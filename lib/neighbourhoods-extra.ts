import type { NeighbourhoodInput } from "./neighbourhoods";

/**
 * Additional London neighbourhoods with search demand (see briefs/london-extra.json).
 * Same shape and style as lib/neighbourhoods.ts. None of these has office or
 * storage keyword data yet, so no extraServices are set.
 */
export const extraNeighbourhoods: NeighbourhoodInput[] = [
  {
    name: "Mayfair",
    borough: "westminster",
    postcodes: "W1J W1K W1S",
    blurb:
      "Mayfair removals for Georgian townhouses, mansion flats and mews homes between Park Lane, Oxford Street and Piccadilly.",
    nearby: ["Westminster", "Chelsea", "Kensington & Chelsea", "Camden", "City of London"],
    housing:
      "Georgian and Victorian townhouses, red-brick mansion blocks, mews houses and serviced apartments around Grosvenor Square, Berkeley Square and Shepherd Market. Moves often include antiques, artwork and high-value furniture that need individual wrapping.",
    access:
      "Mayfair is inside Westminster’s controlled parking zones, so a bay suspension is usually needed for the van. Park Lane is a red route, mews streets are narrow, and many buildings have porters who ask for booked times and insurance documents in advance.",
    faqs: [
      { q: "Can you arrange parking for a move in Mayfair?", a: "Yes — tell us the street and date and we’ll advise on a bay suspension with Westminster or plan loading around the local restrictions." },
      { q: "Do you move antiques and artwork in Mayfair?", a: "Yes. We wrap antiques, mirrors and framed art individually and can add fragile-only packing for the most delicate pieces." },
      { q: "Will you send insurance documents to my building?", a: "Yes — many Mayfair blocks and managed buildings ask for a certificate of insurance before moving day, and we send it on request." },
    ],
  },
  {
    name: "Barnes",
    borough: "richmond-upon-thames",
    postcodes: "SW13",
    blurb:
      "Barnes removals for Victorian family houses, riverside homes and mansion flats between the Common and the Thames.",
    nearby: ["Putney", "Chiswick", "Fulham", "Richmond upon Thames", "Wandsworth", "Hammersmith & Fulham"],
    housing:
      "Large Victorian and Edwardian family houses along Castelnau and around Barnes Common, cottages near the Pond and the High Street, riverside homes on Lonsdale Road and The Terrace, and mansion flats. Whole-house family moves are the most common jobs.",
    access:
      "Hammersmith Bridge has had long-running closures to motor traffic, so routes to and from north of the river often go via Putney or Chiswick. Level crossings near Barnes station can hold traffic, and controlled parking applies near the stations and the High Street.",
    faqs: [
      { q: "Does the Hammersmith Bridge closure affect moves in Barnes?", a: "It changes the route. We plan via Putney Bridge or Chiswick Bridge and allow for the extra time in your quote." },
      { q: "Do you move large family houses in Barnes?", a: "Yes. Three-bed house moves start from £749 and four-bed and larger from £999, with packing available." },
      { q: "Do you cover Castelnau and the riverside?", a: "Yes, all of SW13, including Castelnau, Barnes Common and the riverside streets." },
    ],
  },
  {
    name: "Teddington",
    borough: "richmond-upon-thames",
    postcodes: "TW11",
    blurb:
      "Teddington removals for Victorian terraces, family houses and riverside flats between Bushy Park and Teddington Lock.",
    nearby: ["Twickenham", "Surbiton", "Richmond upon Thames", "Kingston upon Thames", "Hounslow"],
    housing:
      "Victorian and Edwardian terraces off the High Street and Broad Street, larger detached family homes near Bushy Park, and riverside flats and houses close to Teddington Lock.",
    access:
      "Most residential streets take a Luton van, though controlled parking applies near the station and High Street. Broad Street and the High Street get busy, and Kingston Bridge traffic can slow routes south.",
    faqs: [
      { q: "Do you move family houses in Teddington?", a: "Yes — family house moves are our most common Teddington job. Two-bed homes start from £499 and three-bed from £749." },
      { q: "Can you move riverside homes near Teddington Lock?", a: "Yes. We plan for longer carries and narrow lanes common near the river." },
      { q: "Is there a man and van in Teddington?", a: "Yes, from £50 per hour with a two-hour minimum." },
    ],
  },
  {
    name: "Isleworth",
    borough: "hounslow",
    postcodes: "TW7",
    blurb:
      "Isleworth man and van and removals for riverside cottages in Old Isleworth, inter-war semis and new-build flats.",
    nearby: ["Twickenham", "Chiswick", "Hounslow", "Richmond upon Thames", "Ealing"],
    housing:
      "Historic cottages and riverside houses in Old Isleworth, 1930s semis and terraces across the rest of TW7, and new apartment blocks along London Road and the Great West Road.",
    access:
      "London Road and the A4 Great West Road are busy at peak times, and Old Isleworth’s riverside lanes are narrow. Twickenham Stadium sits on the edge of Isleworth, so rugby match days bring closures and heavy traffic — we check fixtures before booking.",
    faqs: [
      { q: "Do rugby match days affect moves in Isleworth?", a: "They can. Roads near Twickenham Stadium close and traffic builds, so we check fixtures and avoid those windows where possible." },
      { q: "How much is a man and van in Isleworth?", a: "Our Isleworth man and van starts from £50 per hour with a two-hour minimum." },
      { q: "Do you move new-build flats in Isleworth?", a: "Yes — we book the loading bay and goods lift with building management." },
    ],
  },
  {
    name: "Hayes",
    borough: "hillingdon",
    postcodes: "UB3 UB4",
    blurb:
      "Hayes man and van and removals for semis, terraces and new apartments near the Elizabeth line and Heathrow.",
    nearby: ["Uxbridge", "Hillingdon", "Ealing", "Hounslow", "Acton"],
    housing:
      "Inter-war semis and terraces, post-war estates, and a growing number of new-build apartments near Hayes & Harlington station and the Grand Union Canal. Many moves are airport workers and young families.",
    access:
      "Residential streets are generally easy for a Luton van. The Uxbridge Road, Station Road and the roads to the M4 and Heathrow get congested, and new-build blocks usually need a loading bay booking.",
    faqs: [
      { q: "How much is a man and van in Hayes?", a: "Our Hayes man and van starts from £50 per hour with a two-hour minimum." },
      { q: "Do you move new-build flats near Hayes & Harlington station?", a: "Yes — we book the loading bay and lift with building management in advance." },
      { q: "Do you cover all of Hayes?", a: "Yes, across UB3 and UB4, including Harlington and Yeading." },
    ],
  },
  {
    name: "North Finchley",
    borough: "barnet",
    postcodes: "N12",
    blurb:
      "North Finchley removals and man and van for Edwardian houses, mansion flats and new apartments around Tally Ho Corner.",
    nearby: ["Edgware", "Barnet", "Haringey", "Enfield", "Camden"],
    housing:
      "Edwardian and inter-war family houses, purpose-built flats along the High Road and newer apartment blocks near Tally Ho Corner and Woodside Park.",
    access:
      "The High Road is busy with buses and shoppers, and the North Circular and the A1 nearby slow peak-time journeys. Side streets near the town centre are permit-controlled, while streets further out are easy for a Luton van.",
    faqs: [
      { q: "Do you do house removals in North Finchley?", a: "Yes, fixed-price house moves from £499 for a two-bed home and £749 for a three-bed." },
      { q: "Can you avoid North Circular traffic?", a: "We schedule North Finchley moves to avoid the worst of the peak traffic where possible." },
      { q: "Is there a man and van in North Finchley?", a: "Yes, from £50 per hour with a two-hour minimum." },
    ],
  },
  {
    name: "St John’s Wood",
    borough: "westminster",
    postcodes: "NW8",
    blurb:
      "St John’s Wood removals for mansion flats, villas and townhouses between Regent’s Park, Abbey Road and Lord’s.",
    nearby: ["Westminster", "Camden", "Brent", "Kensington & Chelsea"],
    housing:
      "Large mansion blocks along Prince Albert Road and Abbey Road, detached and semi-detached villas, Regency townhouses and modern apartment buildings with porters. Moves often involve large furniture, pianos and artwork.",
    access:
      "St John’s Wood is inside Westminster’s controlled parking zones, so a bay suspension is usually needed. Wellington Road and Finchley Road carry red-route restrictions, and cricket days at Lord’s bring heavy traffic and crowds around the ground.",
    faqs: [
      { q: "Do matches at Lord’s affect moves in St John’s Wood?", a: "They can. We check the fixture list when you book and avoid busy match-day windows near the ground." },
      { q: "Can you move a mansion flat in St John’s Wood?", a: "Yes — we book the lift with the porter and send our insurance certificate in advance." },
      { q: "How much is a 3-bed move in St John’s Wood?", a: "Three-bed moves start from £749. Your fixed quote depends on inventory, access and distance." },
    ],
  },
  {
    name: "Canary Wharf",
    borough: "tower-hamlets",
    postcodes: "E14",
    blurb:
      "Canary Wharf man and van and removals for high-rise apartments, with concierge loading bays and goods lifts booked in advance.",
    nearby: ["Tower Hamlets", "Greenwich", "Newham", "City of London", "Woolwich"],
    housing:
      "High-rise apartment towers around the Canary Wharf estate, South Quay and Wood Wharf, converted warehouses at Limehouse and along the river, and estates and terraces across the rest of the Isle of Dogs.",
    access:
      "Most towers need a loading bay slot, goods lift booking and insurance certificate through the concierge, and many have set move-in hours. Parts of the estate are private roads with their own rules, and routes via the Limehouse Link and Westferry Road get congested at peak times.",
    faqs: [
      { q: "Can you book the loading bay for a Canary Wharf tower?", a: "Yes. We arrange the loading bay and goods lift with the concierge and send insurance documents in advance." },
      { q: "How much is a man and van in Canary Wharf?", a: "Our Canary Wharf man and van starts from £50 per hour with a two-hour minimum — ideal for studio and one-bed moves." },
      { q: "How much is a 1-bed flat move in Canary Wharf?", a: "One-bed flat moves start from £329 and studios from £249." },
    ],
  },
  {
    name: "Tottenham",
    borough: "haringey",
    postcodes: "N15 N17",
    blurb:
      "Tottenham man and van and removals for Victorian terraces, estate flats and new-build blocks, planned around match days.",
    nearby: ["Walthamstow", "Haringey", "Enfield", "Hackney", "Waltham Forest"],
    housing:
      "Victorian and Edwardian terraces, many split into flats, large estates such as Broadwater Farm with lifts and walkways, and new apartment blocks around Tottenham Hale.",
    access:
      "Seven Sisters Road and parts of the High Road are red routes, so we load from side streets or suspended bays. Match days and events at Tottenham Hotspur Stadium bring road closures and parking restrictions across the area — we check the fixture list before booking.",
    faqs: [
      { q: "Do Spurs match days affect moves in Tottenham?", a: "Yes — roads around the stadium close and event-day parking restrictions apply. We check fixtures and events and plan around them." },
      { q: "How much is a man and van in Tottenham?", a: "Our Tottenham man and van starts from £50 per hour with a two-hour minimum." },
      { q: "Do you move new-build flats at Tottenham Hale?", a: "Yes — we book the loading bay and goods lift with building management in advance." },
    ],
  },
  {
    name: "Whetstone",
    borough: "barnet",
    postcodes: "N20",
    blurb:
      "Whetstone removals for family houses, purpose-built flats and new apartments along the High Road towards Totteridge.",
    nearby: ["Barnet", "Edgware", "Enfield", "Haringey"],
    housing:
      "Inter-war and post-war family houses, larger detached homes towards Totteridge and Oakleigh Park, and purpose-built flats and newer blocks along the High Road.",
    access:
      "Many homes have driveways or easy kerbside parking. The High Road is busy at peak times, and streets near Totteridge & Whetstone station have parking restrictions.",
    faqs: [
      { q: "Do you do house removals in Whetstone?", a: "Yes, fixed-price house moves from £499 for a two-bed home, with packing available." },
      { q: "Do you cover Totteridge and Oakleigh Park?", a: "Yes, all of N20, including Totteridge and Oakleigh Park." },
      { q: "Is there a man and van in Whetstone?", a: "Yes, from £50 per hour with a two-hour minimum." },
    ],
  },
  {
    name: "Bexleyheath",
    borough: "bexley",
    postcodes: "DA6 DA7",
    blurb:
      "Bexleyheath removals for suburban semis, family houses and flats near the Broadway.",
    nearby: ["Sidcup", "Bexley", "Woolwich", "Greenwich", "Bromley"],
    housing:
      "Mostly 1930s semis and terraced family houses, bungalows, and flats and newer apartment blocks around the Broadway and Bexleyheath station.",
    access:
      "Most residential streets have driveways or easy kerbside parking. The Broadway is busy on weekends, and the A2 near the Black Prince interchange slows traffic at peak times.",
    faqs: [
      { q: "Do you cover all of Bexleyheath?", a: "Yes, across DA6 and DA7, including Barnehurst and Upton." },
      { q: "How much is a 3-bed house move in Bexleyheath?", a: "Three-bed house moves start from £749. Your fixed quote depends on inventory, access and distance." },
      { q: "Is there a man and van in Bexleyheath?", a: "Yes, from £50 per hour with a two-hour minimum." },
    ],
  },
  {
    name: "Upminster",
    borough: "havering",
    postcodes: "RM14",
    blurb:
      "House removals in Upminster for family semis, detached homes and bungalows at the eastern edge of London.",
    nearby: ["Romford", "Havering", "Barking & Dagenham"],
    housing:
      "Mostly 1930s semis and detached family houses, bungalows and some newer flats near the station. Family house moves and downsizing moves are both common.",
    access:
      "Many Upminster homes have driveways or wide residential roads, which keeps loading quick. The town centre around Station Road is busier, and the A127 and M25 junction carry heavy traffic at peak times.",
    faqs: [
      { q: "Do you do house removals in Upminster?", a: "Yes — fixed-price house moves with a 2-bed home from £499 and a 3-bed from £749, quoted from your inventory and access." },
      { q: "Can you move us from Upminster into Essex?", a: "Yes. Send both postcodes and we’ll give you a fixed price — the first 10 miles are included." },
      { q: "Do you help with downsizing moves?", a: "Yes. We can move what you’re keeping and arrange storage or clearance for the rest." },
    ],
  },
  {
    name: "Tooting",
    borough: "wandsworth",
    postcodes: "SW17",
    blurb:
      "House removals and man and van in Tooting for Victorian terraces, conversion flats and family homes around the two commons.",
    nearby: ["Balham", "Wimbledon", "Wandsworth", "Merton", "Clapham"],
    housing:
      "Long streets of Victorian and Edwardian terraces, many converted into flats, plus family houses near Tooting Common and Tooting Bec and flats close to the high street.",
    access:
      "Tooting High Street and Upper Tooting Road are busy red-route stretches of the A24, so loading usually happens on a side street. Most residential roads are permit-controlled, and a bay suspension helps on narrow terraced streets.",
    faqs: [
      { q: "How much are house removals in Tooting?", a: "Flat moves start from £329 for a 1-bed and house moves from £499 for a 2-bed, with a fixed price agreed before moving day." },
      { q: "Can you load on Tooting High Street?", a: "It’s part of the A24 red route, so we normally load from a side street or a suspended bay nearby and plan it in advance." },
      { q: "Do you offer man and van in Tooting?", a: "Yes, from £50 per hour with a two-hour minimum." },
    ],
  },
];
