export const resumeResourceCategories = [
  "Resume Guides",
  "ATS Guides",
  "Resume Examples",
  "Career Advice"
] as const;

export type ResumeResourceCategory = (typeof resumeResourceCategories)[number];

export type ResumeResourceArticle = {
  slug: string;
  category: ResumeResourceCategory;
  title: string;
  description: string;
  quickAnswer: string;
  whyItMatters: string[];
  steps: Array<{ title: string; body: string; bullets?: string[] }>;
  realExample: { before: string; after: string; explanation: string };
  commonMistakes: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
};

export const resumeResourceArticles: ResumeResourceArticle[] = [
  {
    slug: "write-resume-that-gets-interviews",
    category: "Resume Guides",
    title: "How to Write a Resume That Gets Interviews",
    description: "A practical guide to clearer recruiter signals, ATS alignment, measurable achievements, and a resume that is easier to act on.",
    quickAnswer: "A strong resume makes your target role, relevant skills, and measurable results easy to find in a fast scan. Start with a focused summary, put relevant experience first, turn duties into outcomes, and mirror important language from the job description naturally. A resume cannot guarantee an interview, but clear evidence and strong role alignment can help recruiters understand your fit sooner.",
    whyItMatters: ["Recruiters often make an early keep-or-pass decision from a quick scan.", "ATS screening and human review both depend on clear sections, readable wording, and relevant terms.", "Specific outcomes give your experience more credibility than a list of responsibilities."],
    steps: [
      { title: "Choose the target role", body: "Use one target role or a tight role family so your summary, keywords, and evidence point in the same direction." },
      { title: "Lead with relevant proof", body: "Place the strongest relevant experience and achievements where a recruiter will see them first.", bullets: ["Use standard headings such as Summary, Experience, Skills, and Education.", "Keep bullets concise and start with an action verb."] },
      { title: "Show outcomes", body: "Add scope, time, volume, revenue, quality, or efficiency measures when they are accurate and defensible." },
      { title: "Run a final signal check", body: "Read the resume once as a recruiter and once as an ATS: can both find the role, skills, dates, and results quickly?" }
    ],
    realExample: { before: "Responsible for social media and content.", after: "Planned a weekly content calendar that increased qualified social leads by 28% in one quarter.", explanation: "The improved bullet names the action, channel, time frame, and measurable result, so the recruiter can see impact rather than only activity." },
    commonMistakes: ["Using one generic resume for every role.", "Opening with a vague objective instead of relevant value.", "Listing tasks without outcomes, scope, or evidence."],
    faqs: [
      { question: "How long should a resume be?", answer: "Use one page when your experience is early or tightly focused. A second page can be reasonable when additional relevant evidence improves the story." },
      { question: "Can a resume guarantee interviews?", answer: "No. A clearer resume can improve understanding and role alignment, but hiring outcomes depend on the role, market, employer, and many other factors." }
    ],
    relatedSlugs: ["resume-summary-examples", "resume-bullet-points-measurable-impact", "resume-checklist-before-applying"]
  },
  {
    slug: "resume-summary-examples",
    category: "Resume Guides",
    title: "Resume Summary Examples",
    description: "How to write a concise professional summary that gives recruiters a clear role, capability, and evidence signal.",
    quickAnswer: "A resume summary is a short, role-specific introduction that connects your experience, strongest skills, and relevant evidence. It works best when it names the target direction and the value you bring, rather than repeating soft skills. For an early-career applicant, a summary can combine a field of study, practical experience, tools, and a concrete result.",
    whyItMatters: ["The summary frames how recruiters interpret the rest of the resume.", "A focused opening reduces ambiguity about the role you want.", "Specific evidence makes a summary more credible than adjectives alone."],
    steps: [
      { title: "Name the direction", body: "State the role or function you are targeting in plain language." },
      { title: "Add two or three proof signals", body: "Use relevant tools, domains, projects, or outcomes that support the direction.", bullets: ["Keep it to two or three sentences.", "Prefer evidence such as scale, results, or shipped work over personality claims."] },
      { title: "Remove generic openings", body: "Cut phrases such as highly motivated professional unless the rest of the sentence proves something specific." }
    ],
    realExample: { before: "Motivated recent graduate seeking a challenging opportunity to grow.", after: "Business analytics graduate with internship experience building SQL dashboards and reducing weekly reporting time by 30%.", explanation: "The second version identifies the candidate, relevant work, tools, and an outcome in one scan." },
    commonMistakes: ["Writing an objective that focuses only on what you want.", "Making the summary too long to scan.", "Using claims that do not appear elsewhere in the resume."],
    faqs: [
      { question: "Do students need a resume summary?", answer: "A short summary can help when it connects coursework, projects, internships, or part-time work to a target role. It is optional when the top of the resume is already very clear." },
      { question: "Should a summary include keywords?", answer: "Yes, include relevant role language naturally when it accurately describes your experience." }
    ],
    relatedSlugs: ["resume-summary-vs-objective", "first-job-resume", "resume-with-no-experience"]
  },
  {
    slug: "resume-format-guide",
    category: "Resume Guides",
    title: "Resume Format Guide",
    description: "Choose a resume format that keeps your work history, skills, and role alignment clear to recruiters and ATS systems.",
    quickAnswer: "For most job applications, a reverse-chronological resume is the clearest format: it starts with a focused summary, then shows experience from most recent to oldest, followed by skills and education. Use readable headings, consistent dates, simple bullets, and a single-column layout when ATS readability matters. Choose a functional format only when there is a strong reason to explain a non-linear history.",
    whyItMatters: ["Format controls how quickly a recruiter can locate your evidence.", "Simple structure lowers the chance that an ATS misreads dates or sections.", "Consistency makes a resume feel more credible and deliberate."],
    steps: [
      { title: "Default to reverse chronology", body: "Put the most recent and relevant role first, with clear employer, title, location, and dates." },
      { title: "Use standard sections", body: "Keep the document easy to navigate with familiar section names.", bullets: ["Summary or Profile", "Experience", "Skills", "Education", "Optional Projects or Certifications"] },
      { title: "Keep formatting stable", body: "Use one date style, one bullet style, and a restrained number of text treatments." }
    ],
    realExample: { before: "A two-column template with skill bars, icons, and dates in a narrow side panel.", after: "A single-column layout with standard headings, aligned dates, and concise bullets.", explanation: "The second format gives both screening systems and recruiters a more predictable reading path." },
    commonMistakes: ["Using tables or text boxes for core resume content.", "Changing date formats from section to section.", "Choosing design elements that compete with evidence."],
    faqs: [
      { question: "Is a creative resume format better?", answer: "Only when the role and industry value that presentation and the document remains readable. Evidence and clarity should stay primary." },
      { question: "Should the resume be a PDF?", answer: "Use the format requested by the employer. A text-based PDF is often useful when PDF is accepted, but always check that its text can be selected and read." }
    ],
    relatedSlugs: ["what-is-ats", "ats-resume-checklist", "common-resume-mistakes"]
  },
  {
    slug: "common-resume-mistakes",
    category: "Resume Guides",
    title: "Common Resume Mistakes",
    description: "The resume errors that make recruiter signals harder to find, from vague bullets to inconsistent formatting.",
    quickAnswer: "Common resume mistakes are usually clarity problems: a vague target, dense paragraphs, duties without outcomes, missing role keywords, inconsistent dates, and formatting that makes text difficult to parse. Fix the highest-impact signal first. A recruiter should be able to identify the role, relevant experience, skills, and strongest evidence without decoding the document.",
    whyItMatters: ["Small ambiguities compound during a fast review.", "A polished layout cannot compensate for missing or unclear evidence.", "The best fixes are usually focused, not a complete rewrite."],
    steps: [
      { title: "Check the first third", body: "Confirm the target role and strongest evidence appear before the reader loses context." },
      { title: "Audit every bullet", body: "Replace task-only wording with actions and outcomes where the evidence exists." },
      { title: "Run a consistency pass", body: "Check dates, punctuation, capitalization, tense, spacing, and section order." },
      { title: "Remove distractions", body: "Delete irrelevant detail, unnecessary personal information, and design elements that reduce readability." }
    ],
    realExample: { before: "Helped with customer projects and various team tasks.", after: "Coordinated onboarding tasks for 18 customers, reducing average setup time by 2 days.", explanation: "The improved bullet replaces vague language with a clear action, scope, and outcome." },
    commonMistakes: ["Starting with a generic objective.", "Using responsibility phrases repeatedly.", "Submitting without checking the job description and final PDF text."],
    faqs: [
      { question: "What is the most damaging resume mistake?", answer: "A lack of clear, relevant evidence near the top is often more damaging than a small formatting issue." },
      { question: "Should every bullet have a number?", answer: "No. Use accurate numbers where they clarify impact, and use scope, quality, ownership, or outcomes when exact metrics are unavailable." }
    ],
    relatedSlugs: ["why-resume-gets-ignored", "resume-format-guide", "resume-checklist-before-applying"]
  },
  {
    slug: "what-is-ats",
    category: "ATS Guides",
    title: "What Is ATS?",
    description: "A clear explanation of applicant tracking systems, what they do, and how resume clarity supports screening.",
    quickAnswer: "An applicant tracking system, or ATS, is software employers use to collect, organize, search, and sometimes screen job applications. It does not make every hiring decision by itself. Resume readability, standard headings, clear dates, and relevant language help the system capture the information recruiters need. ATS alignment means making accurate evidence easy to find, not stuffing a resume with keywords.",
    whyItMatters: ["An ATS may be the first system to process your application.", "Parsing errors can hide otherwise relevant experience.", "Human recruiters still need a clear and credible story after screening."],
    steps: [
      { title: "Use recognizable sections", body: "Label experience, education, skills, and summary with standard headings." },
      { title: "Make text readable", body: "Prefer selectable text, simple layout, and clear dates over complex visual containers." },
      { title: "Match role language honestly", body: "Use relevant skills and terms from the job description when they describe your actual experience." }
    ],
    realExample: { before: "Skills shown only as icons and visual bars.", after: "Skills listed as text: SQL, Python, Tableau, cohort analysis.", explanation: "Text gives screening systems and recruiters a clear vocabulary to recognize and evaluate." },
    commonMistakes: ["Assuming ATS is a single universal score.", "Using keyword lists without evidence.", "Treating visual design as more important than readable content."],
    faqs: [
      { question: "Can ATS reject a resume automatically?", answer: "Some employers configure screening rules, but processes differ. It is more accurate to improve readable, relevant signals than to assume one universal ATS behavior." },
      { question: "Does ATS alignment guarantee an interview?", answer: "No. It can help your information be captured and matched, but hiring outcomes are not guaranteed." }
    ],
    relatedSlugs: ["how-ats-scans-resume", "resume-keywords-guide", "ats-resume-checklist"]
  },
  {
    slug: "how-ats-scans-resume",
    category: "ATS Guides",
    title: "How ATS Scans Your Resume",
    description: "Understand the practical signals an applicant tracking system may extract from your resume.",
    quickAnswer: "An ATS typically extracts text, identifies fields such as job titles and dates, and helps employers search or filter applications. The exact process varies by system and employer. You can improve the chance of accurate capture by using selectable text, standard headings, conventional date formats, simple structure, and role-relevant language supported by your experience.",
    whyItMatters: ["A system can only search information it can extract reliably.", "A recruiter needs the same fields in a readable order after screening.", "Simple formatting reduces avoidable interpretation problems."],
    steps: [
      { title: "Use selectable text", body: "Avoid image-only resumes when a text document is requested." },
      { title: "Make fields explicit", body: "Keep titles, employers, dates, locations, and skills close to the relevant content." },
      { title: "Use normal language", body: "Write the terms a recruiter would use to describe the role, tools, and responsibilities." }
    ],
    realExample: { before: "2022 - Present | Company Name | Growth", after: "Growth Marketing Manager | Company Name | Jan 2022 - Present", explanation: "The second version makes the role, employer, and dates easier to interpret and search." },
    commonMistakes: ["Putting important text inside images.", "Using unusual symbols instead of words.", "Hiding job titles or dates in decorative layouts."],
    faqs: [
      { question: "Does ATS read columns?", answer: "Some systems may parse columns differently, so a single-column layout is a lower-risk choice when ATS readability is important." },
      { question: "What file type is best?", answer: "Follow the employer's instruction. When PDF is accepted, use a text-based PDF and verify the extracted text before applying." }
    ],
    relatedSlugs: ["what-is-ats", "resume-format-guide", "ats-resume-checklist"]
  },
  {
    slug: "resume-keywords-guide",
    category: "ATS Guides",
    title: "Resume Keywords Guide",
    description: "How to use job-description language naturally so your resume is easier to match without keyword stuffing.",
    quickAnswer: "Resume keywords are the role, skill, tool, process, and domain terms employers use to describe the work. Find them in the job description, group them by priority, and place the accurate terms in your summary, experience, and skills sections where evidence supports them. Natural repetition is fine; a disconnected keyword list weakens credibility.",
    whyItMatters: ["Keywords help connect your resume to the language of the role.", "Recruiters use both exact terms and broader evidence to assess fit.", "Context is more persuasive than a list of terms without proof."],
    steps: [
      { title: "Collect role language", body: "Mark repeated tools, responsibilities, methods, and outcomes in the job description." },
      { title: "Separate must-have signals", body: "Prioritize terms that appear in requirements or describe the core work." },
      { title: "Attach evidence", body: "Place each term near a project, result, or responsibility that proves your experience." }
    ],
    realExample: { before: "Marketing, communication, leadership, technology.", after: "Built lifecycle email campaigns in HubSpot, improving trial-to-paid conversion by 12%.", explanation: "The second version includes specific role language and evidence in a credible context." },
    commonMistakes: ["Copying the entire job description.", "Adding tools you have never used.", "Putting every keyword only in a hidden or oversized skills list."],
    faqs: [
      { question: "How many keywords should a resume have?", answer: "There is no useful universal number. Include the important terms that accurately reflect your experience and the target role." },
      { question: "Is repeating a keyword bad?", answer: "Natural repetition is acceptable when the work genuinely involved that skill. Avoid forced repetition that makes the writing awkward." }
    ],
    relatedSlugs: ["how-ats-scans-resume", "resume-bullet-points-measurable-impact", "resume-checklist-before-applying"]
  },
  {
    slug: "ats-resume-checklist",
    category: "ATS Guides",
    title: "ATS Resume Checklist",
    description: "A concise pre-application checklist for readable structure, role alignment, keywords, and resume evidence.",
    quickAnswer: "Before submitting a resume, check that the text is selectable, the document uses standard headings, dates are clear, and the target role is obvious. Then compare the job description with your summary, experience, and skills. Confirm that important terms appear in context and that your strongest measurable achievements are easy to find.",
    whyItMatters: ["A five-minute check can catch avoidable parsing and clarity issues.", "ATS alignment is strongest when structure and evidence agree.", "A checklist helps you fix the highest-impact issue before applying."],
    steps: [
      { title: "Check structure", body: "Use standard headings, clear dates, and a logical section order." },
      { title: "Check text", body: "Select and copy the resume text. Confirm it appears in the expected order." },
      { title: "Check role match", body: "Compare requirements with the exact skills, titles, and outcomes shown in your resume." },
      { title: "Check the final file", body: "Open the submitted file on another device and confirm no content shifted or disappeared." }
    ],
    realExample: { before: "A PDF where copied text appears in a scrambled two-column order.", after: "A text-based single-column PDF with clear sections and consistent dates.", explanation: "The second file is easier to process and easier for a recruiter to scan." },
    commonMistakes: ["Checking only spelling and not role alignment.", "Assuming a visual PDF is readable because it looks polished.", "Submitting the wrong file version."],
    faqs: [
      { question: "Can I test ATS readability myself?", answer: "Yes. Select and copy the text, inspect the order, and compare the document against the job description. A resume analysis tool can add structured feedback." },
      { question: "Should I use a resume template?", answer: "A template is fine if it keeps text readable, sections standard, and the layout appropriate for the employer's process." }
    ],
    relatedSlugs: ["what-is-ats", "resume-format-guide", "resume-checklist-before-applying"]
  },
  {
    slug: "software-engineer-resume",
    category: "Resume Examples",
    title: "Software Engineer Resume",
    description: "A practical software engineer resume example focused on technical evidence, shipped work, and measurable impact.",
    quickAnswer: "A software engineer resume should make technical scope and outcomes visible quickly. Name the systems, languages, and methods you actually used, then connect them to scale, reliability, speed, cost, or user impact. Projects can demonstrate engineering ability for early-career candidates when they explain the problem, implementation, and result rather than only listing a technology.",
    whyItMatters: ["Technology names show vocabulary, but outcomes show engineering judgment.", "Recruiters need to understand your level of ownership and system scope.", "Clear project evidence can compensate for limited professional experience."],
    steps: [
      { title: "Name the engineering context", body: "Identify the product, platform, system, or user problem you worked on." },
      { title: "Show technical choices", body: "Mention relevant languages, frameworks, testing, data, infrastructure, or collaboration methods." },
      { title: "Quantify the result", body: "Use latency, reliability, throughput, cost, deployment, adoption, or delivery measures when available." }
    ],
    realExample: { before: "Worked on backend services using Python and AWS.", after: "Built Python services on AWS that cut batch processing time from 42 to 18 minutes for 60K daily records.", explanation: "The improved bullet shows ownership, stack, scale, and a measurable performance result." },
    commonMistakes: ["Listing every technology ever touched.", "Describing tasks without system context or outcomes.", "Leaving projects without links, scope, or a clear result."],
    faqs: [
      { question: "Should a software engineer list a full tech stack?", answer: "List the technologies that support the target role and the evidence in your experience. A focused list is more useful than an exhaustive inventory." },
      { question: "How should students show coding projects?", answer: "Describe the problem, your implementation, relevant tools, and a result such as users, performance, or a shipped feature." }
    ],
    relatedSlugs: ["resume-bullet-points-measurable-impact", "resume-keywords-guide", "resume-with-no-experience"]
  },
  {
    slug: "product-manager-resume",
    category: "Resume Examples",
    title: "Product Manager Resume",
    description: "How to show product judgment, customer insight, cross-functional leadership, and outcomes on a product manager resume.",
    quickAnswer: "A product manager resume should connect customer problems, product decisions, cross-functional execution, and measurable outcomes. Show what you discovered, prioritized, shipped, or changed, and how users or the business responded. Avoid describing meetings and processes as the main achievement. Recruiters want evidence of judgment, communication, prioritization, and ownership.",
    whyItMatters: ["Product work is evaluated through decisions and outcomes, not activity alone.", "Clear scope helps recruiters understand your level of ownership.", "Metrics make customer and business impact easier to assess."],
    steps: [
      { title: "State the product context", body: "Name the customer, product area, or problem space rather than using generic product language." },
      { title: "Show the decision", body: "Explain what you prioritized, tested, launched, or changed and why." },
      { title: "Connect to outcomes", body: "Use adoption, activation, retention, revenue, conversion, delivery, or quality measures when accurate." }
    ],
    realExample: { before: "Worked with engineering and design to improve the app.", after: "Prioritized a guided onboarding flow with design and engineering, raising activation 14% across new self-serve accounts.", explanation: "The second bullet shows a product decision, collaboration, and measurable user outcome." },
    commonMistakes: ["Listing ceremonies instead of decisions.", "Using metrics without explaining what changed.", "Failing to distinguish personal ownership from team activity."],
    faqs: [
      { question: "Can a project manager apply with a product manager resume?", answer: "Yes, when the resume clearly shows customer problems, prioritization, product decisions, and outcomes rather than only delivery coordination." },
      { question: "Should PM resumes include a product skills section?", answer: "A focused skills section can help, but it should reinforce evidence in the experience bullets." }
    ],
    relatedSlugs: ["resume-summary-examples", "resume-bullet-points-measurable-impact", "career-change-resume"]
  },
  {
    slug: "marketing-resume",
    category: "Resume Examples",
    title: "Marketing Resume",
    description: "Build a marketing resume around audience, channel, campaign, experimentation, and measurable business outcomes.",
    quickAnswer: "A marketing resume is strongest when it shows who you reached, what channel or campaign you used, what you changed, and what happened next. Name relevant platforms and methods, but connect them to leads, conversion, revenue, engagement, retention, or efficiency. Different marketing roles need different evidence, so tailor the signals to the job description.",
    whyItMatters: ["Marketing work is easier to evaluate when audience and channel are explicit.", "Metrics show whether activity produced a meaningful result.", "Role-specific evidence separates a generalist profile from a targeted one."],
    steps: [
      { title: "Define the audience and goal", body: "Make the customer, funnel stage, or business goal visible." },
      { title: "Name the channel and action", body: "Identify the campaign, platform, experiment, or content system you owned." },
      { title: "Show the result", body: "Use conversion, pipeline, reach, retention, cost, or efficiency measures with a clear time frame." }
    ],
    realExample: { before: "Managed email marketing campaigns.", after: "Segmented a 42K-subscriber list and tested onboarding emails, increasing trial activation by 11%.", explanation: "The improved version shows audience scale, method, and a clear outcome." },
    commonMistakes: ["Listing tools without campaign context.", "Reporting activity metrics without a business connection.", "Using the same bullets for content, growth, and brand roles."],
    faqs: [
      { question: "Which marketing metrics belong on a resume?", answer: "Use the metrics that explain impact for the target role, such as conversion, pipeline, revenue, retention, cost, or qualified leads." },
      { question: "Should marketing resumes include a portfolio?", answer: "A portfolio can help when the role values campaigns, content, or creative work. Keep the resume readable and link only to relevant work." }
    ],
    relatedSlugs: ["resume-keywords-guide", "resume-bullet-points-measurable-impact", "resume-summary-examples"]
  },
  {
    slug: "resume-with-no-experience",
    category: "Career Advice",
    title: "Resume With No Experience",
    description: "How students and early-career candidates can turn coursework, projects, part-time work, and community experience into credible signals.",
    quickAnswer: "A resume with no full-time experience can still show readiness through projects, coursework, internships, volunteering, part-time work, leadership, and skills used to produce a result. Choose a target role, put the most relevant evidence first, explain what you did, and show an outcome or artifact. Do not apologize for being early-career; make your evidence easy to understand.",
    whyItMatters: ["Recruiters evaluate potential through evidence, not only job titles.", "Relevant projects can demonstrate behavior and skills before a first full-time role.", "A focused story is more persuasive than a long list of activities."],
    steps: [
      { title: "Choose a realistic target", body: "Use the job description to decide which coursework, projects, and skills belong on the page." },
      { title: "Build an evidence section", body: "Describe projects with the problem, your contribution, tools, and result." },
      { title: "Translate other experience", body: "Show customer service, reliability, collaboration, or ownership from part-time and community work." }
    ],
    realExample: { before: "Built a website for a class.", after: "Built a React event-registration site for a 120-person student conference and reduced manual sign-up work for organizers.", explanation: "The improved version explains context, tool, scale, and practical value." },
    commonMistakes: ["Leaving projects as one-line titles.", "Filling space with unrelated soft skills.", "Hiding education, coursework, or relevant work too low on the page."],
    faqs: [
      { question: "Should I include part-time work?", answer: "Yes, when it shows transferable skills, reliability, customer interaction, ownership, or measurable contribution." },
      { question: "How can I show impact without job metrics?", answer: "Use scope, users, time saved, completion, quality, adoption, or a concrete artifact when accurate." }
    ],
    relatedSlugs: ["first-job-resume", "resume-summary-examples", "software-engineer-resume"]
  },
  {
    slug: "career-change-resume",
    category: "Career Advice",
    title: "Career Change Resume",
    description: "Position transferable skills and new-direction evidence clearly when moving into a different career path.",
    quickAnswer: "A career change resume should make the new target role clear and connect past experience to the capabilities that role needs. Lead with a focused summary, select transferable achievements, add recent training or projects, and use the new field's language accurately. You do not need to hide the transition; you need to explain why your evidence is relevant.",
    whyItMatters: ["Without context, a recruiter may see a job history but miss the new direction.", "Transferable evidence is strongest when tied to the target role.", "Recent projects and learning reduce uncertainty about readiness."],
    steps: [
      { title: "Name the new direction", body: "State the target role and the relevant strengths you bring from the previous field." },
      { title: "Reframe evidence", body: "Choose achievements that demonstrate the new role's behaviors, not every responsibility from the old role." },
      { title: "Add current proof", body: "Include a project, course, credential, or practical work that shows recent commitment and capability." }
    ],
    realExample: { before: "Office manager who wants to become a project manager.", after: "Operations coordinator who led a cross-team office systems rollout, delivered two weeks early, and is completing a project management certificate.", explanation: "The second version connects past ownership with the new role and adds current proof." },
    commonMistakes: ["Using a generic career-change objective.", "Leading with unrelated history instead of transferable outcomes.", "Overexplaining the transition in a long paragraph."],
    faqs: [
      { question: "Should I remove my old career experience?", answer: "Keep the experience that proves useful skills, scope, judgment, or outcomes for the new role. Remove detail that does not support the direction." },
      { question: "Can a career changer use a functional resume?", answer: "A hybrid or reverse-chronological format is often easier to trust because it preserves context while highlighting transferable skills." }
    ],
    relatedSlugs: ["resume-summary-examples", "resume-format-guide", "resume-keywords-guide"]
  },
  {
    slug: "first-job-resume",
    category: "Career Advice",
    title: "First Job Resume",
    description: "A first-job resume guide for graduates and students who need to turn early evidence into a clear application story.",
    quickAnswer: "A first-job resume should show the role you want, evidence that you can do the work, and the skills you have practiced in real settings. Include relevant education, internships, projects, part-time work, leadership, and tools. Keep the page focused, use outcome-based bullets, and tailor the top half to each application instead of trying to include everything.",
    whyItMatters: ["Early-career candidates compete through clarity and evidence, not years of tenure.", "Projects and internships can show how you work before your first permanent role.", "A tailored first page makes a faster, stronger impression."],
    steps: [
      { title: "Set the target", body: "Use the title and requirements of the role to choose what to emphasize." },
      { title: "Lead with relevant experience", body: "Put internships, projects, coursework, or part-time work that best supports the role near the top." },
      { title: "Write proof-based bullets", body: "Describe what you did, how you did it, and what changed as a result." }
    ],
    realExample: { before: "Helped the team with customer support.", after: "Resolved 25-30 customer questions per shift using Zendesk while maintaining a 95% quality score.", explanation: "The improved bullet makes the work, tool, volume, and quality signal visible." },
    commonMistakes: ["Writing a long personal statement.", "Treating coursework as a list with no application.", "Using a skills list that is not supported by examples."],
    faqs: [
      { question: "How many projects should I include?", answer: "Include the strongest two or three projects that support the target role and can be explained with useful detail." },
      { question: "Do I need a resume summary for my first job?", answer: "Use one when it quickly connects your target role to relevant education, experience, or evidence. Skip it if it would only repeat generic motivation." }
    ],
    relatedSlugs: ["resume-with-no-experience", "resume-summary-examples", "resume-checklist-before-applying"]
  },
  {
    slug: "one-page-vs-two-page-resume",
    category: "Career Advice",
    title: "One Page vs Two Page Resume",
    description: "Decide whether one or two pages gives your experience the clearest, most relevant presentation.",
    quickAnswer: "Use one page when it can show your most relevant evidence clearly, which is common for students and early-career candidates. Use two pages when the additional content is relevant, specific, and valuable for the target role. Page count is less important than signal quality: every line should help a recruiter understand your fit, scope, skills, or results.",
    whyItMatters: ["Extra length can help when it adds evidence, but hurt when it adds repetition.", "A short resume is not automatically focused.", "Recruiters need a clear reading path on every page."],
    steps: [
      { title: "List the evidence", body: "Separate essential proof from background detail and repeated responsibilities." },
      { title: "Test one page", body: "Remove low-relevance detail before shrinking type or margins." },
      { title: "Use page two intentionally", body: "If a second page is justified, start it with useful content and repeat your name or header for context." }
    ],
    realExample: { before: "Two pages of duplicated responsibilities and unrelated early work.", after: "One page with three targeted roles, two projects, and quantified achievements.", explanation: "The shorter document improves relevance without sacrificing proof." },
    commonMistakes: ["Shrinking the font to force one page.", "Adding a second page for weak or duplicated detail.", "Leaving a nearly empty second page."],
    faqs: [
      { question: "Is a one-page resume always better for graduates?", answer: "Usually it is a useful constraint, but a second page can be fine when it contains relevant, credible evidence that cannot fit clearly." },
      { question: "Should I remove older jobs?", answer: "Remove or compress older work when it does not support the target role. Keep it when it shows meaningful transferable value." }
    ],
    relatedSlugs: ["resume-format-guide", "common-resume-mistakes", "resume-checklist-before-applying"]
  }
];

export function getResumeResourceArticle(slug: string) {
  return resumeResourceArticles.find((article) => article.slug === slug);
}

export function getResumeResourceCategory(category: ResumeResourceCategory) {
  return resumeResourceArticles.filter((article) => article.category === category);
}
