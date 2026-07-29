export type ResourceSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  example?: { label: string; text: string };
};

export type ResourceArticle = {
  slug: string;
  title: string;
  description: string;
  directAnswer: string;
  sections: ResourceSection[];
  checklist: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export const resourceArticles: ResourceArticle[] = [
  {
    slug: "recruiter-friendly-resume",
    title: "How to Make Your Resume Easier for Recruiters to Read",
    description: "A practical guide to resume clarity, recruiter signals, and the first few seconds of a resume review.",
    directAnswer: "A recruiter-friendly resume makes the role, strongest evidence, and next step obvious without requiring a close read. Clear hierarchy, focused bullets, and visible outcomes help recruiters understand your professional narrative quickly.",
    sections: [
      { heading: "Start with a clear professional direction", paragraphs: ["A recruiter should be able to tell what kind of role you want from the top third of the page. Use a concise summary that names your target direction, strongest skills, and the type of value you can contribute.", "Avoid opening with a broad list of traits. A specific professional narrative gives the rest of the resume a useful frame."] },
      { heading: "Make the first scan effortless", paragraphs: ["Recruiters often scan before they read. Keep section headings standard, use consistent dates, and give each role a clear title and employer. The visual order should feel predictable from top to bottom."], bullets: ["Use readable section headings such as Experience, Skills, and Education.", "Keep the most relevant experience easiest to find.", "Use short bullets with one main idea each."] },
      { heading: "Turn responsibilities into recruiter signals", paragraphs: ["A responsibility tells a recruiter what you were asked to do. A result tells them what changed because you did it. Strong bullets show action, scope, and evidence of impact."], example: { label: "Example", text: "Instead of 'Responsible for weekly reporting,' try 'Built a weekly reporting process used by 4 teams, reducing manual updates by 6 hours per week.'" } },
      { heading: "Use whitespace with intention", paragraphs: ["Whitespace is useful when it separates ideas and creates hierarchy. It becomes a problem when it pushes important evidence below the first page or makes the resume feel unfinished. Aim for a calm, balanced page that is easy to scan."] },
      { heading: "Check the recruiter path", paragraphs: ["Read the resume as someone who knows nothing about you. Can they identify the target role, strongest proof, and most relevant skills in one pass? If not, fix the order and clarity before polishing minor details."] }
    ],
    checklist: ["The target role is clear near the top.", "Each experience section has concise, outcome-focused bullets.", "Dates, titles, and headings follow one consistent pattern.", "The strongest evidence appears before low-value detail."],
    faqs: [{ question: "What is the most important part of a recruiter-friendly resume?", answer: "The top third should quickly communicate your target direction and strongest relevant evidence. Clear structure then makes the rest easier to trust." }, { question: "Should a resume be one page?", answer: "For many early-career applicants, one focused page is useful, but relevance and readability matter more than an arbitrary page count." }]
  },
  {
    slug: "ats-resume-score",
    title: "What Is an ATS Resume Score and What Does It Actually Mean?",
    description: "Understand ATS alignment, resume scoring, and the limits of automated resume evaluations.",
    directAnswer: "An ATS resume score is an estimate of how clearly a resume presents searchable role signals such as job titles, skills, dates, and relevant keywords. It is a diagnostic, not a guarantee that a specific employer system will accept or reject your resume.",
    sections: [
      { heading: "What an ATS does", paragraphs: ["Applicant tracking systems help employers organize applications and search for relevant information. They may parse a resume into fields, index text, and support recruiter searches. Different employers configure their systems differently."] },
      { heading: "What an ATS score can measure", paragraphs: ["A useful evaluation looks at readable structure, standard headings, visible role language, dates, and keyword alignment. It should also consider whether important evidence is buried in unclear formatting."], bullets: ["Can the system identify your contact details and job titles?", "Are skills and role-specific terms visible in natural language?", "Are sections and dates easy to interpret?", "Does the document avoid layout choices that confuse text extraction?"] },
      { heading: "Why a high score is not enough", paragraphs: ["ATS alignment helps information get found, but recruiters still decide whether the story is credible and relevant. A resume packed with keywords can be harder to read and less persuasive."] },
      { heading: "Improve alignment without gaming the system", paragraphs: ["Use the language of the target role where it truthfully describes your experience. Put important skills in context, connect them to outcomes, and remove terms you cannot support."] },
      { heading: "Read the score as a priority signal", paragraphs: ["The most useful question is not 'What number did I get?' It is 'What should I fix first?' Look for the small number of structural and keyword changes that make your strongest evidence easier to find."] }
    ],
    checklist: ["Standard headings and readable dates are present.", "Relevant skills appear in context, not only in a keyword list.", "The resume can be read as plain text without losing meaning.", "The score is treated as guidance, not a hiring prediction."],
    faqs: [{ question: "Does an ATS resume score guarantee an ATS pass?", answer: "No. A score is an estimate based on selected signals, while real systems and employer settings vary." }, { question: "Can ATS alignment help an early-career applicant?", answer: "Yes. Clear titles, skills, dates, and role language can help a recruiter or system find the evidence that is already present." }]
  },
  {
    slug: "resume-bullet-points-measurable-impact",
    title: "How to Write Resume Bullet Points With Measurable Impact",
    description: "Learn how to turn task-based resume bullets into specific evidence of contribution and measurable achievement.",
    directAnswer: "A strong resume bullet connects an action to an outcome, with numbers or scope when they are truthful and available. The goal is not to add numbers everywhere; it is to make contribution easier for recruiters to understand.",
    sections: [
      { heading: "Use the action, context, outcome pattern", paragraphs: ["Start with a clear action verb, add enough context to understand the work, and finish with the outcome. This structure keeps a bullet focused on contribution rather than activity."], example: { label: "Formula", text: "Action + what you changed + scope or method + measurable result." } },
      { heading: "Choose useful measurements", paragraphs: ["Good measurements show scale, speed, quality, revenue, cost, volume, reach, or time saved. If a precise number is confidential or unavailable, use honest scope such as team size, project count, or audience size."], bullets: ["Scale: supported 3 teams or managed a $50K budget.", "Volume: processed 120 customer requests per week.", "Efficiency: reduced turnaround time by 20%.", "Quality: improved completion or error rates by a measured amount."] },
      { heading: "Replace vague responsibility language", paragraphs: ["Phrases such as 'responsible for' and 'helped with' hide the subject of the sentence. Name what you did and what changed. Do not inflate a result that you cannot explain in an interview."], example: { label: "Before / after", text: "Before: Responsible for social media. After: Planned and published 4 weekly campaigns that increased qualified site visits by 22%." } },
      { heading: "Prioritize the bullets recruiters need first", paragraphs: ["The first one or two bullets under a role should communicate the most relevant impact. Move routine tasks lower or remove them if they do not help explain your fit for the target role."] },
      { heading: "Keep each bullet easy to scan", paragraphs: ["One bullet should carry one main idea. Shorter sentences with concrete verbs are easier to read than a long list of clauses. Use parallel structure across a role so the section feels deliberate."] }
    ],
    checklist: ["Each priority bullet begins with a specific action.", "Outcomes use truthful numbers, scope, or evidence.", "Routine responsibilities do not crowd out achievements.", "The most relevant impact appears first under each role."],
    faqs: [{ question: "What if I do not have impressive metrics?", answer: "Use honest scope, volume, time saved, process improvements, or quality indicators. A specific contribution is better than an invented number." }, { question: "Should every bullet contain a number?", answer: "No. Numbers are useful when they clarify impact, but a concise outcome can still be strong without one." }]
  },
  {
    slug: "resume-summary-vs-objective",
    title: "Resume Summary vs. Resume Objective: What Should You Use?",
    description: "A clear comparison of resume summaries and objectives, with guidance for students and early-career applicants.",
    directAnswer: "Most applicants benefit from a concise resume summary that connects their current strengths to a target role. A short objective can still work for a first job or a clear career change when it explains the direction and value you bring.",
    sections: [
      { heading: "What a resume summary does", paragraphs: ["A summary gives a recruiter a compact view of your experience, strongest capabilities, and professional direction. It should sound like evidence-based positioning, not a list of adjectives."] },
      { heading: "What a resume objective does", paragraphs: ["An objective states the role or direction you are pursuing. It is most useful when the context needs explanation, such as a first professional role, a new field, or a major career transition."] },
      { heading: "A practical choice for early-career candidates", paragraphs: ["Students and recent graduates can use a summary if they have internships, projects, coursework, or part-time experience that support the target role. Use an objective only when the direction itself is the main information a recruiter needs."] },
      { heading: "What makes either one useful", paragraphs: ["Keep the opening specific. Name the target area, the strongest relevant evidence, and the kind of contribution you can make. Avoid statements that could describe any applicant."], example: { label: "Example", text: "Recent information systems graduate with internship experience improving customer workflows and analyzing operational data; seeking an entry-level operations analyst role." } },
      { heading: "Keep the opening connected to the rest", paragraphs: ["The summary or objective should preview the evidence below it. If the opening says you are focused on analytics, the skills and experience sections should make that claim easy to verify."] }
    ],
    checklist: ["The opening names a clear role direction.", "The language is supported by experience, projects, or coursework.", "The summary avoids generic adjectives and empty career goals.", "The rest of the resume proves the opening claim."],
    faqs: [{ question: "Is a resume objective outdated?", answer: "It is less useful when it only describes what the applicant wants. It can still help when it clearly explains a first-job direction or career change." }, { question: "How long should a resume summary be?", answer: "Usually two or three focused sentences are enough to establish direction, strengths, and relevant evidence." }]
  },
  {
    slug: "why-resume-gets-ignored",
    title: "Why Your Resume Gets Ignored Even When You Are Qualified",
    description: "Understand why qualified candidates can be overlooked when their resume signals are unclear, buried, or too generic.",
    directAnswer: "A qualified candidate can be overlooked when a recruiter cannot quickly connect the resume to the role. The problem is often unclear positioning, buried achievements, weak role alignment, or a format that makes evidence difficult to find - not a lack of potential.",
    sections: [
      { heading: "The resume may not show the target clearly", paragraphs: ["If the desired role is ambiguous, a recruiter has to guess where you fit. Make the target direction visible and let the first section support it."] },
      { heading: "The strongest evidence may be buried", paragraphs: ["Many resumes lead with duties, tools, or older detail before showing outcomes. Move the proof that matters most for the target role higher in each section."] },
      { heading: "The language may be too generic", paragraphs: ["Generic phrases such as 'hard worker' or 'team player' are difficult to evaluate. Replace them with actions, context, and evidence that show how you work."] },
      { heading: "The resume may not match the role", paragraphs: ["A strong general resume can still feel wrong for a specific job. Compare the job description with your summary, skills, titles, and achievement language. Add truthful role alignment where it belongs."] },
      { heading: "Fix the highest-impact signal first", paragraphs: ["Do not rewrite everything at once. Start with the change that most improves recruiter understanding: usually the opening, the first experience bullets, or the clearest missing role signal."] }
    ],
    checklist: ["A stranger can name the target role after a quick scan.", "The first bullets show outcomes, not only tasks.", "Generic claims are backed by concrete evidence.", "The resume uses role language honestly and consistently."],
    faqs: [{ question: "Does being ignored mean I am not qualified?", answer: "Not necessarily. A resume can fail to communicate relevant evidence quickly even when the underlying experience is promising." }, { question: "What should I fix first?", answer: "Fix the signal that most affects the first scan: target direction, strongest proof, or role alignment. A focused change is easier to evaluate than a complete rewrite." }]
  },
  {
    slug: "resume-keywords-without-stuffing",
    title: "Resume Keywords: How to Match a Job Description Without Keyword Stuffing",
    description: "Use job-description language naturally while keeping your resume credible, readable, and grounded in real experience.",
    directAnswer: "Match keywords by identifying the skills and responsibilities that genuinely describe your experience, then use them in context. Natural evidence is more credible than repeating a term in a list without showing how you used it.",
    sections: [
      { heading: "Separate essential terms from noise", paragraphs: ["Look for repeated skills, tools, responsibilities, and outcomes in the job description. Prioritize terms that define the role rather than copying every phrase."] },
      { heading: "Place keywords where they carry meaning", paragraphs: ["A target skill can appear in your summary, skills section, and relevant experience bullet when each placement is accurate. The experience bullet is usually the strongest because it shows context."] },
      { heading: "Use natural variations", paragraphs: ["Recruiters may use related terms for the same capability. Use the wording that is accurate for you and add a familiar variation when it improves clarity. Do not force awkward repetition."] },
      { heading: "Connect a keyword to evidence", paragraphs: ["A keyword becomes a recruiter signal when it is attached to an action or result."], example: { label: "Example", text: "Instead of listing 'SQL' three times, show how you used SQL to clean customer data, build a report, or answer a business question." } },
      { heading: "Remove unsupported keywords", paragraphs: ["Do not add a skill because it appears in the job description if you cannot discuss your experience with it. Credibility and interview readiness matter more than a longer keyword list."] }
    ],
    checklist: ["The most important role terms appear naturally.", "Skills are connected to experience or projects.", "No term is repeated simply to influence a score.", "Every listed skill is truthful and explainable."],
    faqs: [{ question: "How many keywords should a resume include?", answer: "There is no universal number. Include the relevant terms your experience supports, then prioritize readable evidence over repetition." }, { question: "Can keyword stuffing hurt a resume?", answer: "Yes. Repetition can make the document harder to read and may weaken trust if the experience does not support the claims." }]
  },
  {
    slug: "resume-checklist-before-applying",
    title: "Resume Checklist Before Applying for a Job",
    description: "Use this practical pre-application checklist to review resume clarity, ATS alignment, achievements, and role fit.",
    directAnswer: "Before applying, check that your target role is clear, your strongest achievements are easy to find, your keywords are truthful and relevant, and your document is readable from both an ATS and recruiter perspective.",
    sections: [
      { heading: "Positioning check", paragraphs: ["Confirm that the title, summary, and first experience bullets support the role you are applying for. A recruiter should not need to infer your direction."] },
      { heading: "Evidence check", paragraphs: ["Review the first two bullets under each relevant role. Replace vague duties with specific actions, scope, and outcomes wherever the evidence is available."] },
      { heading: "ATS and structure check", paragraphs: ["Use standard headings, readable dates, consistent formatting, and text that can be selected and copied. Remove layout elements that interrupt the reading order."] },
      { heading: "Keyword and role alignment check", paragraphs: ["Compare the job description with your skills and experience. Use important terms naturally and only when they accurately describe your background."] },
      { heading: "Final trust check", paragraphs: ["Check spelling, contact details, file name, links, and consistency. Then ask whether the document feels focused, credible, and easy to scan."] }
    ],
    checklist: ["Target role and professional direction are clear.", "Top achievements appear before routine duties.", "ATS-readable headings and dates are consistent.", "Relevant keywords are natural and supported.", "File name, contact details, and spelling are correct.", "The final PDF opens cleanly and is easy to read."],
    faqs: [{ question: "When should I run a resume check?", answer: "Run one before sending an application and again when the target role changes enough to require a different emphasis." }, { question: "What is the fastest high-value check?", answer: "Read only the top third and first bullets. If the target and strongest proof are not clear there, fix those signals first." }]
  }
];

export function getResourceArticle(slug: string) {
  return resourceArticles.find((article) => article.slug === slug);
}
