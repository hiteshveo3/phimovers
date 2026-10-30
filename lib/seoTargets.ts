import type { Area } from "./areas";
import type { ServiceItem } from "./data";
import type { FAQ } from "./services";

/**
 * Keyword targeting for Phase 1 of the content plan (content-plan-pages.csv).
 * Every entry is tied to keywords with KD ≤ 10 that competitors already rank
 * for — titles, H1s and extra sections are written around those phrases.
 */

export type SeoSection = { id: string; label: string; h2: string; paras: string[]; list?: string[] };

export type ServiceSeo = {
  title: string;
  description: string;
  h1: string;
  lead?: string;
  overviewH2?: string;
  sections: SeoSection[];
  faqs: FAQ[];
  /** Related service links shown after the keyword sections */
  related?: { label: string; href: string }[];
};

export const serviceSeo: Record<string, ServiceSeo> = {
  "man-and-van": {
    title: "Man and Van Near Me in London | From £50/hr | Phi Movers",
    description:
      "Need a man and van near you? Insured man with a van across all 32 London boroughs — Luton vans, loading help included, from £50/hour. Same-day slots available.",
    h1: "Man and Van Near You, Across London",
    lead:
      "A local man with a van, ready when you need one. Luton and medium vans across all 32 London boroughs, loading help included, from £50 per hour with a two-hour minimum. Send your postcodes and we’ll confirm the right van and a clear price — usually within about an hour.",
    overviewH2: "Man and van across London, done properly",
    sections: [
      {
        id: "near-me",
        label: "Near me",
        h2: "A man with a van near you — in every London borough",
        paras: [
          "Searching “man and van near me” usually turns up a long list of marketplace listings with no idea who will actually turn up. Phi Movers runs its own vans and crews across London, so the driver who arrives is ours — insured, uniformed and used to London stairs, permit bays and tight streets.",
          "Because our vans work across the capital every day, there’s nearly always one close by. That keeps travel time down, which matters on an hourly booking: less time on the road to you means more of your booking spent actually moving things.",
        ],
        list: [
          "Local man and van in North, South, East and West London",
          "Single items, marketplace pickups and small flat moves",
          "Same-day man and van when a slot is free",
          "Loading and unloading help always included",
        ],
      },
      {
        id: "luton-van",
        label: "Luton vans",
        h2: "Man with a Luton van — the right size for a house move",
        paras: [
          "Most of our man and van jobs use a Luton removal van: the box body takes the contents of a studio or one-bed flat in one trip, with room to strap heavy items like fridges and washing machines safely. For smaller jobs we send a medium van, which is quicker to park in central boroughs.",
          "Compared with self-drive van hire, a man and van booking means you don’t pay for fuel, insurance excess or a day’s hire on top of your own time — and you don’t have to carry the sofa down three flights yourself. If you’re weighing up house move van hire against a moving van with a driver, our quote will show the full cost up front.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is there a man and van near me available today?",
        a: "Often, yes. If a van is free in your part of London we can do same-day man and van bookings — call or send a quote request with your postcodes and we’ll confirm availability and price straight away.",
      },
      {
        q: "Do you use Luton vans?",
        a: "Yes. Most bookings use a Luton van, which fits roughly a studio or one-bed flat. Smaller jobs may get a medium van that’s easier to park in central London.",
      },
      {
        q: "Is a man and van cheaper than van hire?",
        a: "For most small moves it works out similar or cheaper once you add fuel, insurance and your own time to van hire — and you get a driver who does the lifting with you. We’ll give you a clear quote so you can compare.",
      },
    ],
  },

  "house-removals": {
    related: [
      { label: "Long distance removals", href: "/services/long-distance-removals" },
      { label: "Part load removals", href: "/services/part-load-removals" },
    ],
    title: "House Removals London | Moving Services from £249 | Phi Movers",
    description:
      "Professional house removals and moving services across all 32 London boroughs. Fixed-price quotes, insured crews, packing and storage available. Get a quote today.",
    h1: "Stress-Free House Removals Across London",
    sections: [
      {
        id: "moving-services",
        label: "Moving services",
        h2: "Professional moving services and relocation in London",
        paras: [
          "Phi Movers is a London removal company offering full moving services from one point of contact: the van and crew, packing, furniture dismantling, storage and an end of tenancy clean if you need one. You choose the pieces you want and get one fixed price for the lot.",
          "Whether it’s a studio, a family house or a relocation for work, we plan the move around access at both addresses — permits, lifts, stairs and parking — so the day runs to time. Our crews are uniformed, insured and do this every day across London.",
        ],
        list: [
          "Studio flats from £249, 1-bed from £329",
          "2-bed houses from £499, 3-bed from £749, 4-bed+ from £999",
          "Full packing from £150 and storage from £15/week",
          "Free home survey for larger moves",
        ],
      },
      {
        id: "cheap-movers",
        label: "Affordable movers",
        h2: "Affordable movers without the cheap-mover risks",
        paras: [
          "Cheap movers near you can look like a bargain until extra charges appear on the day. We price from your inventory and access before we book, so the quote covers the crew, van, loading and transport — no surprise fees for stairs or a longer carry.",
          "If you’re moving on a tight budget, ask about a smaller crew, a weekday slot or packing yourself with our materials kit. We’ll show you what each option saves.",
        ],
      },
    ],
    faqs: [
      {
        q: "What moving services do you offer?",
        a: "House and flat removals, man and van, full or fragile-only packing, furniture dismantling and assembly, secure storage, specialist items like pianos, and end of tenancy cleaning — all bookable together under one fixed quote.",
      },
      {
        q: "Do you offer relocation services for work moves?",
        a: "Yes. We regularly move people relocating to or from London for work, including storage between dates and coordination with employers or letting agents.",
      },
      {
        q: "How do you keep house removals affordable?",
        a: "We quote from your inventory and access so you only pay for the crew and van you need, and we’ll suggest cheaper slots or self-packing if budget matters most.",
      },
    ],
  },

  "international-moves": {
    title: "International Removals from the UK | Europe, USA & UAE | Phi Movers",
    description:
      "International removals from London to France, Spain, Germany, Switzerland, Ireland, the USA, UAE and more. Export packing, door-to-door service and one UK contact.",
    h1: "International Removals from the UK",
    lead:
      "Door-to-door removals from London to Europe and beyond — survey, export-standard packing and one UK contact from collection to delivery. Tell us where you’re heading and we’ll recommend road, sea or air options with a clear quote.",
    overviewH2: "International moves from London, done properly",
    sections: [
      {
        id: "destinations",
        label: "Destinations",
        h2: "Popular removals from the UK",
        paras: [
          "Most of our international removals start in London and head to Europe by road, where a part-load or dedicated vehicle is usually faster and cheaper than sea freight. For longer routes we arrange container or air shipping through vetted partners and keep the London end — packing, inventory and loading — in our own hands.",
        ],
        list: [
          "Removals to France, Spain and Portugal from the UK",
          "Removals to Germany, the Netherlands, Belgium and Luxembourg",
          "Removals to Switzerland and Austria",
          "UK to Ireland removals",
          "Removals to Norway, Sweden, Denmark and Finland",
          "Removals to the Baltics, Bulgaria and Romania",
          "Removals to Malta and Cyprus",
          "Removals to the USA, UAE (Dubai), Singapore, Hong Kong and South Africa",
        ],
      },
      {
        id: "europe-vs-worldwide",
        label: "Road vs sea",
        h2: "Road, sea or air — which suits your move?",
        paras: [
          "Removals to Europe from the UK usually go by road: your belongings are loaded in London and delivered to the door, often within a week. Moves to the USA, UAE or Asia normally go by sea container, which takes longer but suits full household loads; air freight works for a few urgent boxes.",
          "We’ll explain the options for your destination at survey stage, including realistic transit times and the documents you’re likely to need, and give you one fixed price for the agreed service.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much do removals from the UK to Europe cost?",
        a: "It depends on volume, destination and whether you share a vehicle (part-load) or book a dedicated one. After a quick survey we give a fixed quote covering packing, loading, transport and delivery.",
      },
      {
        q: "Do you move to the USA and Dubai?",
        a: "Yes — longer-distance moves like the USA and UAE are usually shipped by sea container through our partners, with packing and collection handled by our London crew.",
      },
    ],
  },

  "office-removals": {
    related: [
      { label: "Office furniture removals", href: "/services/office-furniture-removals" },
      { label: "Office moving cost guide", href: "/blog/how-much-does-an-office-move-cost" },
    ],
    title: "Office Removals London | Office Moves & Furniture | Phi Movers",
    description:
      "Office moves across London planned around your business — evenings and weekends, office furniture removal and relocation, IT handled with care. Fixed quotes after a quick survey.",
    h1: "Office Removals in London",
    sections: [
      {
        id: "office-moves",
        label: "Office moves",
        h2: "Office moves planned around your business",
        paras: [
          "An office move is really a project: desks, IT, files and people all need to land in the right place with as little downtime as possible. Our office movers plan it with you, label every desk and crate, and usually run the move out of hours so your team loses no working days.",
          "From a ten-desk studio to a multi-floor relocation, you get one project manager, a written plan and a fixed price.",
        ],
      },
      {
        id: "office-furniture",
        label: "Office furniture",
        h2: "Office furniture removal and relocation services",
        paras: [
          "Need furniture moved without a full office move? We handle office furniture removal and relocation on its own — moving desks between floors, clearing furniture before a refit, or taking surplus items to storage. Desks and storage units are dismantled, protected and rebuilt where needed.",
        ],
        list: [
          "Desk, chair and pedestal moves between floors or sites",
          "Dismantling and reassembly of bench desks and storage",
          "Furniture into storage during refits",
          "Clearance of unwanted office furniture",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you move office furniture only?",
        a: "Yes. We regularly do office furniture removal and relocation without a full office move — between floors, between sites or into storage.",
      },
      {
        q: "Can you find office movers near me in outer London?",
        a: "We cover all 32 London boroughs, from Westminster and the City to Croydon, Harrow, Bromley and Hounslow.",
      },
    ],
  },

  "furniture-delivery": {
    title: "Furniture Courier London | Large Item Delivery | Phi Movers",
    description:
      "Furniture courier and large item courier service across London. Collection and delivery of sofas, beds, wardrobes and marketplace buys — carried in and placed, from £50.",
    h1: "Furniture Courier & Delivery in London",
    sections: [
      {
        id: "furniture-courier",
        label: "Furniture courier",
        h2: "A furniture courier that carries it in",
        paras: [
          "A standard parcel courier won’t take a sofa or wardrobe, and many furniture couriers drop at the kerb. Our furniture collection and delivery service sends two people and a van, carries the item up the stairs and puts it in the room you choose.",
          "It works for shop collections, marketplace and auction buys, moving one piece between homes, or taking furniture to storage.",
        ],
      },
      {
        id: "large-items",
        label: "Large items",
        h2: "Large item courier service",
        paras: [
          "Big, heavy or awkward items are what we’re set up for: blankets, straps and trolleys come on every job, and a two-person crew is standard for anything one person can’t carry safely. Tell us the item and the access at both ends and we’ll give you a fixed price.",
        ],
        list: [
          "Sofas, beds, mattresses and wardrobes",
          "Dining tables, sideboards and bookcases",
          "Fridges, washing machines and other appliances",
          "Gym equipment and other large items",
        ],
      },
    ],
    faqs: [
      {
        q: "What’s the best courier for furniture delivery in London?",
        a: "For bulky items, a two-person crew that carries in and places furniture is the safest option. That’s our standard service — fully insured, with a fixed price agreed before we set off.",
      },
      {
        q: "Do you deliver furniture outside London?",
        a: "Our crews are based in London. For deliveries from London to elsewhere in the UK, send both postcodes and we’ll tell you whether we can help and what it costs.",
      },
    ],
  },

  "vehicle-transport": {
    title: "Vehicle Transport London & UK | Car Transporter | Phi Movers",
    description:
      "Vehicle transport from London — cars, classics and motorbikes moved on an open or enclosed transporter. Non-runners welcome. Fixed quote based on distance and vehicle.",
    h1: "Vehicle Transport from London",
    sections: [
      {
        id: "transporter",
        label: "Transporters",
        h2: "The right vehicle transporter for the job",
        paras: [
          "Most cars travel on an open transporter or recovery vehicle, which keeps costs down for everyday cars and non-runners. For classic, prestige or low cars we can arrange enclosed transport so the vehicle is protected from weather and road spray for the whole journey.",
          "Every vehicle is loaded and strapped by people who move cars for a living, with agreed collection and delivery windows.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does vehicle transport cost?",
        a: "Price depends mainly on distance, the type of vehicle and whether it runs. We give you a fixed quote before booking — see our car transport cost guide for typical UK ranges.",
      },
    ],
  },

  "full-packing-service": {
    title: "Packing Service London | Professional Packers from £150 | Phi Movers",
    description:
      "Professional packing service across London — our packers wrap, box and label your whole home with quality materials. Full or fragile-only packing, from £150.",
    h1: "Professional Packing Service in London",
    sections: [
      {
        id: "packing-company",
        label: "Packing company",
        h2: "A packing company near you, as part of your move",
        paras: [
          "Packing is the slowest part of moving house, and it’s where most breakages start. Our packers arrive the day before or the morning of your move with boxes, paper, bubble wrap and wardrobe cartons, and pack room by room with every box labelled for the new address.",
          "You can book packing on its own, add it to a removal, or choose fragile-only packing for kitchens, glass and valuables.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I book packing without the removal?",
        a: "Yes. Our packing service can be booked on its own if you’re moving with another firm or shipping your belongings.",
      },
    ],
  },

  "student-moves": {
    title: "Student Removals London | Student Moves from £50/hr | Phi Movers",
    description:
      "Student removals across London — halls, flat shares and moves home. Budget-friendly hourly man and van, loading help included, from £50/hour.",
    h1: "Student Removals in London",
    sections: [
      {
        id: "student-moving",
        label: "Student moving",
        h2: "Student moving made simple",
        paras: [
          "Student moves are usually small but time-sensitive: halls checkout deadlines, flat-share handovers and summer storage. We charge by the hour so you only pay for what the move takes, and loading help is always included.",
          "Sharing a van with flatmates is a good way to cut the cost — tell us each address and we’ll plan the route.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you offer movers for students on a budget?",
        a: "Yes. Student moves run on our hourly man and van rate from £50/hour, and splitting a booking with flatmates keeps the cost per person low.",
      },
    ],
  },

  "piano-and-specialist": {
    title: "Piano Moving London | Upright & Grand Piano Movers | Phi Movers",
    description:
      "Piano moving across London by trained crews with piano boards, straps and the right van. Upright and grand piano moves, stairs assessed in advance. From £180.",
    h1: "Piano Moving in London",
    sections: [
      {
        id: "piano-moves",
        label: "Piano moves",
        h2: "Piano moves with the right kit and crew",
        paras: [
          "Pianos are heavy, top-heavy and easily damaged, so we never treat them as just another item. Our piano moves use a trained crew, a piano board and straps, and we check stairs, turns and doorways before the day so the right number of people turn up.",
          "We move upright pianos, digital pianos and grand pianos, as part of a house move or on their own.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does piano moving cost?",
        a: "Piano moves start from £180. The final price depends on the type of piano, stairs at both ends and distance — we confirm it before booking.",
      },
    ],
  },

  "secure-storage": {
    title: "Removals & Storage London | Secure Storage from £15/wk | Phi Movers",
    description:
      "House removal with storage in London — we collect, store in a secure monitored unit and deliver when you’re ready. Storage from £15 a week.",
    h1: "Secure Storage in London",
    sections: [
      {
        id: "removal-storage",
        label: "Removal + storage",
        h2: "House removal with storage, handled by one team",
        paras: [
          "When completion dates don’t line up, we can collect your belongings, store them in a secure monitored unit and deliver them to your new home when you’re ready. One team handles the whole thing, so nothing is unloaded and reloaded by strangers.",
        ],
      },
    ],
    faqs: [],
  },
};

/* ---------- Areas ---------- */

/** How searchers write each area when it differs from the borough name. */
const areaSearchName: Record<string, string> = {
  bromley: "Bromley, Kent",
  croydon: "Croydon, Surrey",
  sutton: "Sutton, Surrey",
  "barking-and-dagenham": "Barking & Dagenham",
  "kensington-and-chelsea": "Kensington",
  "kingston-upon-thames": "Kingston upon Thames",
  "richmond-upon-thames": "Richmond",
  "hammersmith-and-fulham": "Hammersmith & Fulham",
};

const shortName = (area: Area) => areaSearchName[area.slug] ?? area.name;

export type PageSeo = { title: string; description: string; h1: string; intro: string };

export function areaHubSeo(area: Area): PageSeo {
  const n = shortName(area);
  if (area.borough) {
    const pc = area.postcodes?.split(" ")[0] ?? "";
    const pcs = (area.postcodes ?? "").split(" ").join(", ");
    return {
      title: `House Removals ${area.name} ${pc} | Removal Company & Man and Van | Phi Movers`,
      description: `Removals in ${area.name} (${pcs}) — fixed-price house moves, man and van from £50/hr and insured local crews who know ${area.name} parking and access.`,
      h1: `House Removals in ${area.name}`,
      intro: `Looking for a removal company in ${area.name}? Phi Movers covers ${pcs} for house removals, flat moves and man and van, with fixed prices agreed before moving day. ${area.blurb}`,
    };
  }
  return {
    title: `Removals ${n} | Removal Company in ${area.name} | Phi Movers`,
    description: `Looking for removal companies in ${n}? Phi Movers offers fixed-price, insured house removals, man and van and storage in ${area.name}. Free quotes.`,
    h1: `Removals in ${area.name}`,
    intro: `Looking for a removal company in ${n}? Phi Movers is a fully insured removal firm covering ${area.name} for house removals, flat moves, man and van, office removals and storage. Our ${area.name} removals are priced from your inventory and access, so the quote you agree is the price you pay.`,
  };
}

/** Extra hand-written sections for high-intent area × service pages, keyed "area/service". */
export const comboExtras: Record<string, SeoSection[]> = {
  "stratford/office-removals": [
    {
      id: "stratford-offices",
      label: "Stratford offices",
      h2: "Office removals across Stratford, E15 and E20",
      paras: [
        "Stratford’s office market has grown fast: the International Quarter London and the towers around Westfield Stratford City, the studios and workspaces at Here East on Queen Elizabeth Olympic Park, and older offices and serviced suites around the Broadway and the Stratford Centre. Each comes with its own building rules, and we plan every office move around them.",
        "Most modern Stratford buildings run booked loading bays, goods-lift slots and security sign-in for contractors. We arrange those with building management in advance, send insurance certificates and method statements when asked, and schedule the move out of hours so your team loses no working days.",
      ],
      list: [
        "Loading bay and goods lift bookings arranged with building management",
        "Evening and weekend office moves to avoid downtime",
        "Labelled desks, crates and IT so everything lands in the right place",
        "Office furniture dismantled, moved and rebuilt",
        "Unwanted office furniture cleared or taken to storage",
      ],
    },
    {
      id: "stratford-access",
      label: "Getting around",
      h2: "Planning around Stratford traffic and transport",
      paras: [
        "Stratford is one of London’s busiest transport hubs, with the Elizabeth line, Central and Jubilee lines, DLR and Overground all at Stratford station — and busy roads around the Westfield and Olympic Park on event days at the London Stadium. We check fixtures and events when we plan your move date and timings.",
        "For offices moving into Stratford from elsewhere in London — or out to East London and Essex — we quote the whole job at a fixed price after a short survey or video walkthrough.",
      ],
    },
  ],
};

export function comboSeo(area: Area, item: ServiceItem): PageSeo | null {
  const n = shortName(area);
  switch (item.slug) {
    case "man-and-van":
      return {
        title: `Man and Van ${n} | Man with a Van from £50/hr | Phi Movers`,
        description: `Man and van in ${area.name} from £50/hour. A local man with a van for flat moves, single items and collections — loading help included, fully insured.`,
        h1: `Man and Van ${area.name}`,
        intro: `Need a man with a van in ${n}? Our ${area.name} man and van service gives you a local driver, a clean Luton or medium van and help with all the lifting — charged by the hour from £50, with a two-hour minimum.`,
      };
    case "office-removals":
      return {
        title: area.slug === "stratford" ? "Office Removals Stratford E15 & E20 | Office Movers | Phi Movers" : `Office Removals ${n} | Office Movers in ${area.name} | Phi Movers`,
        description: `Office removals in ${area.name} planned around your business — evening and weekend office moves, furniture and IT handled with care. Fixed quotes.`,
        h1: `Office Removals in ${area.name}`,
        intro: `Planning an office move in ${n}? Our office removals team handles desks, IT and files for ${area.name} businesses, usually out of hours so your team loses no working days.`,
      };
    case "secure-storage":
      return {
        title: `Removals and Storage ${n} | Secure Storage | Phi Movers`,
        description: `Removals and storage in ${area.name}: we collect, store your belongings in a secure monitored unit and deliver when you’re ready. From £15/week.`,
        h1: `Removals and Storage in ${area.name}`,
        intro: `Need removals and storage in ${n}? We collect from your ${area.name} address, keep everything in secure monitored storage and deliver to your new home when your dates line up.`,
      };
    case "house-removals":
      return {
        title: `House Removals ${n} | Fixed-Price Movers | Phi Movers`,
        description: `House removals in ${area.name} with fixed-price quotes, insured crews and packing available. Local movers who know ${area.name} streets and parking.`,
        h1: `House Removals in ${area.name}`,
        intro: `Looking for house removals in ${n}? Our movers handle ${area.name} homes of every size with a fixed price agreed before moving day.`,
      };
    default:
      return null;
  }
}
