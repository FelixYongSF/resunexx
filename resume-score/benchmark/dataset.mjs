const profiles = [
  {
    id: "graduate-strong",
    category: "graduate",
    tier: "strong",
    targetRole: "Marketing Coordinator",
    summary: "Recent marketing graduate focused on campaign operations, audience research, and performance reporting.",
    skills: "Google Analytics 4, Excel, Canva, campaign reporting, customer research, copywriting",
    experience: [
      "Built a campaign dashboard used by 4 student teams to track registration and engagement.",
      "Coordinated email and social promotion for 6 campus events attended by 780 students.",
      "Analyzed 420 survey responses and presented three audience recommendations to program leadership.",
      "Improved event email click-through rate from 8% to 13% through subject-line testing."
    ],
    education: "Bachelor of Commerce, Marketing, 2026"
  },
  {
    id: "graduate-medium",
    category: "graduate",
    tier: "medium",
    targetRole: "Operations Analyst",
    summary: "Business graduate seeking an operations analyst role with project and spreadsheet experience.",
    skills: "Excel, Google Sheets, process mapping, presentation, research",
    experience: [
      "Created an inventory tracker for a capstone project covering 120 sample orders.",
      "Supported a student organization by coordinating weekly schedules and event logistics.",
      "Presented a process-improvement proposal to a five-person faculty panel.",
      "Completed coursework in statistics, operations management, and business analytics."
    ],
    education: "Bachelor of Business Administration, 2026"
  },
  {
    id: "graduate-weak",
    category: "graduate",
    tier: "weak",
    targetRole: "Business Graduate Role",
    summary: "Hardworking graduate looking for a challenging position where I can learn and grow.",
    skills: "Communication, teamwork, Microsoft Office",
    experience: [
      "Responsible for helping with student club activities.",
      "Worked on different group projects for university classes.",
      "Participated in meetings and helped team members.",
      "Completed assignments and presentations on time."
    ],
    education: "Bachelor of Arts, Business Studies, 2026"
  },
  {
    id: "software-strong",
    category: "software",
    tier: "strong",
    targetRole: "Software Engineer",
    summary: "Software engineer with two years of experience building reliable customer-facing web products.",
    skills: "TypeScript, React, Next.js, Node.js, PostgreSQL, AWS, Docker, Playwright, Datadog",
    experience: [
      "Shipped React onboarding improvements that increased activation by 14% across 8,000 monthly users.",
      "Reduced frontend bundle size by 28% through code splitting and dependency cleanup.",
      "Built 48 automated tests and increased critical-flow coverage from 54% to 86%.",
      "Introduced production monitoring that reduced repeat incidents by 22%.",
      "Partnered with design and support to resolve 40 customer-reported defects."
    ],
    education: "Bachelor of Engineering, Software Engineering, 2024"
  },
  {
    id: "software-medium",
    category: "software",
    tier: "medium",
    targetRole: "Junior Software Engineer",
    summary: "Junior software engineer experienced in web application development and API integration.",
    skills: "JavaScript, React, Node.js, SQL, Git, REST APIs",
    experience: [
      "Developed account settings features for an internal React application.",
      "Integrated two third-party APIs and documented expected error responses.",
      "Resolved 18 defects across frontend and backend services.",
      "Participated in code reviews and weekly release testing.",
      "Created setup documentation used by three new developers."
    ],
    education: "Diploma in Software Development, 2024"
  },
  {
    id: "software-weak",
    category: "software",
    tier: "weak",
    targetRole: "Software Developer",
    summary: "Developer looking for a new role in technology.",
    skills: "JavaScript, computers, teamwork",
    experience: [
      "Responsible for maintaining application features.",
      "Worked on bugs and other technical tasks.",
      "Helped with API integrations.",
      "Participated in testing and documentation.",
      "Attended daily meetings with the team."
    ],
    education: "Certificate in Computing, 2024"
  },
  {
    id: "product-strong",
    category: "product",
    tier: "strong",
    targetRole: "Associate Product Manager",
    summary: "Associate product manager with three years of experience in onboarding, discovery, and experimentation.",
    skills: "Product discovery, roadmap prioritization, SQL, Amplitude, Figma, experimentation, user research",
    experience: [
      "Led discovery for a new onboarding flow that improved trial conversion from 21% to 27%.",
      "Prioritized a 30-item roadmap with engineering, design, sales, and customer success.",
      "Ran 18 user interviews and translated findings into five shipped improvements.",
      "Created an activation dashboard used in weekly product reviews.",
      "Reduced support contacts by 16% after simplifying account setup guidance."
    ],
    education: "Bachelor of Arts, Economics, 2023"
  },
  {
    id: "product-medium",
    category: "product",
    tier: "medium",
    targetRole: "Associate Product Manager",
    summary: "Product coordinator supporting feature delivery, customer research, and cross-functional planning.",
    skills: "Jira, Figma, product requirements, user interviews, analytics, stakeholder communication",
    experience: [
      "Coordinated delivery plans for four product improvements across design and engineering.",
      "Summarized feedback from 12 customer interviews for roadmap discussions.",
      "Maintained release notes and acceptance criteria for a customer portal.",
      "Supported weekly prioritization meetings with product and commercial teams.",
      "Tracked adoption for two recently launched features."
    ],
    education: "Bachelor of Science, Information Systems, 2023"
  },
  {
    id: "product-weak",
    category: "product",
    tier: "weak",
    targetRole: "Product Manager",
    summary: "Operations coordinator interested in moving into product management.",
    skills: "",
    experience: [
      "Coordinated meetings between business teams and software vendors.",
      "Collected feedback and shared notes with stakeholders.",
      "Helped with launch planning.",
      "Responsible for project documentation.",
      "Worked on different requests from managers."
    ],
    education: "Bachelor of Arts, Communications, 2022"
  },
  {
    id: "marketing-strong",
    category: "marketing",
    tier: "strong",
    targetRole: "Growth Marketing Specialist",
    summary: "Growth marketer with two years of experience in lifecycle campaigns, paid acquisition, and reporting.",
    skills: "HubSpot, Google Analytics 4, Looker Studio, paid search, lifecycle marketing, A/B testing",
    experience: [
      "Improved email click-through rate by 19% through audience segmentation and message testing.",
      "Managed a monthly paid-media budget of $35,000 and reduced acquisition cost by 16%.",
      "Built campaign dashboards used by six stakeholders for weekly channel decisions.",
      "Launched a reactivation sequence that returned 420 dormant users to the product.",
      "Partnered with sales to define lead-quality criteria across three campaigns."
    ],
    education: "Bachelor of Business Administration, 2023"
  },
  {
    id: "marketing-medium",
    category: "marketing",
    tier: "medium",
    targetRole: "Marketing Coordinator",
    summary: "Marketing coordinator experienced in content scheduling, campaign support, and performance reporting.",
    skills: "Mailchimp, Canva, Google Analytics, social media, copywriting, campaign coordination",
    experience: [
      "Coordinated a monthly content calendar across email and three social channels.",
      "Prepared campaign reports for marketing and sales stakeholders.",
      "Supported two product launches with landing-page and webinar materials.",
      "Increased webinar registrations by 11% after revising reminder emails.",
      "Maintained brand assets and campaign documentation."
    ],
    education: "Bachelor of Communications, 2024"
  },
  {
    id: "marketing-weak",
    category: "marketing",
    tier: "weak",
    targetRole: "Marketing Assistant",
    summary: "Creative and passionate person looking for a marketing opportunity.",
    skills: "Social media, creativity, communication",
    experience: [
      "Responsible for posting on social media.",
      "Helped with marketing campaigns.",
      "Worked on content and graphics.",
      "Participated in team meetings.",
      "Assisted with other duties when required."
    ],
    education: "Bachelor of Arts, 2024"
  },
  {
    id: "sales-strong",
    category: "sales",
    tier: "strong",
    targetRole: "Business Development Representative",
    summary: "Business development representative with consistent pipeline generation in B2B software.",
    skills: "Salesforce, Outreach, prospecting, discovery, pipeline management, account research",
    experience: [
      "Generated $1.2M in qualified pipeline and achieved 118% of annual quota.",
      "Booked 94 discovery meetings through targeted outbound sequences across three industries.",
      "Improved reply rate from 7% to 11% through account-specific messaging tests.",
      "Built account research templates adopted by eight representatives.",
      "Partnered with account executives to improve opportunity handoff quality."
    ],
    education: "Bachelor of Commerce, 2023"
  },
  {
    id: "sales-medium",
    category: "sales",
    tier: "medium",
    targetRole: "Sales Development Representative",
    summary: "Sales development representative experienced in outbound prospecting and discovery scheduling.",
    skills: "HubSpot, prospecting, cold email, qualification, CRM reporting",
    experience: [
      "Contacted prospective customers through email, phone, and LinkedIn.",
      "Booked 38 discovery calls during a six-month contract.",
      "Maintained CRM records and prepared weekly pipeline updates.",
      "Researched target accounts across technology and professional services.",
      "Supported account executives with meeting preparation."
    ],
    education: "Associate Degree, Business, 2024"
  },
  {
    id: "sales-weak",
    category: "sales",
    tier: "weak",
    targetRole: "Sales Representative",
    summary: "Motivated salesperson seeking a new opportunity.",
    skills: "",
    experience: [
      "Responsible for contacting prospective customers.",
      "Helped with sales presentations.",
      "Worked on customer follow-up.",
      "Maintained relationships with clients.",
      "Participated in pipeline meetings."
    ],
    education: "Associate Degree, Business, 2024"
  },
  {
    id: "finance-strong",
    category: "finance",
    tier: "strong",
    targetRole: "Financial Analyst",
    summary: "Financial analyst with two years of experience in forecasting, variance analysis, and executive reporting.",
    skills: "Excel, Power BI, financial modeling, forecasting, variance analysis, SQL",
    experience: [
      "Automated monthly reporting and reduced preparation time by nine hours per cycle.",
      "Built a $48M annual forecast model covering revenue, expenses, and headcount.",
      "Identified $320,000 in savings opportunities through vendor and spend analysis.",
      "Presented monthly variance findings to six functional leaders.",
      "Improved forecast accuracy by 8% through driver-based assumptions."
    ],
    education: "Bachelor of Commerce, Finance, 2023"
  },
  {
    id: "finance-medium",
    category: "finance",
    tier: "medium",
    targetRole: "Junior Financial Analyst",
    summary: "Junior financial analyst supporting reporting, reconciliations, and budgeting activities.",
    skills: "Excel, financial reporting, reconciliation, budgeting, PowerPoint",
    experience: [
      "Prepared monthly reporting packs for finance leadership.",
      "Reconciled five balance-sheet accounts and investigated exceptions.",
      "Supported annual budget collection across four departments.",
      "Created an Excel tracker that reduced follow-up time by three hours monthly.",
      "Updated forecast assumptions using department submissions."
    ],
    education: "Bachelor of Science, Finance, 2024"
  },
  {
    id: "finance-weak",
    category: "finance",
    tier: "weak",
    targetRole: "Finance Assistant",
    summary: "Detail-oriented graduate interested in finance.",
    skills: "Excel, communication, organization",
    experience: [
      "Responsible for spreadsheets and finance tasks.",
      "Helped prepare reports.",
      "Worked with invoices and documents.",
      "Participated in department meetings.",
      "Assisted the team when needed."
    ],
    education: "Bachelor of Science, Finance, 2025"
  },
  {
    id: "operations-strong",
    category: "operations",
    tier: "strong",
    targetRole: "Operations Analyst",
    summary: "Operations analyst with three years of experience improving workflows, reporting, and service delivery.",
    skills: "Process improvement, Excel, Tableau, SOP development, stakeholder management, data analysis",
    experience: [
      "Redesigned order intake and reduced processing time by 31% across four teams.",
      "Created dashboards tracking 12 service metrics for weekly operating reviews.",
      "Standardized nine procedures and reduced onboarding time from four weeks to three.",
      "Led root-cause analysis that reduced order exceptions by 18%.",
      "Coordinated a system migration affecting 2,400 customer records."
    ],
    education: "Bachelor of Business Operations, 2022"
  },
  {
    id: "operations-medium",
    category: "operations",
    tier: "medium",
    targetRole: "Operations Coordinator",
    summary: "Operations coordinator supporting scheduling, process documentation, and service reporting.",
    skills: "Excel, scheduling, SOP documentation, reporting, vendor coordination",
    experience: [
      "Coordinated weekly schedules for a 14-person service team.",
      "Updated seven operating procedures after a system change.",
      "Prepared monthly service reports for department managers.",
      "Reduced missing order information by 9% using a revised intake checklist.",
      "Managed vendor follow-ups and delivery documentation."
    ],
    education: "Bachelor of Business Administration, 2024"
  },
  {
    id: "operations-weak",
    category: "operations",
    tier: "weak",
    targetRole: "Operations Assistant",
    summary: "Organized professional seeking an operations job.",
    skills: "Organization, communication, teamwork",
    experience: [
      "Responsible for daily operations.",
      "Helped managers with different tasks.",
      "Worked on schedules and paperwork.",
      "Participated in meetings.",
      "Assisted customers and vendors."
    ],
    education: "Diploma in Business, 2024"
  },
  {
    id: "design-strong",
    category: "design",
    tier: "strong",
    targetRole: "Product Designer",
    summary: "Product designer with two years of experience creating accessible mobile and web experiences.",
    skills: "Figma, prototyping, design systems, accessibility, usability testing, interaction design",
    experience: [
      "Redesigned checkout flows and reduced mobile abandonment by 12%.",
      "Built a 45-component design system adopted across three product squads.",
      "Tested prototypes with 24 users and improved task completion from 68% to 84%.",
      "Partnered with engineers to resolve 16 accessibility issues before release.",
      "Facilitated design critiques and documented interaction standards."
    ],
    education: "Bachelor of Design, 2024"
  },
  {
    id: "design-medium",
    category: "design",
    tier: "medium",
    targetRole: "Junior Product Designer",
    summary: "Junior product designer experienced in interface design, prototyping, and user feedback.",
    skills: "Figma, wireframing, prototyping, usability testing, visual design",
    experience: [
      "Designed account settings screens for a responsive web application.",
      "Created interactive prototypes for two customer research studies.",
      "Documented reusable patterns for forms and navigation.",
      "Observed eight usability sessions and summarized findings.",
      "Worked with engineering to review implementation quality."
    ],
    education: "Bachelor of Communication Design, 2024"
  },
  {
    id: "design-weak",
    category: "design",
    tier: "weak",
    targetRole: "UI Designer",
    summary: "Creative designer who loves making beautiful experiences.",
    skills: "Figma, Adobe, creativity",
    experience: [
      "Responsible for making designs.",
      "Worked on app screens.",
      "Helped with user research.",
      "Participated in design meetings.",
      "Created graphics when needed."
    ],
    education: "Certificate in Graphic Design, 2024"
  },
  {
    id: "customer-success-strong",
    category: "customer-success",
    tier: "strong",
    targetRole: "Customer Success Manager",
    summary: "Customer success specialist with two years of experience improving onboarding, adoption, and renewals.",
    skills: "Gainsight, Salesforce, onboarding, adoption, renewals, customer education, account planning",
    experience: [
      "Managed 72 customer accounts with a 94% gross renewal rate.",
      "Created onboarding workshops that reduced time-to-value by 20%.",
      "Identified expansion opportunities contributing $180,000 in annual recurring revenue.",
      "Built health-score reviews that surfaced eight at-risk accounts before renewal.",
      "Partnered with product to prioritize five recurring customer needs."
    ],
    education: "Bachelor of Arts, Psychology, 2023"
  },
  {
    id: "customer-success-medium",
    category: "customer-success",
    tier: "medium",
    targetRole: "Customer Success Specialist",
    summary: "Customer success specialist supporting onboarding, product adoption, and account communication.",
    skills: "Zendesk, Salesforce, onboarding, customer communication, documentation",
    experience: [
      "Supported onboarding for 28 small-business customers.",
      "Hosted monthly product workshops and documented common questions.",
      "Maintained account notes and follow-up plans in Salesforce.",
      "Improved help-center article usage by 15% after reorganizing onboarding links.",
      "Shared recurring customer feedback with product managers."
    ],
    education: "Bachelor of Arts, Communications, 2024"
  },
  {
    id: "customer-success-weak",
    category: "customer-success",
    tier: "weak",
    targetRole: "Customer Success Associate",
    summary: "Friendly customer support associate interested in customer success.",
    skills: "Zendesk, communication, problem solving",
    experience: [
      "Responded to customer questions.",
      "Helped resolve product issues.",
      "Participated in team meetings.",
      "Responsible for updating documentation.",
      "Worked with different customers."
    ],
    education: "Bachelor of Arts, 2024"
  },
  {
    id: "cross-functional-strong",
    category: "cross-functional",
    tier: "strong",
    targetRole: "Business Analyst",
    summary: "Business analyst combining customer research, process analysis, and data reporting.",
    skills: "SQL, Excel, Tableau, requirements gathering, process mapping, stakeholder interviews",
    experience: [
      "Analyzed 18,000 service records and identified workflow changes that reduced delays by 17%.",
      "Led 14 stakeholder interviews and translated findings into prioritized requirements.",
      "Built Tableau dashboards used by seven managers for weekly planning.",
      "Mapped a 12-step process and removed three duplicate approval stages.",
      "Presented implementation options with cost, risk, and customer-impact tradeoffs."
    ],
    education: "Bachelor of Information Systems, 2023"
  },
  {
    id: "cross-functional-medium",
    category: "cross-functional",
    tier: "medium",
    targetRole: "Project Coordinator",
    summary: "Project coordinator supporting delivery planning, documentation, and stakeholder communication.",
    skills: "Jira, Excel, project scheduling, meeting facilitation, documentation",
    experience: [
      "Maintained delivery plans for three internal projects.",
      "Coordinated weekly meetings across four business functions.",
      "Tracked actions, risks, and decisions in Jira.",
      "Created a status template used for monthly leadership updates.",
      "Supported testing and launch-readiness activities."
    ],
    education: "Bachelor of Business Management, 2024"
  },
  {
    id: "cross-functional-weak",
    category: "cross-functional",
    tier: "weak",
    targetRole: "Entry-Level Professional",
    summary: "Flexible team player seeking a rewarding professional opportunity.",
    skills: "Teamwork, leadership, time management",
    experience: [
      "Responsible for many different tasks.",
      "Helped colleagues when needed.",
      "Worked on projects.",
      "Participated in meetings.",
      "Completed work on time."
    ],
    education: "Bachelor of General Studies, 2025"
  }
];

function renderResume(profile) {
  const sections = [
    `SYNTHETIC BENCHMARK CANDIDATE ${profile.id.toUpperCase()}`,
    "Personal contact details intentionally omitted for privacy.",
    "",
    "PROFESSIONAL SUMMARY",
    profile.summary,
    "",
    "EXPERIENCE",
    ...profile.experience.map((bullet) => `- ${bullet}`)
  ];

  if (profile.skills) sections.push("", "SKILLS", profile.skills);
  sections.push("", "EDUCATION", profile.education);
  return sections.join("\n");
}

export const benchmarkDatasetVersion = "1.0.0";
export const benchmarkDataset = profiles.map((profile) => ({
  ...profile,
  sourceType: "synthetic",
  containsPersonalData: false,
  privacyOmissions: ["name", "email", "phone", "address", "LinkedIn URL"],
  resumeText: renderResume(profile)
}));

