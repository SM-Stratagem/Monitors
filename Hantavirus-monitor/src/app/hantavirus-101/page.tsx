"use client";

import { generateBreadcrumbSchema, breadcrumbs } from "@/lib/breadcrumb-schema";

export default function HantavirusGuide101Page() {
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs.hantavirus101);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Hantavirus 101 — Complete Guide to Hantavirus Biology, Transmission & Strains",
    description:
      "Comprehensive guide to hantavirus biology, transmission routes, clinical features, and all known strains.",
    datePublished: "2026-05-10",
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "SM Stratagem",
      url: "https://www.hantavirusmonitorapp.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Hantavirus Outbreak Tracker",
    },
    image: {
      "@type": "ImageObject",
      url: "https://www.hantavirusmonitorapp.com/opengraph-image",
    },
  };

  return (
    <main className="pillar-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <article className="content-wrapper">
        <h1>Hantavirus 101: Complete Guide to Biology, Transmission & Strains</h1>

        <div className="toc">
          <h2>Table of Contents</h2>
          <ul>
            <li>
              <a href="#what-is-hantavirus">What is Hantavirus?</a>
            </li>
            <li>
              <a href="#biology">Biology and Virology</a>
            </li>
            <li>
              <a href="#transmission">How Hantavirus Spreads</a>
            </li>
            <li>
              <a href="#strains">Major Hantavirus Strains</a>
            </li>
            <li>
              <a href="#clinical">Clinical Manifestations</a>
            </li>
            <li>
              <a href="#prevention">Prevention & Safety</a>
            </li>
          </ul>
        </div>

        <section id="what-is-hantavirus">
          <h2>What is Hantavirus?</h2>
          <p>
            Hantavirus is a family of viruses belonging to the genus <em>Orthohantavirus</em> in the family
            Bunyaviridae. These viruses cause severe and potentially fatal diseases in humans. According to the CDC,
            hantaviruses have a global distribution and pose significant public health threats.
          </p>
          <p>
            The virus was first identified in 1976 during an outbreak near the Hantan River in Korea. Since then, over
            24 different hantavirus species have been identified worldwide, each associated with specific rodent
            reservoirs.
          </p>
        </section>

        <section id="biology">
          <h2>Biology and Virology</h2>
          <h3>Viral Structure</h3>
          <p>Hantaviruses are enveloped RNA viruses with three segmented negative-sense genomes:</p>
          <ul>
            <li>
              <strong>Large (L) segment:</strong> Encodes the RNA-dependent RNA polymerase (RdRp)
            </li>
            <li>
              <strong>Medium (M) segment:</strong> Encodes envelope glycoproteins (Gn and Gc)
            </li>
            <li>
              <strong>Small (S) segment:</strong> Encodes nucleocapsid protein (N)
            </li>
          </ul>

          <h3>Replication Cycle</h3>
          <p>
            Hantaviruses primarily infect endothelial cells and macrophages. The virus enters cells through receptor-mediated endocytosis, with the integrin α<sub>v</sub>β<sub>3</sub> being a known entry receptor. Viral replication occurs in the cytoplasm, and infected cells produce both infectious virions and non-infectious particles.
          </p>

          <h3>Pathophysiology</h3>
          <p>
            Hantavirus infection causes a dysregulation of vascular permeability through both viral and immune-mediated mechanisms. This leads to fluid extravasation and the characteristic hemorrhagic manifestations observed in severe cases. The immune response, particularly involving CD8+ T cells, is both protective and pathogenic.
          </p>
        </section>

        <section id="transmission">
          <h2>How Hantavirus Spreads</h2>

          <h3>Primary Transmission Route: Rodent Contact</h3>
          <p>
            Hantaviruses are maintained in nature by rodent species. Humans become infected through contact with infected rodent urine, feces, or saliva. Common exposure scenarios include:
          </p>
          <ul>
            <li>Inhalation of aerosolized virus from contaminated rodent droppings (most common)</li>
            <li>Direct contact with infected rodent tissue or bodily fluids</li>
            <li>Rarely, bite wounds from infected rodents</li>
          </ul>

          <p>
            <strong>Human-to-Human Transmission:</strong> Most hantaviruses do not spread between humans. However, the Andes virus is notable for its capacity for human-to-human transmission, particularly through respiratory droplets. This makes the 2026 MV Hondius outbreak caused by Andes virus particularly significant from an epidemiological perspective.
          </p>

          <h3>High-Risk Activities</h3>
          <ul>
            <li>Cleaning or disinfecting rodent-infested areas without proper protective equipment</li>
            <li>Camping or hiking in rodent-inhabited regions</li>
            <li>Working in agriculture or forestry in endemic areas</li>
            <li>Close contact with infected individuals (Andes virus only)</li>
          </ul>
        </section>

        <section id="strains">
          <h2>Major Hantavirus Strains</h2>

          <h3>1. Andes Virus (ANDV)</h3>
          <p>
            <strong>Geographic Distribution:</strong> Argentina, Chile, and other South American countries
          </p>
          <p>
            <strong>Rodent Reservoir:</strong> Sigmodon hispidus (cotton rat)
          </p>
          <p>
            <strong>Clinical Disease:</strong> Hantavirus Pulmonary Syndrome (HPS)
          </p>
          <p>
            <strong>Mortality Rate:</strong> 20-40% in confirmed cases
          </p>
          <p>
            <strong>Significance:</strong> Andes virus is the only hantavirus capable of sustained human-to-human transmission. This property makes it the cause of the 2026 MV Hondius outbreak currently being tracked on this dashboard.
          </p>

          <h3>2. Sin Nombre Virus (SNV)</h3>
          <p>
            <strong>Geographic Distribution:</strong> North America (USA, Canada, Mexico)
          </p>
          <p>
            <strong>Rodent Reservoir:</strong> Deer mouse (Peromyscus maniculatus)
          </p>
          <p>
            <strong>Clinical Disease:</strong> Hantavirus Pulmonary Syndrome (HPS)
          </p>
          <p>
            <strong>Mortality Rate:</strong> 30-40% in confirmed cases
          </p>
          <p>
            <strong>Historical Note:</strong> Caused the 1993 Four Corners outbreak that led to the identification of hantavirus as a human pathogen in North America.
          </p>

          <h3>3. Hantaan Virus (HTNV)</h3>
          <p>
            <strong>Geographic Distribution:</strong> Eastern Asia (Korea, China, Russia)
          </p>
          <p>
            <strong>Rodent Reservoir:</strong> Striped field mouse (Apodemus agrarius)
          </p>
          <p>
            <strong>Clinical Disease:</strong> Hemorrhagic Fever with Renal Syndrome (HFRS)
          </p>
          <p>
            <strong>Mortality Rate:</strong> 5-15% in confirmed cases
          </p>
          <p>
            <strong>Clinical Features:</strong> Kidney involvement is prominent; pulmonary involvement is rare.
          </p>

          <h3>4. Puumala Virus (PUUV)</h3>
          <p>
            <strong>Geographic Distribution:</strong> Europe (Scandinavia, Russia, Balkans)
          </p>
          <p>
            <strong>Rodent Reservoir:</strong> Bank vole (Myodes glareolus)
          </p>
          <p>
            <strong>Clinical Disease:</strong> Nephropathia Epidemica (NE) — a mild form of HFRS
          </p>
          <p>
            <strong>Mortality Rate:</strong> &lt; 1% in confirmed cases
          </p>
          <p>
            <strong>Clinical Features:</strong> Renal involvement without severe hemorrhagic complications.
          </p>

          <h3>Comparison Table</h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Virus</th>
                  <th>Primary Rodent</th>
                  <th>Geographic Range</th>
                  <th>Disease</th>
                  <th>Mortality</th>
                  <th>H2H Transmission</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Andes (ANDV)</td>
                  <td>Cotton rat</td>
                  <td>South America</td>
                  <td>HPS</td>
                  <td>20-40%</td>
                  <td>✓ Yes</td>
                </tr>
                <tr>
                  <td>Sin Nombre (SNV)</td>
                  <td>Deer mouse</td>
                  <td>North America</td>
                  <td>HPS</td>
                  <td>30-40%</td>
                  <td>✗ No</td>
                </tr>
                <tr>
                  <td>Hantaan (HTNV)</td>
                  <td>Field mouse</td>
                  <td>East Asia</td>
                  <td>HFRS</td>
                  <td>5-15%</td>
                  <td>✗ No</td>
                </tr>
                <tr>
                  <td>Puumala (PUUV)</td>
                  <td>Bank vole</td>
                  <td>Europe</td>
                  <td>NE (mild HFRS)</td>
                  <td>&lt; 1%</td>
                  <td>✗ No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="clinical">
          <h2>Clinical Manifestations</h2>

          <h3>Hantavirus Pulmonary Syndrome (HPS)</h3>
          <p>
            <strong>Incubation Period:</strong> 1-5 weeks (range: 5 days to 6 weeks)
          </p>

          <h4>Prodromal Phase (3-4 days)</h4>
          <ul>
            <li>Fever, myalgia, headache</li>
            <li>Malaise, nausea, abdominal pain</li>
            <li>Cough, dyspnea (late prodrome)</li>
          </ul>

          <h4>Cardiopulmonary Phase</h4>
          <ul>
            <li>Acute pulmonary edema</li>
            <li>Severe respiratory distress</li>
            <li>Hypotension, shock</li>
            <li>Cardiac dysrhythmias (myocarditis)</li>
            <li>Death may occur within 24-48 hours of onset</li>
          </ul>

          <p>
            <strong>Mortality:</strong> 20-40% of hospitalized patients (varies by strain and access to supportive care)
          </p>

          <h3>Hemorrhagic Fever with Renal Syndrome (HFRS)</h3>
          <p>
            <strong>Incubation Period:</strong> 1-2 weeks
          </p>

          <h4>Five Phases of HFRS</h4>
          <ol>
            <li>
              <strong>Febrile Phase:</strong> High fever, headache, abdominal pain (3-7 days)
            </li>
            <li>
              <strong>Hypotensive Phase:</strong> Sudden drop in blood pressure, shock (1-3 days)
            </li>
            <li>
              <strong>Oliguric Phase:</strong> Renal failure, elevated creatinine, electrolyte abnormalities (3-7 days)
            </li>
            <li>
              <strong>Polyuric Phase:</strong> Massive urine output, recovery of renal function (variable duration)
            </li>
            <li>
              <strong>Recovery Phase:</strong> Gradual normalization of function (weeks to months)
            </li>
          </ol>

          <p>
            <strong>Mortality:</strong> 5-15% in Hantaan virus; &lt;1% in Puumala virus
          </p>
        </section>

        <section id="prevention">
          <h2>Prevention & Safety Strategies</h2>

          <h3>Individual Protection Measures</h3>
          <ul>
            <li>
              <strong>Avoid Rodent Contact:</strong> Do not handle or touch wild rodents
            </li>
            <li>
              <strong>Protective Equipment:</strong> Wear N95 respirators and gloves when cleaning rodent-infested areas
            </li>
            <li>
              <strong>Proper Disinfection:</strong> Use 10% bleach solutions when cleaning contaminated surfaces
            </li>
            <li>
              <strong>Seal Gaps:</strong> Seal openings larger than 1/4 inch in homes to prevent rodent entry
            </li>
            <li>
              <strong>Safe Food Storage:</strong> Store food in rodent-proof containers
            </li>
          </ul>

          <h3>Public Health Measures (for Human-to-Human Cases)</h3>
          <ul>
            <li>Respiratory isolation for suspected/confirmed cases (critical for Andes virus)</li>
            <li>Standard precautions for all care settings</li>
            <li>Contact tracing for close contacts of confirmed cases</li>
            <li>Quarantine protocols for exposed individuals</li>
          </ul>

          <h3>Vaccine & Treatment Status</h3>
          <p>
            <strong>Vaccines:</strong> Several inactivated and live-attenuated vaccines exist in some countries (Asia), but no FDA-approved vaccine is available in North America or most Western countries.
          </p>
          <p>
            <strong>Treatment:</strong> No specific antiviral therapy is available. Management is supportive, including mechanical ventilation, vasopressor support, and renal dialysis as needed. Early intensive care intervention significantly improves outcomes.
          </p>
        </section>

        <section className="related-pages">
          <h2>Related Pages in This Topic Cluster</h2>
          <ul>
            <li>
              <a href="/outbreak-timeline">2026 Hantavirus Outbreak Timeline</a> — Day-by-day breakdown of the MV
              Hondius incident
            </li>
            <li>
              <a href="/travel-advisory">Travel Advisory & Flight Tracking</a> — Geographic risk assessment and exposure
              routes
            </li>
            <li>
              <a href="/case-reports">Case Reports & Statistics</a> — Confirmed cases, demographics, outcomes
            </li>
            <li>
              <a href="/faq">Frequently Asked Questions</a> — Common questions answered with citations
            </li>
            <li>
              <a href="/prevention-guide">Prevention & Treatment Guide</a> — Evidence-based protective measures
            </li>
            <li>
              <a href="/health-authority-guidance">Official Health Authority Guidance</a> — WHO, CDC, ECDC statements
            </li>
          </ul>
        </section>

        <section className="sources">
          <h2>Sources</h2>
          <ul>
            <li>
              <a href="https://www.cdc.gov/hantavirus/" target="_blank" rel="noopener">
                CDC Hantavirus Information
              </a>
            </li>
            <li>
              <a href="https://www.who.int/" target="_blank" rel="noopener">
                World Health Organization (WHO)
              </a>
            </li>
            <li>
              <a href="https://www.ecdc.europa.eu/" target="_blank" rel="noopener">
                European Centre for Disease Prevention and Control (ECDC)
              </a>
            </li>
            <li>
              <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3323089/" target="_blank" rel="noopener">
                &ldquo;Hantaviruses&rdquo; — Critical Reviews in Microbiology
              </a>
            </li>
          </ul>
        </section>
      </article>

      <style jsx>{`
        .pillar-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          background: linear-gradient(135deg, #0a1628 0%, #1a2744 100%);
          color: #e0e0e0;
          line-height: 1.8;
        }

        article h1 {
          font-size: 2.5rem;
          margin: 2rem 0 1rem;
          color: #00ff41;
          text-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
        }

        article h2 {
          font-size: 1.8rem;
          margin: 2rem 0 1rem;
          color: #00d4ff;
          border-left: 4px solid #00d4ff;
          padding-left: 1rem;
        }

        article h3 {
          font-size: 1.3rem;
          margin: 1.5rem 0 0.5rem;
          color: #ffd700;
        }

        article h4 {
          font-size: 1.1rem;
          margin: 1rem 0 0.5rem;
          color: #ff9900;
        }

        article p,
        article ul,
        article ol {
          margin: 1rem 0;
          font-size: 1rem;
        }

        article ul li,
        article ol li {
          margin: 0.5rem 0;
        }

        article a {
          color: #00d4ff;
          text-decoration: none;
          border-bottom: 1px solid #00d4ff;
          transition: color 0.2s;
        }

        article a:hover {
          color: #00ff41;
          border-bottom-color: #00ff41;
        }

        .toc {
          background: rgba(0, 212, 255, 0.05);
          border-left: 4px solid #00d4ff;
          padding: 1.5rem;
          margin: 2rem 0;
          border-radius: 4px;
        }

        .toc h2 {
          margin-top: 0;
          color: #00d4ff;
          border: none;
          padding: 0;
        }

        .toc ul {
          list-style: none;
          padding: 0;
        }

        .toc li {
          margin: 0.5rem 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid #444;
        }

        th,
        td {
          padding: 1rem;
          text-align: left;
          border: 1px solid #444;
        }

        th {
          background: rgba(0, 212, 255, 0.1);
          color: #00d4ff;
          font-weight: 600;
        }

        td {
          background: rgba(0, 0, 0, 0.2);
        }

        .table-responsive {
          overflow-x: auto;
        }

        .related-pages,
        .sources {
          background: rgba(0, 255, 65, 0.05);
          border-left: 4px solid #00ff41;
          padding: 1.5rem;
          margin: 2rem 0;
          border-radius: 4px;
        }

        .related-pages h2,
        .sources h2 {
          color: #00ff41;
          border-left-color: #00ff41;
        }

        @media (max-width: 768px) {
          article h1 {
            font-size: 1.8rem;
          }

          article h2 {
            font-size: 1.4rem;
          }

          .pillar-page {
            padding: 1rem;
          }
        }
      `}</style>
    </main>
  );
}
