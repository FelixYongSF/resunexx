import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { ProxyAgent, setGlobalDispatcher } from "undici";
import { benchmarkDataset, benchmarkDatasetVersion } from "./dataset.mjs";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const args = parseArgs(process.argv.slice(2));
const baseUrl = (args["base-url"] || process.env.BENCHMARK_BASE_URL || "").replace(/\/$/, "");
const limit = Number(args.limit || benchmarkDataset.length);
const timeoutMs = Number(args.timeout || 125_000);
const baselinePath = path.resolve(ROOT, args.baseline || "baselines/current.json");
const selected = benchmarkDataset.slice(0, limit);
const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY;
if (proxyUrl) setGlobalDispatcher(new ProxyAgent(proxyUrl));
const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});

if (!baseUrl) {
  console.error("Set BENCHMARK_BASE_URL or pass --base-url=https://your-deployment.example.");
  process.exit(1);
}

const results = [];
for (const [index, sample] of selected.entries()) {
  const startedAt = performance.now();
  const form = new FormData();
  const docx = createDocx(sample.resumeText);
  form.append(
    "resume",
    new Blob([docx], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }),
    `${sample.id}.docx`
  );

  let result;
  try {
    const response = await fetch(`${baseUrl}/api/analyze`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(timeoutMs)
    });
    const payload = await response.json();
    const preview = payload.preview || {};
    result = {
      id: sample.id,
      category: sample.category,
      tier: sample.tier,
      targetRole: sample.targetRole,
      success: response.ok && Boolean(payload.id),
      status: response.status,
      durationMs: Math.round(performance.now() - startedAt),
      engineVersion: preview.engineVersion || null,
      overallScore: preview.overallScore ?? null,
      atsScore: preview.atsCompatibilityScore ?? null,
      readiness: preview.interviewReadinessLevel || null,
      topIssues: preview.topIssues || [],
      error: payload.error || null,
      step: payload.step || null
    };
  } catch (error) {
    result = {
      id: sample.id,
      category: sample.category,
      tier: sample.tier,
      targetRole: sample.targetRole,
      success: false,
      status: 0,
      durationMs: Math.round(performance.now() - startedAt),
      engineVersion: null,
      overallScore: null,
      atsScore: null,
      readiness: null,
      topIssues: [],
      error: error instanceof Error ? error.message : String(error),
      step: "benchmark:request"
    };
  }

  results.push(result);
  console.log(
    `[${index + 1}/${selected.length}] ${sample.id}: ${result.success ? `${result.overallScore}/100` : "FAILED"} (${(
      result.durationMs / 1000
    ).toFixed(1)}s)`
  );
}

const baseline = await readJson(baselinePath);
const report = buildReport(results, baseline);
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const resultsDir = path.join(ROOT, "results");
await fs.mkdir(resultsDir, { recursive: true });
await fs.writeFile(path.join(resultsDir, `${timestamp}.json`), JSON.stringify(report, null, 2));
await fs.writeFile(path.join(resultsDir, "latest.json"), JSON.stringify(report, null, 2));
await fs.writeFile(path.join(resultsDir, "latest.md"), renderMarkdown(report));

if (args["update-baseline"]) {
  await fs.mkdir(path.dirname(baselinePath), { recursive: true });
  await fs.writeFile(baselinePath, JSON.stringify(report, null, 2));
}

console.log(renderConsoleSummary(report));
if (args.strict && report.qualityGate.status !== "pass") process.exitCode = 2;

function buildReport(runResults, baselineReport) {
  const passed = runResults.filter((item) => item.success);
  const tierSummary = Object.fromEntries(
    ["strong", "medium", "weak"].map((tier) => {
      const tierResults = passed.filter((item) => item.tier === tier);
      return [
        tier,
        {
          count: tierResults.length,
          averageOverall: average(tierResults.map((item) => item.overallScore)),
          averageAts: average(tierResults.map((item) => item.atsScore))
        }
      ];
    })
  );
  const allIssues = passed.flatMap((item) => item.topIssues);
  const uniqueIssues = new Set(allIssues.map(normalizeIssue));
  const actionableIssues = allIssues.filter((issue) =>
    /\b(add|rewrite|replace|clarify|move|name|connect|group|remove|expand|prioritize|lead|include|define|quantify)\b/i.test(issue)
  );
  const duplicateTopicSamples = passed.filter((item) => hasDuplicateTopics(item.topIssues));
  const baselineById = new Map((baselineReport?.results || []).map((item) => [item.id, item]));
  const regressions = passed
    .filter((item) => baselineById.has(item.id))
    .map((item) => {
      const previous = baselineById.get(item.id);
      return {
        id: item.id,
        overallDelta: item.overallScore - previous.overallScore,
        atsDelta: item.atsScore - previous.atsScore,
        readinessChanged: item.readiness !== previous.readiness
      };
    });
  const ordered =
    tierSummary.strong.averageOverall > tierSummary.medium.averageOverall &&
    tierSummary.medium.averageOverall > tierSummary.weak.averageOverall;
  const separation = tierSummary.strong.averageOverall - tierSummary.weak.averageOverall;
  const qualityGate = {
    status:
      passed.length === runResults.length &&
      ordered &&
      separation >= 15 &&
      duplicateTopicSamples.length === 0 &&
      actionableIssues.length / Math.max(1, allIssues.length) >= 0.8
        ? "pass"
        : "review",
    allAnalysesSucceeded: passed.length === runResults.length,
    tierOrderingCorrect: ordered,
    strongWeakSeparation: round(separation),
    duplicateTopicSamples: duplicateTopicSamples.map((item) => item.id),
    actionableIssueRate: round((actionableIssues.length / Math.max(1, allIssues.length)) * 100)
  };

  return {
    generatedAt: new Date().toISOString(),
    baseUrl,
    datasetVersion: benchmarkDatasetVersion,
    sampleCount: runResults.length,
    engineVersion: passed[0]?.engineVersion || null,
    summary: {
      passed: passed.length,
      failed: runResults.length - passed.length,
      averageDurationMs: average(runResults.map((item) => item.durationMs)),
      medianDurationMs: median(runResults.map((item) => item.durationMs)),
      averageOverallScore: average(passed.map((item) => item.overallScore)),
      averageAtsScore: average(passed.map((item) => item.atsScore)),
      readinessDistribution: countBy(passed, "readiness"),
      issueDiversityPercent: round((uniqueIssues.size / Math.max(1, allIssues.length)) * 100)
    },
    tiers: tierSummary,
    qualityGate,
    regressions,
    results: runResults
  };
}

function renderMarkdown(report) {
  const lines = [
    "# ResuNexx Benchmark",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Engine: ${report.engineVersion || "unknown"}`,
    `- Dataset: ${report.datasetVersion}`,
    `- Result: ${report.summary.passed}/${report.sampleCount} passed`,
    `- Quality gate: ${report.qualityGate.status.toUpperCase()}`,
    `- Average duration: ${(report.summary.averageDurationMs / 1000).toFixed(1)}s`,
    "",
    "## Tier Calibration",
    "",
    "| Tier | Samples | Overall | ATS |",
    "|---|---:|---:|---:|",
    ...Object.entries(report.tiers).map(
      ([tier, value]) => `| ${tier} | ${value.count} | ${value.averageOverall} | ${value.averageAts} |`
    ),
    "",
    "## Results",
    "",
    "| Sample | Category | Tier | Overall | ATS | Readiness | Time |",
    "|---|---|---|---:|---:|---|---:|",
    ...report.results.map(
      (item) =>
        `| ${item.id} | ${item.category} | ${item.tier} | ${item.overallScore ?? "-"} | ${
          item.atsScore ?? "-"
        } | ${item.readiness ?? "-"} | ${(item.durationMs / 1000).toFixed(1)}s |`
    )
  ];
  return `${lines.join("\n")}\n`;
}

function renderConsoleSummary(report) {
  return [
    "",
    `Benchmark ${report.qualityGate.status.toUpperCase()}: ${report.summary.passed}/${report.sampleCount} passed`,
    `Strong ${report.tiers.strong.averageOverall} > Medium ${report.tiers.medium.averageOverall} > Weak ${report.tiers.weak.averageOverall}`,
    `Strong/weak separation: ${report.qualityGate.strongWeakSeparation} points`,
    `Average duration: ${(report.summary.averageDurationMs / 1000).toFixed(1)}s`,
    `Report: ${path.join(ROOT, "results/latest.md")}`
  ].join("\n");
}

function createDocx(resumeText) {
  const paragraphs = resumeText.split("\n").map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return "<w:p/>";
    const isBullet = trimmed.startsWith("- ");
    const text = escapeXml(isBullet ? trimmed.slice(2) : trimmed);
    const style = isBullet ? '<w:pPr><w:pStyle w:val="ListBullet"/></w:pPr>' : "";
    return `<w:p>${style}<w:r><w:t xml:space="preserve">${text}</w:t></w:r></w:p>`;
  });
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs.join("")}<w:sectPr/></w:body></w:document>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
  const relationships = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  return createZip([
    ["[Content_Types].xml", Buffer.from(contentTypes)],
    ["_rels/.rels", Buffer.from(relationships)],
    ["word/document.xml", Buffer.from(documentXml)]
  ]);
}

function createZip(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  for (const [name, data] of entries) {
    const nameBuffer = Buffer.from(name);
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuffer.length, 26);
    localParts.push(local, nameBuffer, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuffer.length, 28);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, nameBuffer);
    offset += local.length + nameBuffer.length + data.length;
  }
  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) continue;
    const [key, inline] = value.slice(2).split("=");
    if (inline !== undefined) parsed[key] = inline;
    else if (values[index + 1] && !values[index + 1].startsWith("--")) parsed[key] = values[++index];
    else parsed[key] = true;
  }
  return parsed;
}

function normalizeIssue(issue) {
  return issue
    .toLowerCase()
    .replace(/\b\d+(?:[.,]\d+)?\b/g, "#")
    .replace(/[^a-z# ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasDuplicateTopics(issues) {
  const topics = issues.map(issueTopic).filter(Boolean);
  return new Set(topics).size !== topics.length;
}

function issueTopic(issue) {
  const lower = issue.toLowerCase();
  if (/\b(email|phone|linkedin|contact)\b/.test(lower)) return "contact";
  if (/\b(metric|quantif|achievement|scale|result|outcome)\b/.test(lower)) return "evidence";
  if (/\b(skills?|capabilit(?:y|ies)|tools?)\b/.test(lower)) return "skills";
  if (/\b(target role|role direction|role focus)\b/.test(lower)) return "role";
  if (/\b(passive|responsib|action verb|ownership)\b/.test(lower)) return "ownership";
  if (/\b(keyword|ats match)\b/.test(lower)) return "keywords";
  return "";
}

function average(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? round(valid.reduce((sum, value) => sum + value, 0) / valid.length) : 0;
}

function median(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key] || "Unknown";
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function round(value) {
  return Math.round(value * 100) / 100;
}

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
