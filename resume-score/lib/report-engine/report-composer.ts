import type { ResumeReport } from "../engines/resume/resumeTypes.ts";
import type { ReportPlan } from "../report-plan.ts";
import {
  buildExecutiveHeadline,
  buildPriorities,
  buildRisk,
  buildSignals,
  buildStrength,
  compactText,
  normalizeApplicant
} from "./normalize-analysis.ts";
import type {
  AlignmentPage,
  ComposedReport,
  PlaybookPage,
  ReportApplicant,
  ReportEngineInput,
  ReportFeedbackColumn,
  ReportPlanCard,
  ReportStatus,
  RoadmapPage
} from "./types.ts";

export function composeReport(input: ReportEngineInput): ComposedReport {
  const { report, accessPlan } = input;
  const applicant = normalizeApplicant(input.applicant);
  const priorities = roadmapCards(report);

  return {
    executiveSnapshot: {
      applicant,
      planLabel: accessPlan === "full" ? "ELITE" : "PRO",
      headline: buildExecutiveHeadline(report),
      introduction: "This report highlights how your resume may be interpreted by recruiters and ATS systems, and what to improve first.",
      metrics: [
        { label: "OVERALL RESUME SCORE", value: String(report.overallScore), suffix: "/100" },
        { label: "ATS MATCH", value: String(report.atsCompatibilityScore), suffix: "%" },
        { label: "RECRUITER READINESS", value: String(report.interviewReadinessScore), suffix: "/100" }
      ],
      topStrength: buildStrength(report),
      mainRisk: buildRisk(report),
      priorities: buildPriorities(report),
      signals: buildSignals(report),
      footerNote: "ResuNexx analyzes your resume across recruiter behavior, ATS compatibility, and content quality to help you get more interviews."
    },
    roadmap: buildRoadmap(report, priorities),
    playbook: buildPlaybook(report),
    alignment: buildAlignment(report)
  };
}

function buildRoadmap(report: ResumeReport, priorities: ReportPlanCard[]): RoadmapPage {
  return {
    kicker: "IMPROVEMENT ROADMAP",
    headline: "What to improve next to become more interview-ready.",
    introduction: "This page translates your diagnostic into specific, high-impact actions you can take to strengthen your resume and stand out.",
    executiveDirection: "Focus first on quantified achievements, keyword alignment, and a sharper professional narrative.",
    executiveSupport: "These three pillars elevate your credibility, improve recruiter signals, and can help make your value easier to recognize.",
    priorities,
    feedback: [
      feedback("Professional Summary", "needs-work", report.sectionFeedback.summary, "Lead with a sharper focus on your strengths and impact."),
      feedback("Work Experience", "needs-work", report.sectionFeedback.workExperience, "Add metrics and outcomes to show your impact."),
      feedback("Skills & Keywords", "improving", report.sectionFeedback.skills, "Incorporate more role-specific keywords for stronger match."),
      feedback("Education & Credibility", "strong", report.sectionFeedback.education, "Consider adding recent learning only when it strengthens relevance.")
    ],
    improvement: {
      before: compactText(report.paidReport.premiumReport.suggestedRewrite.before, 150),
      after: compactText(report.paidReport.premiumReport.suggestedRewrite.after, 180),
      why: compactText(report.paidReport.premiumReport.suggestedRewrite.whyThisWorksBetter, 120)
    },
    footerNote: "This roadmap is prioritized for highest impact first. Complete these steps in order to strengthen your recruiter readiness."
  };
}

function buildPlaybook(report: ResumeReport): PlaybookPage {
  const plan = report.fullReport.thirtyMinuteActionPlan;
  const improvements = report.fiveMostImportantChanges;
  return {
    kicker: "EXECUTION PLAYBOOK",
    headline: "How to turn this roadmap into a stronger final resume.",
    introduction: "Use this page as a focused action guide. Start with the highest-impact edits first, then tailor your resume for each target role before applying.",
    focus: "Rewrite outcome-driven bullets, align target-role keywords, and sharpen your summary before sending your next applications.",
    focusSupport: "A focused rewrite can improve ATS fit, recruiter clarity, and interview readiness faster than broad editing.",
    implementation: [
      card("01", "This week: Add measurable impact", plan.tenMinutes || improvements[0]?.whatToChangeNext, "Prioritize your most relevant experience first."),
      card("02", "Next: Align target-role language", plan.nextTenMinutes || improvements[1]?.whatToChangeNext, "Focus on your summary, skills, and role highlights."),
      card("03", "Final pass: Polish and validate", plan.finalTenMinutes || improvements[2]?.whatToChangeNext, "Your final resume should feel concise and easy to scan.")
    ],
    emphasis: "Strong resumes feel specific, relevant, and easy to trust.",
    footerNote: "Use one master resume, then tailor each application version before sending."
  };
}

function buildAlignment(report: ResumeReport): AlignmentPage {
  const targetRole = report.fullReport.targetRoleMatch;
  return {
    kicker: "ROLE ALIGNMENT & FINAL CHECK",
    headline: "Make every application feel more targeted and credible.",
    introduction: "This final page turns feedback into a clearer recruiter impression and a cleaner final submission.",
    alignment: [
      feedback("Professional Narrative", "needs-work", report.sectionFeedback.summary, "Make your value proposition clearer in the first few lines."),
      feedback("Impact Evidence", "high-priority", report.sectionFeedback.workExperience, "Add stronger metrics, scale, and outcomes to show impact."),
      feedback("Keyword Coverage", "improving", targetRole.fitAssessment, "Core skills are present; tailor role-specific language more deeply."),
      feedback("Credibility Signals", "strong", report.sectionFeedback.education, "Your background supports trust; keep presentation focused and consistent.")
    ],
    improvement: {
      before: compactText(report.paidReport.premiumReport.suggestedRewrite.before, 145),
      after: compactText(report.fullReport.rewrittenAchievementBullets[0] || report.paidReport.premiumReport.suggestedRewrite.after, 185)
    },
    checklist: [
      "Clear target job title at the top",
      "Professional summary tailored to the role",
      "Top achievements quantified",
      "Keywords matched to the job description",
      "Formatting reviewed before export",
      "Filename cleaned and professional"
    ],
    callout: "Clear fit\nMeasurable value\nEasy to trust",
    calloutSupport: "The strongest resumes feel specific, relevant, and credible within seconds.",
    footerNote: "Final check complete: your resume should now feel sharper, clearer, and more role-ready."
  };
}

function roadmapCards(report: ResumeReport): ReportPlanCard[] {
  const items = report.fiveMostImportantChanges;
  return [
    card("01", "Quantify achievements", items[0]?.whatToChangeNext || "Add numbers and measurable results to prove your impact.", items[0]?.whyItMattersToRecruiters || "Recruiters prioritize resumes with clear, quantified outcomes."),
    card("02", "Improve keyword alignment", items[1]?.whatToChangeNext || "Align your resume with the language and skills from target roles.", items[1]?.whyItMattersToRecruiters || "Stronger keyword fit helps your resume get seen and understood."),
    card("03", "Sharpen your professional summary", items[2]?.whatToChangeNext || "Lead with your value, focus areas, and what makes you unique.", items[2]?.whyItMattersToRecruiters || "A strong summary sets the right tone and drives recruiter interest.")
  ];
}

function card(number: string, title: string, action: string | undefined, support: string) {
  return { number, title, action: compactText(action, 136), support: compactText(support, 116) };
}

function feedback(title: string, status: ReportStatus, description: string, recommendation: string): ReportFeedbackColumn {
  return { title, status, description: compactText(description, 128), recommendation: compactText(recommendation, 112) };
}

export function buildReportInput(report: ResumeReport, accessPlan: Extract<ReportPlan, "standard" | "full">, applicant?: ReportApplicant): ReportEngineInput {
  return { report, accessPlan, applicant };
}
