export type ScoringCategoryKey =
  | "atsCompatibility"
  | "clarityStructure"
  | "impactAchievements"
  | "keywordRelevance"
  | "professionalPresentation";

export type ScoringCategory = {
  key: ScoringCategoryKey;
  label: string;
  maxPoints: 20;
};

export type CategoryGrade = "A" | "B" | "C" | "D" | "F";
export type RulePriority = "Critical" | "Major" | "Minor";
export type ResumeRule = {
  id: string;
  category: ScoringCategoryKey;
  title: string;
  description: string;
  priority: RulePriority;
  weight: number;
  evidenceType: string;
  recommendation: string;
  exampleFix: string;
};

export type TriggeredRule = {
  ruleId: string;
  ruleTitle: string;
  priority: RulePriority;
  evidence: string;
  explanation: string;
  recommendation: string;
};

export type PrecheckTriggeredRule = {
  ruleId: string;
  ruleTitle: string;
  priority: RulePriority;
  evidence: string;
  recommendation: string;
};

export type ResumePrecheckResult = {
  wordCount: number;
  characterCount: number;
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedIn: boolean;
  hasPortfolioOrWebsite: boolean;
  hasSummarySection: boolean;
  hasExperienceSection: boolean;
  hasEducationSection: boolean;
  hasSkillsSection: boolean;
  hasCertificationsSection: boolean;
  detectedSectionHeadings: string[];
  estimatedBulletCount: number;
  quantifiedBulletCount: number;
  weakPhraseCount: number;
  actionVerbCount: number;
  datePatternCount: number;
  possibleFormattingWarnings: string[];
  extractionQualityWarnings: string[];
  precheckTriggeredRules: PrecheckTriggeredRule[];
};

export type ResumePrecheckSummary = {
  wordCount: number;
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedIn: boolean;
  hasExperienceSection: boolean;
  hasSkillsSection: boolean;
  quantifiedBulletCount: number;
  weakPhraseCount: number;
  extractionQualityWarnings: string[];
};

export type ResumeEnginePrecheckDisplay = {
  contactCompleteness: string;
  sectionCompleteness: string;
  quantifiedAchievements: string;
  weakPhrases: string;
  extractionQualityWarnings: string[];
};

export type CategoryBreakdown = {
  score: number;
  grade: CategoryGrade;
  explanation: string;
  evidenceFromResume: string[];
  improvementAdvice: string[];
};

export type ResumeCategoryBreakdown = Record<ScoringCategoryKey, CategoryBreakdown>;

export type InterviewReadinessLevel = "Low" | "Moderate" | "Strong" | "Excellent";

export type Recommendation = {
  whatWeNoticed: string;
  whyItMattersToRecruiters: string;
  whatToChangeNext: string;
};

export type SectionFeedback = {
  summary: string;
  workExperience: string;
  skills: string;
  education: string;
  formatting: string;
};

export type RewriteExamples = {
  improvedBulletPoints: string[];
  improvedProfessionalSummary: string;
};

export type ResumeFreePreview = {
  overallScore: number;
  atsReadinessScore: number;
  interviewReadinessLevel: InterviewReadinessLevel;
  top3Issues: string[];
};

export type ResumePaidReport = {
  categoryBreakdown: ResumeCategoryBreakdown;
  detailedExplanation: string;
  sectionFeedback: SectionFeedback;
  top10ImprovementPriorities: string[];
  missingKeywords: string[];
  rewriteExamples: RewriteExamples;
  finalActionPlan: string[];
  triggeredRules: TriggeredRule[];
  resumeEnginePreCheck: ResumeEnginePrecheckDisplay;
};

export type ResumeReport = {
  engineVersion: string;
  overallScore: number;
  atsCompatibilityScore: number;
  clarityStructureScore: number;
  impactAchievementsScore: number;
  keywordRelevanceScore: number;
  professionalPresentationScore: number;
  interviewReadinessScore: number;
  recruiterAttentionScore: number;
  overallConfidence: number;
  atsConfidence: number;
  clarityConfidence: number;
  impactConfidence: number;
  keywordConfidence: number;
  presentationConfidence: number;
  interviewReadinessLevel: InterviewReadinessLevel;
  summaryDiagnosis: string;
  precheckSummary: ResumePrecheckSummary;
  precheckTriggeredRules: PrecheckTriggeredRule[];
  categoryBreakdown: ResumeCategoryBreakdown;
  triggeredRules: TriggeredRule[];
  topIssues: string[];
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  sectionFeedback: SectionFeedback;
  rewriteExamples: RewriteExamples;
  finalActionPlan: string[];
  freePreview: ResumeFreePreview;
  paidReport: ResumePaidReport;

  // Compatibility fields currently used by the report UI and PDF builder.
  recruiterFirstImpression: string;
  wouldRecruiterKeepReading: string;
  positiveStandouts: string[];
  hesitationSignals: string[];
  fiveMostImportantChanges: Recommendation[];
  whatToFixFirst: string;
  whyThisMattersToRecruiters: string;
  encouragingClosingNote: string;
  disclaimer: string;
};

export type AnalyzeResumeInput = {
  resumeText: string;
  targetRole?: string;
};

export type ResumeEngineSuccess = {
  ok: true;
  report: ResumeReport;
};

export type ResumeEngineFailure = {
  ok: false;
  error: string;
  code:
    | "EMPTY_RESUME_TEXT"
    | "VERY_SHORT_RESUME"
    | "AI_RESPONSE_INVALID_JSON"
    | "AI_RESPONSE_SCHEMA_INVALID"
    | "OPENAI_API_FAILURE";
  details?: string;
};

export type ResumeEngineResult = ResumeEngineSuccess | ResumeEngineFailure;
