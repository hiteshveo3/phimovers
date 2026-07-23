import { allServices, slugify, type ServiceItem } from "./data";

export type AreaFaq = { q: string; a: string };

export type Area = {
  name: string;
  slug: string;
  /** Short SEO blurb used on area + combo pages */
  blurb: string;
  /** Nearby borough names (slugified on build) */
  nearby: string[];
  /** Typical housing stock movers see here */
  housing: string;
  /** Parking, permits, stairs and van-access notes */
  access: string;
  /** Local FAQs for the borough hub page */
  faqs: AreaFaq[];
};

type AreaInput = Omit<Area, "slug" | "nearby"> & { nearby: string[] };

const def = (a: AreaInput): Area => ({
  ...a,
  slug: slugify(a.name),
  nearby: a.nearby.map(slugify),
});

/** All 32 London boroughs + City — canonical area data for /areas and combos. */
export const areas: Area[] = [
  def({
    name: "Barking & Dagenham",
    blurb:
      "East London borough with terraced streets, estate access and easy A13 links for house and flat moves.",
    nearby: ["Havering", "Redbridge", "Newham"],
    housing:
      "Mostly terraced houses, post-war estates and newer riverside flats. Family house moves and flat-to-flat jobs are both common, with occasional longer carries from estate parking bays.",
    access:
      "A13 corridors keep larger vans moving, but estate roads and resident bays need a clear loading plan. Suspended bays help on tighter streets — arrange a few working days ahead when possible.",
    faqs: [
      {
        q: "Do you cover Barking & Dagenham for house removals?",
        a: "Yes — fixed-price house, flat and man & van moves across Barking, Dagenham and the wider borough, with insured crews who know east London access.",
      },
      {
        q: "Is parking difficult for a removals van here?",
        a: "Some estate and terrace streets are tight. Tell us both addresses and we’ll advise on bay suspension or the best loading spot before moving day.",
      },
      {
        q: "How fast can I get a quote for Barking & Dagenham?",
        a: "WhatsApp or call with postcodes and a quick inventory — most replies within about one working hour.",
      },
    ],
  }),
  def({
    name: "Barnet",
    blurb:
      "North London’s largest borough — Victorian houses, new builds and busy high streets around Finchley and High Barnet.",
    nearby: ["Enfield", "Haringey", "Harrow", "Camden"],
    housing:
      "Victorian and Edwardian houses in Finchley and Highgate edges, suburban family homes further north, plus flats along high streets. Three-bed house moves are a regular booking.",
    access:
      "Driveways help in outer Barnet; closer to Finchley and Golders Green you’ll meet controlled parking and busier high streets. Share photos of access if the van can’t stop by the door.",
    faqs: [
      {
        q: "Do you move houses across Barnet?",
        a: "Yes — from High Barnet to Finchley and beyond. We quote from inventory and access so larger north London homes get a fixed price, not an open-ended hourly bill.",
      },
      {
        q: "Can you do evening moves in Barnet?",
        a: "Often yes, subject to crew and any local quiet-hour rules. Ask when you enquire and we’ll confirm an evening or weekend window.",
      },
      {
        q: "Do I need a survey for a Barnet house move?",
        a: "Larger homes and awkward access benefit from a free home or video survey. Smaller flats can usually be quoted from photos and a list.",
      },
    ],
  }),
  def({
    name: "Bexley",
    blurb:
      "South-east London with suburban houses, riverside flats and straightforward van access on most residential roads.",
    nearby: ["Greenwich", "Bromley", "Havering"],
    housing:
      "Suburban semis and terraces dominate, with riverside flats toward Thamesmead edges. Good fit for Luton vans on many residential roads.",
    access:
      "Van access is generally kinder than central London, though cul-de-sacs and school-run traffic can slow loading. Driveways and wider roads make many jobs quicker.",
    faqs: [
      {
        q: "Is man & van available in Bexley?",
        a: "Yes — hourly man & van from £50/hour with a two-hour minimum, plus fixed quotes for full house and flat removals across Bexley.",
      },
      {
        q: "Do you cover riverside flats as well as houses?",
        a: "Yes. Tell us about lifts, floors and parking so we send the right crew size.",
      },
      {
        q: "How do you price a Bexley house move?",
        a: "Full house moves get a fixed quotation from volume, access and distance. Small loads can use hourly pricing instead.",
      },
    ],
  }),
  def({
    name: "Brent",
    blurb:
      "North-west London from Wembley to Willesden — flats, family homes and busy A-road corridors.",
    nearby: ["Harrow", "Ealing", "Camden", "Barnet"],
    housing:
      "Mix of terraces, mansion blocks and newer Wembley high-rises. Flat moves with lifts and house clearances both feature heavily.",
    access:
      "A-road corridors are fast between jobs; side streets near Willesden and Kilburn often need permit thinking. Stadium-event days around Wembley can affect timing — flag match days if you know them.",
    faqs: [
      {
        q: "Do you offer sofa delivery in Brent?",
        a: "Yes — dedicated sofa runs from around £55 depending on size, floors and distance across Wembley, Willesden and the wider borough.",
      },
      {
        q: "Can you move on a Wembley event day?",
        a: "Possible, but traffic and parking get harder. Tell us the date and we’ll plan an earlier slot or alternate approach route.",
      },
      {
        q: "Are student moves available in Brent?",
        a: "Yes — budget-friendly student and small flat moves with clear hourly or fixed options.",
      },
    ],
  }),
  def({
    name: "Bromley",
    blurb:
      "Large south-east borough with suburban roads, parking considerations and longer carry distances on some streets.",
    nearby: ["Bexley", "Lewisham", "Croydon", "Greenwich"],
    housing:
      "Large family houses, suburban semis and town-centre flats. Longer drives and bigger inventories are common compared with inner London.",
    access:
      "Many roads take a Luton comfortably; some private estates and narrow lanes need a smaller van or longer carry. Mention gates, gravel drives and parking rules when you book.",
    faqs: [
      {
        q: "Do you cover the whole of Bromley borough?",
        a: "Yes — including outer neighbourhoods. Distance beyond the first included miles is priced clearly in your quote.",
      },
      {
        q: "What size van for a Bromley family house?",
        a: "Many 3–4 bed homes need a Luton and a full crew. WhatsApp room photos and we’ll confirm before moving day.",
      },
      {
        q: "Can you combine removals with storage?",
        a: "Yes — useful if completion dates in Bromley don’t line up. We can collect, store and deliver when keys are ready.",
      },
    ],
  }),
  def({
    name: "Camden",
    blurb:
      "Central / north London — Georgian terraces, mansion blocks, tight streets and controlled parking near the centre.",
    nearby: ["Islington", "Westminster", "Haringey", "Barnet", "Brent"],
    housing:
      "Georgian and Victorian terraces, mansion blocks, basement flats and modern apartments around Camden Town, Kentish Town and Swiss Cottage.",
    access:
      "Controlled parking and narrow streets are normal. Suspended bays or early slots help near the centre; mansion blocks may need porter notice and lift bookings.",
    faqs: [
      {
        q: "Do you do flat removals in Camden?",
        a: "Yes — walk-ups and mansion blocks are everyday work. Tell us floors, lift access and parking so we quote accurately.",
      },
      {
        q: "Will you move a sofa up a Camden staircase?",
        a: "Yes, by hand. Photos of the sofa and stairwell help us plan; extreme access is flagged before booking.",
      },
      {
        q: "How early should I book in Camden?",
        a: "Weekends fill fast. Mid-week is more flexible; same-day is sometimes available if you message early.",
      },
    ],
  }),
  def({
    name: "City of London",
    blurb:
      "The Square Mile — office-heavy moves, early-morning slots and strict loading rules around the City.",
    nearby: ["Tower Hamlets", "Westminster", "Islington", "Southwark", "Hackney"],
    housing:
      "Mostly offices, serviced apartments and limited residential. Office, IT and out-of-hours commercial moves dominate.",
    access:
      "Loading bays, timed restrictions and security desks are the norm. Early morning or weekend cutovers usually work best — we plan around City access rules.",
    faqs: [
      {
        q: "Do you handle office removals in the City?",
        a: "Yes — evening and weekend office moves with a clear project plan so trading or desk time isn’t lost mid-week.",
      },
      {
        q: "Can vans load in the Square Mile during the day?",
        a: "Sometimes, but restrictions are tight. We’ll confirm bay rules and often prefer early or weekend windows.",
      },
      {
        q: "Do you move IT and servers from City offices?",
        a: "Yes via our IT & server relocation option, coordinated with your IT team’s power-down window.",
      },
    ],
  }),
  def({
    name: "Croydon",
    blurb:
      "South London hub with high-rises, Victorian streets and strong demand for house removals and man & van.",
    nearby: ["Sutton", "Bromley", "Lambeth", "Merton"],
    housing:
      "Victorian terraces, suburban houses and a dense high-rise core. Flat moves with lift bookings and family house removals are both busy.",
    access:
      "Town-centre towers need lift slots and loading plans; outer Croydon is usually easier for Lutons. Congestion around the centre is worth avoiding at peak times.",
    faqs: [
      {
        q: "How much is a house removal in Croydon?",
        a: "Full houses get a fixed quote from inventory and access. Guides for smaller homes start lower; WhatsApp details for a number that fits your load.",
      },
      {
        q: "Do you move high-rise flats in central Croydon?",
        a: "Yes — book the goods lift if the building requires it and tell us which floor. We work around building rules every week.",
      },
      {
        q: "Is man & van popular in Croydon?",
        a: "Very — hourly from £50 with a two-hour minimum for studios, single items and small flat loads.",
      },
    ],
  }),
  def({
    name: "Ealing",
    blurb:
      "West London — family houses, mansion blocks and ULEZ-aware routes across Acton, Ealing and Southall.",
    nearby: ["Hounslow", "Brent", "Hammersmith & Fulham", "Hillingdon"],
    housing:
      "Period family houses, mansion blocks and newer flats across Acton, Ealing Broadway and Southall. Mixed stock means access varies street to street.",
    access:
      "ULEZ and busy Uxbridge Road corridors are part of planning. Side streets may need permits; many houses have usable driveway or kerb space if timed well.",
    faqs: [
      {
        q: "Are your vans ULEZ compliant for Ealing?",
        a: "We plan west London routes with ULEZ in mind and include relevant costs transparently in your quote when they apply.",
      },
      {
        q: "Do you cover Acton and Southall as well as Ealing Broadway?",
        a: "Yes — the whole borough. Local crews know which streets suit a Luton and which need a smaller van.",
      },
      {
        q: "Can you pack as well as move in Ealing?",
        a: "Yes — full or fragile-only packing can be added to any house or flat move.",
      },
    ],
  }),
  def({
    name: "Enfield",
    blurb:
      "North London borough with suburban houses, town-centre flats and good A10 access for larger vans.",
    nearby: ["Barnet", "Haringey", "Waltham Forest"],
    housing:
      "Suburban houses along the A10 corridor, town-centre flats and family semis. Straightforward inventories are common outside the busiest high streets.",
    access:
      "A10 access helps larger vans; some residential closes are narrower. Driveways and wider roads make many Enfield jobs efficient.",
    faqs: [
      {
        q: "Do you offer fixed-price house moves in Enfield?",
        a: "Yes — quoted from rooms, access and distance, with loading help included.",
      },
      {
        q: "Can you collect from storage and deliver in Enfield?",
        a: "Yes. We can combine secure storage with delivery when your keys are ready.",
      },
      {
        q: "How quickly can you book an Enfield move?",
        a: "Mid-week slots are often available at short notice; weekends need a bit more lead time.",
      },
    ],
  }),
  def({
    name: "Greenwich",
    blurb:
      "South-east London from riverside flats to suburban roads — stairs, lifts and permit streets are common.",
    nearby: ["Lewisham", "Bexley", "Tower Hamlets", "Southwark"],
    housing:
      "Riverside apartments, estate flats and suburban houses inland. Stairs and lift bookings show up often on peninsula and riverside jobs.",
    access:
      "Tourist and riverside zones get busy; residential streets inland are usually calmer. Permit bays and building loading rules should be checked early.",
    faqs: [
      {
        q: "Do you move flats near the river in Greenwich?",
        a: "Yes — including buildings that need lift bookings and timed loading. Share building rules with your enquiry.",
      },
      {
        q: "Is sofa delivery available in Greenwich?",
        a: "Yes, from around £55 depending on sofa size, floors and distance.",
      },
      {
        q: "Can you do weekend moves in Greenwich?",
        a: "Yes, subject to crew. Popular for key exchanges — book ahead when you can.",
      },
    ],
  }),
  def({
    name: "Hackney",
    blurb:
      "East London favourite for flat and house moves — narrow streets, conversions and busy weekend slots.",
    nearby: [
      "Islington",
      "Tower Hamlets",
      "Waltham Forest",
      "City of London",
      "Newham",
    ],
    housing:
      "Victorian conversions, warehouse flats, terraces and new builds around Hackney Central, Dalston and Homerton.",
    access:
      "Narrow streets and resident parking are the main constraint. Early starts and bay suspensions help; weekend demand is high so book ahead.",
    faqs: [
      {
        q: "Are Hackney flat moves usually walk-ups?",
        a: "Many are — conversions without lifts are common. Tell us the floor count and we’ll size the crew.",
      },
      {
        q: "Do you offer same-day moves in Hackney?",
        a: "Sometimes, especially mid-week. Message early with addresses and volume and we’ll confirm capacity.",
      },
      {
        q: "Can you move only a few items across Hackney?",
        a: "Yes — single-item or man & van pricing often fits better than a full house quote.",
      },
    ],
  }),
  def({
    name: "Hammersmith & Fulham",
    blurb:
      "West London terraces and mansion blocks with tight parking and strong evening / weekend demand.",
    nearby: [
      "Kensington & Chelsea",
      "Ealing",
      "Wandsworth",
      "Hounslow",
    ],
    housing:
      "Victorian terraces, mansion blocks and riverside flats across Hammersmith, Fulham and Shepherd’s Bush edges.",
    access:
      "Permit zones and tight kerb space are normal. Evening and weekend slots are popular around work and match-day traffic near the stadium.",
    faqs: [
      {
        q: "Do you prefer evening moves in Hammersmith & Fulham?",
        a: "Often helpful for parking and for customers finishing work. We’ll confirm quiet-hour rules for your building if needed.",
      },
      {
        q: "Can you handle mansion-block moves?",
        a: "Yes — porters, lift bookings and protected common parts are part of the plan when you tell us the building setup.",
      },
      {
        q: "Is office moving available here?",
        a: "Yes — including out-of-hours office and small business relocations across the borough.",
      },
    ],
  }),
  def({
    name: "Haringey",
    blurb:
      "North London from Tottenham to Muswell Hill — mixed housing stock and varied access for vans.",
    nearby: ["Enfield", "Islington", "Hackney", "Barnet", "Waltham Forest"],
    housing:
      "Terraces and estates toward Tottenham, larger houses up toward Muswell Hill and Crouch End, plus plenty of flats in between.",
    access:
      "Access swings from wide suburban roads to tighter Victorian streets. Share both postcodes so we don’t assume Muswell Hill access matches Tottenham.",
    faqs: [
      {
        q: "Do you cover both Tottenham and Muswell Hill?",
        a: "Yes — the whole borough. Quotes reflect the actual access at each address, not a one-size borough average.",
      },
      {
        q: "Are student moves common in Haringey?",
        a: "Yes, especially around halls and shared houses. Hourly man & van often suits student inventories.",
      },
      {
        q: "Can you dismantle furniture for a Haringey flat?",
        a: "Basic beds and flat-pack are included on most moves; complex units can be added.",
      },
    ],
  }),
  def({
    name: "Harrow",
    blurb:
      "North-west London suburban houses and flats with generally good road access for Luton vans.",
    nearby: ["Brent", "Barnet", "Hillingdon", "Ealing"],
    housing:
      "Suburban family houses, semis and town-centre flats. Many roads are Luton-friendly compared with inner boroughs.",
    access:
      "Generally good van access; watch school-run peaks and some narrower closes. Driveways often shorten carry distance.",
    faqs: [
      {
        q: "Is a Luton van usually fine in Harrow?",
        a: "For many streets yes. If you live on a tight close, send a photo and we’ll confirm.",
      },
      {
        q: "Do you offer packing services in Harrow?",
        a: "Yes — full packing, fragile-only or materials delivered ahead of moving day.",
      },
      {
        q: "How do quotes work for Harrow house moves?",
        a: "Fixed quotations from inventory, access and distance — loading help included.",
      },
    ],
  }),
  def({
    name: "Havering",
    blurb:
      "Outer east London — Romford and surrounds with suburban drives and longer inter-borough runs.",
    nearby: ["Barking & Dagenham", "Redbridge", "Bexley"],
    housing:
      "Suburban houses, newer estates and town-centre flats around Romford. Longer runs into inner London are common.",
    access:
      "Outer roads are usually van-friendly; mileage beyond the included allowance is itemised. Driveways help many family moves.",
    faqs: [
      {
        q: "Do you move from Havering into central London?",
        a: "Yes — inter-borough moves are routine. Extra miles after the included allowance are priced clearly.",
      },
      {
        q: "Can I book man & van in Romford?",
        a: "Yes — hourly from £50 with a two-hour minimum for smaller loads.",
      },
      {
        q: "Is storage available if my Havering completion slips?",
        a: "Yes — we can collect into secure storage and deliver when keys arrive.",
      },
    ],
  }),
  def({
    name: "Hillingdon",
    blurb:
      "West London including Uxbridge and Heathrow corridors — houses, flats and student-area moves.",
    nearby: ["Hounslow", "Ealing", "Harrow"],
    housing:
      "Suburban houses, flats near Uxbridge and stock linked to Heathrow-area workers and students.",
    access:
      "Generally good for larger vans away from the airport fringe; airport-side traffic and hotel zones need timed slots. ULEZ/route planning is part of west London quotes.",
    faqs: [
      {
        q: "Do you cover Uxbridge and Heathrow-side addresses?",
        a: "Yes across Hillingdon. Tell us about hotel, flat or house access so we plan parking and timing.",
      },
      {
        q: "Are student moves available near the universities?",
        a: "Yes — student and studio moves with clear hourly or fixed options.",
      },
      {
        q: "Can you move offices in Hillingdon?",
        a: "Yes — including evening cutovers for local businesses.",
      },
    ],
  }),
  def({
    name: "Hounslow",
    blurb:
      "West London borough with terraces, new builds and airport-side routes for house and office moves.",
    nearby: [
      "Ealing",
      "Hillingdon",
      "Richmond upon Thames",
      "Hammersmith & Fulham",
    ],
    housing:
      "Terraces, newer apartment blocks and family homes, with airport-corridor demand for flexible timing.",
    access:
      "Airport traffic peaks matter near Heathrow edges; residential streets inland are usually simpler. Share flight or shift constraints if timing is tight.",
    faqs: [
      {
        q: "Can you work around airport shift patterns?",
        a: "We can aim for early, evening or weekend windows — tell us your constraints when you enquire.",
      },
      {
        q: "Do you offer appliance delivery in Hounslow?",
        a: "Yes — white goods delivery and placement from around £50 depending on access.",
      },
      {
        q: "Are fixed house-move quotes available?",
        a: "Yes — full house removals are fixed-quoted from inventory and access.",
      },
    ],
  }),
  def({
    name: "Islington",
    blurb:
      "North London classic — Victorian conversions, walk-ups and controlled parking near Angel and Highbury.",
    nearby: [
      "Camden",
      "Hackney",
      "Haringey",
      "City of London",
      "Tower Hamlets",
    ],
    housing:
      "Victorian conversions, garden flats, maisonettes and some new builds around Angel, Highbury and Archway.",
    access:
      "Controlled parking and narrow streets near Angel need planning. Walk-ups are common; photos of stair turns save time on sofa and wardrobe jobs.",
    faqs: [
      {
        q: "Do you specialise in Islington walk-up flats?",
        a: "They’re a big part of our north London work. Floor count and stair photos help us quote the right crew.",
      },
      {
        q: "Is parking suspension worth it in Islington?",
        a: "On many streets yes — it can cut carry time and cost. Ask us and we’ll say if your road usually needs one.",
      },
      {
        q: "Can you move on a weekday evening in Islington?",
        a: "Often yes, subject to building rules and crew — popular after work key exchanges.",
      },
    ],
  }),
  def({
    name: "Kensington & Chelsea",
    blurb:
      "Central / west London mansion blocks, basements and strict permit zones — plan access early.",
    nearby: [
      "Westminster",
      "Hammersmith & Fulham",
      "Wandsworth",
      "Brent",
    ],
    housing:
      "Mansion blocks, stucco terraces, basement flats and high-value apartments. Careful floor and stair protection matters.",
    access:
      "Strict permit zones and loading etiquette. Porter desks, lift bookings and early slots make moves smoother — we plan access before the crew arrives.",
    faqs: [
      {
        q: "Do you move high-value homes in Kensington & Chelsea?",
        a: "Yes — with blankets, floor protection and experienced crews. Ask if you need higher goods cover for specific pieces.",
      },
      {
        q: "Are basement flat moves possible?",
        a: "Yes, with the right crew and protection. Tell us about external stairs and lightwells when you enquire.",
      },
      {
        q: "Should I book a survey?",
        a: "For larger homes or complex access, a free survey is the calmest way to lock a fixed quote.",
      },
    ],
  }),
  def({
    name: "Kingston upon Thames",
    blurb:
      "South-west London riverside town with suburban streets and popular weekend house-move slots.",
    nearby: [
      "Richmond upon Thames",
      "Merton",
      "Sutton",
      "Wandsworth",
    ],
    housing:
      "Suburban family houses, riverside flats and town-centre apartments. Weekend house moves are especially popular.",
    access:
      "Town centre can be busy on Saturdays; residential streets are often driveway-friendly. Riverside blocks may need lift and bay planning.",
    faqs: [
      {
        q: "Do you book Saturday house moves in Kingston?",
        a: "Yes — book ahead as weekends fill quickly. Mid-week is usually easier for short notice.",
      },
      {
        q: "Is man & van available for student moves?",
        a: "Yes — hourly options suit student and small flat inventories around Kingston.",
      },
      {
        q: "Can you deliver sofas across Kingston?",
        a: "Yes — dedicated sofa delivery with stairs covered, quoted from size and access.",
      },
    ],
  }),
  def({
    name: "Lambeth",
    blurb:
      "South London from Brixton to Waterloo — flats, terraces and busy A-roads into central London.",
    nearby: ["Southwark", "Wandsworth", "Croydon", "Westminster"],
    housing:
      "Terraces, estate flats, conversions and riverside apartments from Brixton through Kennington to Waterloo edges.",
    access:
      "Busy A-roads into town; side streets need permit awareness. Buildings near the river may have loading and porter rules.",
    faqs: [
      {
        q: "Do you cover Brixton and Clapham edges in Lambeth?",
        a: "Yes across the borough. Local access notes go into your quote so carry distance isn’t a surprise.",
      },
      {
        q: "Are evening moves useful in Lambeth?",
        a: "Often — less traffic and better parking windows after rush hour on many streets.",
      },
      {
        q: "Can you do office moves near Waterloo?",
        a: "Yes — including out-of-hours commercial moves with tight loading plans.",
      },
    ],
  }),
  def({
    name: "Lewisham",
    blurb:
      "South-east London with Victorian houses, new builds and mixed parking rules across the borough.",
    nearby: ["Greenwich", "Southwark", "Bromley", "Tower Hamlets"],
    housing:
      "Victorian terraces, new-build flats and family houses across Lewisham, Catford and Blackheath edges.",
    access:
      "Parking rules vary neighbourhood to neighbourhood. New-build car parks and Victorian street loading both come up — tell us which you have.",
    faqs: [
      {
        q: "Do you move flats in new-build Lewisham blocks?",
        a: "Yes — lift bookings and loading-bay rules included in the plan when you share building instructions.",
      },
      {
        q: "Is house clearance available in Lewisham?",
        a: "Yes — clearance and disposal can be booked alone or with a full move.",
      },
      {
        q: "How fast is quoting for Lewisham?",
        a: "Usually within about one working hour once we have addresses and a simple inventory.",
      },
    ],
  }),
  def({
    name: "Merton",
    blurb:
      "South-west London including Wimbledon — family houses, flats and careful driveway access.",
    nearby: ["Wandsworth", "Sutton", "Kingston upon Thames", "Croydon"],
    housing:
      "Family houses around Wimbledon and Morden, flats near transport links, and quieter suburban streets with driveway access.",
    access:
      "Driveways help many jobs; tournament and event traffic around Wimbledon can affect summer timing. Mention gates and gravel if relevant.",
    faqs: [
      {
        q: "Do you cover Wimbledon house removals?",
        a: "Yes — fixed quotes for family homes, with care for drives, lawns and tight gates.",
      },
      {
        q: "Can event weeks affect moving dates?",
        a: "They can around Wimbledon. If your date clashes with major events, we’ll suggest timing that avoids the worst congestion.",
      },
      {
        q: "Is furniture assembly available?",
        a: "Yes — basic assembly can be added to delivery or move bookings.",
      },
    ],
  }),
  def({
    name: "Newham",
    blurb:
      "East London — Stratford high-rises, terraces and strong demand for flat and student moves.",
    nearby: [
      "Tower Hamlets",
      "Hackney",
      "Barking & Dagenham",
      "Redbridge",
      "Waltham Forest",
    ],
    housing:
      "High-rise Stratford apartments, terraces and estate homes. Flat and student moves are especially frequent.",
    access:
      "Tower loading bays and lift bookings matter in Stratford; terraced streets need classic permit planning. Event days around the Olympic Park can add traffic.",
    faqs: [
      {
        q: "Do you move Stratford high-rise flats?",
        a: "Yes — we work with building loading rules and goods lifts regularly.",
      },
      {
        q: "Are student moves available in Newham?",
        a: "Yes — clear hourly or fixed options for halls and shared flats.",
      },
      {
        q: "Can you deliver single items across Newham?",
        a: "Yes — single-item and sofa deliveries with stairs covered.",
      },
    ],
  }),
  def({
    name: "Redbridge",
    blurb:
      "North-east London suburban houses and flats with typically straightforward van access.",
    nearby: [
      "Waltham Forest",
      "Newham",
      "Barking & Dagenham",
      "Havering",
      "Enfield",
    ],
    housing:
      "Suburban family houses, semis and town-centre flats around Ilford and beyond. Many streets suit larger vans.",
    access:
      "Generally straightforward compared with central boroughs. High-street parking peaks still need a loading plan.",
    faqs: [
      {
        q: "Are Luton vans usually OK in Redbridge?",
        a: "On many residential roads yes. Send a photo if your street is particularly narrow.",
      },
      {
        q: "Do you offer fixed house-move prices?",
        a: "Yes — quoted from inventory, access and distance with loading included.",
      },
      {
        q: "Can you help with packing materials?",
        a: "Yes — materials kits or full packing can be added before moving day.",
      },
    ],
  }),
  def({
    name: "Richmond upon Thames",
    blurb:
      "South-west London leafy streets, period houses and riverside flats — protect floors and plan parking.",
    nearby: [
      "Kingston upon Thames",
      "Hounslow",
      "Wandsworth",
      "Hammersmith & Fulham",
    ],
    housing:
      "Period family houses, leafy suburban streets and riverside flats. Floor protection and careful carrying are expected.",
    access:
      "Charming but sometimes narrow streets; parking near the river and town needs planning. Soft landscaping and gravel drives deserve extra care.",
    faqs: [
      {
        q: "Do you take extra care with period homes in Richmond?",
        a: "Yes — blankets, floor protection and careful stair work are standard on these jobs.",
      },
      {
        q: "Is weekend booking essential?",
        a: "Weekends are popular; mid-week often means easier parking and faster quotes turned into slots.",
      },
      {
        q: "Can you move pianos in Richmond?",
        a: "Yes via our piano & specialist service with the right crew and kit.",
      },
    ],
  }),
  def({
    name: "Southwark",
    blurb:
      "Central / south London — warehouse conversions, estates and tight streets near the river.",
    nearby: [
      "Lambeth",
      "Lewisham",
      "Tower Hamlets",
      "City of London",
      "Greenwich",
    ],
    housing:
      "Warehouse conversions, estate flats, terraces and riverside apartments from Borough to Peckham and beyond.",
    access:
      "Tight streets near the river and busy estate loading points. Building managers often require timed slots — share those rules early.",
    faqs: [
      {
        q: "Do you move warehouse conversions in Southwark?",
        a: "Yes — wide sofas and tight staircores are planned with photos before moving day.",
      },
      {
        q: "Are early morning slots available?",
        a: "Often preferred near the river and City edge. Ask when you enquire.",
      },
      {
        q: "Can you do office moves in Southwark?",
        a: "Yes — including evening and weekend commercial relocations.",
      },
    ],
  }),
  def({
    name: "Sutton",
    blurb:
      "South London suburban borough with family houses and generally good access for removals vans.",
    nearby: ["Croydon", "Merton", "Kingston upon Thames"],
    housing:
      "Family houses, semis and quieter suburban streets — classic Luton-friendly stock for many jobs.",
    access:
      "Generally good van access with fewer central-London constraints. School-run peaks are the main timing watch-out.",
    faqs: [
      {
        q: "Are house removals in Sutton usually straightforward for vans?",
        a: "Many are — though every street differs. We’ll still confirm access from your addresses and photos.",
      },
      {
        q: "Do you offer man & van in Sutton?",
        a: "Yes — hourly from £50 with a two-hour minimum for smaller loads.",
      },
      {
        q: "Can you combine a move with end-of-tenancy cleaning?",
        a: "Yes — clean after the van leaves so the property is empty first.",
      },
    ],
  }),
  def({
    name: "Tower Hamlets",
    blurb:
      "East London docks and city-edge — high-rises, warehouse flats and strict loading bays.",
    nearby: [
      "Hackney",
      "City of London",
      "Newham",
      "Southwark",
      "Islington",
    ],
    housing:
      "Docklands high-rises, warehouse flats and denser East End terraces. Lift bookings and loading-bay slots are routine.",
    access:
      "Strict building loading rules near Canary Wharf and the City edge. We plan bay times and security check-ins before the crew arrives.",
    faqs: [
      {
        q: "Do you move Canary Wharf and docklands flats?",
        a: "Yes — with building loading rules and lift bookings factored into the plan.",
      },
      {
        q: "Are weekend moves better in Tower Hamlets?",
        a: "Sometimes, when office traffic drops. We’ll recommend based on your building’s rules.",
      },
      {
        q: "Can you move offices in Tower Hamlets?",
        a: "Yes — evening cutovers are common so desks are ready next morning.",
      },
    ],
  }),
  def({
    name: "Waltham Forest",
    blurb:
      "North-east London — Walthamstow terraces, flats and popular man & van routes.",
    nearby: ["Hackney", "Haringey", "Enfield", "Redbridge", "Newham"],
    housing:
      "Terraces, conversions and flats around Walthamstow and Leyton — strong demand for flat moves and man & van.",
    access:
      "Resident parking and narrower Victorian streets are common. Early starts help; bay suspensions are useful on the tightest roads.",
    faqs: [
      {
        q: "Is man & van popular in Walthamstow?",
        a: "Yes — hourly pricing suits many small flat and single-item jobs across Waltham Forest.",
      },
      {
        q: "Do you handle walk-up conversions?",
        a: "Regularly. Floor count and stair photos make quotes more accurate.",
      },
      {
        q: "Can you collect marketplace sofas in Waltham Forest?",
        a: "Yes — sofa and single-item delivery across the borough.",
      },
    ],
  }),
  def({
    name: "Wandsworth",
    blurb:
      "South-west London — popular for house removals, sofas and busy Saturday bookings.",
    nearby: [
      "Lambeth",
      "Merton",
      "Hammersmith & Fulham",
      "Richmond upon Thames",
      "Kensington & Chelsea",
    ],
    housing:
      "Victorian houses, mansion flats and popular family streets across Battersea, Balham, Tooting and Putney edges.",
    access:
      "Busy Saturday demand; permit streets near the river and commons need planning. Mid-week slots are often calmer for parking.",
    faqs: [
      {
        q: "Why are Saturday moves busy in Wandsworth?",
        a: "Key exchanges cluster at weekends. Book ahead for Saturdays; mid-week is usually easier at short notice.",
      },
      {
        q: "Do you deliver sofas in Battersea and Balham?",
        a: "Yes — stairs and tight landings included, quoted from sofa size and floors.",
      },
      {
        q: "Can you do evening removals in Wandsworth?",
        a: "Often yes — useful after work and when daytime parking is scarce.",
      },
    ],
  }),
  def({
    name: "Westminster",
    blurb:
      "Central London — mansion blocks, porters, tight loading and early slots preferred.",
    nearby: [
      "Camden",
      "Kensington & Chelsea",
      "City of London",
      "Lambeth",
      "Islington",
    ],
    housing:
      "Mansion blocks, portered buildings, mews houses and high-spec flats. Precision loading beats raw van size.",
    access:
      "Tight loading, Congestion Charge considerations and porter protocols. Early morning slots usually work best — we plan access before dispatch.",
    faqs: [
      {
        q: "Do you move portered mansion blocks in Westminster?",
        a: "Yes — we work with porter desks, lift bookings and protected common areas when you share the building rules.",
      },
      {
        q: "Is an early slot better in Westminster?",
        a: "Usually yes for parking and building access. Ask for an early window when you enquire.",
      },
      {
        q: "Are office moves available in Westminster?",
        a: "Yes — evening and weekend commercial moves with a clear project plan.",
      },
    ],
  }),
];

export function getAreaBySlug(slug: string): Area | undefined {
  return areas.find((a) => a.slug === slug);
}

export function getNearbyAreas(slug: string, count = 6): Area[] {
  const area = getAreaBySlug(slug);
  if (!area) return areas.filter((a) => a.slug !== slug).slice(0, count);
  const nearby = area.nearby
    .map((s) => getAreaBySlug(s))
    .filter((a): a is Area => Boolean(a));
  if (nearby.length >= count) return nearby.slice(0, count);
  const rest = areas.filter(
    (a) => a.slug !== slug && !nearby.some((n) => n.slug === a.slug)
  );
  return [...nearby, ...rest].slice(0, count);
}

/** Full area × service matrix — every borough × every service (1000+ pages). */
export function allAreaServiceParams(): { borough: string; service: string }[] {
  const params: { borough: string; service: string }[] = [];
  for (const a of areas) {
    for (const s of allServices) {
      params.push({ borough: a.slug, service: s.slug });
    }
  }
  return params;
}

export function comboHref(boroughSlug: string, serviceSlug: string) {
  return `/areas/${boroughSlug}/${serviceSlug}`;
}

export function areaHref(boroughSlug: string) {
  return `/areas/${boroughSlug}`;
}

/** Display names list (backward compatible with older pages). */
export const londonBoroughNames = areas.map((a) => a.name);

export function servicesForArea(): ServiceItem[] {
  return allServices;
}

/** Region groups for scannable area directories (no coloured chips). */
export const areaRegions: { label: string; slugs: string[] }[] = [
  {
    label: "Central",
    slugs: [
      "city-of-london",
      "westminster",
      "camden",
      "islington",
      "kensington-and-chelsea",
      "southwark",
    ],
  },
  {
    label: "North",
    slugs: ["barnet", "enfield", "haringey", "harrow", "brent"],
  },
  {
    label: "East",
    slugs: [
      "hackney",
      "tower-hamlets",
      "newham",
      "waltham-forest",
      "redbridge",
      "barking-and-dagenham",
      "havering",
    ],
  },
  {
    label: "South",
    slugs: [
      "lambeth",
      "wandsworth",
      "lewisham",
      "greenwich",
      "croydon",
      "bromley",
      "bexley",
      "merton",
      "sutton",
      "kingston-upon-thames",
      "richmond-upon-thames",
    ],
  },
  {
    label: "West",
    slugs: [
      "hammersmith-and-fulham",
      "ealing",
      "hounslow",
      "hillingdon",
    ],
  },
];

export function areasByRegion(): { label: string; areas: Area[] }[] {
  return areaRegions.map((r) => ({
    label: r.label,
    areas: r.slugs
      .map((s) => getAreaBySlug(s))
      .filter((a): a is Area => Boolean(a)),
  }));
}
