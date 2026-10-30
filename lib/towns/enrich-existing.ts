import type { TownEnrichment } from "../townTypes";

/**
 * Council, intro and verifiable local facts for the towns already defined in
 * lib/towns.ts. Keys are the town slugs. Phi Movers is London-based, so copy
 * never implies a local depot.
 */
export const townEnrichment: Record<string, TownEnrichment> = {
  // ---------- South East ----------
  watford: {
    council: "Watford Borough Council",
    intro:
      "Watford draws London renters who want more space without losing a quick commute, and plenty of families moving out along the M1 corridor. Our removals in Watford are mostly flat-to-house moves and London–Watford relocations completed comfortably in a single day.",
    facts: [
      "Watford Junction has direct trains to London Euston and is also served by the London Overground.",
      "The town sits close to junction 5 of the M1 and junctions 19 and 20 of the M25.",
      "Watford FC play at Vicarage Road stadium.",
    ],
  },
  harlow: {
    council: "Harlow District Council",
    intro:
      "Harlow attracts first-time buyers and young families priced out of north-east London, as well as people moving into the new neighbourhoods on the edge of town. Removals in Harlow are often London-to-Harlow house moves or local moves between the town’s neighbourhoods.",
    facts: [
      "Harlow was one of the post-war new towns designated after the New Towns Act 1946.",
      "Harlow Town station has direct trains to London Liverpool Street.",
      "The M11 runs along the east of the town, with access at junction 7 and the newer junction 7a.",
    ],
  },
  basildon: {
    council: "Basildon Borough Council",
    intro:
      "Basildon is a popular move for east Londoners who want a house and garden while staying on a direct line into the City. Removals in Basildon range from maisonette moves on the older estates to family moves out to Billericay and Wickford.",
    facts: [
      "Basildon was designated as a new town in 1949.",
      "Basildon station is on the c2c line to London Fenchurch Street.",
      "The A127 and A13 link the town with east London and the M25.",
    ],
  },
  rayleigh: {
    council: "Rochford District Council",
    intro:
      "Rayleigh is a settled commuter town that tends to attract families and downsizers moving from east London and elsewhere in south Essex. Removals in Rayleigh are often whole-house moves or downsizing moves into bungalows and smaller homes nearby.",
    facts: [
      "Rayleigh station is on the Shenfield to Southend Victoria line, with trains to London Liverpool Street.",
      "Rayleigh Mount, the earthworks of a Norman castle, is cared for by the National Trust.",
      "The town sits between the A127 and the A130.",
    ],
  },
  sittingbourne: {
    council: "Swale Borough Council",
    intro:
      "Sittingbourne attracts buyers from south-east London and the Medway towns who want new-build space with rail links back to the capital. Removals in Sittingbourne are often moves into new estates on the edge of town or London-to-Kent relocations.",
    facts: [
      "Sittingbourne station has trains to London Victoria and high-speed services to London St Pancras.",
      "The A249 connects the town with junction 5 of the M2 and with the Isle of Sheppey.",
      "The Sittingbourne and Kemsley Light Railway is a heritage narrow-gauge line in the town.",
    ],
  },
  margate: {
    council: "Thanet District Council",
    intro:
      "Margate has become a well-known destination for Londoners moving to the coast, from creative workers to families and people taking on period townhouses to restore. Removals in Margate are usually full London-to-coast moves planned as a single long day.",
    facts: [
      "Turner Contemporary gallery stands on the seafront.",
      "Margate station has Southeastern high-speed services to London St Pancras.",
      "The A299 Thanet Way links Thanet with the M2.",
    ],
  },
  maidenhead: {
    council: "Royal Borough of Windsor and Maidenhead",
    intro:
      "Maidenhead attracts west London professionals and families who want riverside living with fast trains back into the city. Removals in Maidenhead are commonly London-to-Berkshire house moves and moves into the new apartments near the station.",
    facts: [
      "Maidenhead is on the Elizabeth line, with direct trains through central London.",
      "Brunel’s Maidenhead Railway Bridge carries the Great Western Main Line over the Thames.",
      "The M4 runs just south of the town, with access at junction 8/9.",
    ],
  },
  reading: {
    council: "Reading Borough Council",
    intro:
      "Reading sees a steady stream of professionals relocating for work, students moving between houses and London households heading west for more space. Removals in Reading range from student lets and city-centre flats to family homes in the suburbs.",
    facts: [
      "Reading station is served by Great Western Railway and the Elizabeth line.",
      "The University of Reading’s main campus is at Whiteknights.",
      "The M4 passes south of the town, with junctions 10 to 12 serving Reading.",
    ],
  },
  basingstoke: {
    council: "Basingstoke and Deane Borough Council",
    intro:
      "Basingstoke attracts people relocating for jobs in the town’s business parks and families moving out of south-west London. Removals in Basingstoke are typically moves into modern estates and new-build homes, often with straightforward parking.",
    facts: [
      "Basingstoke station has direct South Western Railway trains to London Waterloo.",
      "The M3 serves the town at junctions 6 and 7.",
      "Basingstoke expanded rapidly as a London overspill town from the 1960s.",
    ],
  },
  guildford: {
    council: "Guildford Borough Council",
    intro:
      "Guildford draws London families looking for good schools and countryside, along with university staff and students. Removals in Guildford often involve large family homes in the surrounding villages or flats close to the town centre.",
    facts: [
      "Guildford station has direct trains to London Waterloo.",
      "The University of Surrey’s campus is next to Guildford Cathedral on Stag Hill.",
      "The A3 runs past the town, linking it with London and the M25 at junction 10.",
    ],
  },
  leatherhead: {
    council: "Mole Valley District Council",
    intro:
      "Leatherhead attracts families moving out of south-west London who want a short commute and easy access to the Surrey Hills. Removals in Leatherhead are often larger family house moves to Ashtead, Fetcham and Bookham.",
    facts: [
      "Leatherhead station has trains to London Waterloo and London Victoria.",
      "Junction 9 of the M25 is on the edge of the town.",
      "The River Mole runs through Leatherhead.",
    ],
  },
  horsham: {
    council: "Horsham District Council",
    intro:
      "Horsham is popular with families relocating from south London and with commuters who split their week between home and the city. Removals in Horsham are often moves into new-build developments on the edge of town or period homes near the old centre.",
    facts: [
      "Horsham station has direct trains to London Victoria and London Bridge.",
      "The A24 and A264 meet at the town.",
      "The Causeway in the old town is lined with historic buildings, including Horsham Museum.",
    ],
  },
  "haywards-heath": {
    council: "Mid Sussex District Council",
    intro:
      "Haywards Heath attracts London commuters who want a Sussex town within easy reach of both London and Brighton. Removals in Haywards Heath are often London-to-Sussex family moves or relocations from nearby villages into town.",
    facts: [
      "Haywards Heath is on the Brighton Main Line, with direct trains to London Victoria and London Bridge.",
      "The Princess Royal Hospital is in the town.",
      "The A272 runs east–west through the area.",
    ],
  },
  eastbourne: {
    council: "Eastbourne Borough Council",
    intro:
      "Eastbourne is a common choice for retirees, downsizers and families moving to the coast from London and the Home Counties. Removals in Eastbourne often involve moving into seafront apartments or helping relatives downsize from larger homes.",
    facts: [
      "Beachy Head and the South Downs lie just west of the town.",
      "Eastbourne Pier dates from the Victorian era.",
      "Eastbourne station has direct trains to London Victoria.",
    ],
  },
  chichester: {
    council: "Chichester District Council",
    intro:
      "Chichester attracts families, retirees and sailing enthusiasts moving to the south coast, often from London and Surrey. Removals in Chichester range from Georgian townhouses within the city walls to coastal homes on the Manhood Peninsula.",
    facts: [
      "Chichester Cathedral stands in the centre of the walled city.",
      "The University of Chichester has its main campus in the city.",
      "The A27 bypasses the city to the south, and the Goodwood estate lies just to the north.",
    ],
  },
  portsmouth: {
    council: "Portsmouth City Council",
    intro:
      "Portsmouth moves are a mix of students, naval and dockyard families, and people moving down from London for life by the sea. Removals in Portsmouth often mean tight terraced streets on Portsea Island or waterfront flats near Gunwharf Quays.",
    facts: [
      "Portsmouth Historic Dockyard is home to HMS Victory and the Mary Rose.",
      "The University of Portsmouth is based in the city centre.",
      "The M275 links Portsea Island with the M27, and trains run direct to London Waterloo.",
    ],
  },
  oxford: {
    council: "Oxford City Council",
    intro:
      "Oxford moves are shaped by academics, students, hospital staff and families who want a city with a strong London rail link. Removals in Oxford range from college-area flats and student lets to large houses in North Oxford and the surrounding villages.",
    facts: [
      "The city is home to the University of Oxford and Oxford Brookes University.",
      "Oxford station has direct trains to London Paddington and London Marylebone.",
      "The M40 passes east of the city, with the A40 and the ring road connecting it.",
    ],
  },
  "milton-keynes": {
    council: "Milton Keynes City Council",
    intro:
      "Milton Keynes attracts Londoners who want a newer home, more space and a fast rail link back to Euston. Removals in Milton Keynes are often London-to-MK family moves into newer estates or moves between the city’s grid squares.",
    facts: [
      "Milton Keynes Central has fast trains to London Euston.",
      "The M1 serves the city at junctions 13 and 14.",
      "The Open University’s headquarters is at Walton Hall in Milton Keynes.",
    ],
  },
  "leighton-buzzard": {
    council: "Central Bedfordshire Council",
    intro:
      "Leighton Buzzard is popular with families and commuters moving out of north London who want a market town on the West Coast Main Line. Removals in Leighton Buzzard are often moves into new-build estates on the edge of town.",
    facts: [
      "Leighton Buzzard station has direct trains to London Euston.",
      "The Leighton Buzzard Narrow Gauge Railway is a heritage line in the town.",
      "The Grand Union Canal runs between Leighton Buzzard and Linslade.",
    ],
  },
  // ---------- South West ----------
  bournemouth: {
    council: "Bournemouth, Christchurch and Poole Council",
    intro:
      "Bournemouth draws students, young professionals and people moving from London for life by the beach. Removals in Bournemouth are often flat moves in converted villas or longer London-to-coast relocations planned for a single day.",
    facts: [
      "Bournemouth University has campuses in Bournemouth and Poole.",
      "Bournemouth station has direct trains to London Waterloo.",
      "The A338 Wessex Way is the main road into the town from the north.",
    ],
  },
  swindon: {
    council: "Swindon Borough Council",
    intro:
      "Swindon attracts people relocating for work, first-time buyers and families who want an affordable home with a direct line to London. Removals in Swindon range from railway-era terraces near the centre to larger homes in the northern developments.",
    facts: [
      "Swindon station has direct Great Western Railway trains to London Paddington.",
      "The M4 serves the town at junctions 15 and 16.",
      "The STEAM museum tells the story of the Great Western Railway works in the town.",
    ],
  },
  trowbridge: {
    council: "Wiltshire Council",
    intro:
      "Trowbridge attracts families and people relocating to west Wiltshire for more space within reach of Bath and Bristol. Removals in Trowbridge are often long-distance moves from London or short local moves to nearby towns.",
    facts: [
      "Trowbridge is the county town of Wiltshire and home to Wiltshire Council’s offices.",
      "Trowbridge station has trains towards Bath, Bristol and Westbury.",
      "The A361 and A350 are the main roads through the area.",
    ],
  },
  bath: {
    council: "Bath and North East Somerset Council",
    intro:
      "Bath attracts families, academics and people leaving London for a historic city with a direct line to Paddington. Removals in Bath often mean Georgian flats on several floors, steep streets and carefully planned loading points.",
    facts: [
      "The City of Bath is a UNESCO World Heritage Site, known for the Roman Baths and the Royal Crescent.",
      "The city is home to the University of Bath and Bath Spa University.",
      "Bath Spa station has direct trains to London Paddington.",
    ],
  },
  exeter: {
    council: "Exeter City Council",
    intro:
      "Exeter sees students, university staff and families relocating to Devon, many of them from London and the South East. Removals in Exeter are usually long-distance moves planned as a fixed-price day or two.",
    facts: [
      "The University of Exeter’s main campus is at Streatham.",
      "Exeter St Davids has direct trains to London Paddington, and Exeter Central has services to London Waterloo.",
      "The M5 ends at Exeter, where it meets the A30 and A38.",
    ],
  },
  plymouth: {
    council: "Plymouth City Council",
    intro:
      "Plymouth moves often involve naval and military families, students and people relocating to the far South West from London. Removals in Plymouth are long-distance jobs that we plan carefully around the hills and the journey time.",
    facts: [
      "Plymouth Hoe overlooks Plymouth Sound and is home to Smeaton’s Tower.",
      "The University of Plymouth is in the city centre.",
      "Plymouth station has direct trains to London Paddington, and the A38 is the main road into the city.",
    ],
  },
  // ---------- East of England ----------
  cambridge: {
    council: "Cambridge City Council",
    intro:
      "Cambridge sees academics, researchers, students and tech workers relocating constantly, many of them to or from London. Removals in Cambridge range from terraced houses off Mill Road to new homes at Eddington and Trumpington.",
    facts: [
      "The city is home to the University of Cambridge and Anglia Ruskin University.",
      "Cambridge station has direct trains to London King’s Cross and London Liverpool Street.",
      "The M11 and A14 meet on the north-west edge of the city.",
    ],
  },
  peterborough: {
    council: "Peterborough City Council",
    intro:
      "Peterborough attracts families and commuters who want an affordable home with a fast train into London. Removals in Peterborough are often moves into the townships and new-build areas like Hampton.",
    facts: [
      "Peterborough is on the East Coast Main Line with fast trains to London King’s Cross.",
      "Peterborough Cathedral is one of England’s major Norman cathedrals.",
      "The A1(M) runs along the west side of the city.",
    ],
  },
  ipswich: {
    council: "Ipswich Borough Council",
    intro:
      "Ipswich attracts families and commuters relocating from London and Essex, as well as people moving into the waterfront apartments. Removals in Ipswich range from Victorian terraces to marina flats and suburban family homes.",
    facts: [
      "Ipswich station has direct trains to London Liverpool Street.",
      "The University of Suffolk is based on the Ipswich Waterfront.",
      "The Orwell Bridge carries the A14 across the River Orwell south of the town.",
    ],
  },
  norwich: {
    council: "Norwich City Council",
    intro:
      "Norwich draws students, university staff and families relocating to Norfolk, many leaving London for a slower pace. Removals in Norwich are usually long-distance moves into Victorian terraces, suburban homes or flats near the historic centre.",
    facts: [
      "The University of East Anglia is on the western edge of the city.",
      "Norwich Cathedral and Norwich Castle are in the city centre.",
      "Norwich station has direct trains to London Liverpool Street, and the A11 links the city with the M11.",
    ],
  },
  // ---------- Midlands ----------
  northampton: {
    council: "West Northamptonshire Council",
    intro:
      "Northampton attracts families and commuters looking for more space within reach of London and Milton Keynes. Removals in Northampton are often London-to-Midlands house moves into estates and new-build developments.",
    facts: [
      "Northampton station has direct trains to London Euston.",
      "The M1 passes the town at junctions 15, 15A and 16.",
      "The University of Northampton’s Waterside campus is close to the town centre.",
    ],
  },
  leicester: {
    council: "Leicester City Council",
    intro:
      "Leicester moves involve a large student population, families and people relocating for work in the East Midlands. Removals in Leicester range from student terraces near the universities to suburban family homes.",
    facts: [
      "The city is home to the University of Leicester and De Montfort University.",
      "Leicester station is on the Midland Main Line with direct trains to London St Pancras.",
      "The M1 passes west of the city at junction 21.",
    ],
  },
  nuneaton: {
    council: "Nuneaton and Bedworth Borough Council",
    intro:
      "Nuneaton attracts families and workers who want an affordable home between Coventry, Leicester and the motorway network. Removals in Nuneaton are often long-distance moves from London or local moves across north Warwickshire.",
    facts: [
      "Nuneaton station is on the Trent Valley line, with direct trains to London Euston.",
      "The A5 runs along the north of the town, and the M6 and M69 are close by.",
      "The novelist George Eliot was born near Nuneaton.",
    ],
  },
  walsall: {
    council: "Walsall Council",
    intro:
      "Walsall sees families and workers moving around the West Midlands and people relocating from London for a more affordable home. Removals in Walsall are typically long-distance moves into terraces, semis and estate homes.",
    facts: [
      "The M6 passes west of the town, with junctions 7 to 10 serving the area.",
      "Walsall station has frequent trains to Birmingham New Street.",
      "The New Art Gallery Walsall overlooks the town’s canal basin.",
    ],
  },
  // ---------- North ----------
  sheffield: {
    council: "Sheffield City Council",
    intro:
      "Sheffield moves are driven by its two big universities, the city’s growing workforce and people relocating north from London for more space. Removals in Sheffield often mean steep streets and stone terraces that need careful planning.",
    facts: [
      "The city is home to the University of Sheffield and Sheffield Hallam University.",
      "Sheffield station has direct trains to London St Pancras.",
      "The M1 passes east of the city at junctions 33 and 34, and the Supertram runs through the centre.",
    ],
  },
  leeds: {
    council: "Leeds City Council",
    intro:
      "Leeds sees students, graduates and professionals relocating for work, plus families moving from London to the North. Removals in Leeds range from student houses in Headingley to city-centre apartments and suburban family homes.",
    facts: [
      "The city is home to the University of Leeds and Leeds Beckett University.",
      "Leeds station has direct trains to London King’s Cross.",
      "The M1, M62 and M621 all serve the city.",
    ],
  },
  bradford: {
    council: "City of Bradford Metropolitan District Council",
    intro:
      "Bradford moves are often families relocating within West Yorkshire or people moving north from London for a more affordable home. Removals in Bradford usually involve stone-built terraces and larger family houses on hilly streets.",
    facts: [
      "The University of Bradford is close to the city centre.",
      "Bradford has two main stations, Bradford Interchange and Bradford Forster Square, with direct trains to London King’s Cross.",
      "Saltaire, a UNESCO World Heritage Site, is within the district.",
    ],
  },
  bolton: {
    council: "Bolton Council",
    intro:
      "Bolton attracts families and Manchester commuters who want more space for their money, and people relocating to the North West from London. Removals in Bolton are typically long-distance moves into terraces, semis and new-build homes.",
    facts: [
      "The University of Bolton is in the town centre.",
      "Bolton station has frequent trains to Manchester.",
      "The M61 runs past the town, linking it with the M60 and M6.",
    ],
  },
  grimsby: {
    council: "North East Lincolnshire Council",
    intro:
      "Grimsby moves often involve families and workers relocating to the Humber coast, including people moving from London for a more affordable home. Removals in Grimsby are long-distance jobs we plan as a single fixed-price move.",
    facts: [
      "The Grimsby Dock Tower is a landmark on the town’s docks.",
      "The A180 links Grimsby with the M180.",
      "Cleethorpes, with its seafront and pier, adjoins the town.",
    ],
  },
  "newcastle-upon-tyne": {
    council: "Newcastle City Council",
    intro:
      "Newcastle sees students, graduates and families relocating to the North East, many of them moving from London. Removals in Newcastle upon Tyne are long-distance moves into Tyneside flats, Victorian terraces or quayside apartments.",
    facts: [
      "The city is home to Newcastle University and Northumbria University.",
      "Newcastle Central station has direct trains to London King’s Cross.",
      "The Tyne Bridge crosses the river between Newcastle and Gateshead, and the Tyne and Wear Metro serves the city.",
    ],
  },
  // ---------- Scotland, Wales, Northern Ireland ----------
  glasgow: {
    council: "Glasgow City Council",
    intro:
      "Glasgow moves often involve students, graduates and professionals relocating between Scotland and London. Removals in Glasgow are long-distance jobs, usually into tenement flats with shared stairs.",
    facts: [
      "The city is home to the University of Glasgow and the University of Strathclyde.",
      "Glasgow Central station has direct trains to London Euston.",
      "The M8 runs through the city, and the Glasgow Subway serves the centre and West End.",
    ],
  },
  "east-kilbride": {
    council: "South Lanarkshire Council",
    intro:
      "East Kilbride attracts families and Glasgow commuters who want a suburban home with good space. Removals in East Kilbride are typically long-distance moves to or from England, planned and quoted individually.",
    facts: [
      "East Kilbride was designated as Scotland’s first new town in 1947.",
      "East Kilbride station has trains to Glasgow Central.",
    ],
  },
  swansea: {
    council: "Swansea Council",
    intro:
      "Swansea moves are often students, university staff and people relocating to south Wales from London for coast and countryside. Removals in Swansea are long-distance jobs that we plan around the hilly terraced streets.",
    facts: [
      "Swansea University has campuses at Singleton Park and the Bay Campus.",
      "The M4 passes north of the city.",
      "The Gower Peninsula, the UK’s first Area of Outstanding Natural Beauty, lies west of the city.",
    ],
  },
  belfast: {
    council: "Belfast City Council",
    intro:
      "Belfast moves usually involve people relocating between Great Britain and Northern Ireland for work, study or family. Removals in Belfast from London are arranged individually, with the sea crossing built into the plan.",
    facts: [
      "Queen’s University Belfast is in the south of the city.",
      "Ferry routes link Belfast with Cairnryan in Scotland and Birkenhead near Liverpool.",
      "Titanic Belfast stands in the Titanic Quarter, where the ship was built.",
    ],
  },
};
