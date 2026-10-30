import type { AreaFaq } from "./areas";

/**
 * London neighbourhoods people search by name ("removals chelsea", "man and van
 * wimbledon") rather than by borough. Each gets a hub page and only the service
 * combos that keyword data supports (Phase 2 of content-plan-pages.csv); every
 * other service links through to the parent borough's page.
 */
export type NeighbourhoodInput = {
  name: string;
  /** Parent borough slug — must exist in lib/areas.ts */
  borough: string;
  postcodes: string;
  /** Combo pages to build in addition to house-removals and man-and-van */
  extraServices?: string[];
  blurb: string;
  nearby: string[];
  housing: string;
  access: string;
  faqs: AreaFaq[];
};

export const NEIGHBOURHOOD_CORE_SERVICES = ["house-removals", "man-and-van"];

export const neighbourhoods: NeighbourhoodInput[] = [
  {
    name: "Chelsea",
    borough: "kensington-and-chelsea",
    postcodes: "SW3 SW10",
    blurb:
      "Chelsea removals for mansion flats, garden squares and period houses between the King’s Road and the Embankment.",
    nearby: ["Fulham", "Battersea", "Kensington & Chelsea", "Westminster", "Hammersmith & Fulham"],
    housing:
      "Red-brick mansion blocks, Georgian and Victorian terraces, mews houses and a growing number of riverside apartments around Chelsea Harbour and Lots Road. Moves often include antiques, artwork and large wardrobes that need extra wrapping.",
    access:
      "Chelsea sits inside Kensington & Chelsea’s controlled parking zones, so a bay suspension or a dispensation is usually needed for the van. Porters and building managers in mansion blocks often ask for lift bookings and proof of insurance in advance, and the Embankment and King’s Road carry red-route restrictions.",
    faqs: [
      { q: "Can you arrange parking for a move in Chelsea?", a: "Yes — tell us your street and date and we’ll advise on a bay suspension with Kensington & Chelsea, or plan around loading rules where suspensions aren’t practical." },
      { q: "Do you move antiques and artwork in Chelsea homes?", a: "Yes. We wrap antiques, mirrors and framed art individually and can add fragile-only packing for the most delicate pieces." },
      { q: "Will you provide insurance documents for my building?", a: "Yes — many Chelsea mansion blocks ask for a certificate of insurance before moving day, and we send it on request." },
    ],
  },
  {
    name: "Fulham",
    borough: "hammersmith-and-fulham",
    postcodes: "SW6",
    blurb:
      "Fulham removals and man and van for Victorian terraces, conversions and riverside flats from Parsons Green to Sands End.",
    nearby: ["Chelsea", "Putney", "Hammersmith & Fulham", "Wandsworth", "Kensington & Chelsea"],
    housing:
      "Long streets of Victorian terraces, many split into upper and lower flats, plus mansion blocks and newer riverside developments at Imperial Wharf and Fulham Reach. Family house moves and two-bed flat moves are the most common jobs.",
    access:
      "Most Fulham streets are residents’ permit zones, so the van usually needs a suspended bay. Match days at Craven Cottage and Stamford Bridge bring road closures and heavy traffic, and Fulham Palace Road and the New King’s Road are slow at rush hour — we plan timings around them.",
    faqs: [
      { q: "Do football match days affect moves in Fulham?", a: "They can. We check the Fulham and Chelsea fixture lists when you book and avoid kick-off windows near Craven Cottage and Stamford Bridge." },
      { q: "Can you move a top-floor conversion flat in Fulham?", a: "Yes — narrow conversion stairs are routine for us. Tell us the floor and any tight turns so we send the right crew size." },
      { q: "Do you offer man and van in Fulham?", a: "Yes, from £50 per hour with a two-hour minimum, ideal for single items and smaller flat moves." },
    ],
  },
  {
    name: "Battersea",
    borough: "wandsworth",
    postcodes: "SW8 SW11",
    blurb:
      "Battersea removals for Victorian terraces between the commons and new-build towers at Battersea Power Station and Nine Elms.",
    nearby: ["Clapham", "Balham", "Chelsea", "Wandsworth", "Lambeth"],
    housing:
      "Victorian terraces around Northcote Road and ‘between the commons’, mansion flats on Prince of Wales Drive, and large modern developments at Battersea Power Station, Nine Elms and along the riverside.",
    access:
      "New-build towers in Battersea and Nine Elms usually require a booked loading bay, goods lift slot and insurance certificate. Terraced streets are permit zones, so a bay suspension is often needed. Queenstown Road and the roads around the Power Station are busy at peak times.",
    faqs: [
      { q: "Can you move into Battersea Power Station flats?", a: "Yes. We book the loading bay and goods lift with the concierge and send our insurance documents in advance." },
      { q: "Do you cover both Battersea Park and Clapham Junction?", a: "Yes — all of SW11 and SW8, including Battersea Park, Clapham Junction, Nine Elms and Queenstown Road." },
      { q: "Is there a man and van in Battersea for single items?", a: "Yes. Our Battersea man and van is ideal for single items, marketplace collections and small flat moves." },
    ],
  },
  {
    name: "Wimbledon",
    borough: "merton",
    postcodes: "SW19 SW20",
    extraServices: ["secure-storage"],
    blurb:
      "Wimbledon removals, man and van and storage for family houses in the Village, Wimbledon Park and Raynes Park.",
    nearby: ["Putney", "Surbiton", "Balham", "Merton", "Wandsworth", "Kingston upon Thames"],
    housing:
      "Large Victorian and Edwardian family houses up the hill in Wimbledon Village, semis and terraces around Wimbledon Park and South Wimbledon, and flats close to the town centre and station.",
    access:
      "Many residential streets have driveways or easier parking than inner London, but the town centre is busy and permit zones apply near the station. During the Championships in late June and July, roads around the All England Club are closed or heavily restricted — we plan around the tennis.",
    faqs: [
      { q: "Can you move house in Wimbledon during the tennis?", a: "Yes, but road closures around the All England Club affect routes. We’ll suggest timings or routes that avoid the worst of it." },
      { q: "Do you offer removals and storage in Wimbledon?", a: "Yes. We collect from your Wimbledon home, store your belongings securely and deliver when your new place is ready." },
      { q: "How much is a 3-bed house move in Wimbledon?", a: "Three-bed house moves start from £749. Your fixed quote depends on inventory, access and distance." },
    ],
  },
  {
    name: "Twickenham",
    borough: "richmond-upon-thames",
    postcodes: "TW1 TW2",
    extraServices: ["office-removals"],
    blurb:
      "Twickenham removals, man and van and office moves — riverside homes, family semis and local businesses, planned around match days.",
    nearby: ["Surbiton", "Chiswick", "Richmond upon Thames", "Hounslow", "Kingston upon Thames"],
    housing:
      "Victorian and Edwardian terraces near the town centre, larger riverside homes around St Margarets and Strawberry Hill, and 1930s semis further west. Family house moves are the most common jobs.",
    access:
      "Most streets are easy for a Luton van, though controlled parking applies near the station and town centre. Rugby match days at Twickenham Stadium bring road closures and very heavy traffic, so we check fixtures before booking.",
    faqs: [
      { q: "Do rugby match days affect moves in Twickenham?", a: "Yes — roads around the stadium close and traffic builds for hours. We check fixtures and avoid those windows where possible." },
      { q: "Do you do office removals in Twickenham?", a: "Yes. We move Twickenham offices out of hours, with labelled desks and careful IT handling." },
      { q: "Can you move riverside homes in St Margarets?", a: "Yes. We plan for longer carries and narrow lanes common near the river." },
    ],
  },
  {
    name: "Ilford",
    borough: "redbridge",
    postcodes: "IG1 IG2 IG3 IG4 IG6",
    blurb:
      "Ilford removals and man and van for terraced houses, town-centre flats and new apartment blocks near the Elizabeth line.",
    nearby: ["Romford", "Walthamstow", "Redbridge", "Barking & Dagenham", "Newham"],
    housing:
      "Long rows of Edwardian and 1930s terraced houses, semis in Gants Hill and Newbury Park, and a growing number of high-rise flats in Ilford town centre close to the station.",
    access:
      "Most residential roads take a Luton van with little trouble. Town-centre blocks usually need a goods lift booking, and the High Road and Ley Street get busy at peak times.",
    faqs: [
      { q: "Do you move flats in Ilford town centre?", a: "Yes — we book goods lifts and loading bays with building management for town-centre apartment blocks." },
      { q: "Do you offer house removals across all of Ilford?", a: "Yes, across IG1 to IG6, including Gants Hill, Newbury Park, Seven Kings and Goodmayes." },
      { q: "How much is a man and van in Ilford?", a: "Our Ilford man and van starts from £50 per hour with a two-hour minimum." },
    ],
  },
  {
    name: "Walthamstow",
    borough: "waltham-forest",
    postcodes: "E17",
    blurb:
      "Walthamstow man and van and removals for Victorian terraces, Village cottages and new flats, with low-traffic streets planned in.",
    nearby: ["Ilford", "Waltham Forest", "Hackney", "Haringey", "Redbridge"],
    housing:
      "Rows of Victorian and Edwardian terraces, small cottages in Walthamstow Village, conversion flats and new-build blocks close to the station and Blackhorse Road.",
    access:
      "Waltham Forest’s low-traffic schemes mean some streets can only be reached from one direction, which affects van routes. We check the access to your exact address beforehand so the van can get as close as possible.",
    faqs: [
      { q: "Do low-traffic schemes in Walthamstow affect moves?", a: "They can change how the van reaches your door. We plan the route in advance so the crew isn’t carrying further than necessary." },
      { q: "Can you move a flat near Walthamstow Central?", a: "Yes — conversion flats and new-build blocks near the station are everyday jobs for us." },
      { q: "Is there a man and van in Walthamstow?", a: "Yes, from £50 per hour with a two-hour minimum." },
    ],
  },
  {
    name: "Brixton",
    borough: "lambeth",
    postcodes: "SW2 SW9",
    blurb:
      "Brixton removals and man and van for Victorian conversions, estate flats and busy high-street addresses.",
    nearby: ["Clapham", "Balham", "Peckham", "Lambeth", "Southwark"],
    housing:
      "Victorian houses split into flats, mansion blocks around Brixton Hill, and large estates with long walkways and lifts. Flat moves are much more common than whole-house moves.",
    access:
      "Brixton Road and Brixton Hill are red routes, so the van can’t simply stop outside on the main road. Side streets are permit zones, and market days make Electric Avenue and Atlantic Road congested. We plan loading on nearby streets with suspensions where needed.",
    faqs: [
      { q: "Can you load on Brixton Road?", a: "Brixton Road is a red route, so we usually load from a side street or a suspended bay nearby. We’ll plan this before the day." },
      { q: "Do you move estate flats in Brixton?", a: "Yes. Tell us about lifts and walkway distance so we bring the right crew size." },
      { q: "Do you offer man and van in Brixton?", a: "Yes, our Brixton man and van starts from £50 per hour." },
    ],
  },
  {
    name: "Balham",
    borough: "wandsworth",
    postcodes: "SW12 SW17",
    blurb:
      "Balham man and van and removals for family terraces, mansion flats and conversions between the commons.",
    nearby: ["Clapham", "Battersea", "Brixton", "Wimbledon", "Wandsworth"],
    housing:
      "Victorian and Edwardian family terraces, many conversions into flats, and mansion blocks close to Balham High Road. Young families moving up from flats to houses are a common job.",
    access:
      "Balham High Road is a busy main road, and most side streets are in permit zones. A bay suspension helps on narrow terraced streets where double parking isn’t possible.",
    faqs: [
      { q: "Do you do flat-to-house moves in Balham?", a: "Yes — it’s one of our most common Balham jobs. A two-bed house move starts from £499." },
      { q: "Do I need a parking suspension in Balham?", a: "Often, on narrow terraced streets. We’ll advise once we know your address." },
      { q: "Is there a man and van in Balham for single items?", a: "Yes, from £50 per hour with a two-hour minimum." },
    ],
  },
  {
    name: "Chiswick",
    borough: "hounslow",
    postcodes: "W4",
    blurb:
      "Chiswick man and van and removals for large period houses, Bedford Park homes and riverside flats.",
    nearby: ["Acton", "Twickenham", "Hounslow", "Ealing", "Hammersmith & Fulham"],
    housing:
      "Large Victorian and Edwardian houses, the distinctive homes of Bedford Park, riverside properties along Strand on the Green and mansion flats near Turnham Green.",
    access:
      "Chiswick High Road is busy throughout the day, and the A4 and Hogarth Roundabout slow down peak-time journeys. Most residential streets are permit zones, so we often arrange a bay suspension for larger moves.",
    faqs: [
      { q: "Do you move large family houses in Chiswick?", a: "Yes. Four-bed and larger house moves start from £999, with packing available." },
      { q: "Can you avoid the A4 at rush hour?", a: "We schedule Chiswick moves to avoid the worst peak traffic where possible." },
      { q: "Do you offer man and van in Chiswick?", a: "Yes, from £50 per hour with a two-hour minimum." },
    ],
  },
  {
    name: "Clapham",
    borough: "lambeth",
    postcodes: "SW4",
    blurb:
      "Clapham removals and man and van for Victorian terraces, conversion flats and house shares around the Common.",
    nearby: ["Battersea", "Balham", "Brixton", "Lambeth", "Wandsworth"],
    housing:
      "Victorian terraces, many converted into flats, mansion blocks near the Common, and a lot of shared houses. Flat moves and flat-share moves are especially common.",
    access:
      "Clapham High Street and the roads around the Common are busy, and most residential streets are permit-controlled. A bay suspension keeps loading quick on narrow streets.",
    faqs: [
      { q: "Do you help with flat-share moves in Clapham?", a: "Yes. Our hourly man and van is ideal for moving one room or a few items between flat shares." },
      { q: "Can you move a top-floor flat in Clapham?", a: "Yes. Tell us the floor and stair width so we send enough crew." },
      { q: "Do you cover Clapham North and Clapham South?", a: "Yes, all of SW4 and the surrounding streets." },
    ],
  },
  {
    name: "Acton",
    borough: "ealing",
    postcodes: "W3",
    blurb:
      "Acton man and van and removals for conversions, 1930s semis and new-build flats close to the Elizabeth line.",
    nearby: ["Chiswick", "Ealing", "Hammersmith & Fulham", "Brent", "Hounslow"],
    housing:
      "Victorian conversions, mansion blocks, 1930s semis around East Acton and a lot of new-build apartments near Acton Main Line and South Acton.",
    access:
      "Acton has a mix of permit zones and easier suburban streets. The Uxbridge Road and the A40 are busy at peak times, and new-build blocks usually need a loading bay booking.",
    faqs: [
      { q: "Do you move new-build flats in Acton?", a: "Yes — we book the loading bay and goods lift with building management." },
      { q: "How much is a man and van in Acton?", a: "From £50 per hour with a two-hour minimum." },
      { q: "Do you cover North, South and East Acton?", a: "Yes, all of W3." },
    ],
  },
  {
    name: "Putney",
    borough: "wandsworth",
    postcodes: "SW15",
    extraServices: ["office-removals"],
    blurb:
      "Putney removals and office moves — riverside flats, family houses and local businesses near the High Street.",
    nearby: ["Fulham", "Wimbledon", "Battersea", "Wandsworth", "Richmond upon Thames"],
    housing:
      "Riverside apartments along the Embankment, Victorian and Edwardian family houses, mansion flats and larger estates towards Roehampton.",
    access:
      "Putney High Street and Putney Bridge are among the busiest roads in south-west London, so timing matters. Residential streets are permit-controlled and some riverside blocks need a loading booking.",
    faqs: [
      { q: "Do you do office removals in Putney?", a: "Yes. We move Putney offices in the evening or at weekends to avoid lost working time." },
      { q: "Can you avoid Putney High Street traffic?", a: "We plan the route and timing around peak traffic on the High Street and the bridge." },
      { q: "Do you move riverside flats in Putney?", a: "Yes, including loading bay and lift bookings where needed." },
    ],
  },
  {
    name: "Sidcup",
    borough: "bexley",
    postcodes: "DA14 DA15",
    blurb:
      "Sidcup man and van and removals for suburban semis, family houses and town-centre flats.",
    nearby: ["Beckenham", "Bexley", "Bromley", "Greenwich", "Woolwich"],
    housing:
      "Mostly 1930s semis and detached family houses, with flats around Sidcup High Street and the station.",
    access:
      "Many Sidcup homes have driveways or easy kerbside parking, which keeps loading quick. The A20 and A222 can be slow at rush hour.",
    faqs: [
      { q: "Do you cover all of Sidcup?", a: "Yes, across DA14 and DA15, including Blackfen and Lamorbey." },
      { q: "How much is a man and van in Sidcup?", a: "From £50 per hour with a two-hour minimum." },
      { q: "Can you move us from Sidcup into central London?", a: "Yes — we move between Sidcup and anywhere in London." },
    ],
  },
  {
    name: "Romford",
    borough: "havering",
    postcodes: "RM1 RM2 RM3 RM5 RM6 RM7",
    blurb:
      "Romford man and van and removals for suburban houses, new-build flats and town-centre apartments.",
    nearby: ["Ilford", "Havering", "Barking & Dagenham", "Redbridge"],
    housing:
      "Suburban semis and detached houses, with new-build flats and apartment blocks around Romford town centre and the station.",
    access:
      "Most residential streets are easy for a Luton van. The ring road and town centre are busy on market days and weekends, and town-centre blocks usually need a lift booking.",
    faqs: [
      { q: "Do you do house removals in Romford?", a: "Yes, fixed-price house moves from £499 for a two-bed home." },
      { q: "Is there a man and van in Romford?", a: "Yes, from £50 per hour with a two-hour minimum." },
      { q: "Can you move us from Romford to Essex?", a: "Send both postcodes and we’ll quote — the first 10 miles are included." },
    ],
  },
  {
    name: "Beckenham",
    borough: "bromley",
    postcodes: "BR3",
    blurb:
      "Beckenham man and van and removals for Victorian and Edwardian family houses and flats near the High Street.",
    nearby: ["Sidcup", "Bromley", "Croydon", "Lewisham"],
    housing:
      "Large Victorian and Edwardian family houses, inter-war semis and purpose-built flats near Beckenham High Street and the stations.",
    access:
      "Most streets have good access and many homes have driveways. Parking near the High Street and stations is more restricted.",
    faqs: [
      { q: "Do you move large family houses in Beckenham?", a: "Yes. We quote from your inventory and can add packing and dismantling." },
      { q: "How much is a man and van in Beckenham?", a: "From £50 per hour with a two-hour minimum." },
      { q: "Do you cover Elmers End and Eden Park?", a: "Yes, all of BR3." },
    ],
  },
  {
    name: "Surbiton",
    borough: "kingston-upon-thames",
    postcodes: "KT5 KT6",
    blurb:
      "Surbiton man and van and removals for Victorian villas, commuter flats and riverside apartments.",
    nearby: ["Wimbledon", "Twickenham", "Kingston upon Thames", "Sutton"],
    housing:
      "Victorian villas, many split into flats, purpose-built flats near the station and riverside apartments along the Thames.",
    access:
      "Streets near Surbiton station are permit-controlled and busy at commuter times. Residential roads further out are easy for a Luton van.",
    faqs: [
      { q: "Do you move flats near Surbiton station?", a: "Yes, including planning parking and lift access in advance." },
      { q: "How much is a man and van in Surbiton?", a: "From £50 per hour with a two-hour minimum." },
      { q: "Do you cover Tolworth and Berrylands?", a: "Yes, across KT5 and KT6." },
    ],
  },
  {
    name: "Edgware",
    borough: "barnet",
    postcodes: "HA8",
    blurb:
      "Edgware man and van and removals for 1930s semis, family houses and flats along the A5.",
    nearby: ["Barnet", "Harrow", "Brent"],
    housing:
      "Mostly 1930s semis and detached family houses, with flats and newer blocks around Station Road and the A5.",
    access:
      "Residential streets are usually easy for a Luton van, and many homes have driveways. The A5 and Station Road are busy at peak times.",
    faqs: [
      { q: "Do you cover all of Edgware?", a: "Yes, across HA8, including Burnt Oak and Canons Park." },
      { q: "How much is a man and van in Edgware?", a: "From £50 per hour with a two-hour minimum." },
      { q: "Do you offer fixed-price house moves in Edgware?", a: "Yes — quoted from your inventory, access and distance." },
    ],
  },
  {
    name: "Peckham",
    borough: "southwark",
    postcodes: "SE15",
    blurb:
      "Peckham man and van and removals for Victorian terraces, conversion flats and estate homes.",
    nearby: ["Brixton", "Southwark", "Lewisham", "Lambeth"],
    housing:
      "Victorian terraces and conversions, Georgian houses around Peckham Rye, and large estates with lifts and long walkways.",
    access:
      "Rye Lane and Peckham High Street are busy and congested, and much of the area is permit-controlled. We plan loading from side streets or suspended bays.",
    faqs: [
      { q: "Do you move estate flats in Peckham?", a: "Yes. Tell us about lifts and walkways so we send the right crew." },
      { q: "How much is a man and van in Peckham?", a: "From £50 per hour with a two-hour minimum." },
      { q: "Do you cover Nunhead and Peckham Rye?", a: "Yes, all of SE15." },
    ],
  },
  {
    name: "Woolwich",
    borough: "greenwich",
    postcodes: "SE18 SE28",
    blurb:
      "Woolwich man and van and removals for Royal Arsenal riverside flats, terraces and new apartment blocks.",
    nearby: ["Sidcup", "Greenwich", "Bexley", "Newham"],
    housing:
      "Riverside apartments at the Royal Arsenal, new-build blocks near the Elizabeth line station, Victorian terraces and large estates.",
    access:
      "Royal Arsenal and other new developments usually need a loading bay and goods lift booking through the concierge. The town centre is busy, and some streets are permit-controlled.",
    faqs: [
      { q: "Can you move into Royal Arsenal Riverside?", a: "Yes — we book the loading bay and lift with the concierge and send insurance documents in advance." },
      { q: "How much is a man and van in Woolwich?", a: "From £50 per hour with a two-hour minimum." },
      { q: "Do you cover Plumstead and Thamesmead?", a: "Yes, across SE18 and SE28." },
    ],
  },
  {
    name: "Uxbridge",
    borough: "hillingdon",
    postcodes: "UB8 UB10",
    blurb:
      "Uxbridge man and van and removals for family houses, town-centre flats and student moves near Brunel University.",
    nearby: ["Hillingdon", "Ealing", "Harrow", "Hounslow"],
    housing:
      "Suburban semis and detached houses, flats in the town centre, and a lot of student accommodation around Brunel University.",
    access:
      "Residential streets are generally easy for a Luton van. Town-centre flats can need a loading plan, and student halls often have set move-in and move-out slots.",
    faqs: [
      { q: "Do you do student moves in Uxbridge?", a: "Yes — our hourly man and van suits Brunel halls and student houses." },
      { q: "How much is a man and van in Uxbridge?", a: "From £50 per hour with a two-hour minimum." },
      { q: "Do you cover Hillingdon and Cowley?", a: "Yes, across UB8 and UB10." },
    ],
  },
];
