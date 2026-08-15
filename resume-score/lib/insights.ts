export type InsightSource = {
  label: string;
  href: string;
};

export type InsightArticle = {
  slug: string;
  title: string;
  description: string;
  audience: string;
  publishedAt: string;
  opening: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
    example?: {
      before: string;
      after: string;
      note: string;
    };
  }>;
  conclusion: string[];
  cta: string;
  sources: InsightSource[];
};

export const insightArticles: InsightArticle[] = [
  {
    slug: "first-resume-evidence-map",
    title: "Your First Resume Is Not Empty: Build an Evidence Map Before You Add More Skills",
    description: "A practical way for final-year students and recent graduates to turn real coursework, projects, and part-time work into credible resume evidence.",
    audience: "Final-year students and recent graduates",
    publishedAt: "2026-08-15T00:00:00.000Z",
    opening: [
      "When you are applying for your first full-time job, a blank-looking resume can make every line feel too small. You may have coursework, a group project, a weekend job, a student society role, volunteering, or an internship—but none of it has the title you see in the job description.",
      "It is tempting to fill the page with a long skills list or to apologise for having limited experience. Neither approach gives a reader much to work with. A stronger starting point is an evidence map: a short list of the situations where you actually used a skill, what you did, and what changed or was produced."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "First-job applicants often treat experience as a synonym for permanent employment. That leaves useful evidence scattered across education, projects, part-time work, and community activity. The result can be a resume that says communication, teamwork, and problem-solving without showing where those abilities were practiced.",
          "CareerOneStop's guidance for recent college graduates says candidates with little or no work experience can highlight skills and accomplishments gained through coursework, volunteer work, paid or unpaid projects, and relevant interests. The useful test is relevance to the role—not whether an activity sounds impressive on its own."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "Open the job description and underline a small number of real requirements: perhaps customer support, Excel, event coordination, research, written communication, or working with a team. Then make three columns on a separate page: the requirement, a situation where you used it, and one detail that proves the situation happened.",
          "The proof does not have to be a revenue figure. It can be a defined deliverable, a number of participants, a deadline, a tool you used, a process you completed, or the audience you supported. If you cannot verify a detail, leave it out. This keeps your resume honest and gives each claim enough context for a reader to understand it.",
          "A course or research project can sit in Education or Projects. A campus role, volunteer commitment, and part-time job may fit under Experience if you describe the work clearly. You do not need to include every activity; choose the examples that make the target direction easier to see."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Imagine a final-year student applying for an entry-level operations role. Their resume currently says that they are a business student with strong communication and leadership skills. That sentence is not necessarily false, but it asks the reader to take the claims on trust."
        ],
        example: {
          before: "Business student with strong communication and leadership skills.",
          after: "Coordinated attendee registration for a 120-person student event, updated the shared sign-up tracker, and answered participant questions with a two-person team.",
          note: "This is an illustrative example, not a customer result. It does not claim that the student managed an operations department; it makes the setting, actions, and scope visible."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "An evidence map cannot remove every barrier to a first job. Some roles require a credential, work authorisation, a specific portfolio, or experience that you have not yet had the chance to build. A quiet application is not proof that your resume is the only issue.",
          "Use the map as a review tool instead of rewriting your whole resume after each application. Keep the role, the version you used, and the two pieces of evidence you wanted a reader to notice. If neither appears near the top or in the most relevant section, that is worth reviewing."
        ]
      }
    ],
    conclusion: [
      "Your first resume does not need to look like a ten-year career. It needs to show credible examples of how you have learned, contributed, and followed through.",
      "Before you add another skills list, build an evidence map and use it to make the most relevant facts easier to find."
    ],
    cta: "ResuNexx can help you review whether that evidence is organised clearly before you apply.",
    sources: [
      { label: "CareerOneStop: Special tips for recent college graduates", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/special-tips.aspx" },
      { label: "CareerOneStop: Education", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/education.aspx" },
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" }
    ]
  },
  {
    slug: "career-change-resume-transferable-evidence",
    title: "Your Career-Change Resume Does Not Need to Pretend You Have Done the New Job",
    description: "A practical guide for career changers who need to show transferable evidence without renaming or overstating their past work.",
    audience: "Career changers with established transferable experience",
    publishedAt: "2026-08-16T00:00:00.000Z",
    opening: [
      "Changing direction can make a capable person feel strangely inexperienced. You may have managed customers, coordinated work, solved problems, trained colleagues, or kept a process moving for years. Then you open a job description in a new field and wonder whether any of that belongs on the page.",
      "It does. The goal is not to rename your old job or borrow language you cannot defend. It is to make the parts of your experience that travel with you easier to recognise."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "A career-change resume often has two competing stories: your actual work history and the role you want next. When those stories sit beside each other without a bridge, the reader may see only the gap.",
          "CareerOneStop notes that a combination resume format can help highlight transferable skills, refocus experience for a career change, or minimise work gaps. A clear structure can make that bridge easier to notice; it does not prove that you are a fit by itself."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "Start with the target. Name the role or direction you are pursuing near the top, then support it with evidence rather than a broad claim. A focused headline tells the reader what to test against the rest of the document.",
          "Keep each original job title. Then choose bullets that show an action, its setting, and a result or scope you can support. You do not need to force every past task into the new field. A focused selection is more credible than a long list of loosely related keywords.",
          "CareerOneStop advises candidates to connect work descriptions to the job goal, use relevant employer language where accurate, and add context and outcomes. If a number is unavailable or confidential, use honest scope instead: the team you supported, the volume you handled, the process you improved, or the people you served."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Consider a retail supervisor moving toward an entry-level operations coordinator role. Their original bullet describes activity, but leaves the reader to guess what the work involved."
        ],
        example: {
          before: "Managed daily store tasks and helped staff.",
          after: "Coordinated daily staff coverage, tracked stock issues, and shared recurring customer requests with the store manager.",
          note: "This is an illustrative rewrite. It does not turn retail supervision into an operations title; it surfaces planning, record-keeping, communication, and problem recognition that were already part of the work."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "Quiet applications have more than one possible cause. The role may require a credential, technical experience, local work authorisation, or a level of direct experience that your current resume cannot establish. A clearer resume cannot remove those requirements.",
          "Keep a simple record of the role, the version you used, and the transferable strength you wanted a reader to notice. Review whether that strength was visible in the summary and first relevant bullets. This can help you spot where your story is still too vague without making claims you could not explain in an interview."
        ]
      }
    ],
    conclusion: [
      "Your previous experience is not irrelevant because your next title is different. Make the connection specific, keep the original facts intact, and let the reader see the evidence before the ambition.",
      "A career-change resume does not need to imitate the new job. It needs to make your real, relevant work legible."
    ],
    cta: "ResuNexx can help you review how clearly your relevant evidence is organised before you apply.",
    sources: [
      { label: "CareerOneStop: Resume formats", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/ResumeFormats.aspx" },
      { label: "CareerOneStop: Formatting", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/formatting.aspx" },
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" }
    ]
  }
];

export function isPublishedInsight(article: InsightArticle, now = new Date()) {
  return new Date(article.publishedAt).getTime() <= now.getTime();
}

export function getPublishedInsights(now = new Date()) {
  return insightArticles.filter((article) => isPublishedInsight(article, now));
}

export function getInsight(slug: string) {
  return insightArticles.find((article) => article.slug === slug);
}
