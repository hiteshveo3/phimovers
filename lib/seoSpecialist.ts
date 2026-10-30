import type { ServiceSeo } from "./seoTargets";

/**
 * Keyword targeting for the four specialist service pages:
 * sofa & furniture hoisting, moving crate hire, heavy & machinery moving and
 * storage with collection. Same shape and tone as `serviceSeo`.
 *
 * Capability limits are phrased as “we’ll confirm after photos or a survey” —
 * no weight limits, certifications or equipment brands are stated as fact.
 */
export const specialistSeo: Record<string, ServiceSeo> = {
  "sofa-and-furniture-hoisting": {
    title: "Sofa Hoisting & Furniture Hoist Service London | Phi Movers",
    description:
      "Sofa won’t fit up the stairs? We hoist sofas and furniture through windows and over balconies across London — planned, risk-assessed and insured. Get a quote.",
    h1: "Sofa Hoisting & Furniture Hoisting in London",
    lead:
      "When a sofa, bed or wardrobe won’t go up the stairs, we lift it up the outside of the building and in through a window or over a balcony. Send photos and measurements and we’ll tell you whether a hoist is workable — and give you a clear fixed quote before anything is booked.",
    overviewH2: "Furniture hoisting across London, done properly",
    sections: [
      {
        id: "when-to-hoist",
        label: "When to hoist",
        h2: "When does a sofa need hoisting?",
        paras: [
          "Most London sofas still go in the front door and up the stairs — our crews do that by hand every day. Hoisting comes in when the stairs can’t take it: a tight turn on a half-landing, a low ceiling over the stairwell, a narrow front door in a converted flat, or a top-floor flat in a building with a small lift or none at all.",
          "Before you book a hoist, check the simpler options: can the legs come off, does the sofa split into sections, can the back be unbolted? If it still won’t fit, a sofa hoist through a window or balcony is often the only way to get it in without damaging the sofa or the building.",
        ],
        list: [
          "Sofas and corner units too large for the stairwell or front door",
          "Beds, mattresses and wardrobes that can’t be dismantled small enough",
          "Dining tables, sideboards and other large single pieces",
          "Furniture leaving a flat at the end of a tenancy or sale",
        ],
      },
      {
        id: "measurements",
        label: "Measure up",
        h2: "What to measure before booking a furniture hoist",
        paras: [
          "Good measurements are the difference between a quick, safe lift and a wasted trip. Use a tape measure rather than the product listing where you can, and send photos alongside the numbers so we can see what we’re working with.",
          "We’ll check your measurements against the route and tell you whether hoisting looks possible. For tight fits or unusual buildings we’ll arrange a survey visit before confirming.",
        ],
        list: [
          "The item: width, depth and height, including legs and cushions",
          "The opening: clear width and height of the window, balcony door or French door — frame to frame, not glass size",
          "Whether the window opens fully, and whether a sash or casement can be removed",
          "Which floor the opening is on",
          "Photos of the outside of the building from the street, showing the opening and anything below it (railings, basement wells, bay windows)",
          "Where the van can park and how wide the pavement is",
        ],
      },
      {
        id: "safety",
        label: "Safety",
        h2: "How we hoist furniture over a balcony or through a window safely",
        paras: [
          "Every hoist is planned and risk-assessed before the day. We decide where the lifting gear will be anchored, how the item will be wrapped and attached, and how many crew the lift needs. All ropes, slings and fittings are rated for lifting and checked before each job.",
          "On the day a banksman keeps an exclusion zone clear on the pavement below while the item comes up steadily and is guided in by hand. Window frames, balcony railings and walls are padded so nothing is scraped on the way through. If weather or access on the day makes the lift unsafe, we stop and rearrange — we don’t take chances with your sofa or the people below.",
        ],
      },
      {
        id: "permissions",
        label: "Permissions",
        h2: "Building, landlord and parking permissions",
        paras: [
          "If you rent, or your flat is in a block with a managing agent or freeholder, ask for permission before the hoist — particularly if a window needs to open fully or be removed. Many buildings will want to see the mover’s insurance details; we can provide them for your managing agent.",
          "Some London streets need a parking bay suspension so the van can stop directly below the opening. We’ll tell you whether your street is likely to need one when we look at your photos. We can combine the hoist with sofa delivery and furniture assembly, so the sofa is collected, lifted in and rebuilt by one crew.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you hoist a sofa over a balcony?",
        a: "Usually, yes. Balconies are often the best route because the doors behind them give a larger opening than a window. We check the railing height, the doors and the drop to the street, then confirm after seeing photos or doing a survey.",
      },
      {
        q: "How much does furniture hoisting cost in London?",
        a: "Hoisting is a custom quote because every building is different. The price depends on the item, the floor, the opening, the street access and how many crew the lift needs. Send photos and measurements and we’ll give you a fixed price before you book.",
      },
      {
        q: "Is there a weight or size limit for hoisting?",
        a: "It depends on the item, the building and the anchor point available. Rather than quote a single limit, we assess each job from photos and measurements and confirm whether it’s safe to lift. If it isn’t, we’ll say so and suggest alternatives.",
      },
      {
        q: "Do you hire out furniture hoists?",
        a: "We don’t hire out equipment on its own — our hoisting service always comes with a trained crew who plan and carry out the lift. That keeps the lift safe and means our insurance covers the job.",
      },
      {
        q: "Can you remove a window to get a sofa in?",
        a: "Where a sash or casement can be removed and refitted without damage, we can plan for it — but it depends on the window. In rented or managed buildings, get permission first. We’ll confirm what’s possible after photos or a survey.",
      },
    ],
  },

  "moving-crate-hire": {
    title: "Moving Crate Hire London | Plastic Crate Rental | Phi Movers",
    description:
      "Rent plastic moving crates in London instead of cardboard boxes. Crates delivered to your door and collected after you unpack. Get a quote today.",
    h1: "Moving Crate Hire in London",
    lead:
      "Plastic moving crates delivered to your door before the move and collected from your new home once you’ve unpacked. No boxes to build, no tape, no cardboard to recycle — just stack, pack and go.",
    overviewH2: "Plastic crate hire for London moves",
    sections: [
      {
        id: "crates-vs-boxes",
        label: "Crates vs boxes",
        h2: "Why rent moving crates instead of buying boxes?",
        paras: [
          "Cardboard boxes are fine for a few things, but a full house move uses a lot of them — and they sag when they’re full of books, crush when stacked in a van and go soggy in the rain. Plastic moving crates keep their shape, stack neatly and close with a lid, so they’re quicker to pack, safer to carry and easier to load.",
          "When you rent moving boxes as crates, there’s nothing to buy, build or flatten afterwards. We collect the empties from your new address, so you’re not left with a hallway full of cardboard.",
        ],
        list: [
          "Rigid sides that don’t collapse under heavy loads",
          "Lids that close without tape",
          "Stack safely in the van, in lifts and on trolleys",
          "Reusable — less packing waste after the move",
          "Delivered before the move and collected afterwards",
        ],
      },
      {
        id: "how-many",
        label: "How many?",
        h2: "How many moving crates do you need?",
        paras: [
          "Every home is different, so treat these figures as a rough guide only. A minimal flat needs fewer; a home full of books, records or kitchenware needs more. Tell us your home size and how full it is and we’ll suggest a number when we quote.",
        ],
        list: [
          "Guide only — kitchen: around 10–15 crates",
          "Guide only — each bedroom: around 8–12 crates",
          "Guide only — living room with books: around 8–12 crates",
          "Guide only — bathroom: around 3–6 crates",
          "Guide only — studio or one-bed flat: around 25–40 crates in total",
          "Guide only — three-bed house: around 70–100 crates in total",
        ],
      },
      {
        id: "packing-tips",
        label: "Packing tips",
        h2: "Packing tips for plastic crates",
        paras: [
          "Put heavy items like books, tins and tools in the bottom of a crate and lighter things on top, and don’t fill a crate so heavy that one person can’t lift it comfortably. Wrap glass, china and anything fragile in paper or bubble wrap first — crates protect against crushing, not knocks inside the crate.",
          "Label each crate with its room on the lid and the side so the crew can place it straight into the right room. Keep the lid closing flat: an overfilled crate won’t stack safely. If you’d rather not pack at all, add our full packing service, or add packing materials such as paper, bubble wrap and wardrobe boxes to the crate delivery.",
        ],
      },
      {
        id: "hire-period",
        label: "Hire period",
        h2: "Crate rental for house moves, offices and renovations",
        paras: [
          "Crate hire works for flat and house moves, office moves where each desk is packed into its own labelled crates, and renovations where belongings need boxing up for a few weeks. The hire period is agreed when you book — enough time to pack before the move and unpack after it — and can be extended if you need longer.",
          "You can hire crates on their own and move however suits you, or book them with a Phi Movers removal so the same team delivers the crates, moves you and collects the empties.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you deliver moving crates across London?",
        a: "Yes. We deliver crates to addresses across all 32 London boroughs and collect them from your new address after you’ve unpacked. Tell us both postcodes when you ask for a quote.",
      },
      {
        q: "How much does crate hire cost?",
        a: "Crate hire is priced as a custom quote based on how many crates you need, how long you need them and the delivery and collection addresses. Tell us your home size and move date and we’ll send a clear price.",
      },
      {
        q: "When will the crates be delivered?",
        a: "Usually a few days before your move, so you have time to pack without rushing. If you have a lot to pack, we can deliver earlier — just let us know your timeline.",
      },
      {
        q: "Can I rent moving crates without booking a removal?",
        a: "Yes. Crate rental works on its own — we deliver, you move however you like, and we collect from your new address.",
      },
      {
        q: "What if I need the crates for longer?",
        a: "Let us know before the agreed collection date and we’ll extend the hire. It’s common during renovations or when completion dates move.",
      },
    ],
  },

  "heavy-and-machinery-moving": {
    title: "Heavy Machinery & Gym Equipment Movers London | Phi Movers",
    description:
      "Heavy equipment and machinery movers in London — gym equipment, safes, workshop machines and heavy items. Planned lifts, trained crew, insured. Get a quote.",
    h1: "Heavy Equipment & Machinery Movers in London",
    lead:
      "Gym equipment, safes, machinery and very heavy furniture moved with a proper plan: the route checked, the crew sized to the job and the right handling equipment on the day. Send photos and details and we’ll confirm what’s needed before you book.",
    overviewH2: "Heavy item and machinery moves, done properly",
    sections: [
      {
        id: "what-we-move",
        label: "What we move",
        h2: "Heavy items and equipment we move",
        paras: [
          "Our heavy and machinery moving service covers the items a normal removal crew shouldn’t just pick up: things that are very heavy for their size, awkward to grip, or need dismantling before they’ll fit through a door. We move them for homes, gyms, studios, workshops and small businesses across London.",
          "Every job is assessed first. If an item needs a crane or industrial rigging, that’s outside what we offer — and we’ll tell you so up front rather than on the day.",
        ],
        list: [
          "Gym equipment: treadmills, cross-trainers, spin bikes, multi-gyms, racks and weight stacks",
          "Home and commercial safes",
          "Workshop machinery, tools and benches",
          "Catering and light commercial equipment",
          "Stone, marble and other very heavy furniture",
        ],
      },
      {
        id: "gym-equipment",
        label: "Gym equipment",
        h2: "Moving gym equipment safely",
        paras: [
          "Gym equipment is heavy, top-heavy and often wider than a doorway when assembled. Many treadmills fold, and many multi-gyms and racks can be partly dismantled — removing weight stacks, uprights and cables — so they can travel safely and fit through tight access. We reassemble and position them at the other end.",
          "Send us the make and model: manufacturers usually publish dimensions and weights, which helps us bring the right crew and equipment. Please remove loose plates and dumbbells from racks before we arrive, or let us know so we can pack them separately.",
        ],
      },
      {
        id: "planning",
        label: "Planning",
        h2: "How we plan a heavy or machinery move",
        paras: [
          "Heavy items are moved to a plan, not by guesswork. We look at the full route — floor surfaces, stairs, turns, steps, door widths and lifts — and decide on the crew size, the handling equipment and whether anything should be dismantled. For larger or unusual items we visit before confirming.",
          "On the day we protect floors, walls and doorways, move the item in a controlled way with trolleys, straps and enough people, and secure it in the van so it can’t shift. Each job is risk-assessed and covered by our goods-in-transit and public liability insurance.",
        ],
        list: [
          "Photos of the item and the route at both ends",
          "Make, model, dimensions and weight if known",
          "Stairs, steps, lifts and door widths",
          "Floor type at the destination (and whether it needs protecting)",
          "Whether the item needs disconnecting by a qualified trade",
        ],
      },
      {
        id: "commercial",
        label: "Commercial",
        h2: "Commercial equipment movers for businesses",
        paras: [
          "For gyms, studios, workshops, kitchens and small businesses, we can move equipment out of hours to keep disruption down and coordinate with your electrician or engineer for disconnection and reconnection. Pianos are handled by our piano and specialist service, with kit made for pianos.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you move gym equipment in London?",
        a: "Yes. We move home and commercial gym equipment across all 32 London boroughs, including treadmills, bikes, multi-gyms, racks and weights. Many machines can be partly dismantled for access; send the make and model and we’ll confirm what’s needed.",
      },
      {
        q: "Can you move a safe up or down stairs?",
        a: "Often, yes — it depends on the safe and the stairs. We need the model or dimensions and photos of the route. We’ll confirm after photos or a survey whether it can be moved safely, and the safe must be emptied first.",
      },
      {
        q: "What machinery do you move?",
        a: "Light commercial, workshop and catering machinery that a trained crew can move with trolleys and handling equipment. Very large plant needing a crane or industrial rigging is outside what we offer, and we’ll tell you honestly if that applies.",
      },
      {
        q: "How much do heavy equipment movers cost?",
        a: "Heavy and machinery moves are priced as a custom quote because weight, access and crew size vary so much. Send photos and details and we’ll give you a fixed price before you book.",
      },
      {
        q: "Are heavy item moves insured?",
        a: "Yes. Every job includes goods-in-transit and public liability insurance. If the item is particularly valuable, tell us when you enquire so we can check the cover suits it.",
      },
    ],
  },

  "storage-with-collection": {
    title: "Storage with Collection London | Renovation Storage | Phi Movers",
    description:
      "We collect, store and redeliver your belongings across London — ideal for renovations and gaps between moves. CCTV-monitored storage from £15/week.",
    h1: "Storage with Collection in London",
    lead:
      "We collect your belongings from home, keep them in secure, CCTV-monitored storage and deliver them back when you’re ready — to the same address or a new one. Storage from £15 per week, no long contract.",
    overviewH2: "Collection, storage and redelivery in one service",
    sections: [
      {
        id: "renovation",
        label: "Renovations",
        h2: "Collection and storage for renovations",
        paras: [
          "A kitchen refit, loft conversion or full refurbishment is much easier with empty rooms. Builders work faster with clear space, and your furniture stays away from dust, paint and accidental knocks. We collect what needs to go, store it while the work is done, and bring it back when the rooms are ready.",
          "You don’t have to clear the whole house. We can collect the rooms being worked on first and bring items back in stages as each room is finished — handy when a project runs over or the work moves room by room.",
        ],
        list: [
          "Kitchen and bathroom refits",
          "Loft conversions and extensions",
          "Full refurbishments and redecoration",
          "Flooring replacement",
        ],
      },
      {
        id: "between-moves",
        label: "Between moves",
        h2: "Storage between moves",
        paras: [
          "When completion dates don’t line up, or a tenancy ends before the next one starts, storage with collection fills the gap. We move you out, store your belongings and deliver them to your new home when you get the keys — without you hiring a van twice or visiting a storage unit.",
          "It also works for decluttering before a sale or let, students between tenancies, and anyone working or travelling abroad for a few months.",
        ],
      },
      {
        id: "inventory",
        label: "Inventory",
        h2: "Storage with an itemised list of what we’re holding",
        paras: [
          "At collection, the crew goes through what’s going into storage with you, so you have a list of what we’re holding. Labelling boxes and crates by room makes that list more useful and redelivery quicker.",
          "Need something back before the end? Give us reasonable notice and we can deliver specific items or arrange access. Combine storage with packing, moving crates or furniture dismantling, and we handle the whole thing from your door to your door. For long-term storage on its own, see our secure storage service.",
        ],
        list: [
          "Itemised list agreed at collection",
          "Furniture wrapped and protected for storage",
          "Secure storage with 24/7 CCTV monitoring",
          "Redelivery in one go or in stages",
        ],
      },
    ],
    faqs: [
      {
        q: "What is storage with collection?",
        a: "It’s a door-to-door storage service: we collect your belongings from your home, keep them in secure storage and deliver them back when you’re ready. You don’t need a van or to visit a storage unit yourself.",
      },
      {
        q: "How much does storage with collection cost in London?",
        a: "Storage starts from £15 per week, depending on how much you store. Collection and redelivery are quoted based on volume, access and distance, so you see the full price before you book.",
      },
      {
        q: "Can you store furniture while I renovate?",
        a: "Yes. We collect the furniture from the rooms being worked on, store it while the work is done and bring it back when you’re ready — in one delivery or in stages.",
      },
      {
        q: "Can you deliver to a different address?",
        a: "Yes. We can redeliver to the address we collected from or to a new home anywhere in London. It’s a common choice when moving dates don’t line up.",
      },
      {
        q: "Is there a minimum storage period?",
        a: "There’s no long contract. Store for as little as a week and extend whenever you need to.",
      },
    ],
  },
};

/**
 * Suggested internal links for each specialist page. `SeoSection.paras` are
 * plain strings, so these are kept separate for the page to render (e.g. as a
 * “Related services” line under the sections).
 */
export const specialistLinks: Record<string, { label: string; href: string }[]> = {
  "sofa-and-furniture-hoisting": [
    { label: "Sofa delivery", href: "/services/sofa-delivery" },
    { label: "Furniture assembly", href: "/services/furniture-assembly" },
  ],
  "moving-crate-hire": [
    { label: "Full packing service", href: "/services/full-packing-service" },
    { label: "Packing materials", href: "/services/packing-materials" },
  ],
  "heavy-and-machinery-moving": [
    { label: "Piano & specialist moves", href: "/services/piano-and-specialist" },
  ],
  "storage-with-collection": [
    { label: "Secure storage", href: "/services/secure-storage" },
  ],
};
