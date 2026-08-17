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
      "A career-change resume does not need to imitate the new job. It needs to make your real, relevant work legible.",
      "Choose evidence you can explain in the original context, even when the target role uses different language, tools, title, industry terms, or working methods."
    ],
    cta: "ResuNexx can help you review how clearly your relevant evidence is organised before you apply.",
    sources: [
      { label: "CareerOneStop: Resume formats", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/ResumeFormats.aspx" },
      { label: "CareerOneStop: Formatting", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/formatting.aspx" },
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" }
    ]
  },
  {
    slug: "resume-summary-with-little-experience",
    title: "With Little Experience, Your Resume Summary Should Point to Evidence—Not Potential",
    description: "For early-career applicants, a short opening can be useful when it names a real direction and points to evidence that appears later on the page.",
    audience: "Students and early-career applicants",
    publishedAt: "2026-08-17T00:00:00.000Z",
    opening: [
      "A resume summary can feel like a test of confidence when you are early in your career. You know you want an opportunity, but you do not want to claim experience you have not had. The result is often a line such as motivated graduate seeking a challenging role.",
      "That line is understandable, but it does not give a reader much to check. A useful opening does something smaller and more honest: it tells the reader what direction you are pursuing and points toward evidence they can find elsewhere in the resume."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "CareerOneStop describes the top of a resume as the place that introduces you to an employer. Its guidance says a headline can quickly identify your focus, while a summary can highlight skills and accomplishments related to the job. For a recent graduate with very little work experience, it also suggests an objective may be more appropriate than a professional summary.",
          "The practical problem is not whether you use the label Summary or Objective. It is whether the opening gives the rest of the page a clear frame. A string of personal adjectives cannot do that on its own, and a long paragraph can hide the few relevant facts you do have."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "Start by naming a realistic direction: an entry-level data analyst role, customer support work, an operations internship, or another role you can support with real examples. Then choose two proof signals that already appear below—coursework, a project, part-time work, a tool, a deliverable, or an honest scope of responsibility.",
          "Keep the opening short enough to scan. Do not add every skill you have touched, and do not promise an outcome. If a reader cannot find the evidence elsewhere on the page, remove the claim or replace it with a more specific fact. The summary should guide the reader into the resume, not ask them to take you on trust."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Imagine a recent graduate applying for an entry-level reporting role. Their first line currently expresses enthusiasm but gives no clue about what they have practiced."
        ],
        example: {
          before: "Highly motivated graduate seeking a challenging opportunity to grow.",
          after: "Business analytics graduate with project experience building SQL dashboards and presenting weekly reporting findings to a student client team.",
          note: "This is illustrative, not a customer result. It names a direction, a tool, and a setting without turning coursework into professional experience."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "A clearer opening cannot create a missing requirement. Some roles may need a portfolio, a credential, work authorisation, or direct experience that is not yet on your resume. It is better to notice that gap than to cover it with a stronger adjective.",
          "Save the role and the version you used, then review whether the first third of the page made your intended direction and supporting examples visible. If it did, the next step may be to strengthen the underlying evidence with a project or targeted application—not to keep rewriting the same opening."
        ]
      }
    ],
    conclusion: [
      "An early-career summary works best when it is modest, specific, and connected to evidence. Point the reader toward work you can explain, then let the rest of the resume do its job.",
      "If your experience is already clear at the top of the page, it is also fine to skip the summary entirely.",
      "Before sending the application, read the opening beside the first relevant section. The direction, examples, and dates should tell the same accurate story."
    ],
    cta: "ResuNexx can help you check whether the role direction and evidence on your resume are easy to find.",
    sources: [
      { label: "CareerOneStop: Top portion of resume", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/top-portion-of-resume.aspx" },
      { label: "CareerOneStop: Special tips for recent college graduates", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/special-tips.aspx" }
    ]
  },
  {
    slug: "career-change-resume-format",
    title: "Changing Careers? Pick a Resume Format That Keeps Your Work History Visible",
    description: "A guide for career changers who want to foreground transferable evidence without making their past work difficult to verify.",
    audience: "Career changers and returners",
    publishedAt: "2026-08-18T00:00:00.000Z",
    opening: [
      "When you are changing careers, a functional resume can seem like an easy answer. It lets you lead with skills instead of a job history that does not match your target title. But hiding the timeline can create a different problem: a reader may struggle to see where your experience came from.",
      "The useful question is not which format is cleverest. It is which format makes your real work, transferable strengths, and next direction easiest to understand without asking the reader to fill in the gaps."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "CareerOneStop identifies chronological, functional, and combination resumes as the three basic styles. Its formatting guidance says a functional format may emphasise skills but can be misinterpreted by employers or rejected by some applicant tracking systems because detailed work history is limited.",
          "The same guidance says a combination format can help highlight transferable skills, refocus experience for a career change, or minimise work gaps while still including a detailed work history. This is not a rule that guarantees a result; it is a practical way to keep both sides of your story available."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "Keep your actual job titles, employers, and dates easy to locate. Then decide which skills headings or summary statements help a reader connect that history to the new field. Choose a few capabilities you can support with examples, such as coordination, customer research, documentation, scheduling, or process improvement.",
          "Use a simple, consistent layout with standard section headings. A career change already asks the reader to make a connection; do not add an unusual layout that makes dates, titles, or evidence harder to find. If a past role does not help the target story, shorten its detail rather than disguising it."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Consider an office manager moving toward project coordination. A skills-only section may list planning and stakeholder management, but it gives no context for those claims."
        ],
        example: {
          before: "Project management, leadership, communication, and organisation.",
          after: "Office Manager | Northfield Services | 2022–2026: coordinated a cross-team office systems rollout, tracked open requests, and prepared weekly status updates for the operations lead.",
          note: "This illustrative example keeps the original role visible while showing work that may be relevant to a coordination role. It does not rename the job or imply project-management certification."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "Some changes require current proof that a resume format cannot supply: a portfolio, recent training, a credential, or direct technical practice. A transparent timeline is still more useful than a format that makes the reader question what is missing.",
          "Review one target posting at a time. If the gap is in your wording, strengthen the examples tied to the target. If the gap is a real requirement, identify a practical way to build it and keep your existing experience accurate."
        ]
      }
    ],
    conclusion: [
      "A career-change resume should not erase your past. It should make the relevant parts of that past easier to follow.",
      "Keep the history visible, make the transferable evidence specific, and use formatting to clarify rather than conceal.",
      "This approach also makes a later conversation easier to prepare for: each highlighted strength should lead back to a situation you can describe plainly, including the original job, people involved, and work you actually completed. The format cannot remove a transition, but it can prevent the transition from obscuring the evidence you already have. Check the finished page for a clear sequence from headline, to skill, to work-history example, so the reader does not have to assemble that connection alone."
    ],
    cta: "ResuNexx can help you review whether your target direction and transferable evidence are visible in the first scan.",
    sources: [
      { label: "CareerOneStop: Formatting", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/formatting.aspx" },
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" }
    ]
  },
  {
    slug: "one-page-or-two-page-resume",
    title: "One Page or Two? Choose the Resume Length That Keeps Your Best Evidence Intact",
    description: "A practical decision rule for applicants who are unsure whether to cut detail or add a second page.",
    audience: "Early-career and developing-career applicants",
    publishedAt: "2026-08-19T00:00:00.000Z",
    opening: [
      "The one-page versus two-page debate can make a simple edit feel high-stakes. Some applicants squeeze every line into one page. Others add a second page because removing anything feels risky. Neither choice is automatically better.",
      "The more useful standard is whether each page helps a reader understand the role you want, the evidence you have, and the scope of your work. Length is a container; relevance and readability are the real decisions."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "CareerOneStop's formatting guidance recommends a resume length of one to two pages, using two pages only when your amount of experience makes it necessary. It also emphasises clean, consistent layout and readable spacing. That leaves room for judgment rather than a universal page-count rule.",
          "Early-career applicants often have fewer relevant examples and may benefit from the focus of one page. Someone with several directly relevant roles, projects, or certifications may need a second page to avoid shrinking the type or stripping context from the strongest evidence."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "Before changing margins or font size, mark the evidence that directly supports the target role. Keep the strongest recent examples, relevant skills, and qualifications. Then cut repeated duties, generic soft skills, old detail that does not support the target, and anything you could not explain in an interview.",
          "If a second page still contains specific, relevant evidence, use it intentionally. Make sure it begins with useful content rather than a nearly empty continuation. If the only way to reach one page is to reduce readability, the shorter document is no longer serving its purpose."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Imagine an applicant with three years of relevant experience, two sizeable projects, and a page of early retail duties that repeat the same customer-service point."
        ],
        example: {
          before: "Two pages with every role described in equal detail, including repeated tasks from unrelated work.",
          after: "One focused page with the two most relevant roles, a targeted project section, and a shorter line for earlier work that confirms employment history.",
          note: "This is illustrative. The goal is not to remove history indiscriminately; it is to give the most relevant evidence enough room to be understood."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "A shorter resume cannot compensate for a missing requirement or a target that does not match your current experience. Likewise, a second page cannot make unrelated material relevant. Treat length as one clarity check among several.",
          "Keep a version for each target role and review which examples you chose to protect. If the right evidence is already visible and the application remains quiet, review role fit, required qualifications, and how your examples connect to the posting."
        ]
      }
    ],
    conclusion: [
      "Use one page when it keeps your strongest evidence clear. Use two pages when the additional relevant detail genuinely helps the reader understand your fit.",
      "Do not let a page-count rule force you to hide the facts that matter.",
      "Check the document at normal reading size before you decide. A page crowded with narrow margins, tiny type, and compressed bullets may meet a numerical rule while making the underlying evidence less usable. If a detail survives the cut, it should earn its place by clarifying the role, the work, or a relevant capability—not by filling space. A focused second page is preferable to a first page that leaves the reader unable to distinguish the work you led from the work you merely observed in practice."
    ],
    cta: "ResuNexx can help you identify which evidence is prominent and which detail may be competing for attention.",
    sources: [
      { label: "CareerOneStop: Formatting", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/formatting.aspx" },
      { label: "CareerOneStop: Sample resumes", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/sample-resumes.aspx" }
    ]
  },
  {
    slug: "resume-keywords-without-copying-job-description",
    title: "Resume Keywords Work Best When They Sit Next to Real Evidence",
    description: "How applicants can use the language of a job posting accurately without turning their resume into a copied keyword list.",
    audience: "Applicants tailoring a resume to a specific role",
    publishedAt: "2026-08-20T00:00:00.000Z",
    opening: [
      "When a job description repeats terms such as stakeholder management, SQL, customer onboarding, or reporting, it is tempting to copy them into a skills section and hope they are noticed. But a list of familiar words does not show whether you have actually used them.",
      "A better approach is to treat a job posting as a guide to the evidence a reader will look for. Use its language when it accurately describes your work, then place that language next to an example that gives it context."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "CareerOneStop says a summary can highlight skills and accomplishments related to the job by using keywords from the posting. Its work-experience guidance also recommends describing relevant tasks and accomplishments with the employer's language, especially required or desired skills and experience.",
          "Those suggestions do not mean every repeated word belongs on the page. The same guidance stresses specifics: explain the context of the work, why it mattered, who it served, and what happened as a result when you can support it."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "Read the posting and mark the terms that describe the core work, tools, and outcomes—not every adjective. For each marked term, ask where you used it. If you have a real example, place the word near the relevant project, bullet, or skill. If you do not, leave it out and look for adjacent evidence you can describe honestly.",
          "Check for copied phrases that do not sound like you or do not match the facts below them. A reader should be able to move from a keyword to a title, action, tool, deliverable, scope, or outcome without needing to infer the connection."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Consider a job description that asks for customer onboarding and cross-functional coordination. An applicant has supported new clients and worked with an internal implementation team."
        ],
        example: {
          before: "Customer onboarding, stakeholder management, project coordination, communication.",
          after: "Supported customer onboarding by tracking implementation questions, updating the shared launch checklist, and coordinating follow-ups between new clients and the internal delivery team.",
          note: "This illustrative bullet uses relevant role language but makes the setting and actions visible. It does not claim ownership beyond the facts described."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "Keywords cannot replace a required tool, credential, or level of direct experience. Adding a term you cannot defend may create a harder problem later if a reader asks for a specific example.",
          "Keep a small evidence bank for the roles you target. When you see a repeated requirement, record the real situation where you used it, the tool or setting, and the outcome or scope. That gives you a truthful source for future tailoring instead of copying each job description from scratch."
        ]
      }
    ],
    conclusion: [
      "Use the language of the role to help a reader find your experience, not to simulate experience you do not have.",
      "The strongest keyword is one that leads directly to a credible example.",
      "This keeps tailoring sustainable as well. Instead of rebuilding the resume around every new posting, you can maintain a small set of truthful examples and select the ones that match each role. The wording may change, but the underlying facts should remain stable enough to explain clearly if a reader asks where a term came from. Read the final page for strings of keywords that have no nearby action, setting, or output; those are the phrases most worth replacing with concrete evidence on the page."
    ],
    cta: "ResuNexx can help you review whether the role language on your resume is supported by clear evidence.",
    sources: [
      { label: "CareerOneStop: Top portion of resume", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/top-portion-of-resume.aspx" },
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" }
    ]
  },
  {
    slug: "explain-employment-gap-without-overexplaining",
    title: "An Employment Gap Does Not Need a Long Explanation. It Needs an Honest, Useful One",
    description: "A practical guide for returners and career changers who need to account for time away from paid work without turning their resume into a personal statement.",
    audience: "Returners and career changers with an employment gap",
    publishedAt: "2026-08-21T00:00:00.000Z",
    opening: [
      "An employment gap can make the rest of a resume feel harder to trust. You may worry that a reader will stop at the dates and never see the experience that came before or the direction you are pursuing now. That worry can lead to two unhelpful extremes: trying to hide the gap, or explaining far more than a hiring reader needs to know.",
      "A resume is not the place to resolve every question about time away from paid work. Its job is smaller. Make the timeline accurate, keep the context brief where context helps, and make the evidence relevant to the role easy to find. You can decide what personal information is appropriate to share; you do not need to invent a story to make the dates look smoother."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "CareerOneStop's resume-format guidance notes that a functional or combination layout may be used to minimise work gaps, while also warning that a functional format with limited work history can be misinterpreted by employers. That creates a real design tension: a reader needs enough chronology to understand your experience, but a gap does not need to become the centre of the page.",
          "People also assume that a gap must be explained with a single impressive achievement. In practice, the useful question is whether there is an accurate fact that helps the reader understand your present direction. This could be a return-to-work course, a portfolio project, volunteer responsibility, caregiving period described only if you choose, or simply a short neutral label for a planned break."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "First, make your dates consistent. Use the same month-and-year format for every role, education entry, and recent project. Keep actual job titles and employers visible. A reader should not need to guess whether a section is work history, training, or a skills list.",
          "Next, decide whether the gap needs a short context line. Add one only when it is true and helps the target story. For example, a recent data course, a volunteer operations role, or a completed certification can sit in its own relevant section with dates. Do not turn a personal explanation into a claim about skills you did not use. If there is no relevant activity to include, a clean, accurate timeline is often enough.",
          "Finally, give the reader something current to evaluate. Put the role direction, recent relevant evidence, and strongest prior examples near the top. The gap may still be visible, but it no longer has to do all the talking."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Consider a customer-service professional returning after eighteen months away from paid work and applying for a support-coordinator role. Their resume currently leaves the dates unclear and opens with a broad statement about being ready to return."
        ],
        example: {
          before: "Experienced professional returning to work after a career break and ready for a new challenge.",
          after: "Customer Support Specialist | Alder Home Services | 2021–2024. Recent: completed a customer-support systems course and organised appointment requests for a local community project, 2025–2026.",
          note: "This is an illustrative example, not a customer result. It keeps the employment history accurate and names current activity without disclosing personal details or overstating the scope of unpaid work."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "A clearer timeline cannot remove a role's requirements. Some jobs may need recent industry experience, a licence, local work authorisation, or a portfolio that you do not yet have. A quiet application is not evidence that a gap is the only reason for the outcome.",
          "Keep a simple record of the roles you target and the current evidence you included. If the same missing requirement appears repeatedly, consider whether a focused project, training option, or a different entry point would give you a real example to add. Keep the resume honest while you build that next piece of evidence."
        ]
      }
    ],
    conclusion: [
      "A gap in paid work is part of a timeline, not a verdict on your ability. Accuracy, readable dates, and relevant current evidence give the reader a more useful picture than either concealment or overexplanation.",
      "Make the history clear, keep personal context on your terms, and let your actual work and current direction remain visible."
    ],
    cta: "ResuNexx can help you review whether your timeline and current evidence are organised clearly before you apply.",
    sources: [
      { label: "CareerOneStop: Resume formats", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/ResumeFormats.aspx" },
      { label: "CareerOneStop: Formatting", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/formatting.aspx" },
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" }
    ]
  },
  {
    slug: "resume-bullets-show-scope-without-inventing-metrics",
    title: "No Big Numbers to Report? Let Your Resume Bullets Show Scope Instead",
    description: "For developing-career applicants, a way to make responsibilities concrete when revenue, conversion, or confidential metrics are not available.",
    audience: "Developing-career applicants with 3–5 years of experience",
    publishedAt: "2026-08-22T00:00:00.000Z",
    opening: [
      "Many resume bullet examples end with a large percentage, a revenue figure, or a dramatic before-and-after result. If you do not have access to those numbers—or if they would be confidential—it can seem as though your day-to-day work does not count. That is not the right conclusion.",
      "A useful bullet does not need to manufacture a metric. It needs to give a reader enough context to understand what you did, where you did it, and the scale or result you can honestly support. Scope can be a team, a group of customers, a recurring process, a deliverable, a deadline, a system, or a defined responsibility."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "CareerOneStop recommends describing work experience with tasks, accomplishments, relevant employer language, context, and outcomes where available. It also notes that accomplishments can be framed with measures such as money, time, people, processes, or things. The point is to make the work understandable, not to imply that every role produces a public business metric.",
          "Applicants often start with a vague duty—managed emails, helped customers, supported projects—then feel pressure to attach a number they cannot verify. That can produce a bullet that is harder to defend than the original. An honest scope detail is more useful than a precise-looking claim with no clear source."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "Take one duty and write four notes beside it: the setting, the action, the people or process affected, and a result or deliverable you can verify. The result may be that a report was completed for a deadline, a request was handed to the right team, a recurring issue was documented, or a client received the information needed to proceed. Avoid claiming credit for a wider outcome you did not own.",
          "Use numbers only when you know what they mean and could explain their source. If the number is confidential, replace it with non-sensitive scope: a regional team, a weekly reporting cycle, a shared tracker, a group event, a queue, or an agreed deadline. This gives the reader a concrete picture without revealing protected information.",
          "Then check whether the bullet fits the target role. A well-described task is still less useful if it is unrelated to the work you want next. Give the most relevant evidence the clearest space."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Imagine a coordinator applying for an operations-support role. They handled a shared request inbox and updated a weekly status file, but do not have permission to disclose performance data."
        ],
        example: {
          before: "Managed emails and created reports for the team.",
          after: "Triaged requests in the shared operations inbox, recorded open items in the team tracker, and prepared the weekly status file for the regional operations meeting.",
          note: "This illustrative bullet names the process, tools, and recurring responsibility. It does not claim a turnaround improvement or cost saving that the applicant cannot substantiate."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "More detailed bullets cannot make a role equivalent to a requirement you have not met. A posting may need a specific system, industry background, seniority level, or formal qualification. Keep those boundaries visible instead of forcing unrelated work to sound identical to the target job.",
          "Build a small evidence bank as you work: the process you supported, the tools you used, the regular outputs, and the scope you can share. This makes future tailoring easier and gives you a factual starting point for interviews, portfolios, and performance discussions."
        ]
      }
    ],
    conclusion: [
      "A resume bullet becomes stronger when it shows a real setting and a defendable scope. Numbers can help, but they are only one kind of evidence.",
      "Describe the work you actually did, protect confidential information, and make the most relevant responsibilities easy to understand."
    ],
    cta: "ResuNexx can help you review whether your resume bullets make your real scope and contribution easier to see.",
    sources: [
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" },
      { label: "CareerOneStop: Formatting", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/formatting.aspx" }
    ]
  },
  {
    slug: "promotion-resume-show-progression-without-new-title",
    title: "You Took On More at Work. Make the Progression Visible Before You Ask for a New Title",
    description: "For early-to-mid-career applicants whose responsibilities grew before their job title changed, a practical way to document real progression without overstating a promotion.",
    audience: "Established early-to-mid-career applicants whose responsibilities have expanded",
    publishedAt: "2026-08-23T00:00:00.000Z",
    opening: [
      "Sometimes your job title stays still while the work around it changes. You may become the person who trains a new teammate, owns a recurring handover, coordinates a supplier issue, or keeps a shared process from slipping. When you update your resume, the old title can make that extra responsibility difficult to see.",
      "You do not need to imply a promotion that never happened. You do need to show the progression that did happen: what you were trusted to handle, how the scope changed, and which details you can support. That makes your work history more useful without rewriting it into a different role."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "Titles are administrative labels, and they do not always change at the same pace as a team's needs. A manager may add a responsibility because you know a process well, while a formal title change depends on a budget cycle, job architecture, or a decision outside your control. A resume that repeats the original job description can hide that shift.",
          "CareerOneStop advises job seekers to describe work experience with relevant tasks, accomplishments, context, and outcomes where available. That is a useful standard here: the reader needs enough detail to see the work, but the language should not claim authority, people management, or results that were not actually yours."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "Keep the official job title and employer dates exactly as they were. Under that title, compare the work you handled near the start of the role with work you handle now. Look for a real change in scope: a new system, a recurring handover, a larger group of stakeholders, an additional workstream, or responsibility for checking a process before it moves on.",
          "Then turn the change into a bullet with an action, setting, and defensible scope. Use words such as coordinated, documented, trained, prepared, monitored, or supported only when they describe your actual part. If a manager made the final decision, say that you prepared information or coordinated the process rather than claiming that you set the direction.",
          "Choose two or three progression bullets that relate to the role you want next. A long list of every extra task can make the change harder to spot. The aim is a clear record of growing responsibility, not a case for a title you did not hold."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Consider a customer support specialist applying for a service-operations role. Their title has not changed, but they now prepare the weekly issue summary and help new starters use the team's case tracker."
        ],
        example: {
          before: "Answered customer questions and helped train new staff.",
          after: "Answered customer cases, prepared the weekly recurring-issue summary for the support lead, and showed new starters how to record updates in the shared case tracker.",
          note: "This is an illustrative example, not a customer result. It does not call the applicant a manager or claim that the summary improved service outcomes; it makes the added responsibility visible."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "Clearer progression cannot replace a requirement such as direct people management, a specific system, a licence, or sector experience. A quiet application is not proof that your title alone caused the outcome, and it is not a reason to inflate your role.",
          "Keep a short evidence record as responsibilities change: the date, the process, your part, and a non-confidential detail you can verify. If you repeatedly target a role that asks for experience you do not yet have, look for a bounded project or training opportunity that lets you build a real example rather than invent one on the page."
        ]
      }
    ],
    conclusion: [
      "A title is one part of a work history, not the whole story. Keep it accurate, then show the responsibilities and scope that genuinely grew around it.",
      "The most credible progression is specific enough to understand and modest enough to defend."
    ],
    cta: "ResuNexx can help you review whether your resume makes your real progression and current scope easy to understand.",
    sources: [
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" },
      { label: "CareerOneStop: Formatting", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/formatting.aspx" }
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
