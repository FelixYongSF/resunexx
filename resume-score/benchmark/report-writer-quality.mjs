import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const latestPath = path.join(ROOT, "results/latest.json");

const report = JSON.parse(await fs.readFile(latestPath, "utf8"));
const results = report.results || [];
const passed = results.filter((item) => item.success);
const allIssues = passed.flatMap((item) => item.topIssues || []);
const actionableIssues = allIssues.filter((issue) =>
  /\b(add|rewrite|replace|clarify|move|name|connect|group|remove|expand|prioritize|lead|include|define|quantify|revise|refine|align|incorporate|highlight|research|specify|provide|use|ensure|show|surface)\b/i.test(issue)
);
const uniqueIssues = new Set(allIssues.map(normalizeIssue));
const repeatedOpeners = topRepeatedOpeners(allIssues);

const checks = [
  {
    name: "all benchmark analyses succeeded",
    passed: report.summary?.passed === report.sampleCount
  },
  {
    name: "strong resumes score above medium and weak resumes",
    passed:
      report.tiers?.strong?.averageOverall > report.tiers?.medium?.averageOverall &&
      report.tiers?.medium?.averageOverall > report.tiers?.weak?.averageOverall
  },
  {
    name: "strong/weak separation is at least 15 points",
    passed: report.qualityGate?.strongWeakSeparation >= 15
  },
  {
    name: "top issues are at least 80% actionable",
    passed: actionableIssues.length / Math.max(1, allIssues.length) >= 0.8
  },
  {
    name: "top issues have enough diversity",
    passed: uniqueIssues.size / Math.max(1, allIssues.length) >= 0.4
  },
  {
    name: "no duplicate topic samples detected by benchmark",
    passed: (report.qualityGate?.duplicateTopicSamples || []).length === 0
  },
  {
    name: "repeated opener patterns stay within an acceptable benchmark range",
    passed: repeatedOpeners.every((item) => item.count <= 24)
  }
];

const status = checks.every((item) => item.passed) ? "pass" : "review";
console.log(`Report Writer Quality: ${status.toUpperCase()}`);
for (const check of checks) {
  console.log(`${check.passed ? "✓" : "⚠"} ${check.name}`);
}
console.log(`Actionable issue rate: ${Math.round((actionableIssues.length / Math.max(1, allIssues.length)) * 100)}%`);
console.log(`Issue diversity: ${Math.round((uniqueIssues.size / Math.max(1, allIssues.length)) * 100)}%`);
if (repeatedOpeners.length) {
  console.log(`Repeated openers: ${repeatedOpeners.map((item) => `${item.opener} (${item.count})`).join(", ")}`);
}

if (status !== "pass") process.exitCode = 2;

function normalizeIssue(issue) {
  return issue
    .toLowerCase()
    .replace(/\b\d+(?:[.,]\d+)?\b/g, "#")
    .replace(/[^a-z# ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function topRepeatedOpeners(issues) {
  const counts = new Map();
  for (const issue of issues) {
    const opener = issue.split(/\s+/).slice(0, 4).join(" ").toLowerCase();
    counts.set(opener, (counts.get(opener) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([opener, count]) => ({ opener, count }))
    .filter((item) => item.count > 3)
    .sort((a, b) => b.count - a.count);
}
