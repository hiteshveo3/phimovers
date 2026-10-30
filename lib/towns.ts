import { slugify } from "./data";

/**
 * UK towns outside London that searchers look for by name ("removals bolton",
 * "man with a van leeds"). Phase 3 of content-plan-pages.csv. Each town gets a
 * removals hub at /removals/{slug} and a man & van page at /removals/{slug}/man-and-van.
 *
 * Phi Movers crews are London-based, so copy is framed around moves to, from and
 * within each town by arrangement — never a local depot that doesn’t exist.
 */
import type { TownInput, TownService } from "./townTypes";
import { townsBatch1 } from "./towns/batch-1";
import { townsBatch2 } from "./towns/batch-2";
import { townsBatch3 } from "./towns/batch-3";
import { townsBatch4 } from "./towns/batch-4";
import { townEnrichment } from "./towns/enrich-existing";

export type { TownFaq, TownService } from "./townTypes";

/** A town page. Region is widened so Belfast can sit under Northern Ireland. */
export type Town = Omit<TownInput, "region" | "services"> & { slug: string; region: string; services: TownService[] };

type CoreTownInput = Omit<TownInput, "region" | "services"> & { region: string; services?: TownService[] };

/** Phase 3 towns: every one has a man & van page plus any extras listed. */
const t = (x: CoreTownInput): Town => {
  const slug = slugify(x.name);
  return { ...x, ...townEnrichment[slug], slug, services: ["man-and-van", ...(x.services ?? []), "furniture-delivery"] };
};

/** Phase 4/6 towns: sub-pages only where keyword data supports them. */
const b = (x: TownInput): Town => ({ ...x, slug: slugify(x.name), services: [...(x.services ?? []), "furniture-delivery"] });

/** Every sub-page type a town can have. */
export const TOWN_SERVICES: TownService[] = ["man-and-van", "house-clearance", "office-removals", "secure-storage", "furniture-delivery"];

/** Link text for each town sub-page. */
export const TOWN_SERVICE_LABEL: Record<TownService, string> = {
  "man-and-van": "Man and van",
  "house-clearance": "House clearance",
  "office-removals": "Office removals",
  "secure-storage": "Removals and storage",
  "furniture-delivery": "Furniture delivery",
};

const coreTowns: Town[] = [
  // ---------- South East ----------
  t({
    name: "Watford", county: "Hertfordshire", region: "East of England", services: ["house-clearance"], postcodes: "WD17 WD18 WD19 WD24 WD25", miles: 18,
    housing: "Victorian and Edwardian terraces near the town centre, 1930s semis in Garston and Oxhey, and modern flats around Watford Junction.",
    access: "Most residential roads suit a Luton van. The ring road and the town centre near the Atria get busy, and streets close to Vicarage Road are restricted on Watford FC match days.",
    localFaq: { q: "Do you move between Watford and London?", a: "Yes — Watford is only around 18 miles from central London, so Watford–London moves are some of the easiest we do." },
    nearby: ["harlow", "leighton-buzzard", "milton-keynes"],
  }),
  t({
    name: "Harlow", county: "Essex", region: "East of England", postcodes: "CM17 CM18 CM19 CM20", miles: 25,
    housing: "New-town estates with terraces and maisonettes, plus newer developments at Newhall and Gilston.",
    access: "Harlow’s neighbourhood layout means many homes are set back from the road on footpaths, so carry distances can be longer than they look. We plan for this when quoting.",
    localFaq: { q: "Are carry distances longer in Harlow?", a: "Sometimes — many Harlow homes face footpaths rather than the road. Tell us where the van can park and we’ll plan crew size around it." },
    nearby: ["watford", "basildon", "cambridge"],
  }),
  t({
    name: "Basildon", county: "Essex", region: "East of England", postcodes: "SS13 SS14 SS15 SS16", miles: 30,
    housing: "New-town terraces and maisonettes, larger homes in Billericay and Wickford nearby, and town-centre flats.",
    access: "Residential roads are generally easy for a Luton van. Some estates have parking courts and footpath access, which adds carry distance.",
    localFaq: { q: "Do you cover Billericay and Wickford too?", a: "Yes, moves around Basildon, Billericay, Wickford and Laindon are all quoted the same way." },
    nearby: ["rayleigh", "harlow", "sittingbourne"],
  }),
  t({
    name: "Rayleigh", county: "Essex", region: "East of England", postcodes: "SS6", miles: 38,
    housing: "Mainly family semis and detached houses, bungalows and some flats near the High Street.",
    access: "Most homes have driveways or easy kerbside parking. The A127 and A1245 are busy at peak times.",
    localFaq: { q: "Do you move bungalows in Rayleigh?", a: "Yes — bungalows are quick to load with no stairs, which often keeps the price down." },
    nearby: ["basildon", "sittingbourne", "harlow"],
  }),
  t({
    name: "Sittingbourne", county: "Kent", region: "South East", postcodes: "ME9 ME10", miles: 45,
    housing: "Victorian terraces near the town centre, post-war estates and large new-build developments on the edges of town.",
    access: "Most streets suit a Luton van. The A2 through town and the A249 towards the M2 are busy at peak times.",
    localFaq: { q: "How far is Sittingbourne from London for a move?", a: "Around 45 miles by road via the A2 and M2 — easy to complete in a day, including loading and unloading." },
    nearby: ["margate", "basildon", "rayleigh"],
  }),
  t({
    name: "Margate", county: "Kent", region: "South East", postcodes: "CT9", miles: 75,
    housing: "Tall Victorian and Georgian townhouses, many split into flats, seafront apartments and suburban homes in Cliftonville and Westbrook.",
    access: "Converted townhouses often mean several flights of narrow stairs. Seafront parking is busy in summer, so we plan loading times carefully.",
    localFaq: { q: "Do you move people from London to Margate?", a: "Yes — London to Margate is a common move for us, and at around 75 miles it’s usually done in a single day." },
    nearby: ["sittingbourne", "eastbourne"],
  }),
  t({
    name: "Maidenhead", county: "Berkshire", region: "South East", postcodes: "SL6", miles: 30,
    housing: "Victorian and Edwardian houses near the river, 1930s semis, large family homes in Pinkneys Green and new apartments near the station.",
    access: "Most streets are easy for a Luton van. The town centre has been heavily redeveloped, so parking near new apartment blocks needs planning.",
    localFaq: { q: "Do you move between Maidenhead and London?", a: "Yes — Maidenhead is around 30 miles from central London, well within a single-day move." },
    nearby: ["reading", "basingstoke", "guildford"],
  }),
  t({
    name: "Reading", county: "Berkshire", region: "South East", services: ["house-clearance"], postcodes: "RG1 RG2 RG4 RG6 RG30 RG31", miles: 40,
    housing: "Red-brick Victorian terraces, student houses around the university, town-centre apartments and suburban family homes.",
    access: "Central Reading has permit-controlled streets and a busy IDR ring road. Student areas get very busy at the start and end of term.",
    localFaq: { q: "Do you do student moves in Reading?", a: "Yes — our hourly man and van suits student houses and halls around the University of Reading." },
    nearby: ["maidenhead", "basingstoke", "oxford"],
  }),
  t({
    name: "Basingstoke", county: "Hampshire", region: "South East", postcodes: "RG21 RG22 RG23 RG24", miles: 50,
    housing: "Modern estates from the 1960s onwards, new-build developments and town-centre flats.",
    access: "Basingstoke’s roundabout-heavy road network is easy for vans, and most estates have reasonable parking.",
    localFaq: { q: "How much is a 2-bed house move from Basingstoke to London?", a: "Two-bed house moves start from £499; for a Basingstoke–London move your fixed quote also reflects the extra mileage beyond the first 10 miles." },
    nearby: ["reading", "guildford", "maidenhead"],
  }),
  t({
    name: "Guildford", county: "Surrey", region: "South East", postcodes: "GU1 GU2 GU4", miles: 30,
    housing: "Victorian and Edwardian houses, large detached homes in the surrounding villages, student houses and town-centre flats.",
    access: "Guildford town centre is hilly with a one-way system and frequent congestion. Some period streets are narrow, so a smaller van can be better.",
    localFaq: { q: "Can you handle Guildford’s hills and narrow streets?", a: "Yes — tell us your street and we’ll choose the right van size and plan the loading point." },
    nearby: ["leatherhead", "horsham", "basingstoke"],
  }),
  t({
    name: "Leatherhead", county: "Surrey", region: "South East", postcodes: "KT22 KT23 KT24", miles: 20,
    housing: "Large family houses, detached homes in Ashtead and Fetcham, and flats near the town centre.",
    access: "Most homes have driveways. The town centre is compact and the M25 junction nearby gets busy at peak times.",
    localFaq: { q: "Do you cover Ashtead and Fetcham?", a: "Yes — moves around Leatherhead, Ashtead, Fetcham and Bookham are all covered." },
    nearby: ["guildford", "horsham", "haywards-heath"],
  }),
  t({
    name: "Horsham", county: "West Sussex", region: "South East", postcodes: "RH12 RH13", miles: 40,
    housing: "Period homes in the old town, family estates and new-build developments on the edge of town.",
    access: "Most streets are easy for a Luton van, though the old town centre has narrow lanes and pedestrian areas.",
    localFaq: { q: "Is a man and van cheaper than van hire in Horsham?", a: "For most small moves it’s similar or cheaper once you count fuel, insurance and your own time — and a driver helps with all the lifting." },
    nearby: ["haywards-heath", "leatherhead", "chichester"],
  }),
  t({
    name: "Haywards Heath", county: "West Sussex", region: "South East", postcodes: "RH16 RH17", miles: 40,
    housing: "Victorian and Edwardian houses near the station, family estates and village homes in the surrounding area.",
    access: "Most streets are easy to load on. Roads near the station are busy at commuter times.",
    localFaq: { q: "Do you move London commuters to Haywards Heath?", a: "Yes — London to Haywards Heath is a popular move, and at around 40 miles it fits comfortably in a day." },
    nearby: ["horsham", "eastbourne", "leatherhead"],
  }),
  t({
    name: "Eastbourne", county: "East Sussex", region: "South East", postcodes: "BN20 BN21 BN22 BN23", miles: 70,
    housing: "Victorian seafront villas split into flats, retirement apartments, terraced streets and suburban family homes.",
    access: "Seafront flats often have lifts but limited parking. Many retirement buildings have set move-in times, so we plan with the management.",
    localFaq: { q: "Do you help with downsizing moves in Eastbourne?", a: "Yes — we can move part of a household into an apartment and take the rest to storage or clearance." },
    nearby: ["haywards-heath", "chichester", "margate"],
  }),
  t({
    name: "Chichester", county: "West Sussex", region: "South East", services: ["house-clearance"], postcodes: "PO18 PO19 PO20", miles: 65,
    housing: "Georgian and period houses in the city centre, family homes in the suburbs and coastal properties towards the Witterings.",
    access: "The historic city centre has narrow streets and restricted access, so we often load from the nearest permitted spot.",
    localFaq: { q: "Can you load in Chichester city centre?", a: "Access is restricted in parts of the centre, but we plan the nearest legal loading point and bring enough crew for the carry." },
    nearby: ["portsmouth", "horsham", "bournemouth"],
  }),
  t({
    name: "Portsmouth", county: "Hampshire", region: "South East", postcodes: "PO1 PO2 PO3 PO4 PO5 PO6", miles: 75,
    housing: "Dense Victorian terraces in Southsea and Fratton, student houses, naval-city flats and newer waterfront apartments at Gunwharf.",
    access: "Portsea Island is densely packed with tight terraced streets and permit zones. Planning parking in advance makes a big difference here.",
    localFaq: { q: "Do you move student houses in Southsea?", a: "Yes — student moves around the University of Portsmouth are well suited to our hourly man and van." },
    nearby: ["chichester", "bournemouth", "basingstoke"],
  }),
  t({
    name: "Oxford", county: "Oxfordshire", region: "South East", postcodes: "OX1 OX2 OX3 OX4", miles: 57,
    housing: "Victorian terraces in Jericho and East Oxford, large North Oxford houses, student lets and new developments on the edges of the city.",
    access: "Central Oxford has very restricted vehicle access and controlled parking. We plan the loading point and any permits needed before the day.",
    localFaq: { q: "Can a van get into central Oxford?", a: "Parts of the centre are restricted, but we can usually load from a permitted nearby spot. Tell us your street and we’ll plan it." },
    nearby: ["reading", "milton-keynes", "swindon"],
  }),
  t({
    name: "Milton Keynes", county: "Buckinghamshire", region: "South East", postcodes: "MK1 MK2 MK3 MK4 MK5 MK6 MK7 MK8 MK9 MK10", miles: 55,
    housing: "Planned estates of every era, from 1970s grid-square housing to new-build developments, plus city-centre apartments.",
    access: "The grid roads make MK quick to drive, but many homes face footpaths or parking courts, which can mean a longer carry.",
    localFaq: { q: "Do you move between Milton Keynes and London?", a: "Yes — London to MK is a common move, around 55 miles by the M1." },
    nearby: ["leighton-buzzard", "northampton", "oxford"],
  }),
  t({
    name: "Leighton Buzzard", county: "Bedfordshire", region: "East of England", postcodes: "LU7", miles: 45,
    housing: "Victorian terraces near the centre, family estates and a lot of new-build housing on the edge of town.",
    access: "New-build estates usually have good parking. The town centre is compact and busy on market days.",
    localFaq: { q: "Do you cover Linslade too?", a: "Yes — Leighton Buzzard and Linslade are covered together." },
    nearby: ["milton-keynes", "watford", "northampton"],
  }),
  // ---------- South West ----------
  t({
    name: "Bournemouth", county: "Dorset", region: "South West", postcodes: "BH1 BH2 BH5 BH6 BH7 BH8 BH9 BH10 BH11", miles: 105,
    housing: "Victorian villas converted into flats, purpose-built apartment blocks, student houses and family bungalows towards Poole.",
    access: "Many Bournemouth flats are in older blocks with no lift, and summer traffic near the seafront is heavy. We plan loading times to avoid the worst of it.",
    localFaq: { q: "Do you move people from London to Bournemouth?", a: "Yes — London to Bournemouth is around 105 miles, usually completed in a single day for flats and smaller homes." },
    nearby: ["chichester", "portsmouth", "exeter"],
  }),
  t({
    name: "Swindon", county: "Wiltshire", region: "South West", postcodes: "SN1 SN2 SN3 SN5 SN25", miles: 80,
    housing: "Railway-era Victorian terraces, large post-war estates and newer developments in the north of town.",
    access: "Swindon is easy for vans, with good road links to the M4. The ‘Magic Roundabout’ and town centre are the main slow spots.",
    localFaq: { q: "Do you do office removals in Swindon?", a: "Yes — we can quote office and commercial moves in and out of Swindon, usually scheduled out of hours." },
    nearby: ["oxford", "trowbridge", "bath"],
  }),
  t({
    name: "Trowbridge", county: "Wiltshire", region: "South West", postcodes: "BA14", miles: 105,
    housing: "Weavers’ cottages and Victorian terraces in the older town, plus large modern estates around the edges.",
    access: "Older streets can be narrow, but most estates are easy for a Luton van.",
    localFaq: { q: "Do you cover moves between Trowbridge and Bath?", a: "Yes — Trowbridge to Bath is a short local move we can quote by the hour or as a fixed price." },
    nearby: ["bath", "swindon"],
  }),
  t({
    name: "Bath", county: "Somerset", region: "South West", postcodes: "BA1 BA2", miles: 115,
    housing: "Georgian townhouses and crescents, many split into flats with long stairways, plus student houses and suburban homes.",
    access: "Bath’s city centre has a clean air zone, narrow streets and restricted access. Georgian buildings often have steep stairs and basement flats.",
    localFaq: { q: "Can you move a Georgian flat in Bath?", a: "Yes — tell us the floor and stair layout so we send enough crew and plan the loading point." },
    nearby: ["trowbridge", "swindon", "exeter"],
  }),
  t({
    name: "Exeter", county: "Devon", region: "South West", postcodes: "EX1 EX2 EX4", miles: 170,
    housing: "Victorian terraces, student houses around the university, city-centre flats and new developments to the east.",
    access: "The city centre has restricted streets and hills. Student areas are busy at the start and end of term.",
    localFaq: { q: "How long does a London to Exeter move take?", a: "Around 170 miles by road. Smaller moves can be done in a day; larger homes may be planned over two days." },
    nearby: ["plymouth", "bath", "bournemouth"],
  }),
  t({
    name: "Plymouth", county: "Devon", region: "South West", services: ["house-clearance"], postcodes: "PL1 PL2 PL3 PL4 PL5 PL6 PL7 PL9", miles: 215,
    housing: "Victorian terraces in Mutley and Stoke, naval and military housing, student lets and waterfront flats at the Barbican and Royal William Yard.",
    access: "Plymouth is hilly with many steep terraced streets, which can make loading slower.",
    localFaq: { q: "Do you do long-distance moves to Plymouth?", a: "Yes — London to Plymouth is around 215 miles. We’ll quote it as a fixed price and plan timings for a long-distance day." },
    nearby: ["exeter", "bournemouth"],
  }),
  // ---------- East of England ----------
  t({
    name: "Cambridge", county: "Cambridgeshire", region: "East of England", postcodes: "CB1 CB2 CB3 CB4 CB5", miles: 60,
    housing: "Victorian terraces in Mill Road and Romsey, college and student accommodation, and large new developments at Eddington and Trumpington.",
    access: "Central Cambridge has heavy restrictions, bus gates and many cyclists. Residents’ parking applies on most inner streets.",
    localFaq: { q: "Can you avoid Cambridge bus gates?", a: "Yes — we plan the route to the loading point so the van doesn’t pass through restricted bus gates." },
    nearby: ["harlow", "peterborough", "ipswich"],
  }),
  t({
    name: "Peterborough", county: "Cambridgeshire", region: "East of England", postcodes: "PE1 PE2 PE3 PE4 PE7", miles: 85,
    housing: "Victorian terraces near the centre, new-town estates in the townships and lots of new-build housing in Hampton.",
    access: "The parkway system makes Peterborough quick to drive. Most estates have good parking.",
    localFaq: { q: "Do you cover Hampton and Orton?", a: "Yes — all of Peterborough’s townships, including Hampton, Orton and Werrington." },
    nearby: ["cambridge", "northampton", "leicester"],
  }),
  t({
    name: "Ipswich", county: "Suffolk", region: "East of England", postcodes: "IP1 IP2 IP3 IP4", miles: 75,
    housing: "Victorian terraces, waterfront apartments at the marina and suburban family homes.",
    access: "Most residential streets are straightforward. The town centre and waterfront have more parking restrictions.",
    localFaq: { q: "Do you move waterfront flats in Ipswich?", a: "Yes, including lift bookings with building management." },
    nearby: ["norwich", "cambridge", "harlow"],
  }),
  t({
    name: "Norwich", county: "Norfolk", region: "East of England", postcodes: "NR1 NR2 NR3 NR4 NR5 NR6 NR7", miles: 115,
    housing: "Victorian terraces in the Golden Triangle, student houses near UEA, medieval-centre flats and suburban family homes.",
    access: "The historic centre has narrow streets and restricted access, so loading points need planning.",
    localFaq: { q: "Do you do student moves near UEA?", a: "Yes — our hourly man and van suits student houses and halls." },
    nearby: ["ipswich", "cambridge"],
  }),
  // ---------- Midlands ----------
  t({
    name: "Northampton", county: "Northamptonshire", region: "East Midlands", postcodes: "NN1 NN2 NN3 NN4 NN5", miles: 67,
    housing: "Victorian terraces, large new-town estates and new-build developments on the edges of town.",
    access: "Good road links via the M1. Most estates have reasonable parking.",
    localFaq: { q: "Do you move between Northampton and London?", a: "Yes — it’s around 67 miles via the M1." },
    nearby: ["milton-keynes", "leicester", "nuneaton"],
  }),
  t({
    name: "Leicester", county: "Leicestershire", region: "East Midlands", postcodes: "LE1 LE2 LE3 LE4 LE5", miles: 100,
    housing: "Victorian terraces, student housing around the two universities and suburban family homes.",
    access: "The ring road is busy at peak times, and terraced streets near the centre have limited parking.",
    localFaq: { q: "Do you do student moves in Leicester?", a: "Yes — hourly man and van suits student houses around both universities." },
    nearby: ["nuneaton", "northampton", "peterborough"],
  }),
  t({
    name: "Nuneaton", county: "Warwickshire", region: "West Midlands", postcodes: "CV10 CV11", miles: 100,
    housing: "Victorian terraces, post-war estates and newer developments around the town.",
    access: "Most streets are easy for a Luton van, with quick access to the M6 and A5.",
    localFaq: { q: "Is a man and van better than van hire in Nuneaton?", a: "If you need help lifting, usually yes — you get a driver who loads and unloads with you, and no fuel or insurance excess to worry about." },
    nearby: ["leicester", "walsall", "northampton"],
  }),
  t({
    name: "Walsall", county: "West Midlands", region: "West Midlands", postcodes: "WS1 WS2 WS3 WS4 WS5", miles: 120,
    housing: "Victorian and inter-war terraces, large estates and suburban semis.",
    access: "Most residential streets are easy for a Luton van. The town centre and M6 junctions get busy at peak times.",
    localFaq: { q: "Do you cover moves from Walsall to London?", a: "Yes — it’s around 120 miles, usually completed in a day for smaller homes." },
    nearby: ["nuneaton", "leicester"],
  }),
  // Leamington Spa and Warwick moved here from the London areas list (lib/areas.ts), where they did not belong.
  t({
    name: "Leamington Spa", county: "Warwickshire", region: "West Midlands", postcodes: "CV31 CV32 CV33", miles: 95,
    housing: "Regency terraces and villas in the town centre, Victorian streets and spacious suburban homes and apartments.",
    access: "The historic centre has narrow streets and controlled parking, so tell us where the van can stop. The M40 is close for the run to London.",
    localFaq: { q: "Do you move between Leamington Spa and London?", a: "Yes. Moves between Leamington Spa and London are planned as single-day jobs and quoted at a fixed price by arrangement." },
    nearby: ["warwick", "coventry", "rugby"],
  }),
  t({
    name: "Warwick", county: "Warwickshire", region: "West Midlands", postcodes: "CV34 CV35", miles: 95,
    housing: "Historic town-centre houses, Victorian terraces and modern estates on the edge of town.",
    access: "Streets around the castle and the old town are tight and busy, so we plan parking before the day. The M40 gives a straight run to London.",
    localFaq: { q: "Do you offer removals from Warwick to London?", a: "Yes. Warwick to London moves are planned single-day jobs, quoted at a fixed price by arrangement." },
    nearby: ["leamington-spa", "coventry", "rugby"],
  }),
  // ---------- North ----------
  t({
    name: "Sheffield", county: "South Yorkshire", region: "Yorkshire", postcodes: "S1 S2 S6 S7 S10 S11", miles: 165,
    housing: "Stone-built Victorian terraces, large student areas around both universities, and city-centre apartments.",
    access: "Sheffield is very hilly, and many terraced streets are steep and narrow, which can slow loading.",
    localFaq: { q: "Do Sheffield’s hills affect the move?", a: "They can — steep streets and steps add time. Tell us about access and we’ll plan crew size accordingly." },
    nearby: ["leeds", "bradford", "grimsby"],
  }),
  t({
    name: "Leeds", county: "West Yorkshire", region: "Yorkshire", services: ["house-clearance","office-removals"], postcodes: "LS1 LS2 LS4 LS6 LS7 LS8", miles: 195,
    housing: "Victorian back-to-back terraces, huge student areas in Headingley and Hyde Park, and city-centre apartment blocks.",
    access: "Student areas are packed at term start and end, and city-centre blocks usually need a loading bay booking.",
    localFaq: { q: "Do you do student moves in Headingley?", a: "Yes — our hourly man and van is ideal for student houses in Headingley and Hyde Park." },
    nearby: ["bradford", "sheffield"],
  }),
  t({
    name: "Bradford", county: "West Yorkshire", region: "Yorkshire", postcodes: "BD1 BD2 BD3 BD5 BD7 BD8 BD9", miles: 205,
    housing: "Stone-built Victorian terraces, large family homes and estates, and city-centre flats.",
    access: "Hilly terraced streets and on-street parking can slow loading in older areas.",
    localFaq: { q: "Do you move between Bradford and Leeds?", a: "Yes — it’s a short local move we can quote by the hour." },
    nearby: ["leeds", "sheffield", "bolton"],
  }),
  t({
    name: "Bolton", county: "Greater Manchester", region: "North West", postcodes: "BL1 BL2 BL3 BL4 BL5 BL6", miles: 200,
    housing: "Victorian mill-town terraces, inter-war semis and new-build developments.",
    access: "Most terraced streets have on-street parking only. Good links to the M61 and M60.",
    localFaq: { q: "Do you do long-distance moves from Bolton?", a: "Yes — we quote long-distance moves from Bolton to London and elsewhere as a fixed price." },
    nearby: ["bradford", "leeds"],
  }),
  t({
    name: "Grimsby", county: "Lincolnshire", region: "Yorkshire", postcodes: "DN31 DN32 DN33 DN34", miles: 175,
    housing: "Victorian terraces, inter-war semis and suburban homes towards Cleethorpes.",
    access: "Most streets are easy for a Luton van.",
    localFaq: { q: "Do you cover Cleethorpes too?", a: "Yes — Grimsby and Cleethorpes are quoted the same way." },
    nearby: ["sheffield", "leeds"],
  }),
  t({
    name: "Newcastle upon Tyne", county: "Tyne and Wear", region: "North East", postcodes: "NE1 NE2 NE4 NE6", miles: 280,
    housing: "Tyneside flats, Victorian terraces in Jesmond and Heaton, student housing and quayside apartments.",
    access: "Tyneside flats have separate upper and lower front doors, and student areas are busy at term changes.",
    localFaq: { q: "Do you move to Newcastle from London?", a: "Yes — at around 280 miles it’s a long-distance move that we plan and quote as a fixed price." },
    nearby: ["leeds"],
  }),
  // ---------- Scotland, Wales, Northern Ireland ----------
  t({
    name: "Glasgow", county: "Glasgow City", region: "Scotland", services: ["office-removals"], postcodes: "G1 G3 G4 G11 G12 G41", miles: 410,
    housing: "Red and blond sandstone tenements, West End flats and modern riverside apartments.",
    access: "Tenement flats usually mean several flights of shared stairs and no lift, so crew size matters.",
    localFaq: { q: "Do you do removals from London to Glasgow?", a: "Yes — it’s a long-distance move of around 410 miles, planned and quoted individually." },
    nearby: ["east-kilbride"],
  }),
  t({
    name: "East Kilbride", county: "South Lanarkshire", region: "Scotland", postcodes: "G74 G75", miles: 400,
    housing: "New-town estates, terraced and semi-detached homes and flats.",
    access: "Most estates have reasonable parking, with some footpath-only access.",
    localFaq: { q: "Do you quote moves from East Kilbride to England?", a: "Yes — send both postcodes and we’ll give you a fixed long-distance quote." },
    nearby: ["glasgow"],
  }),
  t({
    name: "Swansea", county: "Swansea", region: "Wales", postcodes: "SA1 SA2 SA3", miles: 185,
    housing: "Hillside terraces, student houses in Uplands and Brynmill, and marina apartments.",
    access: "Swansea is hilly and many terraced streets are steep and narrow.",
    localFaq: { q: "Do you do moves between London and Swansea?", a: "Yes — around 185 miles, quoted as a fixed price." },
    nearby: ["bath", "exeter"],
  }),
  t({
    name: "Belfast", county: "County Antrim", region: "Northern Ireland", postcodes: "BT1 BT5 BT7 BT9", miles: 0,
    housing: "Victorian red-brick terraces, student houses around Queen’s University and city-centre apartments.",
    access: "Moves between Great Britain and Belfast include a ferry crossing, which affects timing and price.",
    localFaq: { q: "Can you move me from London to Belfast?", a: "Yes, by arrangement — the move includes a ferry crossing, so we quote it individually with realistic timings." },
    nearby: ["glasgow"],
  }),
];

export const towns: Town[] = [...coreTowns, ...[...townsBatch1, ...townsBatch2, ...townsBatch3, ...townsBatch4].map(b)];

export function getTown(slug: string): Town | undefined {
  return towns.find((x) => x.slug === slug);
}

export function nearbyTowns(town: Town): Town[] {
  return town.nearby.map(getTown).filter((x): x is Town => Boolean(x));
}

export const townHref = (slug: string, service?: string) => (service ? `/removals/${slug}/${service}` : `/removals/${slug}`);

/** How we describe service in each town — London-based crews, by arrangement outside London. */
export function townCoverage(town: Town): string {
  if (town.miles === 0) {
    return `Phi Movers is based in London. Moves to and from ${town.name} are arranged individually, including the sea crossing, with a fixed price agreed before you book.`;
  }
  return town.miles <= 60
    ? `Phi Movers is based in London, around ${town.miles} miles from ${town.name}, so moves between ${town.name} and London — and local moves in and around ${town.name} — fit comfortably into our schedule.`
    : `Phi Movers is based in London, around ${town.miles} miles from ${town.name}. We specialise in moves between ${town.name} and London and long-distance UK moves, and confirm availability for local ${town.name} jobs when you request a quote.`;
}
