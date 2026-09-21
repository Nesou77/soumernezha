import type { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    id: "develop",
    label: "Develop",
    phase: "develop",
    blurb: "Modern front-end and form logic.",
    skills: [
      { name: "Next.js", description: "App Router, API routes, static generation and Vercel deployment." },
      { name: "React", description: "Component-driven interfaces and state management." },
      { name: "TypeScript", description: "Typed components and safe data contracts." },
      { name: "HTML", description: "Semantic, accessible markup." },
      { name: "CSS", description: "Responsive layouts and custom styling." },
      { name: "Tailwind CSS", description: "Utility-first design systems." },
      { name: "React Hook Form", description: "Performant multi-step forms." },
      { name: "Zod", description: "Schema validation shared between client and server." },
    ],
  },
  {
    id: "cms",
    label: "CMS / Low-code",
    phase: "develop",
    blurb: "Fast, maintainable builds.",
    skills: [
      { name: "WordPress", description: "Sites and blogs the team can manage." },
      { name: "Elementor", description: "Figma-to-page integration with custom CSS." },
      { name: "WooCommerce", description: "Catalogues, categories and product pages." },
      { name: "Zoho Sites", description: "Low-code builds extended with custom HTML/CSS." },
      { name: "Custom CSS", description: "Going beyond builder defaults." },
    ],
  },
  {
    id: "design",
    label: "Design",
    phase: "develop",
    blurb: "From design file to browser.",
    skills: [
      { name: "Figma", description: "Reading specs and reproducing designs faithfully." },
      { name: "Responsive Design", description: "Layouts that hold from phone to large desktop." },
      { name: "UI Integration", description: "Turning components and tokens into working interfaces." },
    ],
  },
  {
    id: "qa",
    label: "QA",
    phase: "test",
    blurb: "Breaking things before users do.",
    skills: [
      { name: "Cypress", description: "End-to-end browser test automation." },
      { name: "Selenium", description: "Cross-browser UI automation." },
      { name: "JMeter", description: "Load and performance testing." },
      { name: "Jira", description: "Bug tracking and test reporting." },
      { name: "Functional Testing", description: "Scenario-based verification of user journeys." },
      { name: "Regression Testing", description: "Making sure fixes don't break what worked." },
      { name: "API Testing", description: "Validating requests, payloads and error handling." },
    ],
  },
  {
    id: "data",
    label: "Data",
    phase: "test",
    blurb: "Measuring what matters.",
    skills: [
      { name: "Power BI", description: "Dashboards for test and project reporting." },
      { name: "Excel", description: "Pivot tables and test data." },
      { name: "Python", description: "Data analysis and scraping fundamentals." },
      { name: "SQL", description: "Querying and validating data." },
      { name: "Jupyter", description: "Exploratory analysis notebooks." },
    ],
  },
  {
    id: "deploy",
    label: "Deploy / Marketing tech",
    phase: "deploy",
    blurb: "Shipping and being found.",
    skills: [
      { name: "GitHub", description: "Version control and collaboration." },
      { name: "Vercel", description: "Continuous deployment for Next.js." },
      { name: "Google Analytics", description: "Traffic and behaviour measurement." },
      { name: "Google Tag Manager", description: "Tag and event management." },
      { name: "Search Console", description: "Indexing and search performance monitoring." },
      { name: "SEO", description: "Metadata, structured data and technical SEO." },
      { name: "Rank Math", description: "On-page SEO for WordPress." },
    ],
  },
];

export const phases = [
  { id: "develop", label: "DEVELOP" },
  { id: "test", label: "TEST" },
  { id: "deploy", label: "DEPLOY" },
] as const;
