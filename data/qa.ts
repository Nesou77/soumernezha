import type { QATest } from "@/types";

/** Rows of the simulated test suite. */
export const testSuite: QATest[] = [
  { name: "UI Rendering", detail: "components, layout, states" },
  { name: "Forms Validation", detail: "positive & negative paths" },
  { name: "Responsive Design", detail: "375 → 1920px" },
  { name: "API Integration", detail: "requests, payloads, errors" },
  { name: "Accessibility", detail: "keyboard, contrast, semantics" },
  { name: "Performance", detail: "load & response times" },
];

/** Steps animated by the RUN TESTS button. */
export const runnerSteps: string[] = [
  "Components",
  "Navigation",
  "Forms",
  "API",
  "Responsive",
  "Accessibility",
];

export const testingTypes: string[] = [
  "Manual functional testing",
  "Regression testing",
  "Negative testing",
  "Integration testing",
  "API testing",
  "Performance testing",
  "Load testing",
  "UI/UX validation",
  "AI feature validation",
];

export const qaTools: string[] = ["Jira", "Cypress", "Selenium", "JMeter", "Power BI", "Excel"];

/** Slugs of the QA case studies featured in the lab (see data/projects.ts). */
export const qaProjectSlugs: string[] = ["remedia", "researchguide", "the-foodeshow"];
