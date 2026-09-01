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
  },
  {
    slug: "early-career-resume-skills-list-evidence",
    title: "Your Skills List Is Not a Substitute for Evidence: An Early-Career Resume Check",
    description: "For early-career applicants whose resume lists tools and strengths without showing where they used them, a practical way to add credible context.",
    audience: "Early-career applicants with 0–2 years of experience",
    publishedAt: "2026-08-24T00:00:00.000Z",
    opening: [
      "A skills section can grow quickly when you are early in your career. You may list Excel, customer service, research, presentation design, CRM software, or a programming language because you have used each one at some point. The problem is not the list itself. The problem is that the list can leave a reader unable to tell what you actually did with those tools.",
      "You do not need to turn every skill into a dramatic achievement. You do need to connect the few skills that matter most for a target role to a real setting, task, or output. That gives the reader something more useful than a claim they must interpret alone."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "Early-career applicants often collect skills from classes, internships, part-time jobs, volunteer roles, and online learning. Those experiences can be real and relevant, but they are easy to compress into a dense row of keywords. When a job description also contains a long skills list, copying its language can seem like the fastest way to tailor a resume.",
          "CareerOneStop treats Skills as an optional section and recommends keeping it relevant to the job. Its work-experience guidance also asks candidates to describe the context, purpose, audience, and outcome of their work where they can support it. Together, those ideas suggest a useful division: use the skills list to help a reader scan, then use your bullets or projects to show the evidence behind the most important items."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "Start with one target job and choose no more than three skills that genuinely appear in both the posting and your own experience. For each one, write a short note: where you used it, what you were responsible for, and what you produced, supported, or completed. A class exercise, student project, internship task, or customer-facing shift can all be valid settings when described accurately.",
          "Move the strongest notes into the section where they belong. A spreadsheet used to track event registrations may fit under a campus role. Research used to prepare a class presentation may fit under Projects or Education. Keep the tool name, but add the action around it. If you cannot describe a real use, it may be better to remove the skill or label it honestly as introductory training.",
          "Avoid claiming proficiency levels you cannot explain. The goal is not to prove that every skill is advanced. It is to make your current experience specific enough that a reader can see what you know and ask a sensible follow-up question."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Imagine an applicant for a junior marketing-coordinator role. Their resume has a Skills section that lists Excel, Canva, and social media, but their experience section only says that they helped with a student event."
        ],
        example: {
          before: "Skills: Excel, Canva, social media. Helped with student events.",
          after: "Supported promotion for a student event by updating the attendee spreadsheet, preparing event graphics in Canva, and scheduling approved posts for the society's social channels.",
          note: "This is an illustrative example, not a customer result. It does not claim that the applicant led a campaign or produced a growth result; it shows how the listed tools were used."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "More context around your skills cannot create experience that a role specifically requires. An employer may be looking for a portfolio, a particular platform, work authorisation, a credential, or a level of responsibility you have not reached yet. A quiet application does not prove that your skills section was the only issue.",
          "Keep an evidence bank as you learn: the project, tool, task, and a detail you can verify without sharing confidential information. Use it when tailoring future applications. If a recurring requirement is missing, look for a bounded course project, volunteer task, or supervised opportunity that lets you build a truthful example rather than stretching the wording on your resume."
        ]
      }
    ],
    conclusion: [
      "A skills list can help a resume scan quickly, but it is most useful when the important items also appear beside real work, projects, or training.",
      "Choose the evidence you can explain, place it where it belongs, and let the reader see the connection without guessing."
    ],
    cta: "ResuNexx can help you review whether the skills on your resume are supported by clear, relevant evidence.",
    sources: [
      { label: "CareerOneStop: Top portion of resume", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/top-portion-of-resume.aspx" },
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" }
    ]
  },
  {
    slug: "returning-worker-resume-recent-training",
    title: "Returning to Work? Put Recent Training Where It Supports Your Next Step",
    description: "For returners who have completed recent training but are unsure where it belongs on a resume, a practical way to show it without hiding their work history.",
    audience: "Career returners with recent relevant training",
    publishedAt: "2026-08-25T00:00:00.000Z",
    opening: [
      "Returning to work can make a recent course, certificate, refresher programme, or volunteer assignment feel disproportionately important. You may want it near the top of the page because it is current and connected to the work you want next. At the same time, placing it too prominently can make years of earlier experience look less relevant than they are.",
      "The choice is not between hiding your training and pretending it replaces your work history. A stronger resume lets both do their proper job: recent training signals what you have refreshed or learned, while your experience shows the settings in which you have already contributed."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "A returner often has to reconnect two timelines: earlier paid work and the more recent activities that prepared them to re-enter the market. A resume organised only by date can make a relevant course difficult to notice. A resume organised only around a new qualification can hide practical experience that still matters to the target role.",
          "CareerOneStop notes that education can include certifications, classes, volunteer training, professional development, and training completed on the job. It also says that current or recent relevant training may be placed before work experience, while candidates with relevant work experience can place Education after it. Placement therefore depends on what best supports the job goal, not on a fixed rule for every returner."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "First, identify what the recent training actually demonstrates. Record its formal name, provider, completion date, and the topic or tool you can honestly claim to have covered. If it led to a recognised credential, use the official credential name. If it was a short course, do not present it as a degree, licence, or work experience.",
          "Next, decide where a reader needs to see it. Put a directly relevant, current programme in a concise Professional Development or Training section near the top when it explains your target direction. Keep a fuller Education section later if your earlier degree is less central. If your previous work is the stronger evidence, lead with Experience and position the training where it reinforces that story.",
          "Connect the two sections with careful language. A summary can say that you are returning to a field after recent training, but it should not imply that a course gave you years of practice. Choose one or two past bullets that show related responsibilities and leave unrelated details out of the opening view."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Consider an administrative professional returning after time away and applying for a coordinator role. They completed a recent course on spreadsheet reporting, while their earlier job involved maintaining team records and preparing meeting materials."
        ],
        example: {
          before: "Excel Certificate, 2026. Administrative Assistant, 2018–2022: handled office tasks.",
          after: "Professional Development: Spreadsheet Reporting, City Skills Centre, completed 2026. Administrative Assistant, 2018–2022: maintained the team records file and prepared meeting materials for weekly staff updates.",
          note: "This is an illustrative example, not a hiring result. It distinguishes recent training from earlier work and does not claim advanced reporting expertise beyond the course."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "Recent training can show readiness to learn, but it cannot automatically meet requirements for current industry experience, a licence, local work eligibility, or a specific portfolio. Silence after an application may have several causes, and a resume is only one part of the picture.",
          "Review each target role for the requirement that seems hardest to evidence. If training alone does not cover it, consider a small supervised project, a work sample, or a conversation with a career adviser about a realistic entry route. Keep your resume focused on facts you can explain clearly if asked."
        ]
      }
    ],
    conclusion: [
      "Recent training deserves a visible place when it supports the work you want next, but it should sit beside—not replace—your real experience.",
      "Make the relationship clear, keep each claim proportionate, and help the reader understand both your preparation and your track record."
    ],
    cta: "ResuNexx can help you review whether your recent training and earlier experience tell one clear, accurate story.",
    sources: [
      { label: "CareerOneStop: Education", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/education.aspx" },
      { label: "CareerOneStop: Top portion of resume", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/top-portion-of-resume.aspx" },
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" }
    ]
  },
  {
    slug: "experienced-resume-relevance-without-deleting-history",
    title: "Your Resume Has Enough Experience. Now Make the Relevant Work Easier to Find",
    description: "For established early-to-mid-career applicants whose resume lists every role but does not make the target direction clear.",
    audience: "Established early-to-mid-career applicants with 5–8 years of experience",
    publishedAt: "2026-08-26T00:00:00.000Z",
    opening: [
      "After several years at work, the hard part of a resume can stop being what to add. You may have changed teams, supported different customers, learned new systems, helped with projects outside your title, and kept older roles because each one seems too important to remove. The page grows, but the direction becomes harder to see.",
      "That does not mean your experience lacks value. It means the reader needs help finding the work that is most relevant to this particular role. Editing for relevance is not the same as rewriting your history or making a modest responsibility sound larger than it was."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "An established applicant often writes a resume as a complete record. That instinct is understandable: every role took time, and leaving detail out can feel risky. But a target role does not need equal detail about every task you have performed. It needs a clear, accurate view of the responsibilities, skills, and outcomes that relate to the work on offer.",
          "CareerOneStop advises job seekers to list past and current jobs with responsibilities and accomplishments related to their job goal. Its guidance also suggests giving more emphasis to work that adds the most value to an application, rather than trying to document every task. That is an editing principle, not permission to omit dates, change titles, or conceal an important part of your history."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "Start with one target posting and identify three or four requirements that you can genuinely support. They might involve stakeholder coordination, documentation, customer problem-solving, scheduling, reporting, or a particular system. Then scan your recent roles and mark the bullets that show those activities in a real setting.",
          "Give the most relevant recent role the clearest detail. Keep its official title, employer, dates, and the facts you can explain. Use concise bullets that show what you did, the setting, and a supported outcome or scope. Where a number is unavailable, do not invent one. A team, process, recurring deliverable, or group served can provide useful context without turning an ordinary responsibility into a performance claim.",
          "Older or less relevant roles can stay visible with fewer bullets. This preserves a readable timeline while leaving space for the evidence connected to your next step. Check that the summary, skills section, and first detailed role all point in the same direction."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Imagine a customer operations specialist with seven years of experience applying for a service-delivery coordinator role. Their resume gives every past position five general bullets, so the reader cannot quickly see the coordination work in their current job."
        ],
        example: {
          before: "Customer Operations Specialist: answered queries, updated records, worked with other teams, and completed daily tasks.",
          after: "Customer Operations Specialist: coordinated daily escalations with billing and fulfilment teams, updated the shared case tracker, and prepared a weekly summary of recurring customer issues for the service lead.",
          note: "This is an illustrative rewrite, not a customer result. It keeps the original role title and makes the setting, actions, and scope easier to recognise without claiming a promotion or a hiring outcome."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "A more focused resume cannot remove every gap. A target role may require a licence, direct industry experience, local work authorisation, a technical portfolio, or a level of responsibility you have not yet held. A quiet application does not prove that your resume is the only issue.",
          "Keep a record of the role and the version you used. If responses remain limited, compare the first third of the resume with the target requirements you could honestly support. If the evidence is there but the role needs something you do not yet have, identify a practical way to build that evidence rather than stretching the wording."
        ]
      }
    ],
    conclusion: [
      "More experience should give you more evidence to choose from, not more unrelated detail for a reader to sort through.",
      "Keep your history accurate, foreground the work that connects to the target, and let your next direction become visible through facts you can stand behind."
    ],
    cta: "ResuNexx can help you review whether the most relevant evidence on your resume is clear before you apply.",
    sources: [
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" },
      { label: "CareerOneStop: Top portion of resume", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/top-portion-of-resume.aspx" },
      { label: "CareerOneStop: Formatting", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/formatting.aspx" }
    ]
  },
  {
    slug: "federal-resume-work-experience-details",
    title: "Applying for a U.S. Federal Role? Turn Each Work Entry Into a Clear Record",
    description: "For early-career applicants to U.S. federal roles, a practical way to describe work history clearly without inflating responsibility.",
    audience: "Early-career applicants preparing for U.S. federal roles",
    publishedAt: "2026-08-27T00:00:00.000Z",
    opening: [
      "A federal job application can make an early-career resume feel unexpectedly demanding. You may have a part-time role, internship, campus job, or first professional position that seems too modest to describe in detail. Leaving it brief, however, can hide the duties, tools, and context that show what you actually did.",
      "For U.S. federal applications, the job announcement and application instructions set the standard. Your task is not to make a short role sound senior. It is to create an accurate record that lets the agency see the work, skills, and experience you can genuinely support."
    ],
    sections: [
      { heading: "Why this happens", paragraphs: [
        "Many early-career resumes use a familiar commercial format: title, employer, dates, and a few compact bullets. That can be useful elsewhere, but a federal application may ask for more employment detail. USAJOBS says a work-experience entry should include the employer, title, dates, duties, skills, and accomplishments; some details are optional, and the announcement may ask for additional information.",
        "The pressure to sound qualified can then lead applicants to stretch a supporting role into ownership of a result. That is risky and unnecessary. USAJOBS also states that application information must be true and accurate. Specific, modest detail is a stronger foundation than a polished claim you cannot explain."
      ] },
      { heading: "What to check or improve", paragraphs: [
        "Read the announcement before changing your resume. Note the duties, qualifications, required documents, and any requested fields. Then review each relevant job in your history and write down the setting, your regular responsibilities, the tools or records you used, and an outcome or deliverable you can verify. Keep dates, job titles, and employer names consistent with your records.",
        "Use the announcement's terminology only where it truthfully describes your work. For example, a student assistant who maintained a shared spreadsheet can say that; they should not claim programme management because they observed a programme manager. If a task was completed with a team, name your contribution and the team context instead of taking credit for the full result.",
        "Finally, check the application instructions again. A federal resume may not follow the same length or document rules as another employer. The announcement—not a generic template—should decide what you submit."
      ] },
      { heading: "Concrete example", paragraphs: [
        "Imagine a recent graduate applying for an administrative-support role. Their campus job involved helping a department prepare materials for recurring meetings, but they were not the person who set policy or chaired the meetings."
      ], example: {
        before: "Managed department operations and meetings.",
        after: "Prepared meeting materials for the department coordinator, updated the shared attendee list, and recorded follow-up items assigned during weekly staff meetings.",
        note: "This is an illustrative example, not a customer result. It identifies a real supporting function without claiming decision-making authority or a hiring outcome."
      } },
      { heading: "If you still hear nothing", paragraphs: [
        "A clearer work entry cannot establish eligibility, a required credential, citizenship status, or specialised experience that the announcement requires. It also cannot correct a missing document or an application submitted after the closing date. A quiet result is not proof that the wording of one resume line was the only issue.",
        "Keep a factual record of each role as you apply: dates, duties, tools, training, and examples you can substantiate. Review it against the next announcement rather than rebuilding the story from memory. That makes tailoring more careful and helps you keep your application accurate."
      ] }
    ],
    conclusion: [
      "For a U.S. federal application, clarity is more useful than a bigger-sounding title. Show the real work, follow the announcement, and keep every detail defensible.",
      "A complete record gives the right reader a fairer view of what you have actually done."
    ],
    cta: "ResuNexx can help you review whether the experience on your resume is organised clearly before you adapt it to an application.",
    sources: [
      { label: "USAJOBS Help Center: How to fill out your work experience", href: "https://help.usajobs.gov/how-to/account/profile/experience/work" },
      { label: "USAJOBS Help Center: Signature and false statements", href: "https://help.usajobs.gov/working-in-government/fair-and-transparent/signature-false-statements" }
    ]
  },
  {
    slug: "federal-application-required-documents-check",
    title: "Before You Submit a U.S. Federal Application, Check the Documents Your Resume Cannot Replace",
    description: "For recent graduates applying to U.S. federal roles, a practical pre-submission check for required documents and accurate resume evidence.",
    audience: "Recent graduates applying to U.S. federal early-career roles",
    publishedAt: "2026-08-28T00:00:00.000Z",
    opening: [
      "When an application is nearly ready, it is easy to spend the last hour adjusting resume wording and overlook the documents around it. For a recent graduate applying to a U.S. federal role, the resume is only one part of the package. The announcement may require evidence that a polished bullet cannot provide.",
      "This is not a reason to upload every certificate or old file you can find. It is a reason to pause before submitting, read the announcement closely, and make sure each document supports the eligibility or qualification it is meant to show."
    ],
    sections: [
      { heading: "Why this happens", paragraphs: [
        "Early-career applicants often assume that education, training, and eligibility can be explained in a resume summary. In a federal application, the Required Documents section can set separate requirements. USAJOBS explains that the documents needed depend on the job and applicant type, and that some are required while others are optional.",
        "A transcript, professional certification, proof of enrolment, licence, or other record may support a qualification in a way that a resume line alone cannot. The exact document is not universal: it depends on the announcement. Treating a checklist from another job as a substitute for the current instructions can create avoidable confusion."
      ] },
      { heading: "What to check or improve", paragraphs: [
        "Open the announcement and make a short list with three columns: required document, why it is requested, and whether you have a current readable copy. Check the eligibility and qualifications sections alongside Required Documents. If the role asks for a transcript or a licence, make sure the resume describes the related education or experience accurately, but do not assume the description replaces the document.",
        "Then compare dates and names across the package. Your graduation date, employer dates, training dates, job title, and credential name should match the records you submit. If an item is optional, decide whether it adds relevant evidence; more attachments are not automatically more helpful. Follow the announcement's stated upload and submission instructions.",
        "Keep a simple application folder with the version of your resume, the announcement, and the supporting files you used. This is a personal organisation step, not a promise that the application will be selected. It makes it easier to check what you actually submitted if you apply for another role later."
      ] },
      { heading: "Concrete example", paragraphs: [
        "Consider a recent graduate applying to a role whose announcement lists a transcript as a required document. Their resume says that they completed a relevant degree, but they have not checked whether the application also needs the transcript itself."
      ], example: {
        before: "BSc in Environmental Science, 2026. Relevant coursework available on request.",
        after: "BSc in Environmental Science, 2026. Prepared the requested transcript separately and checked that the degree date and programme name match the application record.",
        note: "This is an illustrative pre-submission check, not a claim that coursework or a degree meets a particular job's qualification standard."
      } },
      { heading: "If you still hear nothing", paragraphs: [
        "A complete document package does not guarantee that you meet the full qualification standard or will receive a response. The role may have a narrow eligibility rule, a specific experience requirement, or a competitive field of eligible applicants. Do not alter a resume or document to make it appear that you meet a condition you do not meet.",
        "Save the announcement and the documents you submitted, then review the next role against its own instructions. If a recurring requirement is missing, identify the legitimate next step—such as confirming eligibility, obtaining a required record, or gaining relevant experience—rather than trying to solve it through wording alone."
      ] }
    ],
    conclusion: [
      "Your resume should describe your evidence clearly, but it cannot replace documents an announcement specifically requires. Read the current instructions, keep the facts consistent, and submit only what the role calls for.",
      "A careful document check is a practical way to make your application complete without overstating what it proves."
    ],
    cta: "ResuNexx can help you review whether your resume presents your education and experience clearly before you complete an application.",
    sources: [
      { label: "USAJOBS Help Center: What documents do I need to provide when I apply?", href: "https://help.usajobs.gov/faq/application/documents" },
      { label: "USAJOBS Help Center: How to create an application", href: "https://help.usajobs.gov/how-to/application" }
    ]
  },
  {
    slug: "new-graduate-resume-degree-in-progress",
    title: "Your Degree Is Still in Progress: Make the Education Line Clear Without Guessing",
    description: "For final-year students applying before graduation, a practical way to show current education, expected completion, and relevant evidence accurately.",
    audience: "Final-year students applying before graduation",
    publishedAt: "2026-08-29T00:00:00.000Z",
    opening: [
      "Applying before graduation can make the Education section feel awkward. You may be close to finishing, still completing a capstone, or waiting for a formal award date. A rushed resume can turn that uncertainty into an unclear line: a degree appears completed when it is not, or the expected date is missing altogether.",
      "You do not need to hide that you are still studying. The useful goal is simpler: let a reader see the programme, institution, current status, and timing without having to infer any of them. Then use the rest of the resume to show the work, projects, and skills you can already support."
    ],
    sections: [
      { heading: "Why this happens", paragraphs: [
        "Final-year applicants often work from an old template that assumes every qualification is already complete. They may also worry that an expected graduation date looks less convincing than a finished degree. That can produce vague wording such as \"BSc candidate\" with no field or date, or a degree listing that looks final even though remaining requirements are still in progress.",
        "CareerOneStop's education guidance treats education as a resume section that can include degrees, training, coursework, certifications, and relevant information for the job target. Its formatting guidance also recommends dates that are easy to read and standard section headings. These are useful cues: clarity and relevance matter more than pretending the timeline is settled."
      ] },
      { heading: "What to check or improve", paragraphs: [
        "Start with the records you can verify: the institution's name, the official programme name, your current status, and your expected completion date. Use \"Expected\" or \"Anticipated\" only when that wording is true. Do not replace it with a completed degree label until the credential has actually been awarded.",
        "Next, decide what education evidence belongs near the line. A capstone, thesis, lab, relevant module, or student project may help when it relates directly to the role. Give it a concrete label and describe what you did, rather than turning a course title into a claim of professional experience. If space is limited, keep the details that make the direction understandable and remove unrelated lists.",
        "Finally, compare the education line with the application form. Some employers ask separately for dates, grades, transcripts, work authorisation, or supporting documents. A clear resume can support the package, but it does not replace instructions in the particular application."
      ] },
      { heading: "Concrete example", paragraphs: [
        "Imagine a final-year student applying for an entry-level data-support role. They are completing a degree in economics and have used spreadsheets in a supervised capstone, but their current resume makes the degree look finished and gives no context for the project."
      ], example: {
        before: "BSc Economics, 2026. Advanced Excel and data analysis.",
        after: "BSc Economics, Northbridge University — Expected June 2026. Capstone project: cleaned and summarised a course dataset in Excel, documenting formulas and source notes for a four-person team.",
        note: "This is an illustrative example, not a claim of professional certification or a hiring result. The student should use their own verified institution, expected date, and project details."
      } },
      { heading: "If you still hear nothing", paragraphs: [
        "A clearer education line cannot make you eligible for a role that requires a completed credential by a specific date, a licence, work authorisation, or experience you have not yet gained. It also cannot show every qualification that an employer may ask for in a separate form. No response is not proof that the degree line was the only issue.",
        "Keep a small evidence file while you finish your course: project briefs, deliverables you are allowed to describe, training records, and accurate dates. When a role is not yet a fit, use the next application to make the same facts clearer rather than changing the status of your degree."
      ] }
    ],
    conclusion: [
      "An in-progress degree is useful information when it is stated plainly. Make the programme and timeline easy to find, then support the direction with work you can explain.",
      "Accuracy now gives you a cleaner update to make once the qualification is complete."
    ],
    cta: "ResuNexx can help you review whether your education and project evidence are easy to understand before you apply.",
    sources: [
      { label: "CareerOneStop: Education", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/education.aspx" },
      { label: "CareerOneStop: Formatting", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/formatting.aspx" }
    ]
  },
  {
    slug: "student-part-time-work-resume-relevance",
    title: "Your Part-Time Job Counts: Show the Work That Connects to Your First Career Step",
    description: "For students and recent graduates, a practical way to turn part-time work into truthful, relevant resume evidence without overstating its scope.",
    audience: "Students and recent graduates with part-time work experience",
    publishedAt: "2026-08-30T00:00:00.000Z",
    opening: [
      "A part-time job can feel unrelated when you are applying for your first role in a new field. Retail, hospitality, campus support, delivery, tutoring, and customer-service work may not match the title you want next. That does not mean it has to disappear from your resume or be rewritten as something it was not.",
      "The better question is what the work lets you show accurately. A reader may need to see that you handled a process, supported customers, kept records, worked to a schedule, or coordinated with a team. Put those facts in context, and keep the claim at the level of responsibility you actually held."
    ],
    sections: [
      { heading: "Why this happens", paragraphs: [
        "Students often divide experience into \"career-relevant\" and \"not worth mentioning.\" That makes it tempting either to delete a real job that explains part of the timeline or to inflate routine tasks into leadership language. Both choices can make the resume harder to trust and harder to read.",
        "CareerOneStop advises applicants with limited work experience to include past jobs while emphasising the skills, tasks, and outcomes most relevant to the target role. Its work-experience guidance also recommends context: what you did, why it mattered, for whom, and what happened as a result where you can support it. Relevance is not the same thing as renaming a job."
      ] },
      { heading: "What to check or improve", paragraphs: [
        "Read one target job description and select a small number of requirements you can honestly connect to the part-time role. For each, note the setting, the recurring task, the people or process involved, and one verifiable detail. A shift handover, booking record, stock check, customer query, or training task can be more useful than a broad adjective such as \"hard-working.\"",
        "Write bullets with ordinary verbs that match your actual contribution: supported, prepared, updated, checked, explained, logged, scheduled, or assisted. Use a number only if you know what it measures and can stand behind it. If the result belonged to a team, say that. If a task was introductory, do not label it expert-level experience.",
        "Place the job where a reader expects to find it, usually under Experience, and keep the dates and employer name consistent with your records. A short description of the organisation can help when the title alone does not explain the setting."
      ] },
      { heading: "Concrete example", paragraphs: [
        "Consider a student applying for an operations-coordinator internship. Their weekend café role did not involve managing the business, but it did include a repeatable opening routine, customer requests, and a shared order process."
      ], example: {
        before: "Leadership and operations experience in a busy café.",
        after: "Supported the opening shift at a neighbourhood café by checking the daily order list, preparing the counter with two colleagues, and recording customer requests for the shift supervisor.",
        note: "This is an illustrative example, not a claim that the student managed operations or improved business results. It makes a supporting role and its setting visible."
      } },
      { heading: "If you still hear nothing", paragraphs: [
        "A truthful part-time-work entry cannot substitute for a portfolio, technical qualification, work authorisation, or prior experience that a role specifically requires. It also cannot establish that you have performed a specialised duty you only observed. A quiet application is not evidence that one bullet was the only barrier.",
        "Keep a factual note of tasks, tools, training, and examples from each role while they are fresh. Add new evidence through coursework, supervised projects, volunteering, or entry-level work where it is genuinely available. That gives you more to tailor without stretching the work you have already done."
      ] }
    ],
    conclusion: [
      "Part-time work can make a first resume more credible when it shows real responsibilities in a clear setting. Preserve the title, dates, and scope, then foreground the evidence that connects to the next step.",
      "You do not need to make an ordinary job sound extraordinary for it to show useful, transferable habits."
    ],
    cta: "ResuNexx can help you review whether your part-time experience shows clear, relevant evidence for your target role.",
    sources: [
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" },
      { label: "CareerOneStop: Special tips for recent college graduates", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/special-tips.aspx" }
    ]
  },
  {
    slug: "experienced-resume-choose-relevant-history",
    title: "Your Resume Has Ten Years of Work: Choose What Supports the Role Without Erasing the Rest",
    description: "For experienced applicants whose resume is becoming a complete work archive, a practical way to select relevant evidence without hiding their real history.",
    audience: "Experienced applicants with 8–15 years of work history",
    publishedAt: "2026-08-31T00:00:00.000Z",
    opening: [
      "After years of work, a resume can become harder to edit than it was to write. Each role contains projects, responsibilities, systems, and people you supported. Removing a bullet can feel like removing proof that the job mattered. Keeping every bullet, though, can leave the reader with a long record and no clear reason you fit this particular direction.",
      "You do not need to rewrite your career or conceal work that explains your history. The aim is to make a reasoned selection: preserve accurate titles and dates, then give the most space to the work that helps a reader understand the role you want now. That is different from claiming every past task was directly relevant."
    ],
    sections: [
      { heading: "Why this happens", paragraphs: [
        "Experienced applicants often build a resume by adding to the previous version. Over time, early roles keep the same detail as recent ones, old tools sit beside current ones, and every project competes for attention. The document may be accurate, but its priorities are no longer visible. A reader has to work out which experience is central and which is background.",
        "CareerOneStop advises applicants with a longer history to include or emphasise the jobs that add the most value to the application, while briefly covering unrelated jobs that explain the timeline. Its guidance also recommends linking work descriptions to the job goal and providing context for tasks and outcomes that can be supported. This is a useful editing rule, not a promise about any hiring decision."
      ] },
      { heading: "What to check or improve", paragraphs: [
        "Start with one target role, not a generic idea of the industry. Mark a small number of requirements that recur in the posting: a process, type of stakeholder, technical area, or responsibility. Then review your work history role by role. For each role, choose the evidence that most directly shows that kind of work and leave routine details in a shorter description where they still explain the position.",
        "Keep the original job title, employer, and dates. Use a bullet to show an action in its real setting, the people or process involved, and a result or scope only when you can verify it. If a useful result cannot be measured, a specific deliverable, handover, system, or audience can still give the reader context. Do not borrow a senior title or imply ownership of work that belonged to a wider team.",
        "Check the balance on the page. Your current or most relevant role may deserve more detail than an early unrelated position, but older work can remain as a concise record. Remove duplicated skills lists and repeated verbs before removing facts that explain a transition, a gap, or a credential."
      ] },
      { heading: "Concrete example", paragraphs: [
        "Imagine an operations professional applying for a project-coordination role after ten years across customer support, scheduling, and vendor administration. Their draft has six equally detailed jobs and several bullets that repeat that they answered emails and updated files."
      ], example: {
        before: "Operations Assistant: Responsible for emails, reports, meetings, administration, suppliers, and supporting projects.",
        after: "Operations Assistant: Prepared weekly supplier-status updates, maintained the action log for a cross-team rollout, and followed up on agreed next steps with the project lead.",
        note: "This is an illustrative rewrite, not a claim that the applicant led the rollout or managed suppliers. It identifies the setting and contribution while leaving the actual title intact."
      } },
      { heading: "If you still hear nothing", paragraphs: [
        "A more focused resume cannot bridge every gap. A role may require a licence, a specialised portfolio, local work authorisation, direct sector experience, or a level of responsibility that your work history does not show. Silence after an application is not proof that the length of the resume or one omitted bullet caused the result.",
        "Keep a master record outside the resume with fuller project notes, dates, tools, and outcomes you are allowed to describe. Use it to create a truthful version for each direction, and compare that version with the next role's actual requirements. This gives you a disciplined way to tailor without losing the facts of your career."
      ] }
    ],
    conclusion: [
      "An experienced resume does not need to be a complete archive. It needs to make the most relevant, supportable parts of a real work history easy to find.",
      "Preserve the record, choose the evidence deliberately, and let the target role determine where the detail belongs."
    ],
    cta: "ResuNexx can help you review whether the strongest evidence in your work history is easy to find for the role you are targeting.",
    sources: [
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" },
      { label: "JobAccess: Creating a good resume", href: "https://jobaccess.gov.au/i-am-a-person-with-disability/creating-a-good-resume" }
    ]
  },
  {
    slug: "early-career-resume-summary-use-evidence",
    title: "Your Resume Summary Sounds Generic: Give Early-Career Evidence a Clearer Job",
    description: "For early-career applicants with some experience but a vague opening summary, a practical way to make the top of the resume specific without inflating a title.",
    audience: "Early-career applicants with 1–3 years of experience",
    publishedAt: "2026-09-01T00:00:00.000Z",
    opening: [
      "When you have one or two years of experience, the top of the resume can be the hardest part to write. You want to sound ready for the next step, but phrases such as \"motivated professional\" or \"strong communicator\" do not show what you have actually done. Adding a bigger title or a crowded skills list can make the opening sound more confident while making it less precise.",
      "A useful summary is not a miniature biography. It is a short orientation for the reader: the kind of work you have done, the evidence you can support, and the direction you are targeting. If your work history already shows a clear progression, you may not need one at all. The important thing is not to make the page say more than the evidence can carry."
    ],
    sections: [
      { heading: "Why this happens", paragraphs: [
        "Early-career applicants often inherit a template designed for much more experienced professionals. It asks for a summary before the writer has selected a target role or reviewed the details in their own work history. The result is a block of positive adjectives that repeats the skills section and gives the reader no concrete way to test the claim.",
        "CareerOneStop describes a summary as a short section for skills and accomplishments related to the job, and notes that applicants with three years or less of experience may skip it. JobAccess likewise lists a short career summary as one possible part of a resume, alongside work history, education, training, and skills. These sources support a simple choice: use a summary only when it adds accurate orientation."
      ] },
      { heading: "What to check or improve", paragraphs: [
        "Read the target job first. Identify two or three requirements you can honestly connect to a real situation: a support process, a tool, a type of customer, a project task, or a training record. Then locate the matching bullets in your experience section. The summary should point toward evidence that is already visible below it, not introduce a claim that appears nowhere else.",
        "Keep the wording modest and concrete. State your actual area of work, a relevant task or setting, and the direction you are pursuing. Avoid calling yourself a manager, specialist, or strategist unless that is your verified role or qualification. If the only available sentence is a list of personality traits, remove it and let the first relevant experience bullet do the work.",
        "Finally, compare the summary with the application form and your records. Names of tools, dates, certificates, and scope should match what you can explain. A short opening is easier to keep accurate when it does not try to cover every skill you have ever used."
      ] },
      { heading: "Concrete example", paragraphs: [
        "Consider an applicant with eighteen months of customer-support and scheduling experience who is applying for an entry-level operations role. Their opening currently claims broad leadership and project-management expertise, while the evidence below shows a narrower but useful contribution."
      ], example: {
        before: "Dynamic professional with excellent communication, leadership, and project-management skills.",
        after: "Customer-support and scheduling assistant with experience updating appointment records, responding to routine client questions, and maintaining handover notes; seeking an entry-level operations-support role.",
        note: "This is an illustrative example, not a claim that the applicant managed projects or will meet every requirement of the target role. The applicant should use only responsibilities and direction they can support."
      } },
      { heading: "If you still hear nothing", paragraphs: [
        "A clearer opening does not establish a qualification that a role requires. The employer may need direct technical experience, a portfolio, an academic credential, local work authorisation, or a level of responsibility you have not yet had. A lack of response does not show that the summary was the only problem.",
        "Save the job posting and the resume version you used. Review whether the opening was supported by the first relevant bullets and whether the target direction was realistic for the requirements. Where a genuine gap remains, identify a legitimate way to build evidence through training, supervised work, or a project rather than trying to solve the gap with a stronger adjective."
      ] }
    ],
    conclusion: [
      "An early-career resume summary earns its place when it helps a reader understand the evidence that follows. It does not need to sound senior to be useful.",
      "Use a short, supportable orientation—or leave it out—and make your actual experience easier to see."
    ],
    cta: "ResuNexx can help you review whether the opening of your resume matches the evidence in your experience section.",
    sources: [
      { label: "CareerOneStop: Top portion of resume", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/top-portion-of-resume.aspx" },
      { label: "JobAccess: Creating a good resume", href: "https://jobaccess.gov.au/i-am-a-person-with-disability/creating-a-good-resume" }
    ]
  },
  {
    slug: "career-break-resume-keep-dates-honest",
    title: "A Career Break Does Not Need a Cover Story: Keep the Dates Honest and the Evidence Useful",
    description: "For international job seekers returning after a career break, a practical way to present a truthful timeline without letting the gap erase relevant skills and experience.",
    audience: "International job seekers returning after a career break",
    publishedAt: "2026-09-02T00:00:00.000Z",
    opening: [
      "Returning to a job search after time away can make the employment dates on a resume feel more important than everything else. You may have cared for family, studied, moved countries, taken training, or dealt with a change that does not fit neatly inside a job title. The pressure to explain every month can lead to altered dates or a resume that hides useful experience along with the break.",
      "A more durable approach is simpler: keep the timeline truthful, make your relevant skills and work history easy to find, and include only the additional context that you can support and that helps the reader understand your current direction. A resume is not required to tell every personal detail. It should not ask the reader to rely on dates or claims that you cannot explain either."
    ],
    sections: [
      { heading: "Why this happens", paragraphs: [
        "A career break can interrupt the familiar reverse-chronological story of a resume. Applicants may assume that a gap automatically makes every earlier role less relevant, so they give the gap more attention than the skills, responsibilities, and results they can still document. Others try to remove the awkwardness by extending a previous employment date. That creates a record that may be difficult to keep consistent across applications, references, and later conversations.",
        "CareerOneStop notes that common reasons for employment gaps include education, gaining skills, caregiving, and significant health issues. Its guidance says it is not necessary to explain the reason on a resume, while advising applicants to be truthful about employment dates and to highlight their skills and experience. That distinction is useful: accuracy is necessary, but a detailed personal explanation is not the same thing as useful evidence for a target role."
      ] },
      { heading: "What to check or improve", paragraphs: [
        "Start by checking the dates against records you can verify. Keep job titles, employers, locations, and employment periods accurate. If a form asks for months as well as years, provide them honestly. A concise timeline makes it easier for a reader to understand your history and helps you avoid creating different versions of the same facts.",
        "Next, choose a format that keeps both work history and relevant capabilities visible. CareerOneStop describes a combination format as one way to foreground transferable skills while retaining detailed work history. Use it only if it makes the page clearer: standard headings, a readable sequence of roles, and skills tied to actual experience are more useful than a long list of general strengths.",
        "If you completed relevant study, certification, volunteer work, or a defined project during the break, include it only with its real name, dates, and scope. For example, a course can belong in Education or Training; volunteer work can describe the organisation and tasks. Do not turn preparation into paid employment, imply a credential you have not earned, or use a broad label such as consultant when the work was informal."
      ] },
      { heading: "Concrete example", paragraphs: [
        "Imagine a customer-service coordinator returning after eighteen months away and applying for an operations-support role. Their draft extends the end date of the last job to cover the gap, then lists \"self-employed consultant\" without a client, project, or service to support it. The timeline looks smoother, but it creates a claim the applicant may not be able to explain."
      ], example: {
        before: "Customer Service Coordinator | 2021–2025; Independent Consultant | 2025–2026",
        after: "Customer Service Coordinator | 2021–2025\nCareer break | 2025–2026\nCompleted a spreadsheet-skills course and volunteered two hours weekly to maintain appointment records for a community programme.",
        note: "This is an illustrative format, not a requirement to disclose a personal reason for a break. The applicant should include only training or volunteer work they can document, and should use the dates and labels that reflect their own situation."
      } },
      { heading: "If you still hear nothing", paragraphs: [
        "A transparent resume cannot remove every barrier in a particular application. A role may require recent sector experience, a licence, local work authorisation, a portfolio, language proficiency, or a technical skill that is not yet demonstrated. No response is not proof that the career break alone caused the result, and changing the dates would not solve a genuine requirement.",
        "Keep a private record of the role, resume version, and evidence you wanted to make visible. Review whether the target requirements were present in documented experience, training, or work samples. If a gap remains, choose a legitimate next step that builds evidence rather than making the timeline sound more continuous than it was."
      ] }
    ],
    conclusion: [
      "A career break is part of a real timeline, not a flaw that needs a fictional title. Accurate dates and specific evidence give a reader more to work with than a vague cover story.",
      "Keep what is relevant, describe it honestly, and let your current direction be supported by facts you can explain."
    ],
    cta: "ResuNexx can help you review whether your resume keeps the timeline clear while making your relevant evidence easy to find.",
    sources: [
      { label: "CareerOneStop: Special tips for employment gaps", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/special-tips.aspx" },
      { label: "CareerOneStop: Formatting", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/formatting.aspx" },
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" }
    ]
  },
  {
    slug: "international-graduate-resume-label-unpaid-work-clearly",
    title: "Your Unpaid Work Counts as Experience Only When the Label and Evidence Are Clear",
    description: "For international graduates with volunteer, campus, or family-business experience, a practical way to show useful work without presenting unpaid activity as a paid role.",
    audience: "International graduates applying for their first professional role",
    publishedAt: "2026-09-03T00:00:00.000Z",
    opening: [
      "International graduates often have more relevant experience than their resume suggests: a student society role, a community project, a placement, a family-business task, or volunteer work completed while studying. The uncertainty is usually not whether the work mattered. It is how to name it without making the reader guess whether it was paid employment, a course assignment, or an informal favour.",
      "A clear label does not make the work less valuable. It tells the reader how to understand the setting, then lets the responsibilities and results carry the point. That is especially important when you are applying across borders, where job titles and employment arrangements may not translate neatly. The goal is an accurate record that makes relevant evidence easy to find."
    ],
    sections: [
      { heading: "Why this happens", paragraphs: [
        "Many entry-level resume templates organise everything under Professional Experience. That can make an applicant feel that a volunteer role or university project belongs nowhere, or that it must be renamed to look more formal. In response, people may omit work that developed useful skills or use a paid-job title they cannot support.",
        "JobAccess lists volunteer work as an optional resume section and explains that the contents can depend on career length and the role being sought. CareerOneStop advises applicants with limited experience to emphasise the skills, tasks, and outcomes most relevant to the target job. Together, those points support a practical approach: include relevant unpaid work, but identify its real context rather than asking a title to imply more than it does."
      ] },
      { heading: "What to check or improve", paragraphs: [
        "Start with the original arrangement. Was it a volunteer position, an internship, a course project, a student leadership role, or work for a family business? Use that label in the section heading or beside the organisation name. If an internship was unpaid, say so only where that detail is needed to make the arrangement clear; do not invent an employment relationship just because the work was substantial.",
        "Then write bullets about work you can explain: the people or process you supported, the tools you used, the scope, and an observable result where one exists. CareerOneStop recommends making work descriptions specific and relating tasks to the target job. Specific does not require confidential numbers. You can describe a recurring task, a defined deliverable, or the group served without claiming revenue, authority, or impact you cannot verify.",
        "Finally, make the dates and location consistent with your education and work-authorisation history. A resume does not need to answer every eligibility question, but it should not create a timeline that conflicts with application forms or records. Keep a contact, project link, or course record privately available in case you later need to explain the entry."
      ] },
      { heading: "Concrete example", paragraphs: [
        "Consider a final-year business student applying for an operations-support role. They helped a local non-profit organise event registrations for one semester, but their draft presents the role as a paid operations coordinator position. The title sounds stronger, while the description gives no clue about the setting or what they actually did."
      ], example: {
        before: "Operations Coordinator | Community Events Group | 2025\nManaged operations and improved event performance.",
        after: "Volunteer Registration Assistant | Community Events Group | Sep–Dec 2025\nUpdated attendee records, prepared weekly registration lists, and handed over changes to the event coordinator using the organisation's spreadsheet template.",
        note: "This is an illustrative example. Use the organisation, dates, tools, and responsibilities that reflect your own arrangement, and do not imply supervisory authority or paid employment unless you can support it."
      } },
      { heading: "If you still hear nothing", paragraphs: [
        "A well-labelled volunteer or project entry does not replace a requirement for a licence, local work authorisation, a specific qualification, or sustained paid experience. A lack of response also does not establish that the unpaid-work label was the reason. The job may have attracted applicants with a different combination of evidence or availability.",
        "Save the posting and the resume version you used. Check whether the relevant entry was easy to find and whether each bullet matched the role's stated tasks. If the target field requires more direct evidence, pursue a legitimate placement, supervised project, training, or volunteer responsibility with a defined scope. Building a clearer record is more useful than relabelling work you already did."
      ] }
    ],
    conclusion: [
      "Unpaid work can show real skills when the context is honest and the description is concrete. A clear label gives the reader a reliable way to interpret the evidence.",
      "Name the arrangement accurately, describe the work specifically, and keep the rest of the application consistent with facts you can explain."
    ],
    cta: "ResuNexx can help you check whether volunteer, project, and early-career experience is labelled clearly and connected to the role you are targeting.",
    sources: [
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" },
      { label: "JobAccess: Creating a good resume", href: "https://jobaccess.gov.au/i-am-a-person-with-disability/creating-a-good-resume" }
    ]
  },
  {
    slug: "international-job-seeker-resume-contact-details-travelable",
    title: "Applying Across Borders? Make Your Resume Contact Details Easy to Use Without Overexplaining",
    description: "For international job seekers applying from another country, a practical way to present contact details, location, and work authorisation accurately without turning the resume into an immigration statement.",
    audience: "International job seekers applying from outside the employer's country",
    publishedAt: "2026-09-04T00:00:00.000Z",
    opening: [
      "Applying to roles in another country can make the contact line feel unusually high-stakes. You may wonder whether to use your current city, a planned destination, a local phone number, or a sentence about your visa. Trying to answer every question in the header can create a location or eligibility claim that is not true yet.",
      "A useful contact section is factual and usable. It identifies you, gives a professional email address, and states a location only as it currently is or as a clearly qualified plan. If an application asks about work authorisation, answer directly and accurately there."
    ],
    sections: [
      { heading: "Why this happens", paragraphs: [
        "Many resume examples assume the applicant already lives near the employer. International candidates may copy a local address, use a friend's number, or claim work eligibility before they have checked what it means for that role. These shortcuts can make the document look more familiar, but they can also make later forms, interview scheduling, and records harder to keep consistent.",
        "JobAccess lists name and contact details among the typical elements of a resume and notes that a resume should contain key information about experience and work history. CareerOneStop's resume guidance also focuses on making qualifications relevant to the job goal. Neither principle requires an applicant to create a local identity. A concise, accurate contact line leaves room for the verified experience that supports the application."
      ] },
      { heading: "What to check or improve", paragraphs: [
        "Use the name, email address, and phone number you actually monitor. Include an international calling code when it helps a recruiter dial the number. State your current city and country. If you plan to relocate, use careful language only when that plan is real and you can explain its timing. Do not list an address where you do not live merely to appear local.",
        "Read the posting and application form separately. Some employers ask where you are based, whether you can work in a location, or whether sponsorship is needed. Those are application questions, not claims to hide in a resume heading. Answer them truthfully according to your present status and the instructions. If wording is unclear, consult the employer's official careers information or the relevant government immigration source rather than guessing.",
        "Keep the header short. Your contact details, a portfolio or professional profile link where relevant, and a real location are usually enough. Check that linked pages use the same name and do not reveal private details you do not want to share. Then give the first visible resume section to the skills, work, study, or project evidence that relates to the role."
      ] },
      { heading: "Concrete example", paragraphs: [
        "Imagine a data-analysis graduate in Taipei applying for a junior role in Australia. Their current header uses a friend's Melbourne address and claims Australian work rights even though they are still checking the role's requirements. The contact line may look convenient, but it turns an unresolved question into a statement of fact."
      ], example: {
        before: "Alex Chen | Melbourne, VIC | Australian work rights | alex@example.com",
        after: "Alex Chen | Taipei, Taiwan | +886 9XX XXX XXX | alex@example.com | Portfolio: example.com\nPlanning relocation to Melbourne; work-authorisation details available in the application where requested.",
        note: "This is an illustrative format, not immigration advice. Use only the location, phone number, relocation plan, and work-authorisation statement that are true for you and suitable for the employer's requested process."
      } },
      { heading: "If you still hear nothing", paragraphs: [
        "Accurate contact details cannot remove a role's location, authorisation, timing, language, or experience requirements. No response does not prove that your country or phone number caused the result; employers may have selected candidates whose availability or evidence better matched the process.",
        "Keep a record of the posting, answers submitted, and resume version. Review whether you answered location or authorisation questions exactly as asked and whether the resume made relevant work easy to find. Seek authoritative immigration guidance before making a new eligibility claim."
      ] }
    ],
    conclusion: [
      "A cross-border application is clearer when the contact line is true, concise, and easy to use. It does not need to imitate a local applicant's circumstances.",
      "Keep facts current, answer eligibility questions in the right place, and let the rest of the resume show the evidence for the work."
    ],
    cta: "ResuNexx can help you review whether your resume header is clear and whether the evidence below it supports the role you are pursuing.",
    sources: [
      { label: "JobAccess: Creating a good resume", href: "https://jobaccess.gov.au/i-am-a-person-with-disability/creating-a-good-resume" },
      { label: "CareerOneStop: Work experience", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/work-experience.aspx" }
    ]
  },
  {
    slug: "international-graduate-resume-project-record",
    title: "Your Best Graduate Project Is Buried: Give It a Clear Record Before You Add Another Skills List",
    description: "For international recent graduates pursuing entry-level analyst or coordinator roles, a practical way to describe one relevant project without turning coursework into a job title.",
    audience: "International recent graduates pursuing entry-level analyst or coordinator roles",
    publishedAt: "2026-09-05T00:00:00.000Z",
    opening: [
      "When you have limited paid experience, one substantial course, capstone, or community project can carry more useful evidence than a long list of tools. Yet many graduate resumes hide that work in a single Education line, while the top half of the page repeats broad words such as analytical, organised, and collaborative.",
      "The answer is not to present coursework as a full-time job. It is to give the project a clear, accurate record: what the setting was, what you contributed, the deliverable you produced, and the evidence you can explain. That makes the work easier to interpret without asking a reader to guess how much responsibility you had."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "International graduates may have completed projects in a different academic system, with team roles and assessment methods that do not map neatly to a job title. If the resume template only offers Professional Experience and Education, it can seem safer to leave the project vague—or to borrow an employer-style title that overstates the arrangement.",
          "CareerOneStop's U.S.-based guidance for recent college graduates says that relevant skills and accomplishments gained through classes or project work can be highlighted near the top of a resume. Its portfolio guidance also recommends describing a work sample, who it was for, how you contributed, and any results. Those are useful prompts for explaining a project, not a reason to claim paid employment or a client relationship that did not exist."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "Choose one project that actually relates to the role. For an entry-level analyst position, that might be cleaning a defined dataset, documenting findings, or presenting a recommendation. For a coordinator position, it might be planning a timetable, maintaining a shared tracker, or handing over a deliverable. The project does not need to prove that you have already held the target job; it needs to show a relevant piece of work clearly.",
          "Create a Projects section or place the entry under Education, depending on which makes the page easier to scan. Name the project, organisation or course where applicable, location or remote setting if useful, and the dates. Then write two or three bullets with a concrete action, the material or people involved, and a deliverable or bounded outcome you can support.",
          "Keep the language proportionate. Write ‘analysed survey responses for a class project’ rather than ‘led market intelligence’ if the work was assessed coursework. If the project was a team effort, state your own contribution instead of claiming the entire group result. Do not disclose confidential material, invent a number, or link to work you are not allowed to share."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Imagine an international business graduate applying for a junior operations-coordinator role. Their resume lists Excel, research, and teamwork in a skills block. A capstone project involved a real local charity, but it appears only as the course name, so the reader cannot tell what the graduate did."
        ],
        example: {
          before: "Skills: Excel, research, teamwork\nBachelor of Business, 2026 — Capstone completed.",
          after: "Projects\nCommunity-service scheduling capstone | 2026\n• Compared appointment records supplied for the course, maintained the team's action tracker, and prepared a handover summary for the charity contact.\n• Presented the team's proposed scheduling changes, identifying the assumptions and data limits used in the analysis.",
          note: "This is an illustrative example, not a customer result. Use only the course, organisation, data access, contribution, and deliverable that you can describe accurately; a group recommendation is not the same as a change the organisation adopted."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "A clearer project entry cannot establish a required credential, local work authorisation, portfolio standard, language level, or amount of direct employment that a role specifies. A lack of response also does not show that the project section was the deciding factor. The role may have attracted applicants with a different combination of evidence or availability.",
          "Keep the job description and the resume version you used. Review whether the project was genuinely relevant, whether the bullets named your own contribution, and whether a reader could locate it quickly. If you need more direct evidence, seek a legitimate placement, supervised project, volunteer responsibility, or work sample with a defined scope. Building the next record is more useful than enlarging the previous one."
        ]
      }
    ],
    conclusion: [
      "A graduate project becomes more useful when its setting, contribution, and deliverable are visible. It does not need a borrowed job title to earn a place on the page.",
      "Choose the most relevant project, record it honestly, and let specific work carry more weight than a longer skills list."
    ],
    cta: "ResuNexx can help you review whether a project entry is clear, proportionate, and connected to the role you are targeting.",
    sources: [
      { label: "CareerOneStop: Special tips for recent college graduates", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/ResumeGuide/special-tips.aspx" },
      { label: "CareerOneStop: Portfolios", href: "https://cloudfront.careeronestop.org/JobSearch/Resumes/portfolios.aspx" }
    ]
  },
  {
    slug: "international-student-resume-keep-master-record",
    title: "Applying in Europe? Keep a Master Record Before You Tailor Your Student Resume",
    description: "For international students applying for early-career roles in Europe, a practical way to tailor a resume without losing projects, languages, volunteering, or the facts behind each application.",
    audience: "International students applying for early-career roles in Europe",
    publishedAt: "2026-09-06T00:00:00.000Z",
    opening: [
      "When you are applying across borders, tailoring a resume can feel like starting over each time. One vacancy asks for a language, another highlights a course project, and a third makes a volunteer role look relevant. After several versions, it is easy to lose a useful detail, change a date by accident, or make one application sound different from the next.",
      "The answer is not to send the same full history everywhere. It is to keep a private master record, then choose the accurate facts that best match each vacancy. That gives you a stable place for your education, projects, languages, work, and volunteering while allowing the resume itself to stay focused and readable."
    ],
    sections: [
      { heading: "Why this happens", paragraphs: [
        "International students often have evidence spread across more than one system: a degree from one country, a placement or campus role in another, language learning, and projects completed with different naming conventions. A one-page resume cannot show every detail, so each new version becomes a trade-off between being concise and leaving out something useful.",
        "The European Commission's Europass guidance describes a profile as a place to record skills, qualifications, work and learning experience, projects, volunteering, and achievements. Its CV guidance then recommends highlighting examples that match the vacancy and focusing on relevant facts rather than a full detailed history. You do not need to use Europass to apply this method; the useful principle is to keep the complete record separate from the tailored document."
      ] },
      { heading: "What to check or improve", paragraphs: [
        "Create one private record with the facts you may need later: the official name of each course or qualification, dates, locations, languages, project names, organisations, responsibilities, tools, links you are allowed to share, and any document that supports the entry. Keep the original wording where it matters, especially for degree names, certificates, and employers. Do not copy confidential coursework, client information, or personal documents into a public portfolio.",
        "For each vacancy, read the stated tasks and requirements first. Select two or three items from the record that you can genuinely connect to that role. Put the most relevant evidence where a reader can find it quickly, and use plain language to explain unfamiliar course titles or local terms. Tailoring means choosing and clarifying facts; it does not mean renaming a project as a job or adding a skill you only plan to learn.",
        "Before submitting, compare the resume with the application form. Names, dates, language levels, locations, and work-authorisation answers should remain accurate across both. If a vacancy asks for something your record does not show, leave the gap visible and decide whether you can build evidence through legitimate study, a supervised project, or a placement."
      ] },
      { heading: "Concrete example", paragraphs: [
        "Imagine an international student in the Netherlands applying for a junior programme-coordinator role. Their master record includes a university event project, a volunteer mentoring activity, and two languages. Their first resume lists all three as disconnected achievements, while the vacancy asks for event support, clear communication, and accurate records."
      ], example: {
        before: "Skills: English, Dutch, communication, organisation, teamwork\nActivities: University project, volunteering, student society.",
        after: "Selected experience\nUniversity event project | 2026\nMaintained the team's attendee tracker, prepared a bilingual event update, and handed over confirmed changes to the student-services contact.\nVolunteer mentor | 2025–2026\nScheduled monthly check-ins and recorded agreed follow-up actions for first-year students.",
        note: "This is an illustrative example, not a customer result. Use only the languages, dates, project setting, responsibilities, and records that are true for you. The student should not imply that a course project was paid employment or that a volunteer activity created a professional qualification."
      } },
      { heading: "If you still hear nothing", paragraphs: [
        "A well-kept record and a clearer resume cannot remove every requirement. A role may require local work authorisation, a specific language level, a credential, direct experience, or availability that your current record does not establish. No response does not prove that one missing bullet or a different resume format was the cause.",
        "Save the vacancy, the version you used, and the evidence you selected. Review whether the chosen examples matched the role and whether they were easy to locate. If an important requirement is genuinely absent, use the master record to identify a realistic next step—such as a relevant course, supervised project, or placement—rather than repeatedly expanding the same claims."
      ] }
    ],
    conclusion: [
      "A tailored student resume is easier to keep accurate when it comes from a complete private record. Preserve the facts first, then select the examples that make sense for one specific vacancy.",
      "That approach keeps your applications focused without making your education, international experience, or earlier work disappear."
    ],
    cta: "ResuNexx can help you review whether the evidence selected for one role is clear, proportionate, and consistent with the rest of your resume.",
    sources: [
      { label: "Europass: Create your Europass CV", href: "https://europass.europa.eu/en/create-europass-cv" },
      { label: "Europass: The Europass profile", href: "https://europass.europa.eu/en/europass-tools/europass-profile" }
    ]
  },
  {
    slug: "international-job-seeker-resume-select-evidence-for-europe",
    title: "Applying in Europe? Select Resume Evidence for the Vacancy Instead of Sending Your Full History",
    description: "For international job seekers pursuing roles in Europe, a practical way to tailor a CV with accurate, relevant evidence without creating a different personal history for every application.",
    audience: "International job seekers applying for roles in Europe",
    publishedAt: "2026-09-07T00:00:00.000Z",
    opening: [
      "When you apply in a new country, a long career history can feel like both an advantage and a problem. You may have qualifications, projects, language learning, volunteer work, and jobs that matter—but not all of them help a reader understand one vacancy. The pressure to look perfectly matched can lead to a CV that lists everything, changes titles, or quietly leaves out dates that are harder to explain.",
      "A better approach is to keep the full record privately and select the facts that are genuinely relevant to the vacancy. Tailoring is an act of organisation, not reinvention. It makes the job-related evidence easier to find while keeping your employment, education, and application answers consistent."
    ],
    sections: [
      {
        heading: "Why this happens",
        paragraphs: [
          "International applicants often need to translate more than language. A degree title, local employer, or project name may be unfamiliar to an employer in another country. It can be tempting to compensate with a crowded skills section or a polished label that sounds closer to the target job. Both choices can make the document less clear if the evidence underneath does not support the label.",
          "The European Commission's Europass guidance recommends focusing a CV on facts and main points that match the job in mind, rather than including a complete detailed history. Its profile guidance describes a separate place to record qualifications, work, learning, projects, volunteering, and achievements. These are compatible tasks: preserve the complete facts first, then choose the items that help a reader assess one advertised role."
        ]
      },
      {
        heading: "What to check or improve",
        paragraphs: [
          "Read the vacancy before editing the CV. Identify a small number of stated tasks, tools, languages, or qualifications. Then look for real examples in your master record: a role, placement, course project, volunteer responsibility, or training item. Choose evidence that you can explain in its original setting instead of copying every keyword from the posting.",
          "Keep the original job title and employer where possible. If a local title would be hard for an international reader to understand, add a plain-language explanation in the bullet points rather than replacing the title with a seniority or function you did not hold. State the activity, the setting, and a defined output, scope, or responsibility that you can support. Do not turn coursework into paid employment or a team result into a claim about your individual authority.",
          "Finally, compare the CV with the application form. Dates, qualification names, language levels, location, and work-authorisation answers should remain true in both places. If an employer requests a specific format or supporting document, follow that instruction. A tailored CV can clarify relevant evidence, but it cannot truthfully fill a requirement you do not yet meet."
        ]
      },
      {
        heading: "Concrete example",
        paragraphs: [
          "Imagine an applicant with a logistics degree and customer-service experience applying for a junior supply-chain support role in Belgium. Their draft puts every previous task into one dense paragraph and changes a retail job title to Supply Chain Coordinator. The reader cannot tell what work was actually done, and the altered title creates a problem if the application is checked later."
        ],
        example: {
          before: "Supply Chain Coordinator | Retail Company | 2024–2026\nManaged logistics, suppliers, stock, customer issues, reporting, and operations.",
          after: "Customer Service Associate | Retail Company | 2024–2026\n• Recorded recurring delivery questions and shared weekly patterns with the store manager.\n• Updated the stock-issue tracker and coordinated accurate customer follow-up using the team's existing process.",
          note: "This is an illustrative example, not a claim that customer-service experience automatically meets a supply-chain requirement. Use only titles, tasks, dates, tools, and outcomes that reflect your own work."
        }
      },
      {
        heading: "If you still hear nothing",
        paragraphs: [
          "A more focused CV cannot remove a requirement for local work authorisation, a language level, a licence, a qualification, or direct sector experience. No response does not prove that one omitted line, your country of residence, or the CV format was the deciding factor. It may simply mean that the role required evidence you have not yet had an opportunity to build.",
          "Save the posting and the version you submitted. Check whether the selected examples were genuinely connected to the stated work and whether the same facts appear accurately in your application. If an important requirement is missing, identify a legitimate way to build it through study, a supervised project, a placement, or relevant work—not by making the existing experience sound like something else."
        ]
      }
    ],
    conclusion: [
      "A tailored CV is not a different life story for every vacancy. It is a clear selection of facts that make your relevant experience easier to understand.",
      "Keep the complete record private, select evidence carefully, and let each application remain consistent with work you can explain."
    ],
    cta: "ResuNexx can help you review whether the evidence selected for one European job application is clear, relevant, and proportionate.",
    sources: [
      { label: "Europass: Create your Europass CV", href: "https://europass.europa.eu/en/create-europass-cv" },
      { label: "Europass: What information should I include in my Europass profile?", href: "https://europass.europa.eu/en/what-type-information-should-i-include-my-europass-profile" }
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
