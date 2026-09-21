/**
 * English copy for the main sections. Kept separate from components so a
 * French version can be added as `content.fr.ts` and selected by locale.
 */
export const content = {
  hero: {
    eyebrow: "Nezha Soumer",
    roleLines: ["Junior Web Developer", "&", "QA Tester"],
    statement: ["I build digital experiences.", "Then I make sure they work."],
    support:
      "Junior Developer & QA Tester specialized in responsive web experiences, CMS integration, testing, SEO and production-ready interfaces.",
    primaryCta: "Explore my work",
    secondaryCta: "About me",
    scroll: "Scroll",
  },
  about: {
    eyebrow: "About",
    headline: ["I work on both sides of the product:", "building it and validating it."],
    paragraphs: [
      "I'm a Junior Developer and low-code web developer with about two years of experience creating, integrating, configuring, testing and deploying responsive websites, from custom Next.js builds to WordPress, WooCommerce and Zoho Sites.",
      "My QA background adds a second pair of eyes: I pay close attention to user journeys, integrations, responsive behaviour and production quality, because a page that looks right still has to work.",
    ],
    expertise: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "WordPress",
      "Elementor",
      "WooCommerce",
      "Zoho Sites",
      "Figma-to-Web",
      "API integrations",
      "SEO",
      "QA testing",
    ],
    cards: [
      {
        num: "01",
        tag: "BUILD",
        title: "Web Development",
        text: "Responsive interfaces in Next.js and React, CMS integrations, forms, APIs and SEO, shipped to production.",
        points: ["Next.js · React · TypeScript", "WordPress · Elementor · WooCommerce", "Figma-to-web"],
      },
      {
        num: "02",
        tag: "VERIFY",
        title: "Quality Assurance",
        text: "Functional, regression, API and performance testing, with clear bug reports and validated releases.",
        points: ["Jira · Cypress · Selenium · JMeter", "Negative & edge-case testing", "Power BI reporting"],
      },
    ],
  },
  projects: {
    eyebrow: "Selected work",
    headline: "Projects",
    intro: "Websites and platforms built, integrated or tested, from booking flows to e-commerce.",
  },
  qa: {
    eyebrow: "QA Lab",
    headline: ["Development", "meets Quality."],
    intro:
      "Testing is part of how I build. This is what a validation pass looks like, and the kind of work behind it.",
  },
  skills: {
    eyebrow: "Skills",
    headline: ["An ecosystem,", "not a logo wall."],
    intro: "Three phases, one workflow: develop it, test it, deploy it. Hover or focus a skill to read more.",
  },
  experience: {
    eyebrow: "Experience",
    headline: "Path",
  },
  contact: {
    eyebrow: "Contact",
    headline: ["Have something", "worth building?"],
    intro: "Let's build something that works beautifully. I'm happy to talk about roles, freelance projects or QA work.",
  },
} as const;
