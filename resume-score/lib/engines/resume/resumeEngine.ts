import OpenAI from "openai";
import { createOpenAiClient } from "@/lib/openai-client";
import { analysisPrompt, buildResumeUserPrompt } from "./resumePrompt";
import { runResumePrechecks, toPrecheckSummary } from "./resumePrechecks";
import { resumeRulebook, scoringCategories } from "./resumeRules";
import { normalizeResumeReport } from "./resumeReportBuilder";
import { resumeReportJsonSchema, validateResumeReport } from "./resumeSchema";
import { AnalyzeResumeInput, ResumeEngineResult, ResumePrecheckResult, ResumeReport } from "./resumeTypes";
import { engineLanguage, engineMarket, engineName, engineVersion } from "./resumeVersion";

export {
  analysisPrompt,
  engineLanguage,
  engineMarket,
  engineName,
  engineVersion,
  resumeReportJsonSchema as expectedJsonSchema,
  scoringCategories
};

export async function analyzeResumeWithEngine(input: AnalyzeResumeInput): Promise<ResumeReport> {
  const result = await analyzeResumeWithEngineResult(input);
  if (!result.ok) throw new Error(result.details ? `${result.error} ${result.details}` : result.error);
  return result.report;
}

export async function analyzeResume(input: AnalyzeResumeInput): Promise<ResumeReport> {
  return analyzeResumeWithEngine(input);
}

export async function analyzeResumeWithEngineResult(input: AnalyzeResumeInput): Promise<ResumeEngineResult> {
  const validation = validateInput(input.resumeText);
  if (!validation.ok) return validation;
  const deterministicPrechecks = runResumePrechecks(input.resumeText, input.targetRole);

  try {
    const report = await generateOpenAIReport({
      resumeText: input.resumeText.trim(),
      targetRole: input.targetRole,
      deterministicPrechecks
    });

    validateResumeReport(report);
    return { ok: true, report: normalizeResumeReport(report) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resume analysis failed.";
    const code = message.includes("valid JSON")
      ? "AI_RESPONSE_INVALID_JSON"
      : message.includes("missing required") || message.includes("schema") || message.includes("engineVersion")
        ? "AI_RESPONSE_SCHEMA_INVALID"
        : "OPENAI_API_FAILURE";

    if (process.env.NODE_ENV !== "production") {
      console.error("[resume-engine:v1] analysis failed", { code, error: message });
    }

    return {
      ok: false,
      code,
      error: userFriendlyEngineError(code),
      details: message
    };
  }
}

export async function generateOpenAIReport(
  input: AnalyzeResumeInput & { deterministicPrechecks?: ResumePrecheckResult }
): Promise<ResumeReport> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const client = createOpenAiClient();
  const requestStartedAt = Date.now();

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.15,
      messages: [
        { role: "system", content: analysisPrompt },
        {
          role: "user",
          content: buildResumeUserPrompt({
            ...input,
            deterministicPrechecks: input.deterministicPrechecks || runResumePrechecks(input.resumeText, input.targetRole)
          })
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "resume_engine_v1_report",
          schema: resumeReportJsonSchema,
          strict: true
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("OpenAI returned an empty analysis.");

    if (process.env.NODE_ENV !== "production") {
      console.info("[resume-engine:v1] OpenAI request completed.", {
        elapsedMs: Date.now() - requestStartedAt,
        model: process.env.OPENAI_MODEL || "gpt-4o-mini"
      });
    }

    try {
      const report = JSON.parse(content) as ResumeReport;
      const prechecks = input.deterministicPrechecks || runResumePrechecks(input.resumeText, input.targetRole);
      return {
        ...report,
        precheckSummary: toPrecheckSummary(prechecks),
        precheckTriggeredRules: prechecks.precheckTriggeredRules
      };
    } catch {
      throw new Error("OpenAI response was not valid JSON.");
    }
  } catch (error) {
    const message = formatOpenAiError(error);
    if (process.env.NODE_ENV !== "production") {
      console.error("[resume-engine:v1] OpenAI request failed.", {
        elapsedMs: Date.now() - requestStartedAt,
        error: message,
        model: process.env.OPENAI_MODEL || "gpt-4o-mini"
      });
    }
    throw new Error(`OpenAI request failed: ${message}`);
  }
}

export function generateMockReport(input: AnalyzeResumeInput, prechecks = runResumePrechecks(input.resumeText, input.targetRole)): ResumeReport {
  const resumeText = input.resumeText.trim();
  const hasMetrics = /\d|%|\$|reduced|increased|improved|grew|saved|launched|built/i.test(resumeText);
  const hasSkills = /skills|sql|python|excel|react|figma|analytics|marketing|sales|operations|design/i.test(resumeText);
  const hasSummary = /summary|profile|objective|professional summary/i.test(resumeText);
  const hasExperience = /experience|intern|manager|engineer|designer|analyst|specialist|assistant|coordinator/i.test(resumeText);
  const targetRole = input.targetRole || "an early-career role";

  const categoryBreakdown = {
    atsCompatibility: {
      score: hasSkills ? 15 : 12,
      grade: "B" as const,
      explanation: "The resume has enough readable text for ATS-style parsing, but the strongest searchable signals should be easier to find in standard sections.",
      evidenceFromResume: [
        hasSkills ? "A skills/tool signal appears in the extracted text." : "A dedicated skills/tool signal is not obvious in the extracted text.",
        hasExperience ? "Experience-related wording appears in the resume." : "Experience signals are limited or difficult to identify."
      ],
      improvementAdvice: [
        "Use plain section headings: Summary, Experience, Projects, Skills, and Education.",
        "Place role keywords in normal text rather than relying on graphics, columns, or icons."
      ]
    },
    clarityStructure: {
      score: hasSummary && hasExperience ? 16 : 13,
      grade: "B" as const,
      explanation: `The resume has useful early-career material, but the top third does not yet make the fit for ${targetRole} obvious enough.`,
      evidenceFromResume: [
        hasSummary ? "A summary/profile signal appears to be present." : "A clear summary/profile signal was not detected.",
        hasExperience ? "Experience content appears to be present." : "Work experience is not easy to identify from the extracted text."
      ],
      improvementAdvice: [
        `Write a 2-3 line summary that names ${targetRole}, two relevant strengths, and one proof point from the resume.`,
        "Move the most relevant internship, project, or work example above less relevant details."
      ]
    },
    impactAchievements: {
      score: hasMetrics ? 15 : 10,
      grade: hasMetrics ? ("B" as const) : ("C" as const),
      explanation: "The resume shows activity, but hiring teams need faster proof of contribution, scope, and result.",
      evidenceFromResume: [
        hasMetrics ? "Numbers, metrics, or outcome verbs appear in the resume text." : "Few metrics or measurable outcomes were detected.",
        "Several bullets may still need clearer context, action, and result."
      ],
      improvementAdvice: [
        "Rewrite the first three experience or project bullets in this order: action, tool or context, audience or scope, result.",
        "Replace task-only phrasing with evidence of what changed because of the work."
      ]
    },
    keywordRelevance: {
      score: hasSkills ? 14 : 11,
      grade: hasSkills ? ("C" as const) : ("C" as const),
      explanation: `The keyword set is not yet focused enough for ${targetRole}, so a recruiter may understand effort before they understand fit.`,
      evidenceFromResume: [
        hasSkills ? "Several skill keywords appear in the resume." : "Role-specific skills are not prominent.",
        input.targetRole ? `The requested target role is ${input.targetRole}.` : "No target role was provided."
      ],
      improvementAdvice: [
        `Compare the resume against 3-5 ${targetRole} job posts and add only truthful repeated requirements.`,
        "Group tools, functional skills, and domain keywords so a recruiter can scan them in under 10 seconds."
      ]
    },
    professionalPresentation: {
      score: 15,
      grade: "B" as const,
      explanation: "The resume is professional enough to work from, but it needs tighter hierarchy and more consistent language to feel application-ready.",
      evidenceFromResume: [
        "The extracted resume text is readable enough to analyze.",
        "The resume would benefit from tighter hierarchy and cleaner wording."
      ],
      improvementAdvice: [
        "Keep formatting consistent across headings, dates, bullets, and spacing.",
        "Remove any detail that does not support the target role or make the candidate easier to evaluate."
      ]
    }
  };

  const overallScore = Object.values(categoryBreakdown).reduce((sum, category) => sum + category.score, 0);
  const atsCompatibilityScore = categoryBreakdown.atsCompatibility.score * 5;
  const clarityStructureScore = categoryBreakdown.clarityStructure.score * 5;
  const impactAchievementsScore = categoryBreakdown.impactAchievements.score * 5;
  const keywordRelevanceScore = categoryBreakdown.keywordRelevance.score * 5;
  const professionalPresentationScore = categoryBreakdown.professionalPresentation.score * 5;
  const interviewReadinessScore = Math.min(92, Math.round(overallScore + (hasMetrics ? 6 : -4)));
  const recruiterAttentionScore = Math.min(90, Math.round(overallScore + (hasSummary ? 4 : -5)));
  const topIssues = [
    hasSummary
      ? `The summary needs to connect the candidate to ${targetRole} faster.`
      : `The resume needs a concise summary that names ${targetRole} and gives one proof point.`,
    hasMetrics
      ? "Some outcomes are present, but the strongest result should appear in the first relevant experience or project."
      : "The bullets describe work activity before showing evidence of impact or scope.",
    hasSkills
      ? `The skills section should be reorganized around the requirements of ${targetRole}.`
      : `The resume needs a visible skills section with tools and role keywords for ${targetRole}.`
  ];
  const finalActionPlan = [
    `Choose one ${targetRole} job posting and use it as the rewrite benchmark.`,
    "Rewrite the top summary to include target role, strongest relevant skill, and one evidence point.",
    "Rewrite the first three bullets so each one shows action, context, and result.",
    "Add truthful keywords from the benchmark job posting to the skills and experience sections.",
    "Export a clean ATS-friendly PDF after removing layout elements that do not help scanning."
  ];
  const triggeredRules = [
    buildTriggeredRule("CLR-001", "The target role is not immediately clear from the top of the resume."),
    buildTriggeredRule("IMP-001", "Some bullets describe activities without showing outcomes."),
    buildTriggeredRule("IMP-002", hasMetrics ? "Metrics are present but should be surfaced earlier." : "Few measurable results were detected."),
    buildTriggeredRule("KEY-001", input.targetRole ? `Keywords should align more directly with ${input.targetRole}.` : "No target role was provided, so keyword fit is harder to judge."),
    buildTriggeredRule("ATS-010", hasSkills ? "A skills signal exists but can be better grouped." : "A clear skills section was not detected."),
    buildTriggeredRule("PRS-003", "Formatting and hierarchy should stay consistent across all sections.")
  ];

  const baseReport: ResumeReport = {
    engineVersion,
    overallScore,
    atsCompatibilityScore,
    clarityStructureScore,
    impactAchievementsScore,
    keywordRelevanceScore,
    professionalPresentationScore,
    interviewReadinessScore,
    recruiterAttentionScore,
    overallConfidence: 84,
    atsConfidence: 78,
    clarityConfidence: 82,
    impactConfidence: hasMetrics ? 80 : 68,
    keywordConfidence: input.targetRole ? 82 : 66,
    presentationConfidence: 72,
    interviewReadinessLevel: overallScore >= 82 ? "Strong" : overallScore >= 62 ? "Moderate" : "Low",
    summaryDiagnosis:
      `The resume shows useful early-career material, but a hiring manager may need to work too hard to connect it to ${targetRole}. The biggest opportunity is to make role fit, evidence of contribution, and job-specific keywords visible in the top third.`,
    precheckSummary: toPrecheckSummary(prechecks),
    precheckTriggeredRules: prechecks.precheckTriggeredRules,
    categoryBreakdown,
    triggeredRules,
    topIssues,
    strengths: [
      "There is enough experience or project material to build a credible early-career story.",
      "The resume contains signals that can be reframed into recruiter-friendly evidence.",
      "The biggest improvements are editing and prioritization, not a full rebuild from scratch."
    ],
    weaknesses: [
      `The fit for ${targetRole} is not clear enough in the first few seconds.`,
      "Some bullets explain what the candidate did without showing what changed or who benefited.",
      "Role-specific keywords need a clearer home in the summary, skills, and first experience section."
    ],
    missingKeywords: [
      "stakeholder management",
      "process improvement",
      "cross-functional collaboration",
      "data analysis",
      "project coordination",
      "customer impact"
    ],
    sectionFeedback: {
      summary: `Open with ${targetRole}, then connect two strengths to one resume-backed proof point.`,
      workExperience: "Start each important bullet with a concrete action, then add the tool, audience, or result that proves contribution.",
      skills: `Group skills around ${targetRole}: tools, functional skills, and relevant domain keywords.`,
      education: "Keep education concise. Add coursework, honors, or projects only when relevant to the target role.",
      formatting: "Use consistent headings, readable dates, clean spacing, and avoid complex visual formatting."
    },
    rewriteExamples: {
      improvedBulletPoints: [
        "Built a weekly tracking workflow that organized key project updates and made progress easier for teammates to review.",
        "Coordinated campaign or project tasks across stakeholders, keeping deadlines visible and reducing last-minute follow-up.",
        "Analyzed recurring project or customer patterns and summarized the findings into practical next steps for the team."
      ],
      improvedProfessionalSummary:
        `Early-career candidate targeting ${targetRole}, with experience organizing workstreams, communicating across teams, and turning project details into clear next steps.`
    },
    finalActionPlan,
    freePreview: {
      overallScore,
      atsReadinessScore: atsCompatibilityScore,
      interviewReadinessLevel: overallScore >= 82 ? "Strong" : overallScore >= 62 ? "Moderate" : "Low",
      top3Issues: topIssues
    },
    paidReport: {
      categoryBreakdown,
      detailedExplanation:
        `The resume can become more competitive quickly if it is rewritten around ${targetRole}. The highest-impact work is to make the top third communicate fit, then turn the strongest bullets into evidence of contribution.`,
      sectionFeedback: {
        summary: `Open with ${targetRole}, then connect two strengths to one resume-backed proof point.`,
        workExperience: "Start each important bullet with a concrete action, then add the tool, audience, or result that proves contribution.",
        skills: `Group skills around ${targetRole}: tools, functional skills, and relevant domain keywords.`,
        education: "Keep education concise. Add coursework, honors, or projects only when relevant to the target role.",
        formatting: "Use consistent headings, readable dates, clean spacing, and avoid complex visual formatting."
      },
      top10ImprovementPriorities: [
        `Choose one ${targetRole} job posting as the benchmark.`,
        `Rewrite the summary so ${targetRole} is named in the first line.`,
        "Move the strongest internship, project, or work example into the top half of the resume.",
        "Add truthful scope or result details to the first three bullets.",
        "Replace task-only bullets with action, context, and result.",
        `Group skills around ${targetRole} requirements.`,
        "Add only keywords that match real experience or coursework.",
        "Use standard ATS section headings.",
        "Make dates, titles, and organization names easy to scan.",
        "Export a clean text-based PDF after the rewrite."
      ],
      missingKeywords: [
        "stakeholder management",
        "process improvement",
        "cross-functional collaboration",
        "data analysis",
        "project coordination",
        "customer impact"
      ],
      rewriteExamples: {
        improvedBulletPoints: [
        "Improved weekly reporting workflow by consolidating key metrics, reducing manual update time by 30%.",
          "Coordinated campaign or project tasks across stakeholders, keeping deadlines visible and reducing last-minute follow-up.",
          "Analyzed recurring project or customer patterns and summarized the findings into practical next steps for the team."
        ],
        improvedProfessionalSummary:
          `Early-career candidate targeting ${targetRole}, with experience organizing workstreams, communicating across teams, and turning project details into clear next steps.`
      },
      finalActionPlan,
      triggeredRules,
      resumeEnginePreCheck: {
        contactCompleteness: "",
        sectionCompleteness: "",
        quantifiedAchievements: "",
        weakPhrases: "",
        extractionQualityWarnings: []
      }
    },
    recruiterFirstImpression:
      `A recruiter would likely see early-career potential, but they would not immediately know why this candidate fits ${targetRole}. The strongest proof needs to appear sooner.`,
    wouldRecruiterKeepReading:
      `Possibly, especially for entry-level roles, but the resume would earn more attention if the top third made ${targetRole} fit, keywords, and contribution evidence easier to scan.`,
    positiveStandouts: [
      "There is enough substance to create a focused early-career narrative.",
      "The existing experience can be reframed into stronger evidence of contribution.",
      "The resume appears close enough to improve through prioritization and rewriting rather than major rebuilding."
    ],
    hesitationSignals: [
      `The target role of ${targetRole} is not obvious quickly enough.`,
      "Impact is not consistently shown through scope, result, or audience.",
      "Some keywords may be too broad to match competitive job descriptions."
    ],
    fiveMostImportantChanges: [
      {
        whatWeNoticed: `The opening does not clearly position the candidate for ${targetRole}.`,
        whyItMattersToRecruiters: "Recruiters scan quickly and need to place you into a role category fast.",
        whatToChangeNext: `Rewrite the summary around ${targetRole}, two relevant skills, and one proof point from the resume.`
      },
      {
        whatWeNoticed: "Several bullets describe tasks rather than outcomes.",
        whyItMattersToRecruiters: "Early-career candidates stand out when they show ownership and contribution.",
        whatToChangeNext: "Rewrite the first three bullets with action, context, audience, and result."
      },
      {
        whatWeNoticed: "Keywords are not yet focused enough.",
        whyItMattersToRecruiters: "ATS and recruiters both look for role language that matches the job description.",
        whatToChangeNext: `Add truthful keywords from 3-5 real ${targetRole} postings.`
      },
      {
        whatWeNoticed: "The strongest project or experience is not prominent enough.",
        whyItMattersToRecruiters: "One strong proof point can help a young candidate stand out quickly.",
        whatToChangeNext: "Move the most relevant project, internship, or work example closer to the top."
      },
      {
        whatWeNoticed: "Formatting can guide the reader more clearly.",
        whyItMattersToRecruiters: "Clear hierarchy helps recruiters find titles, dates, skills, and impact quickly.",
        whatToChangeNext: "Use consistent headings, spacing, dates, and bullet structure."
      }
    ],
    whatToFixFirst:
      `Fix the top third first: summary, skills, and the first few bullets should all point toward ${targetRole}. That is where recruiter attention is won or lost fastest.`,
    whyThisMattersToRecruiters:
      "Recruiters compare many early-career resumes quickly. Clear role fit, visible keywords, and concrete examples help them understand your potential faster.",
    encouragingClosingNote:
      "Your resume has potential. The next step is not to rewrite everything, but to make your strongest signals easier to see.",
    disclaimer:
      "This report is AI-generated feedback and is not professional career, legal, or employment advice. It does not guarantee interviews or job offers."
  };

  return normalizeResumeReport(baseReport);
}

function buildTriggeredRule(ruleId: string, evidence: string) {
  const rule = resumeRulebook.find((item) => item.id === ruleId);
  if (!rule) throw new Error(`Missing mock rule ${ruleId}.`);

  return {
    ruleId: rule.id,
    ruleTitle: rule.title,
    priority: rule.priority,
    evidence,
    explanation: rule.description,
    recommendation: rule.recommendation
  };
}

export function runResumeEngineV1SmokeTest() {
  const prechecks = runResumePrechecks(`
Jane Candidate
Marketing student with internship experience supporting social campaigns, reporting, and event coordination.
Experience
Marketing Intern, Bright Studio, 2025
- Helped launch weekly email campaign and improved open rate by 18%.
- Built Excel tracker for campaign tasks and deadlines.
Skills: Excel, Canva, Google Analytics, copywriting, campaign reporting.
Education: BA Marketing, State University.
`, "Marketing Coordinator");
  const report = generateMockReport({
    targetRole: "Marketing Coordinator",
    resumeText: `
Jane Candidate
Marketing student with internship experience supporting social campaigns, reporting, and event coordination.
Experience
Marketing Intern, Bright Studio, 2025
- Helped launch weekly email campaign and improved open rate by 18%.
- Built Excel tracker for campaign tasks and deadlines.
Skills: Excel, Canva, Google Analytics, copywriting, campaign reporting.
Education: BA Marketing, State University.
`
  }, prechecks);

  return {
    prechecksRun: prechecks.wordCount > 0,
    precheckSummaryExists: report.precheckSummary.wordCount > 0,
    precheckTriggeredRulesExists: Array.isArray(report.precheckTriggeredRules),
    receivedResumeText: true,
    structuredResult: report.engineVersion === engineVersion && typeof report.overallScore === "number",
    freePreviewGenerated: report.freePreview.top3Issues.length === 3,
    paidReportGenerated: report.paidReport.top10ImprovementPriorities.length === 10
  };
}

function validateInput(resumeText: string): ResumeEngineResult {
  const text = resumeText?.trim() || "";

  if (!text) {
    return {
      ok: false,
      code: "EMPTY_RESUME_TEXT",
      error: "We could not find resume text to analyze. Please upload a text-based PDF or DOCX resume."
    };
  }

  if (text.length < 400) {
    return {
      ok: false,
      code: "VERY_SHORT_RESUME",
      error: "This resume appears too short to analyze reliably. Please upload a complete text-based PDF or DOCX resume."
    };
  }

  return { ok: true, report: {} as ResumeReport };
}


function userFriendlyEngineError(code: ResumeEngineResult extends infer R ? R extends { code: infer C } ? C : never : never) {
  switch (code) {
    case "AI_RESPONSE_INVALID_JSON":
    case "AI_RESPONSE_SCHEMA_INVALID":
      return "AI service returned an unexpected report format. Please try again.";
    case "OPENAI_API_FAILURE":
      return "Unable to connect to AI service. Please try again later.";
    default:
      return "Resume analysis failed. Please try again.";
  }
}

function formatOpenAiError(error: unknown) {
  if (error instanceof OpenAI.APIError) {
    const details = [
      error.message,
      error.status ? `status ${error.status}` : "",
      error.code ? `code ${error.code}` : "",
      error.type ? `type ${error.type}` : ""
    ].filter(Boolean);

    return details.join(" | ");
  }

  if (error instanceof Error) return error.message;
  return "Unknown OpenAI error.";
}
