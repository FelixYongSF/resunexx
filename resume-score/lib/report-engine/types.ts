import type { ResumeReport } from "../engines/resume/resumeTypes.ts";
import type { ReportPlan } from "../report-plan.ts";

export type ReportApplicant = {
  name?: string;
  email?: string;
  targetRole?: string;
  generatedAt?: string;
  reportId?: string;
  sourceText?: string;
};

export type ReportEngineInput = {
  report: ResumeReport;
  accessPlan: Extract<ReportPlan, "standard" | "full">;
  applicant?: ReportApplicant;
};

export type ReportMetric = { label: string; value: string; suffix?: string };
export type ReportInsight = { label: string; headline: string; support: string };
export type ReportPriorityFix = {
  number: string;
  title: string;
  support: string;
  icon: "target" | "search" | "edit";
};
export type ReportSignal = {
  label: string;
  score: number;
  icon: "list" | "message" | "key" | "target" | "spark";
};
export type ReportStatus = "needs-work" | "high-priority" | "improving" | "strong";
export type ReportFeedbackColumn = {
  title: string;
  status: ReportStatus;
  description: string;
  recommendation: string;
};
export type ReportBeforeAfter = { before: string; after: string; why?: string };
export type ReportPlanCard = {
  number: string;
  title: string;
  action: string;
  support: string;
};

export type ExecutiveSnapshot = {
  applicant: ReportApplicant;
  planLabel: "PRO" | "ELITE";
  headline: string;
  introduction: string;
  metrics: ReportMetric[];
  topStrength: ReportInsight;
  mainRisk: ReportInsight;
  priorities: ReportPriorityFix[];
  signals: ReportSignal[];
  footerNote: string;
};

export type RoadmapPage = {
  kicker: string;
  headline: string;
  introduction: string;
  executiveDirection: string;
  executiveSupport: string;
  priorities: ReportPlanCard[];
  feedback: ReportFeedbackColumn[];
  improvement: ReportBeforeAfter;
  footerNote: string;
};

export type PlaybookPage = {
  kicker: string;
  headline: string;
  introduction: string;
  focus: string;
  focusSupport: string;
  implementation: ReportPlanCard[];
  emphasis: string;
  footerNote: string;
};

export type AlignmentPage = {
  kicker: string;
  headline: string;
  introduction: string;
  alignment: ReportFeedbackColumn[];
  improvement: ReportBeforeAfter;
  checklist: string[];
  callout: string;
  calloutSupport: string;
  footerNote: string;
};

export type ComposedReport = {
  executiveSnapshot: ExecutiveSnapshot;
  roadmap: RoadmapPage;
  playbook: PlaybookPage;
  alignment: AlignmentPage;
};
