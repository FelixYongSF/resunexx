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

const signalPatterns = {
  leadership: /\b(led|lead|managed|mentored|supervised|directed|headed|coached|facilitated|team lead)\b/gi,
  ownership: /\b(owned|initiated|launched|built|created|designed|implemented|founded|established|drove|delivered)\b/gi,
  communication: /\b(presented|communicated|collaborated|partnered|stakeholder|client|customer|workshop|trained|documented|coordinated)\b/gi,
  technical: /\b(sql|python|java(?:script)?|typescript|react|next\.?js|node\.?js|aws|azure|gcp|docker|kubernetes|tableau|power bi|excel|figma|salesforce|hubspot|google analytics|amplitude|postgres(?:ql)?|api|automation|financial model)\b/gi,
  businessImpact: /\b(revenue|pipeline|sales|conversion|retention|renewal|activation|cost|savings|efficiency|productivity|adoption|growth|profit|budget|time-to-value|response time|acquisition)\b/gi,
  roleFocus: /\b(engineer(?:ing)?|developer|designer|analyst|marketing|product manager|sales|customer success|operations|finance|coordinator|specialist|consultant|researcher)\b/gi
};

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
  const quantifiedBulletCount = countQuantifiedAchievements(text);
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
    leadershipSignalCount: countMatches(text, signalPatterns.leadership),
    ownershipSignalCount: countMatches(text, signalPatterns.ownership),
    communicationSignalCount: countMatches(text, signalPatterns.communication),
    technicalSignalCount: countMatches(text, signalPatterns.technical),
    businessImpactSignalCount: countMatches(text, signalPatterns.businessImpact),
    roleFocusSignalCount: countMatches(text, signalPatterns.roleFocus),
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
    hasSummarySection: prechecks.hasSummarySection,
    hasEducationSection: prechecks.hasEducationSection,
    hasSkillsSection: prechecks.hasSkillsSection,
    estimatedBulletCount: prechecks.estimatedBulletCount,
    quantifiedBulletCount: prechecks.quantifiedBulletCount,
    leadershipSignalCount: prechecks.leadershipSignalCount,
    ownershipSignalCount: prechecks.ownershipSignalCount,
    communicationSignalCount: prechecks.communicationSignalCount,
    technicalSignalCount: prechecks.technicalSignalCount,
    businessImpactSignalCount: prechecks.businessImpactSignalCount,
    roleFocusSignalCount: prechecks.roleFocusSignalCount,
    actionVerbCount: prechecks.actionVerbCount,
    datePatternCount: prechecks.datePatternCount,
    weakPhraseCount: prechecks.weakPhraseCount,
    extractionQualityWarnings: prechecks.extractionQualityWarnings
  };
}

function buildPrecheckTriggeredRules(
  result: Omit<ResumePrecheckResult, "precheckTriggeredRules">,
  targetRole?: string
): PrecheckTriggeredRule[] {
  const triggered: PrecheckTriggeredRule[] = [];

  const missingContactSignals = [
    !result.hasEmail && "email",
    !result.hasPhone && "phone",
    !result.hasLinkedIn && "LinkedIn"
  ].filter(Boolean);
  if (missingContactSignals.length > 0) {
    triggered.push(precheckRule("ATS-003", `Missing contact signals: ${missingContactSignals.join(", ")}.`));
  }
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

function countQuantifiedAchievements(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 18)
    .filter((line) => hasAchievementMetric(line) && hasAchievementContext(line))
    .length;
}

function hasAchievementMetric(line: string) {
  return /(?:\b\d+(?:[.,]\d+)?\s*(?:%|percent|users?|customers?|clients?|accounts?|projects?|campaigns?|tests?|teams?|stakeholders?|regions?|markets?|hours?|days?|weeks?|months?|years?|people|members?|attendees?|responses?|records?|transactions?)\b)|(?:[$£€]\s?\d)|(?:\b\d+(?:[.,]\d+)?\s?(?:k|m|b)\b)|(?:\bfrom\s+\d+(?:[.,]\d+)?\s*%?\s+to\s+\d+(?:[.,]\d+)?\s*%?)|(?:\b\d+-person\b)/i.test(line);
}

function hasAchievementContext(line: string) {
  return /\b(built|created|launched|improved|reduced|increased|grew|saved|generated|achieved|managed|led|delivered|optimized|automated|designed|analyzed|supported|coordinated|identified|resolved|tested|standardized|raised|cut|contributed|covering|used by|adopted)\b/i.test(line);
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
