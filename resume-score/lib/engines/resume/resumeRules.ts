import { ResumeRule, ScoringCategory, ScoringCategoryKey } from "./resumeTypes";

export const scoringCategories: ScoringCategory[] = [
  { key: "atsCompatibility", label: "ATS Compatibility", maxPoints: 20 },
  { key: "clarityStructure", label: "Clarity & Structure", maxPoints: 20 },
  { key: "impactAchievements", label: "Impact & Achievements", maxPoints: 20 },
  { key: "keywordRelevance", label: "Keyword Relevance", maxPoints: 20 },
  { key: "professionalPresentation", label: "Professional Presentation", maxPoints: 20 }
];

function rule(
  id: string,
  category: ScoringCategoryKey,
  title: string,
  description: string,
  priority: ResumeRule["priority"],
  weight: number,
  evidenceType: string,
  recommendation: string,
  exampleFix: string
): ResumeRule {
  return { id, category, title, description, priority, weight, evidenceType, recommendation, exampleFix };
}

export const resumeRulebook: ResumeRule[] = [
  rule("ATS-001", "atsCompatibility", "Use standard section headings", "Resume should use headings ATS systems can recognize.", "Critical", 2, "section heading", "Use Summary, Experience, Skills, Education, and Projects.", "Rename 'My Journey' to 'Experience'."),
  rule("ATS-002", "atsCompatibility", "Avoid complex layout", "Tables, columns, text boxes, images, and heavy graphics can reduce parsing quality.", "Critical", 2, "format signal", "Keep an ATS version with one-column text layout.", "Use a clean single-column PDF exported from DOCX."),
  rule("ATS-003", "atsCompatibility", "Include clear contact information", "Recruiters and systems need name, email, phone, and location.", "Major", 1.5, "contact info", "Place standard contact details at the top.", "Jane Lee | jane@email.com | Toronto, ON | LinkedIn"),
  rule("ATS-004", "atsCompatibility", "Show readable dates", "Dates help systems and recruiters understand timeline and recency.", "Major", 1.5, "date pattern", "Use consistent month/year or year ranges.", "Marketing Intern | Jun 2025 - Aug 2025"),
  rule("ATS-005", "atsCompatibility", "Use clear job titles", "Job titles help match experience to roles.", "Major", 1.5, "job title", "Make titles explicit and easy to scan.", "Operations Intern, not 'Team Member'."),
  rule("ATS-006", "atsCompatibility", "Use natural keywords", "ATS matching improves when relevant keywords appear naturally.", "Major", 1.5, "keyword", "Mirror important terms from target job descriptions.", "Add 'campaign reporting' if applying to marketing coordinator roles."),
  rule("ATS-007", "atsCompatibility", "Avoid headers with critical text only", "Some parsers miss text placed only in document headers/footers.", "Minor", 1, "layout risk", "Keep name and contact details in the body of the document.", "Place contact info in the main top section."),
  rule("ATS-008", "atsCompatibility", "Prefer text-based PDF/DOCX", "Image-only resumes cannot be reliably parsed without OCR.", "Critical", 2, "file readability", "Upload a text-based PDF or DOCX.", "Export from Google Docs as PDF instead of screenshot."),
  rule("ATS-009", "atsCompatibility", "Avoid unusual symbols for bullets", "Unusual glyphs can parse poorly.", "Minor", 1, "bullet style", "Use simple bullet points.", "Use '-' or standard round bullets."),
  rule("ATS-010", "atsCompatibility", "Include skills section", "A clear skills section helps ATS and recruiters identify fit quickly.", "Major", 1.5, "skills section", "Add grouped technical and functional skills.", "Skills: Excel, SQL, reporting, stakeholder communication."),

  rule("CLR-001", "clarityStructure", "Clear target role", "The resume should quickly communicate the type of role being pursued.", "Critical", 2, "summary focus", "Write a focused summary for one target role.", "Marketing coordinator candidate with internship experience in campaigns and reporting."),
  rule("CLR-002", "clarityStructure", "Professional summary", "Early-career resumes benefit from a concise positioning summary.", "Major", 1.5, "summary", "Add 2-3 lines explaining role fit and strengths.", "Recent business graduate focused on operations analyst roles."),
  rule("CLR-003", "clarityStructure", "Relevant content first", "Most relevant experience should be easy to find.", "Major", 1.5, "section order", "Move relevant projects or internships above less relevant items.", "Place Data Analytics Project before unrelated part-time work."),
  rule("CLR-004", "clarityStructure", "Scannable experience", "Recruiters scan quickly and need clear title, organization, date, and bullets.", "Major", 1.5, "experience format", "Use a consistent experience layout.", "Company | Role | Dates followed by 3-5 bullets."),
  rule("CLR-005", "clarityStructure", "Concise bullets", "Long bullets hide the main point.", "Major", 1.25, "bullet length", "Keep bullets focused on one idea.", "Reduced weekly reporting time by 30% using Excel automation."),
  rule("CLR-006", "clarityStructure", "Logical section order", "A predictable order reduces cognitive load.", "Minor", 1, "section order", "Use Summary, Skills, Experience, Projects, Education when appropriate.", "Move hobbies below professional content."),
  rule("CLR-007", "clarityStructure", "Avoid dense paragraphs", "Dense blocks are difficult to scan.", "Major", 1.25, "text density", "Convert dense experience paragraphs into bullets.", "Break a 6-line paragraph into 3 result-focused bullets."),
  rule("CLR-008", "clarityStructure", "Consistent naming", "Inconsistent role or project names confuse readers.", "Minor", 1, "naming consistency", "Use consistent names for companies, tools, and projects.", "Use 'Google Analytics' consistently instead of alternating abbreviations."),
  rule("CLR-009", "clarityStructure", "Clear education placement", "Education should support the story without burying stronger proof.", "Minor", 1, "education structure", "Place education based on relevance and career stage.", "For students, education can appear near the top."),
  rule("CLR-010", "clarityStructure", "One-page focus for early career", "Early-career resumes should usually be concise.", "Minor", 1, "length", "Keep only relevant details.", "Remove older unrelated activities if space is tight."),

  rule("IMP-001", "impactAchievements", "Show outcomes", "Bullets should communicate results, not just assigned duties.", "Critical", 2, "outcome", "Rewrite responsibilities into contribution statements.", "Improved onboarding checklist, reducing setup questions by 20%."),
  rule("IMP-002", "impactAchievements", "Use metrics when truthful", "Numbers help recruiters understand scale and impact.", "Critical", 2, "metric", "Add numbers, percentages, volume, frequency, or scope.", "Supported 12 events with 300+ total attendees."),
  rule("IMP-003", "impactAchievements", "Avoid responsible for", "This phrase often signals passive task descriptions.", "Major", 1.5, "vague phrase", "Start with action verbs.", "Coordinated weekly reports instead of responsible for weekly reports."),
  rule("IMP-004", "impactAchievements", "Use strong action verbs", "Action verbs make contribution clearer.", "Major", 1.25, "verb quality", "Use built, analyzed, improved, coordinated, launched, researched.", "Analyzed survey results to identify top support issues."),
  rule("IMP-005", "impactAchievements", "Include project scope", "Scope helps readers understand complexity.", "Major", 1.25, "scope", "Mention team size, user count, budget, timeline, or data size when relevant.", "Analyzed 500 survey responses."),
  rule("IMP-006", "impactAchievements", "Connect action to business value", "Recruiters care why the work mattered.", "Major", 1.5, "business impact", "Tie work to time saved, quality improved, revenue, retention, or user experience.", "Reduced manual tracking errors by standardizing the spreadsheet."),
  rule("IMP-007", "impactAchievements", "Prioritize achievements over tasks", "Task lists make candidates blend together.", "Critical", 2, "achievement", "Lead with the strongest results in each role.", "Put the highest-impact bullet first."),
  rule("IMP-008", "impactAchievements", "Make projects outcome-based", "Projects should show what was built or learned.", "Major", 1.25, "project result", "Describe output, tools, and result.", "Built Tableau dashboard to summarize sales trends across 3 regions."),
  rule("IMP-009", "impactAchievements", "Show ownership", "Early-career candidates stand out through initiative.", "Major", 1.25, "ownership", "Highlight where you initiated, led, improved, or solved.", "Created a new template adopted by the team."),
  rule("IMP-010", "impactAchievements", "Remove vague claims", "Claims like hardworking or passionate need proof.", "Minor", 1, "generic claim", "Replace claims with evidence.", "Use completed 4 client research summaries instead of strong communicator."),

  rule("KEY-001", "keywordRelevance", "Match target role keywords", "Keywords should reflect the jobs being pursued.", "Critical", 2, "target keyword", "Pull terms from real job postings.", "For analyst roles: SQL, Excel, dashboard, data cleaning."),
  rule("KEY-002", "keywordRelevance", "Group skills by type", "Grouped skills are easier to scan.", "Major", 1.5, "skills grouping", "Separate technical, tools, functional, and languages.", "Tools: Excel, SQL, Tableau. Functional: reporting, research."),
  rule("KEY-003", "keywordRelevance", "Avoid generic skill dominance", "Generic skills should not crowd out role-specific proof.", "Major", 1.25, "generic skill", "Limit broad skills and add concrete tools or methods.", "Replace communication with stakeholder updates, presentation, documentation."),
  rule("KEY-004", "keywordRelevance", "Repeat important keywords naturally", "Natural repetition can help matching and comprehension.", "Minor", 1, "keyword frequency", "Use key terms in summary, skills, and bullets when truthful.", "Mention 'campaign reporting' in summary and internship bullet."),
  rule("KEY-005", "keywordRelevance", "Include tools", "Tools provide concrete capability signals.", "Major", 1.5, "tool keyword", "List relevant software and platforms.", "Excel, Google Analytics, Figma, Python, HubSpot."),
  rule("KEY-006", "keywordRelevance", "Include functional keywords", "Functional keywords explain what the candidate can do.", "Major", 1.25, "functional keyword", "Add role activities such as reporting, research, coordination, analysis.", "Customer research, dashboard reporting, process documentation."),
  rule("KEY-007", "keywordRelevance", "Align project keywords", "Projects should reinforce target role language.", "Major", 1.25, "project keyword", "Name tools and methods used in projects.", "Built SQL query to analyze retention trends."),
  rule("KEY-008", "keywordRelevance", "Avoid keyword stuffing", "Too many unnatural terms reduce credibility.", "Major", 1.25, "keyword stuffing", "Use keywords only where truthful and readable.", "Use one clear skills list instead of repeating every term everywhere."),
  rule("KEY-009", "keywordRelevance", "Identify missing keywords", "The report should call out likely gaps.", "Major", 1.5, "keyword gap", "Compare resume language to target role needs.", "Add 'A/B testing' if applying to growth marketing roles and truthful."),
  rule("KEY-010", "keywordRelevance", "Use standard role titles", "Standard titles improve search and matching.", "Minor", 1, "role title", "Use common role names when possible.", "Use 'Product Marketing Intern' instead of 'Storytelling Fellow' if accurate."),

  rule("PRS-001", "professionalPresentation", "Professional tone", "Resume language should sound credible and workplace-ready.", "Critical", 2, "tone", "Use concise professional wording.", "Coordinated weekly team updates instead of helped with stuff."),
  rule("PRS-002", "professionalPresentation", "Grammar and spelling", "Errors reduce trust quickly.", "Critical", 2, "grammar", "Proofread and use consistent capitalization.", "Use 'led' not 'lead' for past tense."),
  rule("PRS-003", "professionalPresentation", "Consistent formatting", "Consistency helps the resume feel polished.", "Major", 1.5, "format consistency", "Keep dates, bullets, headings, and spacing consistent.", "Use the same date format throughout."),
  rule("PRS-004", "professionalPresentation", "Avoid unnecessary personal information", "Personal details can distract and may be inappropriate.", "Major", 1.25, "personal info", "Remove age, marital status, photo, and unrelated personal identifiers.", "Keep location to city/region only."),
  rule("PRS-005", "professionalPresentation", "Focused content", "Everything should support the target role.", "Major", 1.5, "focus", "Remove low-relevance details when they crowd stronger proof.", "Cut unrelated high school activities for a graduate role."),
  rule("PRS-006", "professionalPresentation", "Readable formatting", "Recruiters should not struggle with visual hierarchy.", "Major", 1.5, "readability", "Use clean spacing and readable font sizes.", "Avoid tiny margins and 8pt text."),
  rule("PRS-007", "professionalPresentation", "Credible claims", "Claims should be supported by evidence.", "Major", 1.25, "claim evidence", "Back up strengths with examples.", "Replace excellent leadership with led 4-person project team."),
  rule("PRS-008", "professionalPresentation", "Consistent tense", "Tense mistakes make writing feel less polished.", "Minor", 1, "tense", "Use present tense for current roles and past tense for previous roles.", "Analyze current reports; analyzed previous survey data."),
  rule("PRS-009", "professionalPresentation", "Appropriate length", "Too much detail weakens focus.", "Minor", 1, "length", "Keep early-career resumes concise.", "Use 3-5 bullets per role."),
  rule("PRS-010", "professionalPresentation", "Clear file readiness", "The final resume should be easy to share and read.", "Minor", 1, "file readiness", "Export with a professional filename and text-based format.", "Jane-Lee-Resume-Marketing-Coordinator.pdf.")
];

export function getRulesByCategory(category: ScoringCategoryKey) {
  return resumeRulebook.filter((item) => item.category === category);
}

export function gradeCategory(score: number) {
  if (score >= 18) return "A";
  if (score >= 15) return "B";
  if (score >= 11) return "C";
  if (score >= 7) return "D";
  return "F";
}
