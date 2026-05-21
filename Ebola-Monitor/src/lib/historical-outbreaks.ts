export interface HistoricalOutbreak {
  id: string;
  name: string;
  country: string;
  region: string;
  yearStart: number;
  yearEnd: number;
  strain: string;
  totalCases: number;
  totalDeaths: number;
  caseFatalityRate: number;
  summary: string;
  whoResponse: string;
  lat: number;
  lng: number;
}

export const HISTORICAL_OUTBREAKS: HistoricalOutbreak[] = [
  {
    id: "ebola-1976-yambuku",
    name: "Yambuku Outbreak",
    country: "Zaire (DRC)",
    region: "Mongala",
    yearStart: 1976,
    yearEnd: 1976,
    strain: "Zaire ebolavirus",
    totalCases: 318,
    totalDeaths: 280,
    caseFatalityRate: 88,
    summary:
      "The first recognized Ebola outbreak in history, centered on the Belgian-run Yambuku Mission Hospital in Zaire. The virus spread rapidly through the hospital via contaminated needles and was transmitted at funeral rites. 280 of 318 confirmed patients died, establishing Ebola's terrifying lethality.",
    whoResponse:
      "International alert. Belgian and WHO teams deployed. Led to identification and naming of the Ebola virus by Dr. Peter Piot and colleagues.",
    lat: 2.5,
    lng: 22.3,
  },
  {
    id: "ebola-1976-nzara",
    name: "Nzara Outbreak",
    country: "Sudan",
    region: "Western Equatoria",
    yearStart: 1976,
    yearEnd: 1976,
    strain: "Sudan ebolavirus",
    totalCases: 151,
    totalDeaths: 118,
    caseFatalityRate: 78,
    summary:
      "The first recognized Ebola outbreak in Sudan, centered in the town of Nzara. This outbreak led to the identification of a second species of Ebola virus, distinct from the Zaire strain found the same year in Yambuku.",
    whoResponse:
      "WHO and international response deployed. Contributed to the classification of Sudan ebolavirus as a separate species.",
    lat: 4.77,
    lng: 29.3,
  },
  {
    id: "ebola-1976-maridi",
    name: "Maridi Outbreak",
    country: "Sudan",
    region: "Western Equatoria",
    yearStart: 1976,
    yearEnd: 1976,
    strain: "Sudan ebolavirus",
    totalCases: 60,
    totalDeaths: 29,
    caseFatalityRate: 48,
    summary:
      "Part of the same Nzara/Maridi outbreak chain in Sudan. The virus spread from Nzara to Maridi through infected patients. The local hospital amplified transmission via contaminated equipment.",
    whoResponse:
      "International response team deployed. Maridi was the focus of epidemiological investigation by the WHO.",
    lat: 4.84,
    lng: 29.56,
  },
  {
    id: "ebola-1977-tandali",
    name: "Tandali Outbreak",
    country: "Zaire (DRC)",
    region: "Tandali",
    yearStart: 1977,
    yearEnd: 1977,
    strain: "Zaire ebolavirus",
    totalCases: 1,
    totalDeaths: 1,
    caseFatalityRate: 100,
    summary:
      "A sporadic, single-case outbreak in the Tandali region of Zaire. This isolated case occurred a year after the devastating Yambuku outbreak and was the only known case.",
    whoResponse:
      "Identified during retrospective investigation. No major international response required.",
    lat: 3.5,
    lng: 24.0,
  },
  {
    id: "ebola-1994-nyankunde",
    name: "Nyankunde Outbreak",
    country: "Zaire (DRC)",
    region: "Haut-Uélé",
    yearStart: 1994,
    yearEnd: 1995,
    strain: "Zaire ebolavirus",
    totalCases: 49,
    totalDeaths: 44,
    caseFatalityRate: 90,
    summary:
      "An outbreak in the gold-mining area of Nyankunde in northeastern Zaire, with a 90% case fatality rate. This was one of the earliest outbreaks recognized in the post-Yambuku era.",
    whoResponse:
      "WHO alerted. Limited international response due to regional instability.",
    lat: 2.8,
    lng: 28.9,
  },
  {
    id: "ebola-1995-kikwit",
    name: "Kikwit Outbreak",
    country: "Zaire (DRC)",
    region: "Bandundu",
    yearStart: 1995,
    yearEnd: 1995,
    strain: "Zaire ebolavirus",
    totalCases: 315,
    totalDeaths: 254,
    caseFatalityRate: 81,
    summary:
      "The largest Ebola outbreak at the time, centered in the city of Kikwit in western Zaire. This outbreak drew massive international attention and was a landmark event in Ebola history, demonstrating urban transmission and the challenges of containment in resource-limited settings.",
    whoResponse:
      "Major international response including WHO, CDC, and Médecins Sans Frontières. Teams deployed to implement strict infection control. Helped shape future outbreak response protocols.",
    lat: -4.81,
    lng: 18.86,
  },
  {
    id: "ebola-1996-gabon-mayibout",
    name: "Mayibout Outbreak",
    country: "Gabon",
    region: "Ogooué-Ivindo",
    yearStart: 1996,
    yearEnd: 1997,
    strain: "Zaire ebolavirus",
    totalCases: 62,
    totalDeaths: 93,
    caseFatalityRate: 100,
    summary:
      "An outbreak in Mayibout, Gabon, notable for primate-to-human transmission. Hunters found dead or dying gorillas and chimpanzees in the forest and butchered them for bushmeat, triggering a chain of human infections. More people died than were officially recorded as cases.",
    whoResponse:
      "WHO and CDC investigation teams deployed. Highlighted the wildlife-human interface as a source of Ebola spillover events.",
    lat: 0.78,
    lng: 12.3,
  },
  {
    id: "ebola-2000-2001-gulu",
    name: "Gulu Outbreak",
    country: "Uganda",
    region: "Northern Uganda",
    yearStart: 2000,
    yearEnd: 2001,
    strain: "Sudan ebolavirus",
    totalCases: 425,
    totalDeaths: 224,
    caseFatalityRate: 53,
    summary:
      "The first major Ebola outbreak in Uganda and the largest Sudan ebolavirus outbreak on record. It spread across the Gulu, Masindi, and Mbarara districts, affecting over 400 people. The outbreak lasted for several months and demonstrated the capacity for community-level spread.",
    whoResponse:
      "Major WHO and international response. Uganda's Ministry of Health led containment efforts with support from WHO and partners. Established a model for African-led outbreak response.",
    lat: 2.77,
    lng: 32.3,
  },
  {
    id: "ebola-2001-2002-boende",
    name: "Boende Outbreak",
    country: "DRC",
    region: "Tshuapa",
    yearStart: 2001,
    yearEnd: 2002,
    strain: "Zaire ebolavirus",
    totalCases: 59,
    totalDeaths: 44,
    caseFatalityRate: 75,
    summary:
      "An outbreak in the Boende health zone of the Equateur Province in DRC. The outbreak affected remote forest communities and was contained with limited international intervention.",
    whoResponse:
      "WHO alert and investigation. Contained primarily by DRC health authorities with WHO technical support.",
    lat: -1.8,
    lng: 19.2,
  },
  {
    id: "ebola-2002-2003-bonkola",
    name: "Bonkola/Mbomo Outbreak",
    country: "DRC",
    region: "Équateur",
    yearStart: 2002,
    yearEnd: 2003,
    strain: "Zaire ebolavirus",
    totalCases: 143,
    totalDeaths: 128,
    caseFatalityRate: 90,
    summary:
      "A devastating outbreak in the Bonkola and Mbomo areas of Équateur Province, DRC, with a case fatality rate of 90%. This outbreak occurred in remote forested areas and was one of the deadliest relative to its size.",
    whoResponse:
      "WHO and international response teams deployed. Reinforced the difficulty of response in remote, densely forested areas.",
    lat: -1.7,
    lng: 19.0,
  },
  {
    id: "ebola-2004-sudan-ango",
    name: "Ango District Outbreak",
    country: "Sudan",
    region: "Western Equatoria",
    yearStart: 2004,
    yearEnd: 2004,
    strain: "Sudan ebolavirus",
    totalCases: 17,
    totalDeaths: 7,
    caseFatalityRate: 41,
    summary:
      "A small outbreak in the Ango District of southern Sudan. This was one of the smallest recorded Ebola outbreaks and was contained relatively quickly.",
    whoResponse:
      "WHO investigation and limited international support. Contained with basic public health measures.",
    lat: 4.5,
    lng: 29.0,
  },
  {
    id: "ebola-2007-drc-kasai",
    name: "Kasai Occidental Outbreak",
    country: "DRC",
    region: "Kasaï-Occidental",
    yearStart: 2007,
    yearEnd: 2007,
    strain: "Zaire ebolavirus",
    totalCases: 264,
    totalDeaths: 187,
    caseFatalityRate: 71,
    summary:
      "A major outbreak in the Kasai Occidental Province of DRC, one of the largest outbreaks at the time. This outbreak led to the first identification of what would later be classified as the Bundibugyo ebolavirus strain in a related but distinct outbreak.",
    whoResponse:
      "Major WHO and CDC response. International teams deployed to support containment efforts. Important for advancing understanding of Ebola virus diversity.",
    lat: -5.0,
    lng: 21.0,
  },
  {
    id: "ebola-2007-2008-bundibugyo",
    name: "Bundibugyo Outbreak",
    country: "Uganda",
    region: "Bundibugyo District",
    yearStart: 2007,
    yearEnd: 2008,
    strain: "Bundibugyo ebolavirus",
    totalCases: 149,
    totalDeaths: 37,
    caseFatalityRate: 25,
    summary:
      "The first recognized outbreak of Bundibugyo ebolavirus, a newly identified species. Occurring in western Uganda near the DRC border, this outbreak had a lower case fatality rate than Zaire or Sudan strains but demonstrated the existence of additional Ebola virus species.",
    whoResponse:
      "WHO, CDC, and international research teams deployed. Led to the formal description of Bundibugyo ebolavirus as a new species.",
    lat: 0.5,
    lng: 30.0,
  },
  {
    id: "ebola-2008-2009-western-drc",
    name: "Western DRC Outbreak",
    country: "DRC",
    region: "Western DRC",
    yearStart: 2008,
    yearEnd: 2009,
    strain: "Zaire ebolavirus",
    totalCases: 32,
    totalDeaths: 15,
    caseFatalityRate: 47,
    summary:
      "A relatively small outbreak in western DRC, continuing the pattern of sporadic Ebola emergence in the region. Contained with standard public health interventions.",
    whoResponse:
      "WHO monitoring and limited international response. DRC Ministry of Health led containment.",
    lat: -4.5,
    lng: 19.5,
  },
  {
    id: "ebola-2012-drc-orientale",
    name: "Orientale Province Outbreak",
    country: "DRC",
    region: "Orientale",
    yearStart: 2012,
    yearEnd: 2012,
    strain: "Zaire ebolavirus",
    totalCases: 36,
    totalDeaths: 13,
    caseFatalityRate: 36,
    summary:
      "An outbreak in the Orientale Province of northeastern DRC. This was one of several outbreaks in the DRC during 2012 and was contained relatively quickly with a lower-than-usual fatality rate.",
    whoResponse:
      "WHO and international response teams deployed. Demonstrated improved capacity for rapid containment in DRC.",
    lat: 2.0,
    lng: 28.0,
  },
  {
    id: "ebola-2012-uganda-kibaale",
    name: "Kibaale Outbreak",
    country: "Uganda",
    region: "Kibaale District",
    yearStart: 2012,
    yearEnd: 2012,
    strain: "Sudan ebolavirus",
    totalCases: 11,
    totalDeaths: 4,
    caseFatalityRate: 36,
    summary:
      "A small outbreak in the Kibaale District of western Uganda. This was a relatively contained event with limited spread outside the initial cluster.",
    whoResponse:
      "WHO and CDC support. Uganda's established surveillance systems helped contain the outbreak rapidly.",
    lat: 0.75,
    lng: 31.4,
  },
  {
    id: "ebola-2014-2016-west-africa",
    name: "West Africa Epidemic",
    country: "Guinea, Sierra Leone, Liberia",
    region: "West Africa",
    yearStart: 2014,
    yearEnd: 2016,
    strain: "Zaire ebolavirus",
    totalCases: 28616,
    totalDeaths: 11310,
    caseFatalityRate: 40,
    summary:
      "The largest and most devastating Ebola outbreak in history. Beginning in December 2013 in the village of Méliandou, Guinea, the virus spread across Guinea, Sierra Leone, and Liberia, fueled by weak health systems, poverty, cultural practices involving burial rituals, and distrust of authorities. Over 28,600 people were infected and more than 11,300 died, making it the deadliest Ebola epidemic ever recorded. The WHO declared a Public Health Emergency of International Concern (PHEIC) in August 2014. A massive international response involving the WHO, CDC, MSF, the African Union, and military forces from multiple nations was mobilized. The rVSV-ZEBOV vaccine was tested in a landmark ring vaccination trial in Guinea in 2015, demonstrating 100% efficacy. The epidemic caused catastrophic economic damage estimated at over $32 billion across the affected nations, destabilized health systems, and reversed years of development gains. The outbreak was officially declared over in June 2016.",
    whoResponse:
      "WHO declared PHEIC in August 2014. Largest-ever international health emergency response. CDC deployed 3,000+ personnel. MSF treated thousands. UN Mission for Ebola Emergency Response (UNMEER) established. Military forces from US, UK, and others assisted. rVSV-ZEBOV vaccine ring vaccination trials conducted. Response cost exceeded $4 billion internationally.",
    lat: 8.5,
    lng: -11.5,
  },
  {
    id: "ebola-2014-mali",
    name: "Mali Outbreak",
    country: "Mali",
    region: "Bamako",
    yearStart: 2014,
    yearEnd: 2014,
    strain: "Zaire ebolavirus",
    totalCases: 8,
    totalDeaths: 6,
    caseFatalityRate: 75,
    summary:
      "An imported case from Guinea triggered a small outbreak in Mali. A Guinean man traveled to Bamako, the capital, and infected several contacts including healthcare workers before dying. The outbreak was contained relatively quickly.",
    whoResponse:
      "WHO and CDC support. Mali's Ministry of Health led rapid response. Contained through contact tracing and isolation.",
    lat: 12.65,
    lng: -8.0,
  },
  {
    id: "ebola-2014-nigeria",
    name: "Nigeria Outbreak",
    country: "Nigeria",
    region: "Lagos",
    yearStart: 2014,
    yearEnd: 2014,
    strain: "Zaire ebolavirus",
    totalCases: 20,
    totalDeaths: 8,
    caseFatalityRate: 40,
    summary:
      "An imported case from Liberia triggered a small but alarming outbreak in Lagos, Africa's most populous city. A Liberian-American diplomat collapsed at Lagos airport. Nigeria's rapid response, including aggressive contact tracing and quarantine, was praised internationally and the outbreak was contained in under three months.",
    whoResponse:
      "WHO and CDC rapid response teams deployed. Nigeria's containment was hailed as a model for stopping imported cases. The outbreak raised concerns about spread to major urban centers.",
    lat: 6.52,
    lng: 3.38,
  },
  {
    id: "ebola-2014-2015-senegal",
    name: "Senegal Case",
    country: "Senegal",
    region: "Dakar",
    yearStart: 2014,
    yearEnd: 2015,
    strain: "Zaire ebolavirus",
    totalCases: 1,
    totalDeaths: 0,
    caseFatalityRate: 0,
    summary:
      "A single imported case in Senegal, a Guinean student who traveled to Dakar. No secondary infections occurred. Senegal's health authorities isolated the patient quickly and conducted thorough contact tracing.",
    whoResponse:
      "WHO monitoring. Senegal's public health system successfully prevented any further spread.",
    lat: 14.69,
    lng: -17.44,
  },
  {
    id: "ebola-2014-spain",
    name: "Spain Case",
    country: "Spain",
    region: "Madrid",
    yearStart: 2014,
    yearEnd: 2014,
    strain: "Zaire ebolavirus",
    totalCases: 1,
    totalDeaths: 0,
    caseFatalityRate: 0,
    summary:
      "A Spanish healthcare worker who had been caring for repatriated Ebola patients in Madrid tested positive for Ebola. She was treated and recovered. The case raised alarm about infection risk to healthcare workers in non-endemic countries.",
    whoResponse:
      "Spanish health authorities managed the case with WHO guidance. Highlighted the need for rigorous PPE protocols in hospitals treating Ebola patients.",
    lat: 40.42,
    lng: -3.7,
  },
  {
    id: "ebola-2014-uk",
    name: "United Kingdom Case",
    country: "United Kingdom",
    region: "London",
    yearStart: 2014,
    yearEnd: 2014,
    strain: "Zaire ebolavirus",
    totalCases: 1,
    totalDeaths: 0,
    caseFatalityRate: 0,
    summary:
      "A healthcare worker who had been volunteering in West Africa was evacuated to London for treatment after testing positive for Ebola. The patient recovered at the Royal Free Hospital's specialized high-level isolation unit.",
    whoResponse:
      "NHS and Public Health England managed the case. The UK had pre-positioned isolation capabilities for exactly this scenario.",
    lat: 51.51,
    lng: -0.13,
  },
  {
    id: "ebola-2014-us",
    name: "United States Cases",
    country: "United States",
    region: "Texas",
    yearStart: 2014,
    yearEnd: 2014,
    strain: "Zaire ebolavirus",
    totalCases: 4,
    totalDeaths: 1,
    caseFatalityRate: 25,
    summary:
      "A Liberian man traveled to Dallas, Texas and was admitted to hospital but initially sent home, sparking massive public outcry. He returned and was diagnosed with Ebola, becoming the first case diagnosed on US soil. He died. Two nurses who cared for him were subsequently infected but recovered. The cases exposed gaps in US hospital preparedness.",
    whoResponse:
      "CDC deployed teams to Dallas. The cases triggered national debate about travel bans, hospital preparedness, and screening protocols. CDC updated guidelines for healthcare facilities.",
    lat: 32.78,
    lng: -96.8,
  },
  {
    id: "ebola-2017-likati",
    name: "Likati Outbreak",
    country: "DRC",
    region: "Likati",
    yearStart: 2017,
    yearEnd: 2017,
    strain: "Zaire ebolavirus",
    totalCases: 8,
    totalDeaths: 4,
    caseFatalityRate: 50,
    summary:
      "A small, quickly contained outbreak in the Likati health zone of northern DRC. This was the eighth Ebola outbreak in the DRC and was contained before spreading widely, thanks to rapid response and existing surveillance infrastructure.",
    whoResponse:
      "WHO and DRC Ministry of Health response. The quick containment demonstrated improved outbreak detection and response capacity.",
    lat: 3.0,
    lng: 28.5,
  },
  {
    id: "ebola-2018-2020-north-kivu",
    name: "North Kivu/Ituri Epidemic",
    country: "DRC",
    region: "North Kivu and Ituri",
    yearStart: 2018,
    yearEnd: 2020,
    strain: "Zaire ebolavirus",
    totalCases: 3481,
    totalDeaths: 2299,
    caseFatalityRate: 66,
    summary:
      "The second-largest Ebola outbreak in history, centered in the conflict-ridden provinces of North Kivu and Ituri in eastern DRC. This outbreak presented unprecedented challenges due to active armed conflict, community distrust, attacks on health workers, and a mobile population crossing international borders with Uganda. The WHO declared it a PHEIC in July 2019. The rVSV-ZEBOV vaccine was deployed on a large scale, with nearly 300,000 people vaccinated. Despite the vaccine and international response, the outbreak lasted over 18 months due to security challenges and community resistance. It was finally declared over in June 2020.",
    whoResponse:
      "WHO declared PHEIC in July 2019. Over 299,000 people vaccinated with rVSV-ZEBOV. Multiple international organizations responded. Security challenges hampered response. Attacks on health facilities and workers were a significant problem. Total international response cost exceeded $500 million.",
    lat: 1.5,
    lng: 29.0,
  },
  {
    id: "ebola-2020-equateur",
    name: "Équateur Province Outbreak",
    country: "DRC",
    region: "Équateur",
    yearStart: 2020,
    yearEnd: 2020,
    strain: "Zaire ebolavirus",
    totalCases: 130,
    totalDeaths: 55,
    caseFatalityRate: 42,
    summary:
      "A separate Ebola outbreak in Équateur Province, western DRC, occurring concurrently with the North Kivu epidemic. This outbreak was geographically distinct and was contained more effectively, likely due to the absence of active conflict and the experience gained from the ongoing response in the east.",
    whoResponse:
      "WHO and DRC Ministry of Health response. rVSV-ZEBOV vaccine deployed. Contained through rapid response and established surveillance systems.",
    lat: -1.5,
    lng: 19.0,
  },
  {
    id: "ebola-2021-guinea",
    name: "Guinea Outbreak",
    country: "Guinea",
    region: "Nzérékoré",
    yearStart: 2021,
    yearEnd: 2021,
    strain: "Zaire ebolavirus",
    totalCases: 16,
    totalDeaths: 12,
    caseFatalityRate: 75,
    summary:
      "The first Ebola outbreak in West Africa since the 2014-2016 epidemic, centered in the Nzérékoré region of southeastern Guinea. The outbreak was contained in just three months through rapid response, contact tracing, and vaccination. It served as a critical test of the region's improved preparedness since the devastating 2014-2016 epidemic.",
    whoResponse:
      "WHO and international partners deployed quickly. rVSV-ZEBOV vaccine used for ring vaccination. Guinea's improved surveillance systems, built after 2014, helped contain the outbreak rapidly.",
    lat: 7.75,
    lng: -8.8,
  },
  {
    id: "ebola-2022-drc-mbandaka",
    name: "Mbandaka Outbreak",
    country: "DRC",
    region: "Équateur",
    yearStart: 2022,
    yearEnd: 2022,
    strain: "Zaire ebolavirus",
    totalCases: 11,
    totalDeaths: 9,
    caseFatalityRate: 82,
    summary:
      "An urban Ebola outbreak in Mbandaka, the capital of Équateur Province. This was notable for occurring in an urban setting rather than a remote forest area, presenting different challenges for containment. The outbreak was declared over in July 2022 after a rapid response.",
    whoResponse:
      "WHO and DRC health authorities responded rapidly. rVSV-ZEBOV vaccine deployed. Urban setting required adapted contact tracing and community engagement strategies.",
    lat: -0.06,
    lng: 18.26,
  },
  {
    id: "ebola-2022-uganda-kampala",
    name: "Kampala/Uganda Outbreak",
    country: "Uganda",
    region: "Central Uganda",
    yearStart: 2022,
    yearEnd: 2023,
    strain: "Sudan ebolavirus",
    totalCases: 164,
    totalDeaths: 77,
    caseFatalityRate: 47,
    summary:
      "The first Sudan ebolavirus outbreak in Uganda since 2012, centered in the central region including Kampala. The outbreak spread across multiple districts and reached the capital city, prompting a national response. The WHO declared a PHEIC in September 2022. This was the largest Sudan ebolavirus outbreak since the 2000-2001 Gulu epidemic.",
    whoResponse:
      "WHO declared PHEIC in September 2022. Uganda's Ministry of Health led the response with international support. No approved vaccine existed for Sudan ebolavirus, complicating the response. Trial vaccines were considered for deployment.",
    lat: 0.35,
    lng: 32.58,
  },
  {
    id: "ebola-2023-2024-drc-sporadic",
    name: "DRC Sporadic Cases",
    country: "DRC",
    region: "Various",
    yearStart: 2023,
    yearEnd: 2024,
    strain: "Zaire ebolavirus",
    totalCases: 12,
    totalDeaths: 6,
    caseFatalityRate: 50,
    summary:
      "Sporadic Ebola cases reported across multiple provinces of the DRC in 2023-2024, representing the ongoing endemic threat of the virus in the region. Each cluster was contained quickly through established surveillance and response mechanisms.",
    whoResponse:
      "WHO monitoring and support. DRC's surveillance and rapid response teams contained each cluster. Demonstrated the ongoing nature of Ebola threat in the region.",
    lat: -2.5,
    lng: 23.5,
  },
  {
    id: "ebola-2026-current",
    name: "2026 West/Central Africa Outbreak",
    country: "West/Central Africa",
    region: "West/Central Africa",
    yearStart: 2026,
    yearEnd: 2026,
    strain: "Zaire ebolavirus",
    totalCases: 0,
    totalDeaths: 0,
    caseFatalityRate: 0,
    summary:
      "The current Ebola outbreak being monitored by this tracker. Case counts and death tolls are updated in real-time from official health authority reports.",
    whoResponse:
      "Ongoing monitoring and response. Data populated from live feeds and official health authority reports.",
    lat: 0.0,
    lng: 0.0,
  },
];

export function getAllTimeStats(outbreaks: HistoricalOutbreak[]): {
  totalCases: number;
  totalDeaths: number;
  totalOutbreaks: number;
  averageCFR: number;
  countriesAffected: number;
  deadliestOutbreak: string;
} {
  const totalCases = outbreaks.reduce((sum, o) => sum + o.totalCases, 0);
  const totalDeaths = outbreaks.reduce((sum, o) => sum + o.totalDeaths, 0);
  const totalOutbreaks = outbreaks.length;
  const averageCFR =
    totalCases > 0 ? Math.round((totalDeaths / totalCases) * 1000) / 10 : 0;

  const countriesSet = new Set<string>();
  outbreaks.forEach((o) => {
    o.country.split(",").forEach((c) => countriesSet.add(c.trim()));
  });

  const deadliest = outbreaks.reduce((max, o) =>
    o.totalDeaths > max.totalDeaths ? o : max
  );

  return {
    totalCases,
    totalDeaths,
    totalOutbreaks,
    averageCFR,
    countriesAffected: countriesSet.size,
    deadliestOutbreak: deadliest.name,
  };
}
