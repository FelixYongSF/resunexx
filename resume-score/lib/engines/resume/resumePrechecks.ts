import { resumeRulebook } from "./resumeRules";
import { PrecheckTriggeredRule, ResumePrecheckResult } from "./resumeTypes";

const weakPhrases = [
  "responsible for",
  "helped with",
  "worked on",
  "involved in",
  "participated in"
];

const actionVerbs = [
  "built",
  "created",
  "launched",
  "improved",
  "reduced",
  "increased",
  "analyzed",
  "coordinated",
  "led",
  "managed",
  "designed",
  "implemented",
  "developed",
  "organized",
  "optimized",
  "reported",
  "researched",
  "supported"
];

const sectionPatterns = [
  ["Summary", /\b(summary|profile|objective|professional summary)\b/i],
  ["Experience", /\b(experience|work experience|employment|internship|professional experience)\b/i],
  ["Education", /\b(education|university|college|bachelor|master|degree)\b/i],
  ["Skills", /\b(skills|technical skills|core skills|tools)\b/i],
  ["Certifications", /\b(certifications|certificates|licenses)\b/i],
  ["Projects", /\b(projects|portfolio projects)\b/i]
] as const;

export function runResumePrechecks(resumeText: string, targetRole?: string): ResumePrecheckResult {
  const text = resumeText.trim();
  const lower = text.toLowerCase();
  const words = text.match(/\b[\w'-]+\b/g) || [];
  const detectedSectionHeadings = sectionPatterns
    .filter(([, pattern]) => pattern.test(text))
    .map(([label]) => label);
  const estimatedBulletCount = countMatches(text, /(^|\n)\s*(?:[-*•]|\d+[.)])\s+/g);
  const quantifiedBulletCount = countQuantifiedBullets(text);
  const weakPhraseCount = weakPhrases.reduce(
    (sum, phrase) => sum + countMatches(lower, new RegExp(escapeRegExp(phrase), "g")),
    0
  );
  const actionVerbCount = actionVerbs.reduce(
    (sum, verb) => sum + countMatches(lower, new RegExp(`\\b${escapeRegExp(verb)}\\b`, "g")),
    0
  );
  const extractionQualityWarnings = getExtractionQualityWarnings(text);
  const possibleFormattingWarnings = getFormattingWarnings(text, estimatedBulletCount);

  const result: Omit<ResumePrecheckResult, "precheckTriggeredRules"> = {
    wordCount: words.length,
    characterCount: text.length,
    hasEmail: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text),
    hasPhone: /(?:\+?\d[\d\s().-]{7,}\d)/.test(text),
    hasLinkedIn: /linkedin\.com|linkedin/i.test(lower),
    hasPortfolioOrWebsite: /(https?:\/\/|www\.|portfolio|github\.com|behance\.net|dribbble\.com)/i.test(text),
    hasSummarySection: /\b(summary|profile|objective|professional summary)\b/i.test(text),
    hasExperienceSection: /\b(experience|work experience|employment|internship|professional experience)\b/i.test(text),
    hasEducationSection: /\b(education|university|college|bachelor|master|degree)\b/i.test(text),
    hasSkillsSection: /\b(skills|technical skills|core skills|tools)\b/i.test(text),
    hasCertificationsSection: /\b(certifications|certificates|licenses)\b/i.test(text),
    detectedSectionHeadings,
    estimatedBulletCount,
    quantifiedBulletCount,
    weakPhraseCount,
    actionVerbCount,
    datePatternCount: countMatches(text, /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}|\b20\d{2}\b|\b19\d{2}\b/gi),
    possibleFormattingWarnings,
    extractionQualityWarnings
  };

  return {
    ...result,
    precheckTriggeredRules: buildPrecheckTriggeredRules(result, targetRole)
  };
}

export function toPrecheckSummary(prechecks: ResumePrecheckResult) {
  return {
    wordCount: prechecks.wordCount,
    hasEmail: prechecks.hasEmail,
    hasPhone: prechecks.hasPhone,
    hasLinkedIn: prechecks.hasLinkedIn,
    hasExperienceSection: prechecks.hasExperienceSection,
    hasSkillsSection: prechecks.hasSkillsSection,
    quantifiedBulletCount: prechecks.quantifiedBulletCount,
    weakPhraseCount: prechecks.weakPhraseCount,
    extractionQualityWarnings: prechecks.extractionQualityWarnings
  };
}

function buildPrecheckTriggeredRules(
  result: Omit<ResumePrecheckResult, "precheckTriggeredRules">,
  targetRole?: string
): PrecheckTriggeredRule[] {
  const triggered: PrecheckTriggeredRule[] = [];

  if (!result.hasEmail) triggered.push(precheckRule("ATS-003", "No email address was detected."));
  if (!result.hasPhone) triggered.push(precheckRule("ATS-003", "No phone number was detected."));
  if (!result.hasLinkedIn) triggered.push(precheckRule("ATS-003", "No LinkedIn signal was detected."));
  if (result.wordCount < 250) triggered.push(precheckRule("CLR-010", `Resume text is short at ${result.wordCount} words.`));
  if (!result.hasExperienceSection) triggered.push(precheckRule("CLR-004", "No clear work experience section was detected."));
  if (!result.hasSkillsSection) triggered.push(precheckRule("ATS-010", "No clear skills section was detected."));
  if (!result.hasEducationSection) triggered.push(precheckRule("CLR-009", "No clear education section was detected."));
  if (result.estimatedBulletCount < 3) triggered.push(precheckRule("CLR-005", `Only ${result.estimatedBulletCount} bullet-like lines were detected.`));
  if (result.quantifiedBulletCount === 0) triggered.push(precheckRule("IMP-002", "No quantified achievement bullets were detected."));
  if (result.weakPhraseCount >= 2) triggered.push(precheckRule("IMP-003", `${result.weakPhraseCount} weak responsibility phrases were detected.`));
  if (result.extractionQualityWarnings.length > 0) {
    triggered.push(precheckRule("ATS-008", result.extractionQualityWarnings.join(" ")));
  }
  if (targetRole && result.hasSkillsSection === false) {
    triggered.push(precheckRule("KEY-001", `Target role is ${targetRole}, but no skills section was detected.`));
  }

  return triggered;
}

function precheckRule(ruleId: string, evidence: string): PrecheckTriggeredRule {
  const rule = resumeRulebook.find((item) => item.id === ruleId);
  if (!rule) throw new Error(`Precheck rule ${ruleId} not found.`);

  return {
    ruleId: rule.id,
    ruleTitle: rule.title,
    priority: rule.priority,
    evidence,
    recommendation: rule.recommendation
  };
}

function countQuantifiedBullets(text: string) {
  return text
    .split(/\n+/)
    .filter((line) => /^\s*(?:[-*•]|\d+[.)])\s+/.test(line) && /(\d|%|\$|reduced|increased|improved|grew|saved)/i.test(line))
    .length;
}

function getExtractionQualityWarnings(text: string) {
  const warnings: string[] = [];
  const unreadableCount = countMatches(text, /�|□|■|�/g);
  const brokenLineCount = text.split("\n").filter((line) => line.trim().length > 0 && line.trim().length <= 2).length;

  if (unreadableCount >= 3) warnings.push("The extracted text contains unreadable characters.");
  if (brokenLineCount >= 15) warnings.push("The extracted text contains many unusually short broken lines.");
  if (text.replace(/\s/g, "").length < 300) warnings.push("The extracted text appears very short.");

  return warnings;
}

function getFormattingWarnings(text: string, estimatedBulletCount: number) {
  const warnings: string[] = [];
  if (/\t{2,}/.test(text)) warnings.push("Text contains repeated tabs that may indicate table-like formatting.");
  if (estimatedBulletCount === 0) warnings.push("No clear bullet structure was detected.");
  return warnings;
}

function countMatches(text: string, pattern: RegExp) {
  return text.match(pattern)?.length || 0;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
