const BASE_URL = "https://www.ebolamonitorapp.com";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Breadcrumb configurations for each pillar page
export const breadcrumbs = {
  home: [{ name: "Ebola Monitor", url: BASE_URL }],

  ebola101: [
    { name: "Ebola Monitor", url: BASE_URL },
    { name: "Ebola 101", url: `${BASE_URL}/ebola-101` },
  ],

  outbreakTimeline: [
    { name: "Ebola Monitor", url: BASE_URL },
    { name: "Outbreak Timeline", url: `${BASE_URL}/outbreak-timeline` },
  ],

  travelAdvisory: [
    { name: "Ebola Monitor", url: BASE_URL },
    { name: "Travel Advisory", url: `${BASE_URL}/travel-advisory` },
  ],

  caseReports: [
    { name: "Ebola Monitor", url: BASE_URL },
    { name: "Case Reports", url: `${BASE_URL}/case-reports` },
  ],

  faq: [
    { name: "Ebola Monitor", url: BASE_URL },
    { name: "FAQ", url: `${BASE_URL}/faq` },
  ],

  preventionGuide: [
    { name: "Ebola Monitor", url: BASE_URL },
    { name: "Prevention Guide", url: `${BASE_URL}/prevention-guide` },
  ],

  healthAuthorityGuidance: [
    { name: "Ebola Monitor", url: BASE_URL },
    { name: "Health Authority Guidance", url: `${BASE_URL}/health-authority-guidance` },
  ],
};
