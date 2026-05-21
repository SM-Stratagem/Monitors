"use client";

import { generateBreadcrumbSchema, breadcrumbs } from "@/lib/breadcrumb-schema";

export default function EbolaGuide101Page() {
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs.ebola101);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Ebola 101 — Complete Guide to Ebola Virus Disease Biology, Transmission & Strains",
    description:
      "Comprehensive guide to Ebola virus disease (EVD) biology, transmission routes, clinical features, and all known strains.",
    datePublished: "2026-05-10",
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "SM Stratagem",
      url: "https://www.ebolamonitorapp.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Ebola Outbreak Tracker",
    },
    image: {
      "@type": "ImageObject",
      url: "https://www.ebolamonitorapp.com/opengraph-image",
    },
  };

  return (
    <main className="pillar-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <article className="content-wrapper">
        <h1>Ebola 101: Complete Guide to Biology, Transmission & Strains</h1>

        <div className="toc">
          <h2>Table of Contents</h2>
          <ul>
            <li>
              <a href="#what-is-ebola">What is Ebola?</a>
            </li>
            <li>
              <a href="#biology">Biology and Virology</a>
            </li>
            <li>
              <a href="#transmission">How Ebola Spreads</a>
            </li>
            <li>
              <a href="#strains">Major Ebola Virus Species</a>
            </li>
            <li>
              <a href="#clinical">Clinical Manifestations</a>
            </li>
            <li>
              <a href="#prevention">Prevention & Safety</a>
            </li>
          </ul>
        </div>

        <section id="what-is-ebola">
          <h2>What is Ebola?</h2>
          <p>
            Ebola virus disease (EVD) is a rare and deadly infectious disease caused by the Ebola virus, a member of the
            family Filoviridae. According to the CDC, Ebola virus was first discovered in 1976 near the Ebola River in
            what is now the Democratic Republic of the Congo.
          </p>
          <p>
            Since its discovery, multiple outbreaks have occurred across sub-Saharan Africa. Five species of Ebola virus
            have been identified, with Zaire ebolavirus being the most lethal and the cause of the majority of outbreaks.
          </p>
        </section>

        <section id="biology">
          <h2>Biology and Virology</h2>
          <h3>Viral Structure</h3>
          <p>Ebola viruses are enveloped, single-stranded, negative-sense RNA viruses with a characteristic filamentous shape:</p>
          <ul>
            <li>
              <strong>Nucleoprotein (NP):</strong> Encapsidates the viral RNA genome
            </li>
            <li>
              <strong>Viral proteins (VP35, VP40):</strong> VP35 is the polymerase cofactor; VP40 drives viral budding
            </li>
            <li>
              <strong>Glycoprotein (GP):</strong> Mediates entry into host cells via macropinocytosis
            </li>
            <li>
              <strong>RNA-dependent RNA polymerase (L):</strong> Replicates and transcribes the viral genome
            </li>
          </ul>

          <h3>Replication Cycle</h3>
          <p>
            Ebola virus enters host cells primarily through macropinocytosis and receptor-mediated endocytosis. The glycoprotein (GP) binds to host cell surface receptors including NPC1 (Niemann-Pick C1) within endosomes. Viral replication occurs in the cytoplasm, and new virions bud from the cell surface.
          </p>

          <h3>Pathophysiology</h3>
          <p>
            Ebola virus infection causes a massive immune dysregulation, including a "cytokine storm" that damages the endothelial lining of blood vessels. This leads to increased vascular permeability, internal and external bleeding, and multi-organ failure. The virus also infects and impairs dendritic cells and macrophages, crippling the adaptive immune response.
          </p>
        </section>

        <section id="transmission">
          <h2>How Ebola Spreads</h2>

          <h3>Primary Transmission Route: Human Contact</h3>
          <p>
            Ebola virus is transmitted through direct contact with the blood, secretions, organs, or other bodily fluids of infected individuals. Key transmission routes include:
          </p>
          <ul>
            <li>Direct contact with blood or bodily fluids of symptomatic patients (most common)</li>
            <li>Contact with contaminated surfaces, bedding, or medical equipment (fomites)</li>
            <li>Sexual transmission from recovering patients (virus can persist in semen for months)</li>
            <li>Traditional burial practices involving direct contact with the deceased</li>
          </ul>

          <p>
            <strong>Animal Reservoir:</strong> Fruit bats (Pteropodidae family) are considered the natural reservoir of Ebola virus. Humans can become infected through contact with infected bats or other wildlife (primates, duikers). Once a human is infected, secondary transmission can occur through human-to-human contact.
          </p>

          <h3>High-Risk Activities</h3>
          <ul>
            <li>Caring for Ebola patients without proper personal protective equipment (PPE)</li>
            <li>Participating in traditional burial practices involving the body of an Ebola victim</li>
            <li>Contact with fruit bats or non-human primates in endemic areas</li>
            <li>Healthcare work in outbreak settings without adequate infection control</li>
          </ul>
        </section>

        <section id="strains">
          <h2>Major Ebola Virus Species</h2>

          <h3>1. Zaire ebolavirus (EBOV)</h3>
          <p>
            <strong>Geographic Distribution:</strong> Democratic Republic of the Congo, Republic of the Congo, Gabon, and other Central/West African countries
          </p>
          <p>
            <strong>Reservoir:</strong> Fruit bats (Pteropodidae family)
          </p>
          <p>
            <strong>Clinical Disease:</strong> Ebola Hemorrhagic Fever (EHF)
          </p>
          <p>
            <strong>Mortality Rate:</strong> Up to 90% in outbreaks without supportive care; ~50% with treatment
          </p>
          <p>
            <strong>Significance:</strong> Responsible for the majority of outbreaks, including the 2014-2016 West Africa epidemic (28,000+ cases) and the largest outbreak to date.
          </p>

          <h3>2. Sudan ebolavirus (SUDV)</h3>
          <p>
            <strong>Geographic Distribution:</strong> Uganda, Sudan, South Sudan, Democratic Republic of the Congo
          </p>
          <p>
            <strong>Reservoir:</strong> Fruit bats (suspected)
          </p>
          <p>
            <strong>Clinical Disease:</strong> Ebola Hemorrhagic Fever (EHF)
          </p>
          <p>
            <strong>Mortality Rate:</strong> 40-60% in confirmed cases
          </p>
          <p>
            <strong>Historical Note:</strong> First identified in southern Sudan in 1976. No approved vaccine specifically for SUDV, though cross-reactive vaccines are being evaluated.
          </p>

          <h3>3. Bundibugyo ebolavirus (BDBV)</h3>
          <p>
            <strong>Geographic Distribution:</strong> Uganda (Bundibugyo District)
          </p>
          <p>
            <strong>Reservoir:</strong> Fruit bats (suspected)
          </p>
          <p>
            <strong>Clinical Disease:</strong> Ebola Hemorrhagic Fever (EHF)
          </p>
          <p>
            <strong>Mortality Rate:</strong> 25-40% in confirmed cases
          </p>
          <p>
            <strong>Clinical Features:</strong> Identified in 2007-2008 outbreak in Uganda; generally lower mortality than Zaire species.
          </p>

          <h3>4. Taï Forest ebolavirus (TAFV)</h3>
          <p>
            <strong>Geographic Distribution:</strong> Côte d'Ivoire
          </p>
          <p>
            <strong>Reservoir:</strong> Fruit bats (suspected)
          </p>
          <p>
            <strong>Clinical Disease:</strong> Limited human cases (one known)
          </p>
          <p>
            <strong>Mortality Rate:</strong> Low (single human case recovered)
          </p>
          <p>
            <strong>Clinical Features:</strong> First identified in 1994 after a dead chimpanzee was found in Taï Forest; only one known human case.
          </p>

          <h3>5. Reston ebolavirus (RESTV)</h3>
          <p>
            <strong>Geographic Distribution:</strong> Philippines, United States (imported)
          </p>
          <p>
            <strong>Reservoir:</strong> Fruit bats; also causes outbreaks in domestic pigs
          </p>
          <p>
            <strong>Clinical Disease:</strong> Non-pathogenic in humans
          </p>
          <p>
            <strong>Mortality Rate:</strong> 0% in humans (fatal in non-human primates)
          </p>
          <p>
            <strong>Clinical Features:</strong> Discovered in laboratory monkeys imported from the Philippines to Reston, Virginia in 1989. Causes no illness in humans but is lethal to primates.
          </p>

          <h3>Comparison Table</h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Species</th>
                  <th>Reservoir</th>
                  <th>Geographic Range</th>
                  <th>Disease</th>
                  <th>Mortality</th>
                  <th>H2H Transmission</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Zaire (EBOV)</td>
                  <td>Fruit bats</td>
                  <td>Central/West Africa</td>
                  <td>EHF</td>
                  <td>Up to 90%</td>
                  <td>✓ Efficient</td>
                </tr>
                <tr>
                  <td>Sudan (SUDV)</td>
                  <td>Fruit bats</td>
                  <td>East/Central Africa</td>
                  <td>EHF</td>
                  <td>40-60%</td>
                  <td>✓ Possible</td>
                </tr>
                <tr>
                  <td>Bundibugyo (BDBV)</td>
                  <td>Fruit bats</td>
                  <td>Uganda</td>
                  <td>EHF</td>
                  <td>25-40%</td>
                  <td>✓ Possible</td>
                </tr>
                <tr>
                  <td>Taï Forest (TAFV)</td>
                  <td>Fruit bats</td>
                  <td>Côte d'Ivoire</td>
                  <td>Limited</td>
                  <td>Low</td>
                  <td>✗ Not confirmed</td>
                </tr>
                <tr>
                  <td>Reston (RESTV)</td>
                  <td>Fruit bats/pigs</td>
                  <td>Philippines/USA</td>
                  <td>None (humans)</td>
                  <td>0% (humans)</td>
                  <td>✗ Not in humans</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="clinical">
          <h2>Clinical Manifestations</h2>

          <h3>Ebola Hemorrhagic Fever (EHF)</h3>
          <p>
            <strong>Incubation Period:</strong> 2-21 days (typically 8-10 days)
          </p>

          <h4>Early Phase (Days 1-3)</h4>
          <ul>
            <li>Sudden onset of fever, fatigue, and malaise</li>
            <li>Muscle pain (myalgia) and headache</li>
            <li>Sore throat and abdominal pain</li>
          </ul>

          <h4>Progressive Phase (Days 4-7)</h4>
          <ul>
            <li>Persistent high fever</li>
            <li>Vomiting and diarrhea (often severe)</li>
            <li>Rash (maculopapular)</li>
            <li>Impaired kidney and liver function</li>
          </ul>

          <h4>Severe/Hemorrhagic Phase (Days 7-14+)</h4>
          <ul>
            <li>Internal and external bleeding (gums, nose, bloody stools)</li>
            <li>Multi-organ failure</li>
            <li>Shock and death (if untreated)</li>
            <li>Recovery: Survivors develop antibodies 2-4 weeks after symptom onset</li>
          </ul>

          <p>
            <strong>Mortality:</strong> 25-90% depending on strain, access to supportive care, and quality of care (average ~50%)
          </p>

          <h3>Long-Term Sequelae in Survivors</h3>
          <p>
            <strong>Incubation Period:</strong> Recovery can take weeks to months
          </p>

          <h4>Post-Ebola Syndrome (PES)</h4>
          <ol>
            <li>
              <strong>Joint pain:</strong> Chronic arthralgia affecting multiple joints
            </li>
            <li>
              <strong>Ocular problems:</strong> Uveitis, vision changes, potentially permanent eye damage
            </li>
            <li>
              <strong>Neurological issues:</strong> Headaches, fatigue, memory problems
            </li>
            <li>
              <strong>Persistent viral shedding:</strong> Virus can persist in semen (up to 12 months), breast milk, and other fluids
            </li>
            <li>
              <strong>Pregnancy complications:</strong> High risk of fetal loss and maternal death
            </li>
          </ol>

          <p>
            <strong>Long-term outcome:</strong> Many survivors experience debilitating sequelae that significantly impact quality of life for months to years after recovery.
          </p>
        </section>

        <section id="prevention">
          <h2>Prevention & Safety Strategies</h2>

          <h3>Individual Protection Measures</h3>
          <ul>
            <li>
              <strong>Avoid Contact with Infected Individuals:</strong> Do not touch patients or their bodily fluids
            </li>
            <li>
              <strong>Personal Protective Equipment:</strong> Wear full PPE (gowns, gloves, face shields, masks) when caring for Ebola patients
            </li>
            <li>
              <strong>Proper Disinfection:</strong> Use approved disinfectants; Ebola virus can be killed by bleach, UV light, and heat (60°C for 60 minutes)
            </li>
            <li>
              <strong>Safe Burial Practices:</strong> Avoid traditional burial practices that involve contact with the deceased
            </li>
            <li>
              <strong>Avoid Bushmeat:</strong> Do not handle or consume non-human primates or fruit bats in endemic areas
            </li>
          </ul>

          <h3>Public Health Measures</h3>
          <ul>
            <li>Isolation of suspected and confirmed Ebola patients in dedicated treatment centers</li>
            <li>Contact tracing and monitoring of all close contacts for 21 days</li>
            <li>Vaccination of contacts and contacts-of-contacts (ring vaccination strategy)</li>
            <li>Safe and dignified burial practices</li>
            <li>Community engagement and risk communication</li>
          </ul>

          <h3>Vaccine & Treatment Status</h3>
          <p>
            <strong>Vaccine:</strong> rVSV-ZEBOV (Ervebo) — an FDA-approved live-attenuated vaccine for Zaire ebolavirus. Administered as a single dose for pre-exposure prophylaxis in outbreak settings. Also approved: Ad26.ZEBOV/MVA-BN-Filo (Zabdeno/Mvabea) two-dose regimen.
          </p>
          <p>
            <strong>Treatment:</strong> Inmazeb (atoltivimab/maftivimab/odesivimab) — the first FDA-approved treatment for Zaire ebolavirus infection (2020). Additionally, Ebanga (ansuvimab) — a monoclonal antibody approved for treatment. Supportive care (IV fluids, electrolyte management) remains critical for survival.
          </p>
        </section>

        <section className="related-pages">
          <h2>Related Pages in This Topic Cluster</h2>
          <ul>
            <li>
              <a href="/outbreak-timeline">Ebola Outbreak Timeline</a> — Day-by-day breakdown of the current EVD
              response
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
              <a href="https://www.cdc.gov/ebola/" target="_blank" rel="noopener">
                CDC Ebola Information
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
              <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7120673/" target="_blank" rel="noopener">
                &ldquo;Ebola Virus Disease&rdquo; — NEJM Review
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
