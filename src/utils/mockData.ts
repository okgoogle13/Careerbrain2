import { CareerDatabase, EntryType } from '../../types';

export const mockCareerData: CareerDatabase = {
  Personal_Information: {
    FullName: "Alex Rivera",
    Phone: "+1 (555) 123-4567",
    Email: "alex.rivera@example.com",
    Location: "San Francisco, CA",
    Portfolio_Website_URLs: ["https://github.com/arivera", "https://linkedin.com/in/arivera"]
  },
  Career_Profile: {
    Target_Titles: ["Senior Frontend Engineer", "Full Stack Developer", "UI Engineer"],
    Master_Summary_Points: [
      "Product-minded software engineer with 6+ years of experience building scalable web applications.",
      "Expertise in React, TypeScript, and modern frontend architecture.",
      "Proven track record of mentoring junior developers and leading cross-functional projects."
    ],
    Job_Preferences: {
      Target_Roles: ["Senior Frontend Engineer", "Frontend Tech Lead"],
      Preferred_Locations: ["San Francisco, CA", "Remote"],
      Work_Type: "Hybrid",
      Relocation_Open: false
    }
  },
  Master_Skills_Inventory: [
    { Skill_Name: "React", Category: "Frontend", Subtype: ["Library"], Proficiency: "Expert", Years_Experience: 6 },
    { Skill_Name: "TypeScript", Category: "Language", Subtype: ["Strong Typing"], Proficiency: "Expert", Years_Experience: 5 },
    { Skill_Name: "Node.js", Category: "Backend", Subtype: ["Runtime"], Proficiency: "Proficient", Years_Experience: 4 },
    { Skill_Name: "GraphQL", Category: "API", Subtype: ["Query Language"], Proficiency: "Competent", Years_Experience: 2 },
    { Skill_Name: "Tailwind CSS", Category: "Styling", Subtype: ["Utility-first"], Proficiency: "Expert", Years_Experience: 3 },
    { Skill_Name: "Agile/Scrum", Category: "Methodology", Subtype: ["Process"], Proficiency: "Proficient", Years_Experience: 6 }
  ],
  Career_Entries: [
    {
      Entry_ID: "work-1",
      Entry_Type: EntryType.WORK_EXPERIENCE,
      Organization: "TechFlow Solutions",
      Role: "Senior Frontend Engineer",
      StartDate: "2021-03",
      EndDate: "Present",
      Location: "San Francisco, CA",
      Core_Responsibilities_Scope: "Lead frontend development for the core enterprise SaaS product, managing a team of 3 engineers.",
      Subtype_Tags: ["SaaS", "Enterprise", "Leadership"]
    },
    {
      Entry_ID: "work-2",
      Entry_Type: EntryType.WORK_EXPERIENCE,
      Organization: "InnovateTech",
      Role: "Software Engineer",
      StartDate: "2018-06",
      EndDate: "2021-02",
      Location: "Austin, TX",
      Core_Responsibilities_Scope: "Developed and maintained multiple client-facing React applications.",
      Subtype_Tags: ["Agency", "Client-facing"]
    },
    {
      Entry_ID: "edu-1",
      Entry_Type: EntryType.EDUCATION,
      Organization: "University of Texas at Austin",
      Role: "B.S. Computer Science",
      StartDate: "2014-08",
      EndDate: "2018-05",
      Location: "Austin, TX",
      Core_Responsibilities_Scope: "Graduated with Honors. Coursework focused on software engineering and human-computer interaction.",
      Subtype_Tags: ["Degree", "Computer Science"]
    }
  ],
  Structured_Achievements: [
    {
      Achievement_ID: "ach-1",
      Entry_ID: "work-1",
      Original_Text: "I made the app load much faster by fixing the bundle size.",
      Action_Verb: "Optimized",
      Noun_Task: "application load time",
      Metric: "by 40%",
      Strategy: "implementing code splitting and lazy loading in React",
      Outcome: "improving user retention and core web vitals",
      Skills_Used: ["React", "Webpack", "Performance Optimization"],
      Tools_Used: ["Lighthouse"],
      Subtype_Tags: ["Performance", "Frontend"],
      Needs_Review_Flag: false
    },
    {
      Achievement_ID: "ach-2",
      Entry_ID: "work-1",
      Original_Text: "Led a team to build a new dashboard.",
      Action_Verb: "Spearheaded",
      Noun_Task: "development of a real-time analytics dashboard",
      Metric: "used by 10,000+ daily active users",
      Strategy: "utilizing React, TypeScript, and WebSockets",
      Outcome: "increasing customer engagement by 25%",
      Skills_Used: ["React", "TypeScript", "WebSockets", "Leadership"],
      Tools_Used: ["Jira", "Figma"],
      Subtype_Tags: ["Leadership", "Product Launch"],
      Needs_Review_Flag: false
    },
    {
      Achievement_ID: "ach-3",
      Entry_ID: "work-2",
      Original_Text: "Migrated the old codebase to React.",
      Action_Verb: "Migrated",
      Noun_Task: "legacy jQuery application",
      Metric: "reducing bug reports by 30%",
      Strategy: "to a modern React/Redux architecture",
      Outcome: "accelerating feature delivery cycles",
      Skills_Used: ["React", "Redux", "jQuery", "Refactoring"],
      Tools_Used: ["Git"],
      Subtype_Tags: ["Migration", "Refactoring"],
      Needs_Review_Flag: false
    }
  ],
  KSC_Responses: []
};
