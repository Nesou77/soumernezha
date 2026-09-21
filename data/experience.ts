import type { EducationEntry, TimelineEntry } from "@/types";

export const experience: TimelineEntry[] = [
  {
    company: "Monark IT / Hoverswitch",
    role: "Junior Developer & QA Tester",
    period: "November 2024 — Present",
    location: "Marrakech, Morocco",
    summary:
      "Creating, integrating, configuring, testing and deploying responsive websites, and testing web platforms, across tourism, insurance, private security, e-commerce, gaming, hospitality, technology, education and B2B.",
    tags: ["Web Development", "Low-Code", "Responsive Design", "CMS", "SEO", "QA"],
    highlight: true,
  },
  {
    company: "Assurances Salhi / Allianz",
    role: "Insurance Manager",
    period: "October 2023 — October 2024",
  },
  {
    company: "EMAK Distribution",
    role: "Administrative Assistant",
    period: "September 2021 — January 2023",
  },
  {
    company: "Secret Agri",
    role: "Administrative internship",
    period: "August — September 2020",
  },
];

export const education: EducationEntry[] = [
  {
    title: "Licence — Data Science applied to Management & Economics",
    school: "FSJES Marrakech, Cadi Ayyad University",
    period: "2022 — 2023",
  },
  {
    title: "DUT — Sales Techniques and Customer Service",
    school: "EST Oujda",
    period: "2019 — 2021",
  },
  {
    title: "Baccalaureate — Economics and Management Sciences",
    school: "Lycée Technique de Chichaoua",
    period: "2017 — 2018",
  },
];

export const certification = {
  title: "365 Data Science",
  topics: ["Python", "SQL", "Jupyter", "Power BI", "Excel Pivot Tables", "Web Scraping", "API Fundamentals"],
};
