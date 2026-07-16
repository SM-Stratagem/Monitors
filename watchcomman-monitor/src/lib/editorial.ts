// Original editorial content for Watchcomman Monitor.
//
// This module exists to give the templated topic pages (categories, regions) and
// the publisher pages real, human-written prose instead of nothing but live widgets.
// Everything here is written specifically for this site — it is the "added value"
// layer on top of the aggregated feeds. Keep it accurate, keep it original.

export type CategoryArticle = {
  /** One-line summary used under the H1. */
  summary: string;
  /** 2–4 original paragraphs explaining the category. */
  body: string[];
  /** Concrete things a reader should watch for in this feed. */
  watchFor: string[];
  /** Plain-language note on where these signals come from. */
  sourcing: string;
};

export const CATEGORY_EDITORIAL: Record<string, CategoryArticle> = {
  outbreak: {
    summary:
      "Confirmed and suspected infectious-disease outbreaks — from filoviruses to cholera — tracked from first public report through official confirmation.",
    body: [
      "An outbreak signal marks a place and moment where an infectious disease is spreading beyond its expected baseline. We treat the earliest credible report as the start of a watch, then upgrade or retire it as official bodies confirm case counts, identify the pathogen, and issue guidance. The goal is to show the shape of an event as it develops, not to wait for a final situation report weeks later.",
      "Not every outbreak is an emergency. Most localised clusters are contained quickly by routine public-health response, and our severity weighting reflects that: a handful of suspected cases in a well-resourced setting is a low signal, while sustained human-to-human transmission of a high-fatality pathogen in a fragile health system is flagged critical. Reading the trend line matters more than reading any single day — a flat 21-day curve usually means an event is under control even if the raw count looks alarming.",
      "This category is where our sibling disease monitors feed directly into the atlas. Ebola virus disease and hantavirus pulmonary syndrome each have their own deep tracker; here they appear alongside outbreaks surfaced by the World Health Organization and humanitarian reporting so you can see them in one continuous view rather than in isolation.",
    ],
    watchFor: [
      "A suspected cluster upgrading to a laboratory-confirmed outbreak.",
      "Case counts accelerating rather than plateauing over a 7–21 day window.",
      "Outbreaks in areas with weak health infrastructure or active conflict, where response is slower.",
      "Cross-border spread, which changes an event from a local to a regional concern.",
    ],
    sourcing:
      "WHO Disease Outbreak News, ReliefWeb humanitarian reporting, and our dedicated Ebola and Hantavirus monitors, normalised into a common shape.",
  },
  advisory: {
    summary:
      "Official advisories, alerts, and guidance issued by health ministries, disaster agencies, and international bodies.",
    body: [
      "Advisories are the formal instructions that follow an event: a travel notice, a boil-water order, a vaccination campaign, an evacuation recommendation. On their own they are dry documents scattered across dozens of government portals. Collected here, they become a single stream that tells you not just that something is happening, but what the responsible authority is asking people to do about it.",
      "We keep advisories distinct from the raw event that triggered them because the two move on different clocks. An earthquake is over in seconds; the advisories about aftershocks, damaged infrastructure, and shelter can run for weeks. Tracking the advisory stream separately lets you follow an event's second life — the response — long after the original signal has cooled.",
      "Severity here reflects the scope and urgency of the instruction rather than the underlying hazard. A precautionary notice covering a wide area may matter more to more people than an acute alert affecting a single facility.",
    ],
    watchFor: [
      "Escalation from an advisory (guidance) to a directive (mandatory action).",
      "Advisories that widen their geographic scope over time.",
      "Conflicting guidance from different authorities covering the same area.",
    ],
    sourcing:
      "National and international agency notices carried through ReliefWeb, GDACS, and WHO channels.",
  },
  logistics: {
    summary:
      "Supply, movement, and response-capacity signals — the plumbing that determines whether help arrives in time.",
    body: [
      "Logistics signals cover the parts of an emergency that rarely make headlines but decide the outcome: cold-chain capacity for vaccines, airfield and port access, fuel and staffing for a response, corridor closures that reroute aid. When a health or disaster event is unfolding, the logistics layer is often the difference between a contained incident and a spiralling crisis.",
      "We surface these as context around the hazard categories rather than as events in their own right. A disease outbreak next to a functioning airport and a stocked cold chain reads very differently from the same outbreak in a landlocked area with a single seasonal road. Putting the two side by side is the point of an aggregation surface.",
      "Because logistics reporting is fragmented and often indirect, this is one of the sparser categories. Treat it as supporting evidence — a reason a nearby event may be harder or easier to resolve — rather than as a primary alert.",
    ],
    watchFor: [
      "Corridor, port, or airfield closures near an active event.",
      "Cold-chain or medical-supply constraints during an outbreak.",
      "Fuel and staffing shortfalls that slow an ongoing response.",
    ],
    sourcing:
      "Humanitarian logistics reporting via ReliefWeb (OCHA) and response-capacity notes in agency situation reports.",
  },
  environment: {
    summary:
      "Environmental pressure signals — the slow-moving conditions that raise or lower the risk of a hazard.",
    body: [
      "Environmental signals track the background conditions that make acute events more or less likely: drought and heat that dry out fuel before a fire season, rainfall anomalies that precede floods, rodent-population indicators that precede hantavirus clusters, air- and water-quality shifts. They are the leading indicators — the reason a region can look calm one week and combustible the next.",
      "This category rewards patience. A single environment signal rarely means anything on its own; the value is in the accumulation. A month of rainfall anomalies plus a heat advisory plus a vector-population note is a very different picture from any one of those alone, and reading them together is exactly what a monitoring surface is for.",
      "We keep environmental context deliberately close to the hazard categories it feeds. When you open a region and see environmental pressure building underneath a quiet disaster count, that is the signal to pay attention before the acute events arrive.",
    ],
    watchFor: [
      "Sustained heat and drought heading into a wildfire season.",
      "Rainfall anomalies upstream of flood-prone basins.",
      "Ecological indicators — vector or rodent populations — ahead of disease clusters.",
    ],
    sourcing:
      "NASA EONET Earth-observation events, seasonal environmental reporting, and ecological indicators referenced by the disease monitors.",
  },
  earthquake: {
    summary:
      "Significant seismic events (roughly magnitude 4.5 and above) sourced from USGS, with severity weighted by magnitude, depth, and exposure.",
    body: [
      "Earthquake signals are among the most objective in the atlas: seismic networks detect and locate events within minutes, and the raw parameters — magnitude, depth, coordinates — are unambiguous. What a monitoring surface adds is judgement about which of the many daily earthquakes actually matter. A magnitude-6 event ten kilometres under a dense city is a different story from the same magnitude two hundred kilometres offshore at depth.",
      "Our severity weighting combines the reported magnitude with depth and how populated the surrounding area is. Shallow, strong, and near people is what pushes a signal toward critical; deep or remote pulls it back down even at high magnitude. This is why the ranking here will sometimes disagree with a raw magnitude sort — and that disagreement is the added value.",
      "Aftershock sequences are worth watching as a set rather than as isolated points. A strong main shock followed by a decaying series of aftershocks is normal; a swarm that fails to decay, or a second event larger than the first, is the pattern that warrants closer attention.",
    ],
    watchFor: [
      "Shallow, strong events beneath or near populated areas.",
      "Aftershock sequences that fail to decay over days.",
      "Coastal or undersea quakes with tsunami potential.",
    ],
    sourcing:
      "USGS Earthquake Hazards Program real-time feed, magnitude ≥ 4.5, refreshed continuously.",
  },
  wildfire: {
    summary:
      "Active wildfire and thermal-anomaly events detected from orbit, tracked through their growth and containment.",
    body: [
      "Wildfire signals mark where large fires are burning now, drawn from satellite thermal detection rather than after-the-fact reporting. That gives an early, global view — fires in remote or under-reported areas show up here at roughly the same time as those near cities. The trade-off is that raw detections need interpretation: a brief thermal anomaly is not the same as an established, spreading fire.",
      "The signals that matter are the persistent ones — thermal detections that recur in the same area over successive passes, indicating a fire that is established rather than a transient hotspot. When you pair a growing wildfire signal with the environmental category's heat and drought indicators for the same region, you get a genuine risk picture rather than a single alarming dot.",
      "Severity rises with proximity to people and infrastructure and with how long a fire persists. A large fire in unpopulated wildland is an ecological event; the same fire at the edge of a town is an emergency, and the weighting reflects that difference.",
    ],
    watchFor: [
      "Persistent thermal detections that indicate an established, spreading fire.",
      "Fires advancing toward populated areas or critical infrastructure.",
      "Clusters of ignitions during heat-and-drought conditions.",
    ],
    sourcing:
      "NASA EONET wildfire events, built on satellite thermal-anomaly detection.",
  },
  storm: {
    summary:
      "Tropical cyclones and severe storm systems, from formation through landfall and dissipation.",
    body: [
      "Storm signals follow major weather systems — tropical cyclones, hurricanes, typhoons, and severe storm complexes — across their whole life cycle. Unlike an earthquake, a storm is a forecastable event: it is often visible days before it makes landfall, which makes the trend and track more informative than any single reading. The value of tracking storms in a monitoring surface is seeing them in the same frame as the floods, disasters, and advisories they generate.",
      "A storm rarely arrives alone. A landfalling cyclone typically spawns flood signals, humanitarian-disaster declarations, and a wave of advisories in the following days. Watching those categories light up in sequence around a single storm is one of the clearest demonstrations of why aggregation beats monitoring each feed separately.",
      "Severity tracks intensity and, crucially, exposure. A powerful storm that stays at sea is a low signal; a moderate one crossing a densely populated, low-lying coast can be catastrophic. The atlas weights toward the second.",
    ],
    watchFor: [
      "Intensifying systems on a track toward populated coastlines.",
      "The cascade of flood and disaster signals that follows landfall.",
      "Slow-moving storms, which dump far more rain over one area.",
    ],
    sourcing:
      "NASA EONET severe-storm events and GDACS tropical-cyclone alerts.",
  },
  flood: {
    summary:
      "Riverine, flash, and coastal flooding events, tracked alongside the rainfall and storm conditions that drive them.",
    body: [
      "Flood signals mark where water is doing damage — river basins over their banks, flash flooding after intense rainfall, storm surge along coasts. Floods are the most common and among the most destructive natural hazards worldwide, and they are also among the most connected: nearly every flood signal has a cause in the storm or environment categories a day or two earlier.",
      "Because floods develop over hours to days, the sequence is readable in a way that sudden events are not. Rainfall anomalies in the environment feed, then a storm signal, then floods downstream, then disaster declarations — that chain, visible in one atlas, is more useful than any single flood report. It tells you not just what happened but why, and often what is coming next downstream.",
      "Severity reflects the population and infrastructure in the affected area and the persistence of the flooding. Slow-onset river floods can inundate huge areas for weeks; flash floods are briefer but far more lethal per event. Both are weighted by who is in the way.",
    ],
    watchFor: [
      "Flooding downstream of basins that have taken sustained heavy rainfall.",
      "Flash-flood conditions in steep or urban terrain after intense storms.",
      "Coastal flooding coinciding with storm surge and high tides.",
    ],
    sourcing:
      "NASA EONET flood events, GDACS flood alerts, and humanitarian reporting via ReliefWeb.",
  },
  disaster: {
    summary:
      "Declared humanitarian disasters and multi-hazard emergencies — the category where events graduate into formal response.",
    body: [
      "A disaster signal is what an event becomes when it crosses the threshold into a coordinated humanitarian response: a formal declaration, an international appeal, a mobilisation of relief. Where the other categories track individual hazards, this one tracks the consequence — the point at which an earthquake, storm, outbreak, or conflict is large enough that the formal humanitarian system engages.",
      "These are the highest-context signals in the atlas. A disaster declaration usually sits on top of a chain of earlier signals — the storm that caused it, the floods that followed, the advisories that preceded the declaration — and reading it in that context tells you far more than the declaration alone. This is deliberately the category with the most editorial weight because it represents human impact that has already been officially recognised.",
      "Severity here is anchored to the scale of the declared response and the number of people affected. A national emergency covering millions ranks above a localised declaration, and multi-hazard situations — a flood inside a conflict zone, an outbreak during a drought — are weighted up because compounding hazards are consistently harder to resolve.",
    ],
    watchFor: [
      "New or escalating humanitarian declarations and international appeals.",
      "Compound emergencies where two or more hazards overlap in one area.",
      "Slow-onset disasters — drought, displacement — that build without a single triggering event.",
    ],
    sourcing:
      "ReliefWeb (OCHA) humanitarian disaster reporting and GDACS multi-hazard alerts.",
  },
};

// Short, genuinely distinct notes per region so region pages carry unique prose
// rather than a shared template.
export const REGION_EDITORIAL: Record<string, string> = {
  Europe:
    "Europe combines dense population with strong reporting infrastructure, so signals here skew toward well-documented storms, floods, and public-health advisories. The value is less in early detection — reporting is fast — and more in seeing cross-border events, from flooding along shared river basins to advisories that move between neighbouring states.",
  Asia:
    "Asia spans the most seismically and meteorologically active zones on Earth, from the Pacific typhoon belt to major fault systems. Expect a high baseline volume of earthquakes, storms, and floods, with the largest human-exposure figures in the atlas. Trend and exposure weighting matter more here than raw counts.",
  "Southeast Asia":
    "Southeast Asia sits in the path of the western Pacific storm track and along active subduction zones, giving it a dense mix of typhoons, floods, and seismic signals. Monsoon-driven flooding is the recurring seasonal story, often cascading from storm to flood to disaster within a single week.",
  Oceania:
    "Oceania's signals are dominated by cyclones across the Pacific islands and by seismic activity along the region's plate boundaries. Small island states carry outsized exposure relative to their population, so a single storm can push straight to a disaster declaration.",
  "North Africa & Middle East":
    "This region blends environmental pressure — heat, drought, water stress — with a reporting environment shaped by conflict in several areas. Disaster and advisory signals here often reflect compound crises where a natural hazard meets a fragile response capacity.",
  "West & Central Africa":
    "West and Central Africa is the primary theatre for our disease monitors, particularly Ebola virus disease surveillance. Outbreak and advisory signals feature heavily, frequently intersecting with logistics constraints that determine how quickly a response can reach affected areas.",
  "Southern Africa":
    "Southern Africa's signal mix runs from cyclones making landfall on the Mozambique Channel coast to drought-driven environmental pressure inland. Seasonal flooding and its humanitarian aftermath are the recurring pattern to watch.",
  "East Africa":
    "East Africa combines flood-and-drought cycles with recurring disease surveillance and a history of compound emergencies. Environmental indicators here are especially worth reading early, as they precede both the floods and the health events that follow.",
  "North America":
    "North America's signals are well-instrumented and fast-reported: USGS earthquakes on the western margin, hurricanes on the Atlantic and Gulf coasts, and a long wildfire season across the west. Exposure weighting separates the many routine detections from the events that reach people.",
  "Central America & Caribbean":
    "This region sits directly in the Atlantic hurricane corridor and along an active seismic boundary, giving it one of the highest hazard densities per capita in the atlas. Storm-to-flood-to-disaster cascades are the defining seasonal pattern.",
  "South America":
    "South America ranges from the seismically active Andean margin to the Amazon basin's fire and flood cycles. Hantavirus surveillance across the southern cone also feeds this region, linking environmental and outbreak signals in one view.",
  "Central Africa":
    "Central Africa is a core disease-surveillance region for the atlas, where outbreak and logistics signals often move together — the difficulty of reaching remote areas is frequently the story behind a slow-resolving health event.",
  "West Africa":
    "West Africa carries a dense mix of outbreak surveillance, seasonal flooding, and humanitarian response signals. It is one of the regions where the connection between environmental pressure, disease, and formal disaster declaration is most visible.",
  "South Asia":
    "South Asia combines monsoon-driven flooding, cyclone landfalls on the Bay of Bengal, and major seismic exposure across the Himalayan front. With some of the highest population densities on the planet, exposure weighting is decisive in ranking its signals.",
};

// Shared methodology prose, reused across topic pages and the About/Methodology page.
export const METHODOLOGY: string[] = [
  "Every signal in the atlas is pulled from a public, authoritative source, normalised into one common shape — category, severity, region, geocode, and recency — and de-duplicated against what we have already seen. We do not generate events; we collect, structure, and rank events that official bodies and established feeds have already reported.",
  "Severity is a weighting, not a verdict. It combines the intensity a source reports with how exposed the surrounding population and infrastructure are, so that a moderate hazard near many people can outrank a severe one in an empty area. Because it is a weighting, it is best read as a way to sort attention, not as an official threat level.",
  "A cron-driven ingest runs continuously, so the surface reflects a live rolling window rather than a static snapshot. Trend lines cover the most recent 21 days, which is long enough to separate a genuine escalation from day-to-day noise. When a signal is retired upstream, it ages out of the active window here.",
];

export const DISCLAIMER =
  "Watchcomman Monitor is an independent open-source-intelligence aggregation surface for situational awareness. It is not an official emergency service, not medical or safety advice, and not a substitute for guidance from your local authorities. Always follow the instructions of official agencies during any event. Signals are drawn from third-party sources and may be incomplete, delayed, or subsequently revised.";

export const SITE_TAGLINE = "Live OSINT & global monitoring, in one editorial atlas.";

export const SITE_DESCRIPTION =
  "Watchcomman Monitor is an independent open-source-intelligence platform that fuses live signals — disease outbreaks, earthquakes, wildfires, storms, floods, humanitarian disasters, sanctions, cyber threats, defense contracts, and maritime and military movement — into one continuously updated, editorially weighted dashboard.";
