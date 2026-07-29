import type { ResumeReport } from "../engines/resume/resumeTypes.ts";
import type { ReportApplicant, ReportInsight, ReportPriorityFix, ReportSignal } from "./types.ts";

const whitespace = /\s+/g;

export function compactText(value: string | undefined, limit: number) {
  const text = (value || "").replace(whitespace, " ").trim();
  if (!text) return "No additional detail was available from the analysis.";
  if (text.length <= limit) return text;

  const shortened = text.slice(0, Math.max(1, limit - 3));
  const boundary = shortened.lastIndexOf(" ");
  return `${(boundary > limit * 0.55 ? shortened.slice(0, boundary) : shortened).trim()}...`;
}

export function normalizeApplicant(applicant: ReportApplicant | undefined): ReportApplicant {
  const sourceText = applicant?.sourceText || "";
  const email = applicant?.email || sourceText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const firstLine = sourceText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => /^[A-Za-z][A-Za-z .'-]{2,58}$/.test(line) && !/resume|summary|profile|experience/i.test(line));

  return {
    ...applicant,
    name: compactOptional(applicant?.name || firstLine),
    email: compactOptional(email),
    generatedAt: applicant?.generatedAt || new Date().toISOString()
  };
}

export function buildExecutiveHeadline(report: ResumeReport) {
  if (report.overallScore >= 80) {
    return "Your resume is already credible, but a few signals could be sharper for faster recruiter recognition.";
  }
  if (report.overallScore >= 62) {
    return "Your resume shows strong potential, but your recruiter signals are not yet clear enough.";
  }
  return "Your resume has useful potential, but the strongest signals need to be clearer before recruiters can act on them.";
}

export function buildStrength(report: ResumeReport): ReportInsight {
  return {
    label: "TOP STRENGTH",
    headline: compactText(report.positiveStandouts[0] || report.strengths[0], 94),
    support: compactText(report.strengths[1] || report.recruiterFirstImpression || report.summaryDiagnosis, 162)
  };
}

export function buildRisk(report: ResumeReport): ReportInsight {
  const opportunity = report.paidReport.premiumReport.biggestOpportunity;
  return {
    label: "MAIN RISK",
    headline: compactText(opportunity.whatToImprove || report.topIssues[0], 94),
    support: compactText(opportunity.whyItMatters || report.whyThisMattersToRecruiters, 162)
  };
}

export function buildPriorities(report: ResumeReport): ReportPriorityFix[] {
  const defaults = [
    ["Add measurable outcomes", "Make the strongest contributions easier to compare at a glance."],
    ["Improve keyword alignment", "Use truthful role language where your experience already supports it."],
    ["Sharpen professional summary", "Position your role fit and strongest proof point earlier."]
  ];

  return defaults.map(([fallbackTitle, fallbackSupport], index) => {
    const item = report.fiveMostImportantChanges[index];
    return {
      number: String(index + 1).padStart(2, "0"),
      title: compactText(item?.whatToChangeNext || fallbackTitle, 52),
      support: compactText(item?.whyItMattersToRecruiters || fallbackSupport, 96),
      icon: index === 0 ? "target" : index === 1 ? "search" : "edit"
    };
  });
}

export function buildSignals(report: ResumeReport): ReportSignal[] {
  return [
    { label: "STRUCTURE", score: report.clarityStructureScore, icon: "list" },
    { label: "CLARITY", score: report.professionalPresentationScore, icon: "message" },
    { label: "KEYWORDS", score: report.keywordRelevanceScore, icon: "key" },
    { label: "IMPACT", score: report.impactAchievementsScore, icon: "target" },
    { label: "RELEVANCE", score: report.recruiterAttentionScore, icon: "spark" }
  ];
}

function compactOptional(value: string | undefined) {
  if (!value) return undefined;
  return compactText(value, 68);
}
