import { engineVersion } from "./resumeVersion";
import { ResumeReport, ScoringCategoryKey } from "./resumeTypes";

const categoryKeys: ScoringCategoryKey[] = [
  "atsCompatibility",
  "clarityStructure",
  "impactAchievements",
  "keywordRelevance",
  "professionalPresentation"
];

const categoryBreakdownSchema = {
  type: "object",
  additionalProperties: false,
  required: categoryKeys,
  properties: Object.fromEntries(
    categoryKeys.map((key) => [
      key,
      {
        type: "object",
        additionalProperties: false,
        required: ["score", "grade", "explanation", "evidenceFromResume", "improvementAdvice"],
        properties: {
          score: { type: "number", minimum: 0, maximum: 20 },
          grade: { type: "string", enum: ["A", "B", "C", "D", "F"] },
          explanation: { type: "string" },
          evidenceFromResume: { type: "array", minItems: 1, maxItems: 4, items: { type: "string" } },
          improvementAdvice: { type: "array", minItems: 1, maxItems: 4, items: { type: "string" } }
        }
      }
    ])
  )
} as const;

const sectionFeedbackSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "workExperience", "skills", "education", "formatting"],
  properties: {
    summary: { type: "string" },
    workExperience: { type: "string" },
    skills: { type: "string" },
    education: { type: "string" },
    formatting: { type: "string" }
  }
} as const;

const rewriteExamplesSchema = {
  type: "object",
  additionalProperties: false,
  required: ["improvedBulletPoints", "improvedProfessionalSummary"],
  properties: {
    improvedBulletPoints: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } },
    improvedProfessionalSummary: { type: "string" }
  }
} as const;

const fullReportSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "targetRoleMatch",
    "missingKeywordDetails",
    "rewrittenSummary",
    "rewrittenAchievementBullets",
    "rewriteEvidenceCaveat",
    "thirtyMinuteActionPlan"
  ],
  properties: {
    targetRoleMatch: {
      type: "object",
      additionalProperties: false,
      required: ["fitAssessment", "strongestMatchingEvidence", "missingRoleSignals"],
      properties: {
        fitAssessment: { type: "string" },
        strongestMatchingEvidence: { type: "array", minItems: 2, maxItems: 5, items: { type: "string" } },
        missingRoleSignals: { type: "array", minItems: 2, maxItems: 5, items: { type: "string" } }
      }
    },
    missingKeywordDetails: {
      type: "array",
      minItems: 5,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["keyword", "status", "whyItMatters", "placementRecommendation"],
        properties: {
          keyword: { type: "string" },
          status: { type: "string", enum: ["missing", "weakly_represented"] },
          whyItMatters: { type: "string" },
          placementRecommendation: { type: "string" }
        }
      }
    },
    rewrittenSummary: { type: "string" },
    rewrittenAchievementBullets: { type: "array", minItems: 5, maxItems: 5, items: { type: "string" } },
    rewriteEvidenceCaveat: { type: "string" },
    thirtyMinuteActionPlan: {
      type: "object",
      additionalProperties: false,
      required: ["tenMinutes", "nextTenMinutes", "finalTenMinutes"],
      properties: {
        tenMinutes: { type: "string" },
        nextTenMinutes: { type: "string" },
        finalTenMinutes: { type: "string" }
      }
    }
  }
} as const;

const premiumReportSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "executiveSummary",
    "biggestOpportunity",
    "highImpactImprovements",
    "suggestedRewrite",
    "recruiterFirstImpression",
    "atsPerspective",
    "thirtyMinuteImprovementPlan",
    "longTermCareerSignal"
  ],
  properties: {
    executiveSummary: { type: "string" },
    biggestOpportunity: {
      type: "object",
      additionalProperties: false,
      required: ["whatToImprove", "whyItMatters", "example", "expectedImpact"],
      properties: {
        whatToImprove: { type: "string" },
        whyItMatters: { type: "string" },
        example: { type: "string" },
        expectedImpact: { type: "string" }
      }
    },
    highImpactImprovements: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "priorityLevel",
          "whatWasDetected",
          "whyItMatters",
          "recruiterImpact",
          "atsImpact",
          "recommendedAction",
          "expectedBenefit"
        ],
        properties: {
          priorityLevel: { type: "string", enum: ["High", "Medium", "Low"] },
          whatWasDetected: { type: "string" },
          whyItMatters: { type: "string" },
          recruiterImpact: { type: "string" },
          atsImpact: { type: "string" },
          recommendedAction: { type: "string" },
          expectedBenefit: { type: "string" }
        }
      }
    },
    suggestedRewrite: {
      type: "object",
      additionalProperties: false,
      required: ["before", "after", "whyThisWorksBetter"],
      properties: {
        before: { type: "string" },
        after: { type: "string" },
        whyThisWorksBetter: { type: "string" }
      }
    },
    recruiterFirstImpression: { type: "string" },
    atsPerspective: { type: "string" },
    thirtyMinuteImprovementPlan: {
      type: "object",
      additionalProperties: false,
      required: ["tenMinutes", "nextTenMinutes", "finalTenMinutes"],
      properties: {
        tenMinutes: { type: "string" },
        nextTenMinutes: { type: "string" },
        finalTenMinutes: { type: "string" }
      }
    },
    longTermCareerSignal: { type: "string" }
  }
} as const;

const recommendationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["whatWeNoticed", "whyItMattersToRecruiters", "whatToChangeNext"],
  properties: {
    whatWeNoticed: { type: "string" },
    whyItMattersToRecruiters: { type: "string" },
    whatToChangeNext: { type: "string" }
  }
} as const;

const triggeredRuleSchema = {
  type: "object",
  additionalProperties: false,
  required: ["ruleId", "ruleTitle", "priority", "evidence", "explanation", "recommendation"],
  properties: {
    ruleId: { type: "string" },
    ruleTitle: { type: "string" },
    priority: { type: "string", enum: ["Critical", "Major", "Minor"] },
    evidence: { type: "string" },
    explanation: { type: "string" },
    recommendation: { type: "string" }
  }
} as const;

const precheckTriggeredRuleSchema = {
  type: "object",
  additionalProperties: false,
  required: ["ruleId", "ruleTitle", "priority", "evidence", "recommendation"],
  properties: {
    ruleId: { type: "string" },
    ruleTitle: { type: "string" },
    priority: { type: "string", enum: ["Critical", "Major", "Minor"] },
    evidence: { type: "string" },
    recommendation: { type: "string" }
  }
} as const;

const precheckSummarySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "wordCount",
    "hasEmail",
    "hasPhone",
    "hasLinkedIn",
    "hasExperienceSection",
    "hasSummarySection",
    "hasEducationSection",
    "hasSkillsSection",
    "estimatedBulletCount",
    "quantifiedBulletCount",
    "leadershipSignalCount",
    "ownershipSignalCount",
    "communicationSignalCount",
    "technicalSignalCount",
    "businessImpactSignalCount",
    "roleFocusSignalCount",
    "actionVerbCount",
    "datePatternCount",
    "weakPhraseCount",
    "extractionQualityWarnings"
  ],
  properties: {
    wordCount: { type: "number", minimum: 0 },
    hasEmail: { type: "boolean" },
    hasPhone: { type: "boolean" },
    hasLinkedIn: { type: "boolean" },
    hasExperienceSection: { type: "boolean" },
    hasSummarySection: { type: "boolean" },
    hasEducationSection: { type: "boolean" },
    hasSkillsSection: { type: "boolean" },
    estimatedBulletCount: { type: "number", minimum: 0 },
    quantifiedBulletCount: { type: "number", minimum: 0 },
    leadershipSignalCount: { type: "number", minimum: 0 },
    ownershipSignalCount: { type: "number", minimum: 0 },
    communicationSignalCount: { type: "number", minimum: 0 },
    technicalSignalCount: { type: "number", minimum: 0 },
    businessImpactSignalCount: { type: "number", minimum: 0 },
    roleFocusSignalCount: { type: "number", minimum: 0 },
    actionVerbCount: { type: "number", minimum: 0 },
    datePatternCount: { type: "number", minimum: 0 },
    weakPhraseCount: { type: "number", minimum: 0 },
    extractionQualityWarnings: { type: "array", items: { type: "string" } }
  }
} as const;

const resumeEnginePreCheckSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "contactCompleteness",
    "sectionCompleteness",
    "quantifiedAchievements",
    "weakPhrases",
    "extractionQualityWarnings"
  ],
  properties: {
    contactCompleteness: { type: "string" },
    sectionCompleteness: { type: "string" },
    quantifiedAchievements: { type: "string" },
    weakPhrases: { type: "string" },
    extractionQualityWarnings: { type: "array", items: { type: "string" } }
  }
} as const;

export const resumeReportJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "engineVersion",
    "overallScore",
    "atsCompatibilityScore",
    "clarityStructureScore",
    "impactAchievementsScore",
    "keywordRelevanceScore",
    "professionalPresentationScore",
    "interviewReadinessScore",
    "recruiterAttentionScore",
    "overallConfidence",
    "atsConfidence",
    "clarityConfidence",
    "impactConfidence",
    "keywordConfidence",
    "presentationConfidence",
    "interviewReadinessLevel",
    "summaryDiagnosis",
    "precheckSummary",
    "precheckTriggeredRules",
    "categoryBreakdown",
    "triggeredRules",
    "topIssues",
    "strengths",
    "weaknesses",
    "missingKeywords",
    "sectionFeedback",
    "rewriteExamples",
    "finalActionPlan",
    "fullReport",
    "freePreview",
    "paidReport",
    "recruiterFirstImpression",
    "wouldRecruiterKeepReading",
    "positiveStandouts",
    "hesitationSignals",
    "fiveMostImportantChanges",
    "whatToFixFirst",
    "whyThisMattersToRecruiters",
    "encouragingClosingNote",
    "disclaimer"
  ],
  properties: {
    engineVersion: { type: "string", enum: [engineVersion] },
    overallScore: { type: "number", minimum: 0, maximum: 100 },
    atsCompatibilityScore: { type: "number", minimum: 0, maximum: 100 },
    clarityStructureScore: { type: "number", minimum: 0, maximum: 100 },
    impactAchievementsScore: { type: "number", minimum: 0, maximum: 100 },
    keywordRelevanceScore: { type: "number", minimum: 0, maximum: 100 },
    professionalPresentationScore: { type: "number", minimum: 0, maximum: 100 },
    interviewReadinessScore: { type: "number", minimum: 0, maximum: 100 },
    recruiterAttentionScore: { type: "number", minimum: 0, maximum: 100 },
    overallConfidence: { type: "number", minimum: 0, maximum: 100 },
    atsConfidence: { type: "number", minimum: 0, maximum: 100 },
    clarityConfidence: { type: "number", minimum: 0, maximum: 100 },
    impactConfidence: { type: "number", minimum: 0, maximum: 100 },
    keywordConfidence: { type: "number", minimum: 0, maximum: 100 },
    presentationConfidence: { type: "number", minimum: 0, maximum: 100 },
    interviewReadinessLevel: { type: "string", enum: ["Low", "Medium", "High"] },
    summaryDiagnosis: { type: "string" },
    precheckSummary: precheckSummarySchema,
    precheckTriggeredRules: { type: "array", maxItems: 20, items: precheckTriggeredRuleSchema },
    categoryBreakdown: categoryBreakdownSchema,
    triggeredRules: { type: "array", minItems: 5, maxItems: 20, items: triggeredRuleSchema },
    topIssues: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } },
    strengths: { type: "array", minItems: 3, maxItems: 6, items: { type: "string" } },
    weaknesses: { type: "array", minItems: 3, maxItems: 6, items: { type: "string" } },
    missingKeywords: { type: "array", minItems: 5, maxItems: 12, items: { type: "string" } },
    sectionFeedback: sectionFeedbackSchema,
    rewriteExamples: rewriteExamplesSchema,
    finalActionPlan: { type: "array", minItems: 5, maxItems: 8, items: { type: "string" } },
    fullReport: fullReportSchema,
    freePreview: {
      type: "object",
      additionalProperties: false,
      required: ["overallScore", "atsReadinessScore", "interviewReadinessLevel", "top3Issues"],
      properties: {
        overallScore: { type: "number", minimum: 0, maximum: 100 },
        atsReadinessScore: { type: "number", minimum: 0, maximum: 100 },
        interviewReadinessLevel: { type: "string", enum: ["Low", "Medium", "High"] },
        top3Issues: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } }
      }
    },
    paidReport: {
      type: "object",
      additionalProperties: false,
      required: [
        "premiumReport",
        "categoryBreakdown",
        "detailedExplanation",
        "sectionFeedback",
        "top10ImprovementPriorities",
        "missingKeywords",
        "rewriteExamples",
        "finalActionPlan",
        "triggeredRules",
        "resumeEnginePreCheck"
      ],
      properties: {
        premiumReport: premiumReportSchema,
        categoryBreakdown: categoryBreakdownSchema,
        detailedExplanation: { type: "string" },
        sectionFeedback: sectionFeedbackSchema,
        top10ImprovementPriorities: { type: "array", minItems: 10, maxItems: 10, items: { type: "string" } },
        missingKeywords: { type: "array", minItems: 5, maxItems: 12, items: { type: "string" } },
        rewriteExamples: rewriteExamplesSchema,
        finalActionPlan: { type: "array", minItems: 5, maxItems: 8, items: { type: "string" } },
        triggeredRules: { type: "array", minItems: 5, maxItems: 20, items: triggeredRuleSchema },
        resumeEnginePreCheck: resumeEnginePreCheckSchema
      }
    },
    recruiterFirstImpression: { type: "string" },
    wouldRecruiterKeepReading: { type: "string" },
    positiveStandouts: { type: "array", minItems: 3, maxItems: 5, items: { type: "string" } },
    hesitationSignals: { type: "array", minItems: 3, maxItems: 5, items: { type: "string" } },
    fiveMostImportantChanges: { type: "array", minItems: 5, maxItems: 5, items: recommendationSchema },
    whatToFixFirst: { type: "string" },
    whyThisMattersToRecruiters: { type: "string" },
    encouragingClosingNote: { type: "string" },
    disclaimer: { type: "string" }
  }
} as const;

const derivedReportFields = new Set([
  "precheckSummary",
  "precheckTriggeredRules",
  "freePreview",
  "paidReport"
]);

export const resumeAnalysisJsonSchema = {
  ...resumeReportJsonSchema,
  required: resumeReportJsonSchema.required.filter((field) => !derivedReportFields.has(field)),
  properties: Object.fromEntries(
    Object.entries(resumeReportJsonSchema.properties).filter(([field]) => !derivedReportFields.has(field))
  )
};

export function validateResumeReport(value: unknown): asserts value is ResumeReport {
  if (!value || typeof value !== "object") {
    throw new Error("AI response is not an object.");
  }

  const report = value as Partial<ResumeReport>;
  const required: (keyof ResumeReport)[] = [
    "engineVersion",
    "overallScore",
    "atsCompatibilityScore",
    "clarityStructureScore",
    "impactAchievementsScore",
    "keywordRelevanceScore",
    "professionalPresentationScore",
    "interviewReadinessScore",
    "overallConfidence",
    "atsConfidence",
    "clarityConfidence",
    "impactConfidence",
    "keywordConfidence",
    "presentationConfidence",
    "interviewReadinessLevel",
    "recruiterAttentionScore",
    "summaryDiagnosis",
    "precheckSummary",
    "precheckTriggeredRules",
    "triggeredRules",
    "topIssues",
    "strengths",
    "weaknesses",
    "missingKeywords",
    "sectionFeedback",
    "rewriteExamples",
    "finalActionPlan",
    "freePreview",
    "paidReport"
    ,"fullReport"
  ];

  const missing = required.filter((key) => report[key] === undefined);
  if (missing.length > 0) {
    throw new Error(`AI response is missing required fields: ${missing.join(", ")}.`);
  }

  if (report.engineVersion !== engineVersion) {
    throw new Error(`AI response used engineVersion "${report.engineVersion}" instead of "${engineVersion}".`);
  }

  if (!Array.isArray(report.topIssues) || report.topIssues.length !== 3) {
    throw new Error("AI response must include exactly 3 top issues.");
  }

  if (!report.freePreview || !Array.isArray(report.freePreview.top3Issues)) {
    throw new Error("AI response must include freePreview.top3Issues.");
  }

  if (!report.paidReport?.categoryBreakdown) {
    throw new Error("AI response must include paidReport.categoryBreakdown.");
  }

  if (!Array.isArray(report.triggeredRules) || report.triggeredRules.length < 5) {
    throw new Error("AI response must include at least 5 triggeredRules.");
  }

  if (!report.precheckSummary) {
    throw new Error("AI response must include precheckSummary.");
  }
}
