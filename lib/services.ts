import { allServices, getServiceBySlug, type ServiceItem } from "./data";

export function relatedServices(slug: string, count = 3): ServiceItem[] {
  const found = getServiceBySlug(slug);
  if (!found) return allServices.filter((s) => s.slug !== slug).slice(0, count);

  const siblings = found.category.items.filter((s) => s.slug !== slug);
  if (siblings.length >= count) return siblings.slice(0, count);

  const rest = allServices.filter(
    (s) => s.slug !== slug && !siblings.some((x) => x.slug === s.slug)
  );
  return [...siblings, ...rest].slice(0, count);
}

export type FAQ = { q: string; a: string };
export type Step = { title: string; body: string };

export type ServiceCopy = {
  intro: string[];
  included: string[];
  idealFor: string[];
  steps: Step[];
  affects: string[];
  faqs: FAQ[];
};

const defaultSteps: Step[] = [
  {
    title: "Get your free quote",
    body: "Tell us what you need moving, your pickup and delivery addresses and your preferred date. Start your quote in under a minute — we usually reply with a clear fixed price within about one working hour. No site visit required for most jobs; a free home survey is available for larger moves.",
  },
  {
    title: "Confirm your booking",
    body: "Pick a date and time that suits you. A small deposit is only asked when you confirm the booking — it comes off your final balance. We’ll send a confirmation with everything you need to prepare, plus a friendly reminder as the day approaches.",
  },
  {
    title: "We prepare and protect",
    body: "On the day, our uniformed crew arrives on time with blankets, straps and trolleys. We protect floors, doorways and furniture before anything is lifted, so your home and your belongings stay in perfect condition.",
  },
  {
    title: "Careful transport",
    body: "Your items are loaded, secured and driven safely to the destination by an experienced London driver who knows the boroughs, the permit zones and the quickest routes at any time of day.",
  },
  {
    title: "Unload and settle in",
    body: "We place everything exactly where you want it, reassemble anything we took apart and only leave once you’re completely happy. Payment is taken on completion — simple and stress-free.",
  },
];

const defaultAffects: string[] = [
  "The volume of items and the size of van required",
  "How many crew members or helpers you need",
  "Access at both addresses — stairs, lifts and carry distance",
  "Total mileage beyond the first 10 included miles",
  "Timing — evenings, weekends, bank holidays and same-day bookings",
  "Optional extras such as packing, dismantling or storage",
];

// Rich, service-specific copy. Any service without an entry falls back to a
// generated version so every page is complete and detailed.
const copy: Record<string, Partial<ServiceCopy>> = {
  "house-removals": {
    intro: [
      "House removals across London shouldn’t mean guessing the price or hoping the crew turns up. Phi Movers gives you a clear fixed quote for your house move — van, crew and loading included — whether you’re leaving a terrace in Hackney or a family home in Richmond.",
      "Every house is different, which is why we price from inventory, access at both ends and any extras you choose. You get a fixed quotation before moving day — not an open-ended hourly bill for a full house removal. Hourly man-and-van rates start from £50/hour with a two-hour minimum for smaller jobs. No hidden fees when the crew arrives.",
      "Our teams move households across all 32 London boroughs every week. We know which streets need a parking suspension, where the low bridges are, and how to get a sofa up a narrow Victorian staircase without a scratch — carried by hand, not by crane.",
    ],
    included: [
      "A clean, well-maintained van sized to your house move",
      "An experienced, uniformed two-person crew (more available)",
      "Loading and unloading — never charged as an extra",
      "Furniture blankets, straps, trolleys and floor protection",
      "Basic dismantling and reassembly of beds and flat-pack",
      "Sofas and bulky furniture carried up tight staircases by hand (window and balcony hoisting available separately)",
      "Goods-in-transit and public liability insurance",
    ],
    idealFor: [
      "Studio, one, two, three and four-bedroom homes",
      "Family houses of any size across London",
      "Moves with fragile, bulky or awkward items",
      "Anyone who wants a fixed price with no surprises",
    ],
    faqs: [
      {
        q: "Do you provide boxes and packing?",
        a: "Yes. You can add a full or fragile-only packing service, or simply buy a materials kit and pack yourself. Just let us know when you book and we’ll include it in your fixed quote.",
      },
      {
        q: "How far in advance should I book a house removal?",
        a: "For weekends and month-end dates we recommend booking one to two weeks ahead. Mid-week and mid-month slots are often available at shorter notice, and we offer same-day bookings subject to crew availability.",
      },
      {
        q: "Will you dismantle and reassemble furniture?",
        a: "Basic bed frames and flat-pack items are handled as standard. For wardrobes, complex units or full furniture assembly, add our assembly option and we’ll bring the right tools and time.",
      },
      {
        q: "Do you move sofas up narrow staircases?",
        a: "Yes — carrying sofas and bulky furniture up tight staircases is included and done by hand. If something won’t fit up the stairs, our sofa and furniture hoisting service can lift it in through a window or balcony; we’ll assess photos or a survey first.",
      },
      {
        q: "What’s included in the fixed price?",
        a: "Your quote covers the crew, the van, loading and unloading, basic protection materials and the first 10 journey miles. Optional extras like packing or storage are itemised clearly before you book.",
      },
      {
        q: "What size van do I need for my house?",
        a: "As a guide: studio / 1-bed often suits a small or transit van; a typical 2–3 bed house usually needs a Luton; larger homes may need a Luton plus extra crew or a second run. Send us details of your rooms and we’ll confirm the right van in your quote.",
      },
    ],
  },

  "flat-removals": {
    intro: [
      "Flat removals in London mean stairs, lifts, tight landings and permit streets — not just a big van. Phi Movers prices your flat move as a clear fixed quote from inventory and access at both ends, so you’re not guessing how many hours a walk-up will take.",
      "Guides start from around £249 for smaller flats; your final price depends on volume, floors and distance. Loading, unloading and basic protection are included. Hourly man-and-van (from £50/hour, two-hour minimum) is better for tiny loads — full flat moves get a fixed quotation.",
      "We move studios through multi-bed apartments across all 32 boroughs. Send photos or book a free survey for awkward access and we’ll confirm crew size before moving day.",
    ],
    included: [
      "Fixed quote based on inventory and access",
      "Two-person crew as standard (more if needed)",
      "Stairs, lifts and tight hallway handling",
      "Blankets, straps, trolleys and floor protection",
      "Basic bed dismantling and reassembly",
      "Goods-in-transit and public liability cover",
    ],
    idealFor: [
      "Walk-ups and mansion-block flats",
      "One and two-bed apartment moves",
      "Moves with parking and porter rules",
      "Anyone who wants a fixed flat-move price",
    ],
    faqs: [
      {
        q: "How much does a flat removal cost in London?",
        a: "Smaller flats guide from around £249 as a fixed quote once we know rooms, floors and distance. Larger or high-floor flats cost more. Hourly man-and-van from £50/hour (two-hour minimum) suits very small loads — we’ll say which pricing fits.",
      },
      {
        q: "Do you handle flats with no lift?",
        a: "Yes — walk-ups are normal London work. Tell us how many floors and whether there’s a lift booking needed. Photos of the stairwell help us plan the right crew.",
      },
      {
        q: "Will you dismantle beds and wardrobes?",
        a: "Basic bed frames and simple flat-pack are included. Complex wardrobes or full assembly can be added — tell us when you enquire.",
      },
      {
        q: "Do I need a deposit for a quote?",
        a: "No. Quotes are free with no card details required. A small deposit only applies when you confirm a booking.",
      },
    ],
  },

  "studio-moves": {
    intro: [
      "Studio moves should be quick, affordable and booked around key-exchange — not treated like a four-bed house job. Phi Movers runs dedicated studio moves across London with a fixed quote for typical loads, or hourly man-and-van when that suits better.",
      "Guides start from around £199 depending on volume, floors and distance. You get a clean van, a capable crew and careful handling of sofas, beds and boxes through tight studio doors and shared corridors.",
      "Ideal for first flats, downsizing and student-to-studio jumps. Call us or send your addresses in a quote request for a clear price within about one working hour.",
    ],
    included: [
      "Van and crew sized for a studio load",
      "Loading and unloading help included",
      "Protection for furniture and flooring",
      "Help with stairs and shared access",
      "First 10 journey miles in your quote",
      "Goods-in-transit and public liability cover",
    ],
    idealFor: [
      "Studio and micro-flat moves",
      "First-time renters changing flats",
      "Downsizing from a larger place",
      "Short-notice studio key exchanges",
    ],
    faqs: [
      {
        q: "How much does a studio move cost?",
        a: "Studio moves guide from around £199 as a fixed job once we know floors and distance. Very light loads can use hourly man-and-van from £50/hour with a two-hour minimum — we’ll recommend the better option.",
      },
      {
        q: "Can you move a studio sofa up stairs?",
        a: "Yes. Sofas and mattresses through tight studio access are everyday work. Photos help if the landing is particularly narrow.",
      },
      {
        q: "How far ahead should I book?",
        a: "Weekends and month-end fill fastest — a few days’ notice helps. Same-day and last-minute slots are often available mid-week subject to crew.",
      },
    ],
  },

  "man-and-van": {
    intro: [
      "Our man & van service is the flexible, budget-friendly way to move smaller loads across London. Charged by the hour with a simple two-hour minimum, it’s perfect for single items, studio moves, marketplace purchases and those jobs that are too big for a taxi but don’t need a full removals crew.",
      "You get a friendly, capable driver and a clean van — and, unlike a lot of cheap listings online, loading and unloading help is always included. That means your driver rolls up their sleeves and does the lifting with you, rather than watching from the cab.",
      "Because we operate right across the capital, you’re never far from an available van. Whether you’re collecting a sofa from Wandsworth or moving a room’s worth of boxes across Camden, we’ll get it done quickly, carefully and for a price that’s clear from the outset.",
    ],
    included: [
      "A clean van with an experienced London driver",
      "Loading and unloading help as standard",
      "Blankets, straps and trolleys to protect your items",
      "Charged by the hour, billed in 30-minute blocks",
      "First 10 journey miles included",
      "Goods-in-transit and public liability insurance",
    ],
    idealFor: [
      "Single-item and small furniture collections",
      "Studio flats and student moves",
      "Marketplace, auction and store pickups",
      "Clearing a room, garage or storage unit",
    ],
    faqs: [
      {
        q: "How much does a man & van cost?",
        a: "Our man & van starts from £50 per hour with a two-hour minimum, so from £100. After the minimum, time is billed in 30-minute blocks. Add an extra helper for £20 per hour if you have heavy or high-volume items.",
      },
      {
        q: "Can the driver help me carry everything?",
        a: "Absolutely — loading and unloading help is included. For very heavy items or lots of stairs, we recommend adding a second helper so the job stays quick and safe.",
      },
      {
        q: "Is there a minimum booking?",
        a: "Yes, the minimum booking is two hours. This covers most single-item and small-room moves comfortably, including travel between addresses.",
      },
    ],
  },
  "office-removals": {
    intro: [
      "Business moves live and die by planning, and that’s exactly what our office removals service delivers. We manage commercial relocations of every size across London — from a small studio office to a multi-floor headquarters — with a dedicated project manager who keeps everything on schedule and on budget.",
      "We know downtime costs money, so we build the move around your business. Evening, weekend and out-of-hours moves are our speciality, meaning your team can log off on Friday and log back on Monday in a fully set-up new space. Desks, IT, storage and confidential files are all handled with care and a clear chain of custody.",
      "From the first walkthrough to the final desk in place, you get one point of contact, a written plan and a crew that’s done this hundreds of times before. The result is a move that feels organised rather than overwhelming.",
    ],
    included: [
      "A dedicated project manager and written move plan",
      "Out-of-hours, evening and weekend scheduling",
      "Desk, pedestal and furniture handling with labelling",
      "Careful IT, monitor and equipment transport",
      "Crates and materials available on request",
      "Full commercial insurance cover",
    ],
    idealFor: [
      "Studio and small offices (up to ~10 staff)",
      "Growing SMEs relocating to a larger space",
      "Multi-floor headquarters and departments",
      "Retail, studio and co-working relocations",
    ],
    faqs: [
      {
        q: "Can you move us outside working hours?",
        a: "Yes — most of our office moves happen in the evening or over the weekend to avoid any disruption to your business. We’ll schedule around your operating hours.",
      },
      {
        q: "Do you move IT equipment and servers?",
        a: "We handle standard IT, monitors and peripherals as part of the move. For server rooms and specialist tech we offer a dedicated IT & server relocation service with extra protection and planning.",
      },
      {
        q: "How do you price an office move?",
        a: "Because every business is different, office moves are quoted individually after a quick survey. You’ll get a fixed written quote covering crew, vehicles, materials and timing.",
      },
    ],
  },
  "secure-storage": {
    intro: [
      "Sometimes the dates don’t line up, or you simply need somewhere safe to keep your things for a while. Our secure storage service gives you clean, dry, monitored space for as long as you need it — a week between tenancies or many months during a renovation or a move abroad.",
      "Because we handle the collection, transport and storage together, you avoid hiring a van twice and lugging boxes yourself. Our crew packs your items into the unit properly, so everything stays protected and accessible.",
      "With 24/7 CCTV, individual units and flexible terms, you get peace of mind without a long-term commitment. Add packing or a man & van and we’ll take care of the whole thing end to end.",
    ],
    included: [
      "Clean, dry, individually secured storage units",
      "24/7 CCTV monitoring and controlled access",
      "Collection and transport of your items",
      "Careful loading and stacking inside the unit",
      "Flexible short and long-term terms",
      "Full insurance while in storage",
    ],
    idealFor: [
      "Gaps between moving out and moving in",
      "Renovations and home improvement projects",
      "Decluttering and staging a home for sale",
      "Storing belongings while working or travelling abroad",
    ],
    faqs: [
      {
        q: "How much does storage cost?",
        a: "Storage starts from around £15 per week depending on the volume you need to store. We’ll recommend the right unit size after a quick chat about your items.",
      },
      {
        q: "Can I access my items while they’re in storage?",
        a: "Yes — just give us reasonable notice and we’ll arrange access to your unit during opening hours.",
      },
      {
        q: "Is there a minimum term?",
        a: "No long contracts. You can store for as little as a week and extend whenever you need to, so you only ever pay for the time you actually use.",
      },
    ],
  },

  "student-moves": {
    intro: [
      "Student moves are often last-minute, budget-sensitive and packed into a tiny window between term dates. Our student moves service is built exactly for that — a clean van, a friendly crew and a simple hourly rate that won’t blow your deposit.",
      "Whether you’re leaving halls for a shared flat, swapping houses with housemates, or heading home for the summer with a room’s worth of stuff, we keep it fast and careful. Loading help is always included, so you’re not left carrying a mattress down five flights alone.",
      "We know London student areas well — Bloomsbury, King’s Cross, Stratford, Uxbridge, South Kensington and beyond — so we can time the job around your keys handover and get you settled without the usual chaos.",
    ],
    included: [
      "Clean van sized for a room or small flat load",
      "Driver help with loading and unloading",
      "Blankets and straps for furniture and TVs",
      "Simple hourly pricing with a two-hour minimum",
      "First 10 journey miles included",
      "Goods-in-transit insurance as standard",
    ],
    idealFor: [
      "Halls to flat and flat-to-flat term moves",
      "Shared houses splitting belongings",
      "Summer storage drop-offs and pickups",
      "Students moving with a tight budget and timeline",
    ],
    faqs: [
      {
        q: "How much does a student move cost?",
        a: "Student moves start from £50 per hour with a two-hour minimum. Most room moves finish inside that window; larger flat shares may need a little longer or an extra helper.",
      },
      {
        q: "Can you move on key-exchange day?",
        a: "Yes. Tell us your handover time and we’ll schedule around it. Mid-week slots are often cheapest and easiest to book at short notice.",
      },
      {
        q: "Do you move mattresses and flat-pack furniture?",
        a: "Absolutely — mattresses, desks, bed frames and flat-pack wardrobes are everyday jobs for us. We’ll protect them and reassemble basic pieces if needed.",
      },
    ],
  },

  "house-clearance": {
    intro: [
      "Clearing a house, flat or garage shouldn’t mean endless trips to the tip. Our house clearance service removes unwanted furniture, appliances and clutter in one organised visit — carefully, responsibly and with a clear fixed price.",
      "We handle everything from a single room declutter to a full property clear-out after a move, renovation or bereavement. Items are sorted so reusable pieces can be donated or recycled where possible, and the rest is disposed of correctly.",
      "You don’t need to hire a skip or lift heavy items yourself. Our crew brings the van, the muscle and the know-how — and leaves the space clean and ready for what comes next.",
    ],
    included: [
      "Full or partial property clearances",
      "Furniture, appliances and general household items removed",
      "Careful carrying down stairs and through tight access",
      "Responsible disposal and recycling where possible",
      "Fixed price based on volume and access",
      "Public liability cover for the job",
    ],
    idealFor: [
      "End-of-tenancy and landlord clear-outs",
      "Decluttering before a sale or renovation",
      "Garage, loft and shed clearances",
      "Bereavement and probate house clearances",
    ],
    faqs: [
      {
        q: "How is a house clearance priced?",
        a: "We price by volume and access — a quick description or photos is often enough for a fixed quote. Larger or multi-floor clearances may need a short survey.",
      },
      {
        q: "Do you take everything?",
        a: "We remove furniture, white goods and most household items. Hazardous waste, asbestos and certain restricted materials need specialist disposal — we’ll tell you upfront if anything can’t be taken.",
      },
      {
        q: "Can you clear while I’m not there?",
        a: "Yes, with access arranged (keys or a site contact). We’ll agree what’s staying and what’s going before we start so nothing important is removed by mistake.",
      },
    ],
  },

  "it-and-server-relocation": {
    intro: [
      "Moving IT isn’t the same as moving desks. Our IT & server relocation service is built for the kit that keeps your business running — servers, networking gear, monitors and peripherals — with planning, labelling and careful handling every step of the way.",
      "We work with your IT team (or provider) to agree a sequence, downtime window and packing approach. Sensitive equipment is wrapped, strapped and transported upright where required, with a clear chain of custody from rack to rack.",
      "Evening and weekend moves are available so your users barely notice the switch. Whether you’re relocating a small office stack or a denser server room, you get a specialist crew and a written plan — not a generic van job.",
    ],
    included: [
      "Pre-move planning with your IT contact",
      "Labelling, inventory and careful packing of kit",
      "Protected transport for servers, racks and peripherals",
      "Out-of-hours scheduling to minimise downtime",
      "Reconnection support for desk moves (as agreed)",
      "Commercial insurance cover for the relocation",
    ],
    idealFor: [
      "Office moves with significant IT footprint",
      "Server room and network cupboard relocations",
      "Studio and agency tech refreshes",
      "Businesses that can’t risk weekend chaos",
    ],
    faqs: [
      {
        q: "Do you disconnect and reconnect servers?",
        a: "We handle physical relocation and careful packing. Live power-down, cabling and commissioning are typically done by your IT team or MSP — we coordinate timings so everyone works in sequence.",
      },
      {
        q: "Is specialist packaging included?",
        a: "Yes — anti-static bags, foam, blankets and upright securing as needed. For high-value or delicate kit we’ll agree the packing method before the day.",
      },
      {
        q: "Can you move overnight?",
        a: "Yes. Most IT relocations run evenings or weekends. We’ll build a timeline around your maintenance window.",
      },
    ],
  },

  "retail-shop-move": {
    intro: [
      "A shop move can’t stop the till ringing for days. Our retail and shop relocation service is planned around your trading hours — evenings, overnight and quiet days — so you close one door and open another with minimum lost sales.",
      "We move fixtures, stock, till points, mannequins and back-of-house kit with a labelled plan, so everything has a place in the new unit. Fragile displays and glass get extra protection; heavy shelving is dismantled and rebuilt where agreed.",
      "From independent boutiques to multi-unit rollouts, you get one project contact, a clear quote and a crew used to working in customer-facing spaces without leaving a mess behind.",
    ],
    included: [
      "Out-of-hours and overnight scheduling",
      "Fixture, stock and till-point handling",
      "Labelling and placement plan for the new unit",
      "Protection for glass, displays and flooring",
      "Dismantling and reassembly of agreed fixtures",
      "Commercial insurance for the relocation",
    ],
    idealFor: [
      "Independent shops and boutiques",
      "Cafés, salons and high-street units",
      "Pop-up to permanent store moves",
      "Multi-site retail refreshes",
    ],
    faqs: [
      {
        q: "Can you move us overnight so we open next morning?",
        a: "That’s our preferred approach for retail. We’ll agree a close time, crew size and reopen target so you’re trading again as fast as possible.",
      },
      {
        q: "Do you move refrigerated or specialist equipment?",
        a: "We can relocate most shop equipment. Specialist refrigeration or gas-connected kit may need your engineer — we’ll flag that at quoting stage.",
      },
      {
        q: "How do you price a shop move?",
        a: "Retail moves are quoted individually after a short walkthrough or video survey, covering crew, vehicles, timing and any fixture work.",
      },
    ],
  },

  "warehouse-removals": {
    intro: [
      "Warehouse removals need the right vans, the right crew count and a plan for racking, pallets and stock flow — not a house-move approach with bigger boxes. Phi Movers relocates warehouse and light-industrial loads across London with commercial timing and a clear written quote.",
      "We handle stock, racking (when dismantled/reassembled as agreed), packing stations and office corners of the unit. Jobs are priced from volume, access, loading bays and whether you need evenings or a weekend cutover.",
      "One project contact, insured transit and crews used to loading-bay rules and tight yard turns.",
    ],
    included: [
      "Survey or video assessment of volume and access",
      "Crew and vans sized to the warehouse load",
      "Stock, pallet and racking handling as agreed",
      "Labelling and staged loading where needed",
      "Evening or weekend cutovers on request",
      "Commercial goods-in-transit cover",
    ],
    idealFor: [
      "Unit-to-unit warehouse relocations",
      "Stock moves between London sites",
      "Racking and packing-station shifts",
      "Businesses that need a planned cutover weekend",
    ],
    faqs: [
      {
        q: "How much does a warehouse removal cost?",
        a: "Warehouse moves are custom-quoted from volume, access, crew size and timing. After a short survey you’ll get a fixed written price — not an open-ended hourly guess for a large stock move.",
      },
      {
        q: "Do you dismantle and rebuild racking?",
        a: "Yes when booked. Simple bolt-together racking is straightforward; specialist systems may need your supplier — we’ll flag that early.",
      },
      {
        q: "Can you work around live operations?",
        a: "Often yes — we stage zones, use evenings/weekends, or move bay-by-bay so part of the site stays productive.",
      },
    ],
  },

  "full-packing-service": {
    intro: [
      "Packing is the part of moving that eats evenings and weekends. Our full packing service takes it off your plate — our team arrives with quality materials and packs every room carefully, labelled and ready for the van.",
      "Kitchens, wardrobes, books and fragile pieces are wrapped the right way, not just thrown into boxes. You’ll get a clear inventory-style labelling system so unpacking at the other end is calm rather than chaotic.",
      "Add packing to any home or office move, or book it as a standalone day before your removal. Either way, you get a fixed price and a home that’s move-ready without the last-minute panic.",
    ],
    included: [
      "Professional packing crew and quality materials",
      "Room-by-room packing with clear labelling",
      "Fragile wrapping for glass, crockery and frames",
      "Wardrobe and kitchen packing as standard",
      "Materials included in your packing quote",
      "Option to unpack at the destination",
    ],
    idealFor: [
      "Busy households with no time to pack",
      "Full house and flat moves",
      "Anyone with lots of fragile kitchenware",
      "Office moves needing labelled crates",
    ],
    faqs: [
      {
        q: "How long does full packing take?",
        a: "A typical one-bed flat is often packed in a day; larger homes may need more crew or a second day. We’ll estimate after hearing how many rooms and how full they are.",
      },
      {
        q: "Are boxes and paper included?",
        a: "Yes — materials are included in the packing quote unless you ask to use your own. We bring boxes, tape, paper and bubble wrap as needed.",
      },
      {
        q: "Can you pack some rooms and leave others?",
        a: "Of course. Many customers pack clothes themselves and leave kitchens and breakables to us — we’ll quote only for what you need.",
      },
    ],
  },

  "fragile-only-packing": {
    intro: [
      "You don’t always need a full packing crew — sometimes it’s just the kitchen, the glassware and the pieces you’d hate to see cracked. Our fragile-only packing service focuses on exactly that.",
      "Experienced packers wrap crockery, glass, mirrors, pictures and valuables with proper materials and box them so they travel upright and protected. Everything else can stay as you’ve packed it.",
      "It’s a smart middle ground: you save money by packing the easy stuff yourself, while the items most likely to break get professional care.",
    ],
    included: [
      "Specialist wrapping for glass, crockery and ceramics",
      "Picture, mirror and frame protection",
      "Quality boxes, paper and bubble wrap",
      "Clear fragile labelling on every carton",
      "Can be booked alone or with your move",
      "Fixed price based on volume of fragile items",
    ],
    idealFor: [
      "Kitchens packed by the professionals",
      "Art, mirrors and glass furniture",
      "Customers who pack clothes but not breakables",
      "Short packing sessions before moving day",
    ],
    faqs: [
      {
        q: "What counts as ‘fragile’?",
        a: "Typically kitchenware, glassware, ornaments, mirrors, framed art and similar breakables. Tell us roughly how many boxes’ worth and we’ll quote accordingly.",
      },
      {
        q: "How much does fragile-only packing cost?",
        a: "It starts from around £80 depending on volume. A small kitchen is often at the lower end; larger homes with lots of glassware cost more.",
      },
      {
        q: "Do you pack TVs and monitors?",
        a: "Yes — screens can be included. Original boxes are ideal; if you don’t have them, we’ll protect screens with blankets and corner guards.",
      },
    ],
  },

  "packing-materials": {
    intro: [
      "Good packing starts with the right kit. Our packing materials service delivers sturdy boxes, tape, wrapping paper and bubble wrap to your door — so you’re not hunting half-broken cartons the night before the move.",
      "Choose a ready-made kit sized for a studio, one-bed or larger home, or tell us what you need and we’ll put a custom bundle together. Everything is chosen for removals, not supermarket leftovers.",
      "Combine materials with a man & van or full removal and you’ll be ready to pack properly without last-minute shop runs.",
    ],
    included: [
      "Double-walled removal boxes in useful sizes",
      "Packing tape and dispensers",
      "Wrapping paper and/or bubble wrap",
      "Optional wardrobe boxes and specialty cartons",
      "Delivery across London boroughs",
      "Advice on how many boxes you’ll likely need",
    ],
    idealFor: [
      "DIY packers who want proper materials",
      "Students and small flat moves",
      "Topping up supplies mid-pack",
      "Anyone avoiding flimsy supermarket boxes",
    ],
    faqs: [
      {
        q: "How many boxes do I need?",
        a: "As a rough guide, a studio often needs 15–25 boxes, a one-bed 25–40, and a three-bed home 60+. We’ll help you choose a kit once you tell us your home size.",
      },
      {
        q: "Can you deliver materials before moving day?",
        a: "Yes — most customers take delivery a week or two ahead so packing isn’t rushed. Same-week delivery is often available too.",
      },
      {
        q: "Do you take boxes back after the move?",
        a: "Ask us when you book. In many cases we can collect flattened boxes on a return visit or with a related job.",
      },
    ],
  },

  "piano-and-specialist": {
    intro: [
      "Pianos, antiques and oversized pieces need more than a strong back — they need the right technique, padding and crew. Our piano & specialist service moves upright and grand pianos, heavy gym kit, safes and awkward heirlooms with trained care.",
      "We assess stairs, turns and doorway widths before we commit, then bring piano boards, straps and enough people to keep every step controlled. No dragging, no ‘hope for the best’ — just a calm, planned lift.",
      "Whether it’s a hallway piano that’s lived there for twenty years or a specialist item from a gallery or studio, we’ll quote honestly and only proceed when the access is workable.",
    ],
    included: [
      "Trained specialist crew for heavy items",
      "Piano boards, straps and heavy-duty protection",
      "Pre-move access check for stairs and turns",
      "Careful loading and securing in the van",
      "Placement in the agreed room at destination",
      "Appropriate insurance for specialist moves",
    ],
    idealFor: [
      "Upright and grand piano moves",
      "Antiques, marble and oversized furniture",
      "Gym equipment, safes and heavy appliances",
      "Items that need more than a standard crew",
    ],
    faqs: [
      {
        q: "Do you move grand pianos?",
        a: "Yes, subject to access. Grands need space, the right kit and often a larger crew — we’ll confirm feasibility after seeing photos or visiting.",
      },
      {
        q: "Can you take a piano up a narrow staircase?",
        a: "Often yes for uprights, if turns and widths allow. We’ll be honest if access is too tight and discuss alternatives (different route or specialist lift options).",
      },
      {
        q: "How much does a piano move cost?",
        a: "Specialist moves start from around £180 depending on piano type, floors and distance. You’ll get a fixed quote before we book.",
      },
    ],
  },

  "furniture-assembly": {
    intro: [
      "Flat-pack instructions and missing screws are nobody’s idea of a good moving day. Our furniture assembly service dismantles what needs to travel safely and rebuilds beds, wardrobes and desks at the other end — tools, time and patience included.",
      "Book it with your removal or as a standalone job after delivery. We bring the right kit, protect floors while we work, and leave furniture solid and ready to use.",
      "From a single bed frame to a full flat of IKEA pieces, you get a clear price and a tidy finish — no half-built wardrobe left overnight.",
    ],
    included: [
      "Dismantling of agreed furniture before the move",
      "Reassembly at the destination",
      "Beds, wardrobes, desks and common flat-pack",
      "Basic fixings checked and tightened",
      "Floor and wall protection while working",
      "Can be booked with or without a removal",
    ],
    idealFor: [
      "Flat-pack heavy homes and student lets",
      "Wardrobes that won’t fit through doorways built",
      "Busy movers who don’t want a DIY evening",
      "Landlords preparing a property for new tenants",
    ],
    faqs: [
      {
        q: "What furniture can you assemble?",
        a: "Most beds, wardrobes, chests, desks and standard flat-pack. Complex custom joinery or wall-to-wall fitted units may need a specialist — we’ll say if something is outside scope.",
      },
      {
        q: "How much does assembly cost?",
        a: "It starts from around £60 depending on how many pieces and how complex they are. We’ll quote from a simple list or photos.",
      },
      {
        q: "Do you provide screws if some are missing?",
        a: "We carry common fixings for typical flat-pack. Unusual or brand-specific parts may need a quick hardware run — we’ll keep you updated if that happens.",
      },
    ],
  },

  "sofa-delivery": {
    intro: [
      "Need a sofa collected and delivered in London without hiring a whole house-move crew? Phi Movers specialises in sofa delivery — marketplace finds, showroom pickups and flat-to-flat moves — with stairs, tight landings and awkward doorways handled as part of the job.",
      "Dedicated sofa jobs start from £55. That is a fixed price for a sofa run once we know size, floors and distance — not the same as our hourly man-and-van rate (from £50/hour with a two-hour minimum). You get a clear quote before we set off; no card details needed just to ask.",
      "We wrap and protect the sofa, carry it in by hand, and place it in the room you choose. Corner sofas, leather sets and narrow Victorian stairs are everyday work for us across all 32 boroughs.",
    ],
    included: [
      "Collection from home, store, warehouse or private seller",
      "Blankets, straps and protection for fabric or leather",
      "Carry up or down stairs and through tight access",
      "Placement in the agreed room",
      "Goods-in-transit and public liability cover as standard",
      "Clear fixed quote before the crew leaves",
    ],
    idealFor: [
      "Gumtree, Facebook Marketplace and auction sofas",
      "Showroom or warehouse collections across London",
      "Flat moves where only the sofa (or sofa + a few pieces) is going",
      "Jobs with stairs, no lift, or tight hallways",
    ],
    steps: [
      {
        title: "Send photos and addresses",
        body: "Call us or send a quote request with pickup and delivery postcodes, which floor at each end, and the size of the sofa. Most sofa quotes come back within about one working hour. No deposit and no card details to enquire.",
      },
      {
        title: "Confirm your slot",
        body: "Agree a time window that works for both addresses. A small deposit is only asked when you confirm the booking — it comes off the final balance. You’ll get a confirmation with what to prepare.",
      },
      {
        title: "We collect and protect",
        body: "The crew wraps the sofa, checks doorways and stair turns, and loads it securely. If legs or a modular section need removing for access, we do that carefully and refit at the other end when practical.",
      },
      {
        title: "Delivery and placement",
        body: "We carry the sofa in, place it where you want it, and only leave once you’re happy. Balance is due on completion.",
      },
    ],
    affects: [
      "Sofa size — 2-seater, 3-seater, corner or L-shape",
      "Floors and stairs at pickup and delivery (lift or no lift)",
      "Carry distance from parking to the door",
      "Distance between addresses beyond the included miles",
      "Whether a second person is needed for weight or tight turns",
      "Parking or bay suspension at either address",
    ],
    faqs: [
      {
        q: "How much does sofa delivery cost in London?",
        a: "Dedicated sofa delivery starts from £55 for a straightforward run. The final fixed price depends on sofa size, floors/stairs and distance. That is separate from hourly man-and-van (from £50/hour, two-hour minimum from £100) which suits multi-item or flexible hourly jobs. We’ll tell you which pricing fits before you book.",
      },
      {
        q: "Do I pay a deposit to get a quote?",
        a: "No. Quotes are free and you don’t need to leave card details just to enquire. A small deposit is only requested when you confirm a booking, and it comes off your final balance.",
      },
      {
        q: "Can you collect from Gumtree or Facebook Marketplace?",
        a: "Yes. Send the seller’s address and a contact number. We recommend confirming the sofa is still available and ready before the crew sets off so you’re not charged for a wasted run.",
      },
      {
        q: "What if the stairs are narrow?",
        a: "We move sofas up and down tight London staircases by hand every week. Photos of the sofa and the stairwell help us plan. If access looks extreme, we’ll say so before booking rather than discover it on the day.",
      },
      {
        q: "Will you remove sofa legs or split a corner unit?",
        a: "Where it helps with access, yes — we can remove legs or separate modular sections and refit them on delivery when the design allows. Tell us the make/model or send a photo if you’re unsure.",
      },
      {
        q: "Is sofa delivery insured?",
        a: "Yes. Jobs include goods-in-transit and public liability cover as standard. Ask if you need higher cover for a particularly expensive piece.",
      },
    ],
  },

  "bed-and-mattress-delivery": {
    intro: [
      "Bought a new bed or mattress and need it home without dragging it through the tube? Our bed and mattress delivery service collects from store, warehouse or seller and places everything in the right room — stairs and tight turns included.",
      "Jobs start from around £50 depending on size, floors and distance. We can dismantle an old bed frame for removal when booked, and reassemble a new frame so you’re not left with a bag of bolts at midnight.",
      "Mattresses stay wrapped and protected in transit. One clear fixed quote before we set off; no card details needed just to enquire.",
    ],
    included: [
      "Collection from store, warehouse or private seller",
      "Protected mattress and frame transport",
      "Carry-in to the agreed bedroom",
      "Optional dismantle of old bed / basic new-frame assembly",
      "Stairs and tight access handling",
      "Insured delivery as standard",
    ],
    idealFor: [
      "New bed and mattress drop-offs",
      "Marketplace bed collections",
      "Flat moves where only the bed is changing",
      "High-floor deliveries without a lift",
    ],
    faqs: [
      {
        q: "How much does bed and mattress delivery cost?",
        a: "From around £50 for a straightforward run. King sizes, high floors or long carries are quoted from access and distance. You’ll get a fixed price before booking.",
      },
      {
        q: "Will you assemble the bed frame?",
        a: "Basic frame assembly can be included when booked. Complex storage beds or missing parts may need extra time — tell us the make if you can.",
      },
      {
        q: "Can you take the old mattress away?",
        a: "Often yes when disposal is practical — ask when you enquire so we plan van space and any disposal fee.",
      },
    ],
  },

  "appliance-delivery": {
    intro: [
      "Fridges, washers, dryers and dishwashers need careful handling — tipping a fridge the wrong way or scratching a kitchen can ruin the day. Our appliance delivery service moves white goods across London and positions them where you need them.",
      "Deliveries start from around £50 depending on the appliance, floors and distance. We protect floors and doorways, use the right straps and trolleys, and can help with disconnect/reconnect of simple plug-in units when agreed (plumbing and gas stay with a qualified tradesperson).",
      "Ideal for store collections, marketplace finds and swapping out a broken machine the same week.",
    ],
    included: [
      "Collection and protected transport of white goods",
      "Trolleys, straps and floor protection",
      "Carry up or down stairs as assessed",
      "Placement in the agreed spot",
      "Clear fixed quote before we leave",
      "Goods-in-transit and public liability cover",
    ],
    idealFor: [
      "Fridge, freezer and washer deliveries",
      "Dryer and dishwasher moves",
      "Marketplace appliance collections",
      "Kitchen swap-outs with tight access",
    ],
    faqs: [
      {
        q: "How much does appliance delivery cost?",
        a: "From around £50 for a typical single appliance run. Heavy American-style fridges or high floors may need two people — we’ll quote clearly first.",
      },
      {
        q: "Do you plumb in washers or gas cookers?",
        a: "We position appliances and can help with simple plug-in disconnect/reconnect when agreed. Water, waste and gas connections need a qualified plumber or Gas Safe engineer.",
      },
      {
        q: "Should I empty the fridge first?",
        a: "Yes — empty and defrost fridges/freezers before collection so they’re lighter, safer and don’t leak in the van.",
      },
    ],
  },

  "single-item-delivery": {
    intro: [
      "One item, one clear job. Our single item delivery service is built for marketplace buys, store collections and “too big for an Uber” pieces — desks, TVs, bikes, gym kit and similar.",
      "Prices start from around £50 depending on size, stairs and distance. You get a fixed quote, a protected carry and placement where you want it — without paying for a full house-move crew.",
      "If the load grows into several items, we may suggest hourly man-and-van instead. We’ll tell you which is cheaper before you book.",
    ],
    included: [
      "Collection from seller, store or home",
      "Blankets and straps for protection",
      "Carry-in to the agreed room",
      "Help with stairs and doorways",
      "Fixed quote for the single-item run",
      "Insured delivery as standard",
    ],
    idealFor: [
      "Gumtree and Facebook Marketplace finds",
      "One-off store or warehouse pickups",
      "Desks, TVs, bikes and gym equipment",
      "Anyone who doesn’t need a full van load",
    ],
    faqs: [
      {
        q: "How much does single item delivery cost?",
        a: "From around £50 for a light, straightforward item. Heavy, bulky or high-floor pieces cost more. Multi-item loads may be better on hourly man-and-van from £50/hour (two-hour minimum).",
      },
      {
        q: "What counts as a single item?",
        a: "One main piece — for example a desk, TV or bike. A small bag of accessories that travels with it is fine. Extra furniture usually means a different quote.",
      },
      {
        q: "Do I pay a deposit to get a quote?",
        a: "No — quotes are free. A small deposit only applies when you confirm the booking.",
      },
    ],
  },

  "furniture-delivery": {
    intro: [
      "Bought a sofa, bed or flat-pack online and need it home without the hassle? Our furniture delivery service collects single items and small loads across London and places them where you want them — stairs and awkward doorways included.",
      "It’s ideal for marketplace finds, store collections and showroom pickups. We wrap and protect the piece, carry it carefully and can unpack or basic-assemble flat-pack when booked.",
      "One clear fixed price before we set off — no card details needed just to enquire. A small deposit only applies when you confirm the booking.",
    ],
    included: [
      "Collection from store, warehouse or private seller",
      "Protected transport with blankets and straps",
      "Carry-in to the agreed room",
      "Help with stairs and tight access",
      "Optional basic flat-pack assembly",
      "Insured delivery as standard",
    ],
    idealFor: [
      "Sofa, bed and appliance deliveries",
      "Marketplace and auction collections",
      "Flat-pack drop-offs with assembly",
      "Single-item moves across London",
    ],
    faqs: [
      {
        q: "How much does furniture delivery cost?",
        a: "Single-item deliveries are quoted as a fixed job from the item size, stairs and distance — for sofas see our sofa delivery page from £55. Multi-item or open-ended jobs may use hourly man-and-van (from £50/hour, two-hour minimum). We’ll confirm which applies before you book.",
      },
      {
        q: "Can you collect from IKEA or a private seller?",
        a: "Yes. Give us the pickup details and a contact number. For private sales we recommend confirming the item is ready before the crew sets off.",
      },
      {
        q: "Will you take packaging away?",
        a: "We can remove outer packaging on request and take it with us where disposal is practical. Let us know when you book.",
      },
      {
        q: "Do I need a deposit for a quote?",
        a: "No — quotes are free with no card details required. A small deposit only applies when you confirm a booking.",
      },
    ],
  },

  "vehicle-transport": {
    intro: [
      "Need a car, motorbike or piece of equipment moved without putting miles on it yourself? Our vehicle transport service relocates cars, bikes and similar kit safely across London and further afield, with the right transporter and securing method for the job.",
      "We arrange collection and delivery windows that work around your keys and access, and we treat every vehicle as high-value cargo — strapped, protected and driven by people who move vehicles for a living.",
      "From a city runabout to a classic or a site machine, you’ll get a clear quote and a booking you can plan around.",
    ],
    included: [
      "Suitable transporter or recovery method for the vehicle",
      "Secure loading and strapping",
      "Agreed collection and delivery windows",
      "Careful handling of low or modified vehicles (as assessed)",
      "Cover appropriate to the job",
      "Updates on ETA while in transit",
    ],
    idealFor: [
      "Cars that can’t or shouldn’t be driven",
      "Motorbike and scooter relocations",
      "Auction, dealer and private vehicle moves",
      "Light equipment and trailer moves",
    ],
    faqs: [
      {
        q: "Do you offer enclosed transport?",
        a: "Standard moves use an open transporter or appropriate recovery vehicle. Enclosed options can be arranged for higher-value or sensitive vehicles — ask when you enquire.",
      },
      {
        q: "Can you move a non-running car?",
        a: "Often yes, with winch or specialist loading. Tell us if it doesn’t start, has a seized brake or is particularly low so we send the right kit.",
      },
      {
        q: "How is vehicle transport priced?",
        a: "Quotes are based on distance, vehicle type and loading requirements. You’ll get a fixed price before we confirm the booking.",
      },
    ],
  },

  "motorbike-transport": {
    intro: [
      "Moving a bike shouldn’t mean risking it in the rain on a mate’s trailer. Our motorbike transport service relocates scooters and motorcycles across London with proper strapping, wheel chocks and a crew who move bikes regularly.",
      "Jobs start from around £80 depending on bike size, distance and whether it runs. Non-runners and low bikes need the right loading method — tell us upfront so we send suitable kit.",
      "Ideal for auction collections, dealer transfers, house moves where the bike is part of the load, and seasonal storage runs.",
    ],
    included: [
      "Secure loading with straps and wheel support",
      "Suitable van or transporter for the bike",
      "Agreed collection and delivery windows",
      "Care for fairings, mirrors and soft luggage when fitted",
      "Cover appropriate to the job",
      "ETA updates while in transit",
    ],
    idealFor: [
      "Scooter and motorcycle relocations",
      "Auction and dealer collections",
      "Non-running bikes that need winching",
      "Bikes moving with a house or flat removal",
    ],
    faqs: [
      {
        q: "How much does motorbike transport cost?",
        a: "From around £80 for a straightforward London run. Distance, bike size and whether it starts affect the fixed quote.",
      },
      {
        q: "Can you move a non-running motorcycle?",
        a: "Often yes, with winch or ramp assistance. Tell us if the brakes are seized or the bike is particularly low.",
      },
      {
        q: "Do I need to drain fuel?",
        a: "A small amount of fuel is usually fine. For longer storage or shipping we’ll advise if draining is safer — ask when you book.",
      },
    ],
  },

  "same-day-move": {
    intro: [
      "Plans change. Keys appear early, a seller pushes completion, or a marketplace sofa won’t wait until next week. Our same-day move option adds urgent capacity when you need a van and crew today — not next Tuesday.",
      "Subject to availability, we’ll match you with the nearest suitable crew, confirm a fixed price and get moving. You still get the same care, insurance and loading help as a planned booking — just on a tighter clock.",
      "Message or call early in the day for the best chance of a slot. We’ll be honest if we’re fully booked and suggest the soonest alternative.",
    ],
    included: [
      "Priority matching to an available crew",
      "Same care and insurance as a standard booking",
      "Loading and unloading help included",
      "Clear price confirmed before we dispatch",
      "Phone updates on the day",
      "Available across London boroughs subject to capacity",
    ],
    idealFor: [
      "Last-minute key exchanges",
      "Urgent single-item collections",
      "Unexpected date changes",
      "Anyone who needs a van today",
    ],
    faqs: [
      {
        q: "Is same-day always available?",
        a: "It depends on crew capacity. Mid-week mornings are usually easier than late Friday afternoons. Contact us as early as you can and we’ll confirm within minutes.",
      },
      {
        q: "How much extra is same-day?",
        a: "Same-day bookings typically add from £20 depending on timing and demand. You’ll see the full fixed price before you confirm.",
      },
      {
        q: "What if you can’t make today?",
        a: "We’ll offer the earliest next slot — often first thing the following morning — so you’re not left guessing.",
      },
    ],
  },

  "last-minute-removals": {
    intro: [
      "Completion moved, landlord changed the date, or you only found out you need a van tomorrow — our last minute removals service is built for short-notice London moves when the calendar won’t wait.",
      "Subject to crew availability, we confirm a fixed price fast and turn up with the right van and people. You still get loading help, protection materials and standard insurance — just with less lead time than a planned booking.",
      "Contact us as soon as you know the date. Mid-week is usually easier than peak Saturday; we’ll be honest if we’re full and offer the soonest alternative.",
    ],
    included: [
      "Short-notice booking when capacity allows",
      "Fixed price confirmed before dispatch",
      "Van and crew matched to your load",
      "Loading help and basic protection materials",
      "Goods-in-transit and public liability cover",
      "Phone updates on the day",
    ],
    idealFor: [
      "Sudden key-exchange changes",
      "Emergency flat and studio moves",
      "Jobs that can’t wait a week",
      "Customers comparing last-minute options",
    ],
    faqs: [
      {
        q: "How last-minute can you take a booking?",
        a: "Same-day and next-day are often possible mid-week. Weekends and month-end need earlier notice. Message us with addresses and volume and we’ll confirm within minutes if we can help.",
      },
      {
        q: "Is last-minute more expensive?",
        a: "Short-notice slots can add from around £15–£25 depending on demand. The full fixed price is always shown before you confirm — no surprise uplift on the doorstep.",
      },
      {
        q: "What’s the difference vs same-day move?",
        a: "Same-day is specifically “today”. Last-minute covers urgent bookings in the next day or two when plans suddenly change. Overlap is fine — we’ll pick the label that matches your timing.",
      },
    ],
  },

  "evening-and-weekend-moves": {
    intro: [
      "Not everyone can move at 10am on a Tuesday. Our evening and weekend moves service runs out-of-hours slots so you can finish work, collect keys, or keep the shop open while we handle the heavy lifting.",
      "Hourly man-and-van starts from £60/hour for evening and weekend timing (still with a clear minimum), and larger jobs get a fixed out-of-hours quotation. You’ll know the price before we arrive.",
      "Popular for office cutovers, retail overnight moves and residential key exchanges that only land on Saturdays.",
    ],
    included: [
      "Evening and weekend booking windows",
      "Crew scheduled around your keys or trading hours",
      "Same care and insurance as daytime moves",
      "Loading and unloading help included",
      "Clear pricing for out-of-hours timing",
      "Quiet, professional arrival at residential buildings",
    ],
    idealFor: [
      "Saturday key exchanges",
      "After-work flat and house moves",
      "Office and shop out-of-hours cutovers",
      "Anyone who can’t take weekday leave",
    ],
    faqs: [
      {
        q: "How much do evening and weekend moves cost?",
        a: "Out-of-hours man-and-van guides from £60/hour with a clear minimum. Full house or office moves get a fixed quote that includes the evening/weekend timing. Daytime rates may be lower if your diary allows.",
      },
      {
        q: "How late can you work?",
        a: "Many residential jobs run into the evening; buildings with quiet hours may need an earlier finish. Tell us any porter or neighbour rules when you book.",
      },
      {
        q: "Are Sundays available?",
        a: "Often yes, subject to crew. Sunday and bank-holiday demand is high — book ahead when you can.",
      },
    ],
  },

  "international-moves": {
    intro: [
      "Moving abroad takes more than a big van — it takes packing standards, paperwork awareness and partners you can trust at the other end. Our international moves service covers door-to-door relocations across Europe and beyond, coordinated from London.",
      "We start with a survey and inventory, agree road, sea or air options, and pack to export standards where needed. You’ll have one UK contact who keeps the journey visible from collection to delivery.",
      "Whether you’re relocating for work, study or a new chapter overseas, we keep the London end calm and professional so the rest of the journey has a solid start.",
    ],
    included: [
      "Survey and export-ready inventory",
      "Professional packing to international standards",
      "Road, sea or air options as appropriate",
      "UK collection and destination liaison",
      "Guidance on documentation you may need",
      "Insured transit for the agreed journey",
    ],
    idealFor: [
      "Relocations to Europe and further afield",
      "Expat and corporate moves",
      "Students moving overseas with belongings",
      "Part-load and full-load international shipments",
    ],
    faqs: [
      {
        q: "Do you handle customs paperwork?",
        a: "We guide you on what’s typically required and work with destination partners. Personal customs declarations remain your responsibility, but we won’t leave you guessing what to prepare.",
      },
      {
        q: "How long does an international move take?",
        a: "Road moves within Europe can take days; sea freight takes longer depending on the route. We’ll give realistic transit windows at quoting stage.",
      },
      {
        q: "Can you store my things before shipping?",
        a: "Yes — secure storage in the UK is available if your flight or completion date doesn’t line up with the container or truck departure.",
      },
    ],
  },

  "european-moves": {
    intro: [
      "Moving to or from Europe by road is often faster and simpler than sea freight for a household load. Our European moves service covers door-to-door road relocations between London and destinations across the continent — packed properly, documented clearly and tracked by one UK contact.",
      "We start with a survey and inventory, agree part-load or dedicated vehicle options, and pack to the standard your route needs. Export paperwork guidance is part of the conversation so you’re not googling customs rules the night before collection.",
      "Ideal for expats, remote workers and families relocating within the EU and nearby countries who want a calm London collection and a reliable handover abroad.",
    ],
    included: [
      "Survey and European road-move inventory",
      "Export-aware packing where required",
      "Part-load or dedicated vehicle options",
      "London collection and destination liaison",
      "Guidance on documents you typically need",
      "Insured transit for the agreed route",
    ],
    idealFor: [
      "Relocations to France, Spain, Germany and beyond",
      "EU and nearby country household moves",
      "Part-load shipments that don’t fill a lorry",
      "Moves where road transit beats sea timing",
    ],
    faqs: [
      {
        q: "How is a European move different from international?",
        a: "European moves focus on road routes across the continent. Broader international covers sea/air and longer-haul destinations too. If you’re unsure, tell us the country and we’ll recommend the right product.",
      },
      {
        q: "How long does a European road move take?",
        a: "Often several days depending on country, part-load schedules and border timing. We’ll give a realistic window with your quote — not a vague “soon”.",
      },
      {
        q: "Do you help with customs after Brexit?",
        a: "We guide you on common personal-effects requirements and work with destination partners. Final declarations remain your responsibility; we won’t leave you without a checklist.",
      },
    ],
  },

  "end-of-tenancy-clean": {
    intro: [
      "Getting your deposit back shouldn’t hang on a missed oven shelf. Our end-of-tenancy clean is a thorough, checklist-style deep clean designed for London landlords and letting agents — after you’ve moved out, or just before handover.",
      "We clean kitchens, bathrooms, floors, insides of cupboards and the fiddly bits that fail inspections. Combine it with your removal or house clearance and you can hand back keys knowing the place looks cared for.",
      "Fixed pricing, reliable arrival windows and a clean that aims for deposit-ready — not a quick wipe-over.",
    ],
    included: [
      "Kitchen deep clean including appliances (as agreed)",
      "Bathrooms descaled and sanitised",
      "Floors vacuumed and mopped throughout",
      "Internal cupboard and surface wipe-down",
      "Checklist aligned to typical agent expectations",
      "Optional add-ons for ovens, windows or carpets",
    ],
    idealFor: [
      "Tenants aiming for a full deposit return",
      "Landlords preparing a void property",
      "Moves where cleaning after packing isn’t realistic",
      "Anyone handing keys back the same week",
    ],
    faqs: [
      {
        q: "How much does an end-of-tenancy clean cost?",
        a: "Cleans start from around £120 depending on property size and condition. We’ll confirm a fixed price once we know bedrooms and any extras (oven, windows, carpets).",
      },
      {
        q: "Do you guarantee my deposit back?",
        a: "No cleaner can legally guarantee a deposit — that’s the agent’s decision — but we clean to a professional end-of-tenancy standard that meets typical check-out expectations.",
      },
      {
        q: "Can you clean on the same day as my move?",
        a: "Often yes, once the property is empty. We’ll schedule the clean after the van leaves so we’re not working around boxes.",
      },
    ],
  },

  "free-home-survey": {
    intro: [
      "Some moves are too big or too complex to price from a form alone. Our free home survey is a no-obligation visit (or video survey) so we can see your inventory, access and parking with our own eyes — and give you a quote you can trust.",
      "A surveyor walks through with you, notes bulky items, stairs and carry distances, and flags anything that might affect the crew or van size. You get a clear written quote afterwards, with no pressure to book on the spot.",
      "Ideal for larger homes, awkward access, pianos or anything where you’d rather be exact than guess. Book a survey, get your number, then decide in your own time.",
    ],
    included: [
      "No-obligation home or video survey",
      "Inventory and access assessment",
      "Advice on van size and crew numbers",
      "Parking and permit pointers for your street",
      "Written fixed quote after the visit",
      "Completely free — no hidden survey fee",
    ],
    idealFor: [
      "Three-bed+ homes and complex access",
      "Moves with pianos or specialist items",
      "Customers who want certainty before booking",
      "Anyone comparing quotes properly",
    ],
    faqs: [
      {
        q: "Is the survey really free?",
        a: "Yes. There’s no charge for the survey and no obligation to book. If you do book, the quote from the survey is the one we work to.",
      },
      {
        q: "How long does a survey take?",
        a: "Usually 20–40 minutes depending on the size of the property. Video surveys are often quicker and still accurate for many jobs.",
      },
      {
        q: "When will I get the quote?",
        a: "Typically the same day or within one working day of the survey, sent by email or phone with a clear breakdown.",
      },
    ],
  },

  "sofa-and-furniture-hoisting": {
    intro: [
      "Some sofas simply won’t go up the stairs. A tight turn on a Victorian landing, a low ceiling over the half-landing or a narrow door into a mansion-block flat can stop a delivery dead. Phi Movers’ sofa and furniture hoisting service lifts the piece up the outside of the building and in through a window, balcony or French door instead — so the sofa you chose still ends up in your living room.",
      "Hoisting is planned, not improvised. We start with photos and measurements of the item and the opening, check the route from the street to the window, and confirm whether the lift is workable before we book. On the day the crew sets up rated lifting gear, keeps a clear exclusion zone below the lift, protects the window frame and walls, and guides the item in by hand.",
      "We hoist sofas, corner units, beds, wardrobes, mattresses, dining tables and other bulky furniture into and out of flats and houses across all 32 London boroughs. Combine it with our sofa delivery, furniture delivery or furniture assembly service and one crew handles the whole job: collection, the lift and putting everything back together inside.",
    ],
    included: [
      "Pre-job assessment from your photos and measurements (or a survey visit)",
      "Written plan and risk assessment for the lift",
      "Rated ropes, slings and lifting gear, checked before every job",
      "Protective wrapping for the item, window frame and walls",
      "Exclusion zone and a banksman at street level during the lift",
      "Hand-guiding the item in through the window, balcony or door and placing it in the room",
      "Goods-in-transit and public liability insurance",
    ],
    idealFor: [
      "Sofas and corner units that won’t fit up the stairs or through the front door",
      "Upper-floor flats with balconies, Juliet balconies or large sash windows",
      "Beds, wardrobes and mattresses that can’t be dismantled small enough",
      "Furniture deliveries that a retailer’s two-person crew couldn’t get in",
      "Taking large furniture out of a flat when you’re moving",
    ],
    steps: [
      {
        title: "Photos and measurements",
        body: "Send photos of the item, the window or balcony opening and the outside of the building from the street. We need the item’s width, depth and height, the clear opening size of the window or door (frame to frame, not glass size), and which floor it’s on. From this we tell you whether hoisting looks workable or whether a survey visit is needed.",
      },
      {
        title: "Access and permissions",
        body: "We check where the van can park, whether the pavement below needs coning off, and whether a parking bay suspension is needed. If you rent or live in a managed block, we’ll ask you to get the landlord’s or managing agent’s permission for the lift and, if needed, for a window to be opened or a sash removed.",
      },
      {
        title: "Set-up and rigging",
        body: "On the day the crew protects the item, the window frame and the walls, sets an exclusion zone at street level and rigs the lifting gear from a secure anchor point. Every rope, sling and fitting is checked before any weight goes on it.",
      },
      {
        title: "The lift",
        body: "One crew member controls the lift, one guides the item from the ground and a banksman keeps people clear below. The item comes up steadily, is guided in through the opening by hand and is set down onto protected floor — nothing is swung or forced.",
      },
      {
        title: "Placement and tidy-up",
        body: "We unwrap the item, place it in the room you want and refit legs or reassemble any sections we removed. The rigging comes down, the window is closed and secured, and we only leave once you’re happy.",
      },
    ],
    affects: [
      "Size and approximate weight of the item",
      "Which floor it’s going to and the clear size of the window or balcony opening",
      "Whether a window sash or door needs removing and refitting",
      "Street access — parking, pavement width and any bay suspension",
      "How many crew are needed to control the lift safely",
      "Whether the hoist is combined with delivery, collection or assembly",
    ],
    faqs: [
      {
        q: "How do I know if my sofa can be hoisted?",
        a: "Measure the sofa (width, depth and height) and the clear opening of the window, balcony door or French door, then send photos of the opening from inside and the outside of the building from the street. If the sofa’s smallest cross-section is smaller than the opening with room to spare for wrapping, hoisting is usually possible. We’ll confirm after seeing your photos or doing a survey.",
      },
      {
        q: "Can you lift furniture over a balcony?",
        a: "Often, yes. Balconies are one of the most common routes because the opening is usually larger than a window. We check the balcony railing, the doors behind it and the drop to the street, and confirm the method after photos or a survey.",
      },
      {
        q: "Do I need permission to hoist furniture?",
        a: "If you rent or live in a block with a managing agent, get written permission before the lift — especially if a window needs to be opened fully or removed. We’ll tell you what we need to plan the job and can provide our insurance details for the building.",
      },
      {
        q: "Is furniture hoisting insured?",
        a: "Yes. Hoisting jobs are covered by our goods-in-transit and public liability insurance. If the item is particularly valuable, tell us when you enquire so we can check the cover suits it.",
      },
      {
        q: "How much does sofa hoisting cost?",
        a: "Hoisting is priced as a custom quote because every building is different. The price depends on the item, the floor, the opening and how many crew the lift needs. Send photos and measurements and we’ll come back with a clear fixed price before you book.",
      },
    ],
  },

  "moving-crate-hire": {
    intro: [
      "Moving crate hire is the simple alternative to building, taping and recycling dozens of cardboard boxes. Phi Movers delivers sturdy plastic moving crates to your door before the move, you pack at your own pace, and we collect the empty crates once you’ve unpacked at the other end.",
      "Crates stack neatly, don’t collapse when they’re full of books, and keep their shape in a van or a lift. Most have lids that close without tape, so you can pack, close and stack in seconds — and unpack straight onto the shelves in your new home.",
      "Crate hire suits flat and house moves, office moves and renovations across London. Hire crates on their own and pack yourself, or pair them with our full packing service or packing materials (bubble wrap, paper and wardrobe boxes) and we’ll put together exactly what your move needs.",
    ],
    included: [
      "Clean plastic moving crates, delivered to your door",
      "Collection of the empty crates from your new address",
      "Flexible hire period agreed when you book",
      "Advice on how many crates you need for your home",
      "Option to add packing paper, bubble wrap and wardrobe boxes",
      "Option to add our packing team to pack and unpack for you",
    ],
    idealFor: [
      "Flat and house moves where you’d rather not deal with cardboard",
      "Office moves that need stackable, closable crates per desk",
      "Renovations where belongings need boxing up for a few weeks",
      "Heavy items like books, records, files and kitchenware",
      "Anyone who wants less packing waste after the move",
    ],
    steps: [
      {
        title: "Tell us your home size",
        body: "Let us know how many bedrooms you have, roughly how much you own (minimal, average or full) and your move date. We’ll suggest how many crates you need and when to have them delivered — usually a few days before the move.",
      },
      {
        title: "We deliver the crates",
        body: "Crates arrive clean and ready to use, so you can start packing straight away. If you’ve added packing materials, they come in the same delivery.",
      },
      {
        title: "Pack and label",
        body: "Pack heavy things like books in the bottom of crates and lighter items on top, close the lids and label each crate with its room. Don’t overfill — the lid should close flat so crates stack safely.",
      },
      {
        title: "Move day",
        body: "Full crates stack securely in the van and on trolleys, so loading is quicker and safer. If we’re doing your move, the crew places each crate in the right room at your new home.",
      },
      {
        title: "Unpack and we collect",
        body: "Unpack at your own pace within the agreed hire period, stack the empty crates and let us know when they’re ready. We collect them from your new address.",
      },
    ],
    affects: [
      "How many crates you need",
      "How long you need them for",
      "Delivery and collection addresses and distance between them",
      "Whether you add packing materials such as paper, bubble wrap or wardrobe boxes",
      "Whether you add packing, unpacking or a full removal",
    ],
    faqs: [
      {
        q: "How many moving crates do I need?",
        a: "As a rough guide only: around 10–15 crates for a kitchen, 8–12 per bedroom, 8–12 for a living room with books, and 3–6 for a bathroom. A studio or one-bed flat often needs somewhere around 25–40 crates and a three-bed house around 70–100. Tell us how full your home is and we’ll suggest a number.",
      },
      {
        q: "Is it cheaper to hire crates or buy boxes?",
        a: "It depends on how many you need and how long for. Crates are reused, so there’s nothing to buy, build or recycle afterwards, and they protect heavy and fragile items better than cardboard. We’ll quote for crate hire so you can compare it with buying a box kit.",
      },
      {
        q: "How long can I keep the crates?",
        a: "You agree the hire period when you book — long enough to pack before the move and unpack afterwards. If you need longer, just ask and we’ll extend it.",
      },
      {
        q: "Can I hire crates without booking a removal?",
        a: "Yes. Crate hire works on its own: we deliver, you move however suits you, and we collect from your new address. You can add our removal crew at any time.",
      },
      {
        q: "What shouldn’t go in a crate?",
        a: "Avoid anything that leaks, liquids, flammables or food that could spoil. Wrap glass and china in paper or bubble wrap first, and keep crates to a weight one person can lift comfortably.",
      },
    ],
  },

  "heavy-and-machinery-moving": {
    intro: [
      "Heavy items don’t move like the rest of a house. A treadmill, a multi-gym, a safe, a stone table or a workshop machine can be far heavier than it looks, with weight concentrated in one place and nothing easy to grip. Phi Movers’ heavy and machinery moving service plans those lifts properly — the route, the crew, the equipment and the floor at both ends.",
      "We start with photos, the item’s make and model if it has one, and the route from where it stands to where it’s going: stairs, turns, door widths, lifts and floor surfaces. From that we work out how many crew are needed, whether it should be partly dismantled, and what handling equipment the job needs. If we can’t do it safely, we’ll tell you before booking.",
      "We move home and commercial gym equipment, safes, heavy furniture, workshop and catering equipment, and light machinery for homes, studios and small businesses across London. For pianos, see our piano and specialist service — the same careful planning, with kit made for pianos.",
    ],
    included: [
      "Pre-move assessment from photos, model details or a survey visit",
      "Risk assessment and a lifting plan for the route",
      "Crew sized to the weight and the access",
      "Heavy-duty trolleys, straps and protection suited to the item",
      "Floor, wall and doorway protection along the route",
      "Dismantling and reassembly of gym equipment where practical",
      "Goods-in-transit and public liability insurance",
    ],
    idealFor: [
      "Treadmills, cross-trainers, multi-gyms, racks and weight stacks",
      "Home and commercial safes",
      "Workshop, catering and light commercial machinery",
      "Stone, marble and other very heavy furniture",
      "Gyms, studios and small businesses relocating equipment",
    ],
    steps: [
      {
        title: "Photos and item details",
        body: "Send photos of the item and the route out, plus the make and model if it has one. Manufacturers usually publish the weight and dimensions, which helps us plan accurately. Tell us about stairs, lifts, steps and door widths at both addresses.",
      },
      {
        title: "Assessment and plan",
        body: "We work out the safest route, the crew size and the handling equipment needed, and whether the item should be partly dismantled. For larger or unusual items we’ll visit first. You get a clear plan and a fixed quote.",
      },
      {
        title: "Preparation",
        body: "Before moving day, make sure the item is disconnected from power, water or gas by a qualified person where needed, safes are emptied, and weight plates are removed from racks. On the day we protect floors, walls and doorways along the route.",
      },
      {
        title: "The move",
        body: "The crew dismantles what’s practical, then moves the item with trolleys, straps and enough people to keep every step controlled. It’s secured in the van so it can’t shift in transit.",
      },
      {
        title: "Positioning",
        body: "We bring the item in along the planned route, reassemble it where we took it apart and position it where you want it. We’ll ask you to check it over before we leave.",
      },
    ],
    affects: [
      "Weight and size of the item, and whether it can be dismantled",
      "Stairs, steps, lifts and door widths at both addresses",
      "How many crew the lift needs to stay safe",
      "Specialist handling equipment needed for the item",
      "Disconnection or reconnection by a qualified trade, if required",
      "Distance between addresses and parking at each end",
    ],
    faqs: [
      {
        q: "Can you move gym equipment?",
        a: "Yes. We move treadmills, cross-trainers, bikes, multi-gyms, racks and weights for homes and gyms. Many machines can be partly dismantled to get through doors and up stairs; send the make and model and we’ll confirm what’s needed.",
      },
      {
        q: "Do you move safes?",
        a: "Yes, subject to the weight and the access. Safes are heavy for their size, so we need the model or dimensions and details of any stairs. Please empty the safe before the move. We’ll confirm whether it’s workable after photos or a survey.",
      },
      {
        q: "What kind of machinery can you move?",
        a: "We move light commercial and workshop machinery, catering equipment and similar items that can be moved by a trained crew with trolleys and handling equipment. Very large plant that needs a crane or industrial rigging is outside what we offer — we’ll tell you honestly if that’s the case.",
      },
      {
        q: "Do you disconnect machinery?",
        a: "Equipment connected to mains power, water or gas should be disconnected and reconnected by a qualified person. Once it’s safely disconnected, we’ll handle the dismantling, moving and positioning.",
      },
      {
        q: "How much does it cost to move heavy items?",
        a: "Heavy and machinery moves are priced as a custom quote because the weight, access and crew size vary so much. Send photos and details and we’ll come back with a clear fixed price before you book.",
      },
    ],
  },

  "storage-with-collection": {
    intro: [
      "Storage with collection means you don’t hire a van, drive to a storage unit and carry everything in yourself. Phi Movers collects your belongings from your home, takes them into secure storage, and brings them back — to the same address or a new one — when you’re ready.",
      "It’s built for the moments when your home can’t hold your things for a while: a kitchen refit or loft conversion, a gap between selling and buying, a tenancy that ends before the next one starts, or time working abroad. You choose what goes and when, and we can bring items back in one delivery or in stages.",
      "Storage starts from £15 per week, with 24/7 CCTV monitoring and no long contract. Add our packing team, moving crates or furniture dismantling and we’ll handle the whole thing door to door.",
    ],
    included: [
      "Collection from your home by our own crew and van",
      "Wrapping and protection of furniture for storage",
      "Itemised list of what goes into storage, agreed at collection",
      "Secure storage with 24/7 CCTV monitoring",
      "Flexible terms — store for weeks or months",
      "Redelivery to the same or a new address, in one go or in stages",
      "Goods-in-transit and public liability insurance",
    ],
    idealFor: [
      "Renovations, refurbishments and kitchen or bathroom refits",
      "Gaps between moving out and moving in",
      "Decluttering before selling or letting a property",
      "Students and tenants between tenancies",
      "Working or travelling abroad for a few months",
    ],
    steps: [
      {
        title: "Tell us what you’re storing",
        body: "Send a list or photos of what needs storing, your address and roughly how long you need storage for. We’ll suggest the right amount of space and give you a clear price for collection, storage and redelivery.",
      },
      {
        title: "Book your collection",
        body: "Pick a collection date that works around your builders or move. If you’d like help packing, we can deliver moving crates beforehand or send our packing team.",
      },
      {
        title: "Collection and inventory",
        body: "The crew wraps furniture, loads boxes and crates, and goes through the list of what’s going into storage with you, so you know exactly what we’re holding.",
      },
      {
        title: "Secure storage",
        body: "Your belongings go into secure, CCTV-monitored storage. Need something back early? Give us reasonable notice and we’ll arrange access or deliver specific items.",
      },
      {
        title: "Redelivery",
        body: "When the work is finished or your new home is ready, we deliver everything back and place furniture in the rooms you choose. We can reassemble anything we took apart.",
      },
    ],
    affects: [
      "How much you’re storing and the space it needs",
      "How long you need storage for",
      "Collection and redelivery addresses, floors and access",
      "Whether you need packing, crates or furniture dismantling",
      "Whether items come back in one delivery or in stages",
    ],
    faqs: [
      {
        q: "How does storage with collection work?",
        a: "We collect your belongings from your home, take them into secure storage and deliver them back when you’re ready. You don’t need to hire a van or visit a storage unit yourself.",
      },
      {
        q: "Can I store furniture during a renovation?",
        a: "Yes — it’s one of the most common reasons people use this service. Moving furniture out protects it from dust and damage and gives your builders clear space. We can collect the rooms being worked on and bring everything back when the work is done.",
      },
      {
        q: "How much does storage with collection cost?",
        a: "Storage starts from £15 per week, depending on how much you store. Collection and redelivery are quoted separately based on volume, access and distance, so you see the full price before you book.",
      },
      {
        q: "Will I know what’s in storage?",
        a: "Yes. We go through what’s being stored with you at collection, so you have a record of what we’re holding. Labelling boxes by room makes redelivery quicker.",
      },
      {
        q: "Can I get items back before the end?",
        a: "Yes. Give us reasonable notice and we can deliver specific items or arrange access. There’s no long minimum term, so you can extend or end storage when you need to.",
      },
    ],
  },

  "long-distance-removals": {
    intro: [
      "Long distance removals from Phi Movers take you from London to anywhere in mainland UK — or bring you into London from elsewhere — with the same London-based crew loading, driving and unloading. Whether you’re moving to Manchester, Bristol, Leeds, Edinburgh or a village in Cornwall, the job is planned around the route, the legal limits on driving time and the size of your home, then quoted as a fixed price before you book.",
      "A long-distance move is a different job from a cross-London one. A few hundred miles means the timing has to work: loading early enough to arrive while it’s still light, legal breaks for the driver, keys being released at the other end, and parking for a large van on a street the crew has never seen. For bigger homes or the longest routes, the sensible plan is often a two-day move — load and drive on day one, an overnight stop, then deliver fresh on day two.",
      "You’ll choose between a dedicated van, which carries only your belongings on your dates, and a part load, where you share space on a van already heading your way and pay less in return for more flexible timing. We’ll explain which suits your move, give you a written inventory-based quote and tell you exactly what’s included — so you can compare us properly with any other long distance moving company.",
    ],
    included: [
      "Fixed quote based on your inventory, both addresses and access — no open-ended hourly bill",
      "Free home survey or video survey for larger homes",
      "Route and timing plan, including driver breaks and an overnight stop where needed",
      "Blankets, straps and wrapping for furniture; floors and doorways protected",
      "Loading, transport and unloading by the same London-based crew",
      "Dismantling and reassembly of beds and wardrobes when booked",
      "Goods-in-transit and public liability insurance",
    ],
    idealFor: [
      "Moving from London to elsewhere in the UK, or into London from another city",
      "Family houses where a two-day move is safer than one very long day",
      "Relocating for a new job, university or to be closer to family",
      "Smaller loads where a part load can cut the cost",
      "Anyone comparing long distance moving companies who wants a clear, like-for-like quote",
    ],
    steps: [
      {
        title: "Survey and inventory",
        body: "Send both postcodes, your move date and a room-by-room list, or book a free home or video survey. An accurate inventory sets the van size and crew, and it’s the only way a long-distance fixed price stays fixed — anything left off the list may not fit on the day.",
      },
      {
        title: "Route and timing plan",
        body: "We work out the driving time, legal breaks for the driver and whether the move fits in one day or needs an overnight stop. We’ll check key release times at the new property and parking at both ends, and agree a realistic arrival window with you.",
      },
      {
        title: "Packing and loading",
        body: "On loading day the crew protects floors and doorways, wraps furniture, dismantles anything that needs it and loads the van so nothing can shift over a long journey. If you’ve booked packing, it’s usually done the day before.",
      },
      {
        title: "The journey",
        body: "The van travels by the planned route with breaks built in. On two-day moves your belongings stay loaded and secured in the van overnight while the crew rests, ready for an early start. You’ll have a contact number for updates throughout.",
      },
      {
        title: "Delivery and setting up",
        body: "At your new home we unload, place furniture and boxes in the rooms you choose and reassemble anything we took apart. Check everything against your inventory before the crew leaves, and payment of the balance is taken on completion.",
      },
    ],
    affects: [
      "Distance and route, and whether an overnight stop is needed",
      "The volume of your belongings and the van size required",
      "Dedicated van or part load",
      "Crew size and the number of days the move takes",
      "Access at both addresses — stairs, lifts, carry distance and parking",
      "Packing, dismantling, storage or other extras you add",
    ],
    faqs: [
      {
        q: "How do I compare long distance moving companies?",
        a: "Ask each firm for a written quote based on the same inventory, and check whether it’s a fixed price or an estimate, what insurance is included and its limits, whether the price includes fuel, tolls and an overnight stop, and who actually does the move. Our checklist on this page covers the questions to ask.",
      },
      {
        q: "Will my move be done in one day?",
        a: "Many long-distance moves fit in one long day, but it depends on the size of your home, the distance and access at both ends. For larger homes or the longest routes we usually recommend two days so the crew isn’t rushing and the driver stays within legal driving limits.",
      },
      {
        q: "Do you move from London to Scotland?",
        a: "Yes. We move between London and towns and cities across mainland UK, including Scotland. The longest routes are normally planned as two-day moves with an overnight stop.",
      },
      {
        q: "Is a long distance move a fixed price?",
        a: "Yes — we quote long-distance moves as a fixed price based on your inventory, the addresses and the access. If what you’re moving changes significantly, tell us before the day so we can confirm the price.",
      },
      {
        q: "How much does a long distance removal cost?",
        a: "Long-distance removals are a custom quote because distance, volume, crew and the number of days vary so much. Send both postcodes and an inventory, or book a free survey, and we’ll come back with a clear fixed price.",
      },
    ],
  },

  "part-load-removals": {
    intro: [
      "A part load removal means your belongings share a van with other customers’ loads travelling the same way. Instead of paying for a whole van and a crew to drive hundreds of miles for a few rooms of furniture, you pay for the space you use on a route that’s already running. Phi Movers runs part loads between London and towns across the UK for flats, studios, students and anyone moving a smaller load a long way.",
      "The saving comes with a trade-off, and we’re upfront about it: part loads work on date windows rather than fixed times. Your collection and delivery days depend on when the van is running your route and what else is on board. If you can be flexible by a few days, a shared van removal is often the most cost-effective way to move a small load across the country.",
      "Everything is still handled by our London-based crew: furniture is wrapped, loads are kept separate and labelled, and your items are checked off an inventory at collection and delivery. If your dates can’t move, we’ll quote a dedicated long-distance van as well so you can compare.",
    ],
    included: [
      "Space on a shared van between London and your UK destination",
      "Agreed collection and delivery windows confirmed before you book",
      "Two-person loading and unloading at both addresses",
      "Furniture wrapped in blankets and secured separately from other loads",
      "Labelled items and an inventory checked at collection and delivery",
      "Goods-in-transit and public liability insurance",
    ],
    idealFor: [
      "Studio and one-bed flat moves going a long way",
      "Students moving to or from university outside London",
      "A few items of furniture going to family in another city",
      "Moves where you can be flexible by a few days",
      "Anyone who wants a long-distance move without paying for a whole van",
    ],
    steps: [
      {
        title: "Tell us what’s going",
        body: "Send a list of your items with rough sizes, both postcodes and the dates you could be ready. The more accurate the list, the more accurately we can reserve space — part loads are priced on the space you take up.",
      },
      {
        title: "Agree your date window",
        body: "We check when a van is running your route and offer collection and delivery windows. Once you’re happy with the windows and the price, we confirm the booking and the space is reserved for you.",
      },
      {
        title: "Prepare your load",
        body: "Pack everything into strong, sealed boxes or crates and label each one with your name and the destination room. Dismantle what you can, or book us to do it. Keep valuables, documents and essentials with you rather than in the van.",
      },
      {
        title: "Collection",
        body: "The crew wraps your furniture, checks your items off the inventory and loads them in their own section of the van, kept apart from other customers’ belongings and secured for the journey.",
      },
      {
        title: "Delivery",
        body: "We confirm the delivery time as the van gets closer. Your items are unloaded, checked off the inventory with you and placed in the rooms you choose.",
      },
    ],
    affects: [
      "How much space your belongings take up in the van",
      "The route and how often a van is running it",
      "How flexible your collection and delivery dates are",
      "Access at both addresses — stairs, lifts and parking",
      "Dismantling, packing or storage you add",
    ],
    faqs: [
      {
        q: "What is a part load removal?",
        a: "It’s a removal where your belongings share van space with other customers’ loads heading the same way. You pay for the space you use rather than a whole van, which is why it’s usually cheaper for smaller long-distance moves.",
      },
      {
        q: "How long will a part load take?",
        a: "It depends on the route and when a van is running it. We agree collection and delivery windows with you before you book, so you know what to expect. If you need fixed dates, a dedicated van is the better choice.",
      },
      {
        q: "Will my things be mixed up with other people’s?",
        a: "No. Each customer’s items are labelled, loaded together in their own section of the van and checked off an inventory at collection and delivery.",
      },
      {
        q: "Is a part load the same as a courier backload?",
        a: "They’re similar ideas. A backload uses space on a van’s return journey; a part load uses shared space on a planned route. Both lower the cost by filling space that would otherwise travel empty.",
      },
      {
        q: "How much does a part load removal cost?",
        a: "Part loads are a custom quote based on how much space you need, the route and your date flexibility. Send your list of items and both postcodes and we’ll come back with a clear price.",
      },
    ],
  },

  "office-furniture-removals": {
    intro: [
      "Office furniture removals cover the bit of an office move that takes the most hands: desks, bench desking, pedestals, meeting tables, storage units and chairs. Phi Movers dismantles office furniture, moves it between floors, buildings or sites across London, and rebuilds it to your floor plan — or takes it into storage or away for reuse when it’s no longer needed.",
      "Most office furniture is designed to come apart, but bench desking, cable trays and screens all need to go back together the same way. We label parts and fixings as we dismantle, keep each desk’s components together, and work from your layout so the new floor is set up correctly the first time rather than shuffled around on Monday morning.",
      "We work evenings and weekends so staff can leave on Friday and sit down at a working desk on Monday. Use this service on its own for a reconfiguration, a downsize or a furniture clear-out, or alongside our office removals service when the whole business is moving.",
    ],
    included: [
      "Site visit or photo-based assessment of the furniture and access",
      "Dismantling of desks, bench desking, meeting tables and storage",
      "Labelled parts and fixings kept together for each item",
      "Protection for floors, lifts, walls and door frames",
      "Moving between floors, buildings or sites, or into storage",
      "Reassembly and placement to your floor plan",
      "Clearance of unwanted furniture, with reuse or recycling where practical",
      "Evening and weekend working to avoid disruption",
    ],
    idealFor: [
      "Office relocations where furniture is moving with you",
      "Reconfiguring a floor or moving teams between floors",
      "Downsizing and taking surplus furniture into storage",
      "Clearing old furniture at the end of a lease",
      "Fit-outs that need existing furniture moved out and back",
    ],
    steps: [
      {
        title: "Survey and furniture list",
        body: "We visit, or work from photos and a list, to count desks, pedestals, storage, tables and chairs, check how bench desking is fixed, and look at lifts, loading bays and access at both sites. You get a clear plan and a custom quote.",
      },
      {
        title: "Floor plan and labelling",
        body: "Share the new floor plan and we agree a labelling system with you, so every desk, pedestal and storage unit has a destination. Furniture going to storage or clearance is marked separately.",
      },
      {
        title: "Dismantling",
        body: "Ask staff to clear desks and either empty or lock pedestals and storage before we arrive. We then dismantle desks, frames and tables, bag and label fixings, and protect worktops, glass and screens before anything is moved.",
      },
      {
        title: "The move",
        body: "Furniture moves by lift or stairs on trolleys with floors, lifts and corners protected, then is loaded and secured in the van. Moves between floors in the same building often don’t need a van at all.",
      },
      {
        title: "Reassembly and clearance",
        body: "We rebuild furniture to the floor plan, check desks are level and stable, and take away packaging. Unwanted items go to storage or are cleared, with reuse or recycling where practical.",
      },
    ],
    affects: [
      "How many desks, tables, storage units and chairs are moving",
      "Whether furniture needs dismantling and reassembling",
      "Access at each site — lifts, loading bays, stairs and building rules",
      "Moving within a building, between sites or into storage",
      "Evening or weekend working",
      "How much furniture needs clearing or disposing of",
    ],
    faqs: [
      {
        q: "Do you dismantle and reassemble office desks?",
        a: "Yes. We dismantle desks, bench desking, meeting tables and storage units, label the parts and fixings, and rebuild them to your floor plan at the new location.",
      },
      {
        q: "Can you move office furniture out of hours?",
        a: "Yes. Evening and weekend moves are common for office furniture so the business can keep working. Check your building’s rules for out-of-hours access and lift bookings.",
      },
      {
        q: "Do you take away old office furniture?",
        a: "Yes. We can clear unwanted desks, chairs and storage, with reuse or recycling where practical, or move it into storage if you might need it again.",
      },
      {
        q: "Can you move furniture between floors in the same building?",
        a: "Yes. Internal moves between floors or teams are one of the most common office furniture jobs, and they often don’t need a van at all.",
      },
      {
        q: "How much do office furniture removals cost?",
        a: "Office furniture removals are a custom quote based on how much furniture is moving, whether it needs dismantling, access and timing. Send a list or book a survey for a clear price.",
      },
    ],
  },

  "marketplace-collection-and-delivery": {
    intro: [
      "Found the perfect sideboard on Facebook Marketplace, a dining table on eBay or a wardrobe on Gumtree — but it’s collection only and won’t fit in your car? Phi Movers collects heavy and bulky marketplace buys from the seller’s address and delivers them to your door, with two people to carry anything one person can’t manage safely.",
      "The most common thing that goes wrong with a marketplace purchase isn’t the van — it’s the item not fitting through your door, or the seller not being home. So we help you get it right before you book: check the measurements against your stairs and doorways, pay the seller directly, agree a collection window, and share the seller’s number with us.",
      "At pickup the crew looks the item over and takes photos before it’s loaded, so you have a record of its condition when it left the seller. It’s then wrapped, carried out, secured in the van and carried into the room you want at the other end. Marketplace collection and delivery starts from £50 across London.",
    ],
    included: [
      "Collection from the seller’s home, garage or storage unit",
      "Two-person carry for heavy and bulky items",
      "Condition photos at pickup, sent to you before loading",
      "Blanket wrapping and straps in the van",
      "Delivery and placement in the room you choose",
      "Advice on measuring the item and your access before you buy",
    ],
    idealFor: [
      "Facebook Marketplace, eBay and Gumtree furniture marked collection only",
      "Heavy or bulky items parcel couriers won’t take",
      "Sofas, wardrobes, dining tables, sideboards and bookcases",
      "Buyers who can’t get to the seller themselves",
      "Second-hand appliances and gym equipment",
    ],
    steps: [
      {
        title: "Check it will fit before you buy",
        body: "Ask the seller for the item’s width, depth and height, whether it comes apart, and which floor it’s on. Measure your front door, hallway turns, stairs and the room door, and compare. If it’s tight, send us the numbers and photos and we’ll give you an honest view.",
      },
      {
        title: "Pay the seller and agree a window",
        body: "Pay the seller directly through the platform or as you’ve agreed — we don’t handle payment for the item. Agree a collection window when someone will be home, and get their phone number and full address.",
      },
      {
        title: "Book your collection",
        body: "Send us the seller’s address and number, your address, the item details and the floor and access at both ends. We confirm a fixed price and a collection slot, then call the seller when the crew is on the way.",
      },
      {
        title: "Inspection photos at pickup",
        body: "The crew looks the item over and sends you photos before loading. If it doesn’t match the listing, you can decide there and then. We’ll take a look for obvious damage, but we can’t test electrical items or judge the price.",
      },
      {
        title: "Two-person carry and delivery",
        body: "The item is wrapped, carried out by two people, strapped in the van and delivered. We carry it up the stairs and place it in the room you want, ready to use.",
      },
    ],
    affects: [
      "The size and weight of the item",
      "Whether it needs one person or two",
      "Stairs, lifts and carry distance at the seller’s and your address",
      "Distance between the two addresses",
      "Whether the item needs dismantling at collection",
      "Waiting time if the seller isn’t ready",
    ],
    faqs: [
      {
        q: "Can you collect an eBay item for me?",
        a: "Yes. You buy and pay for the item, then send us the seller’s address and phone number and a collection window. We collect it and deliver it to your door, with two people for anything heavy or bulky.",
      },
      {
        q: "Do you collect from Facebook Marketplace and Gumtree?",
        a: "Yes. We collect from private sellers on Facebook Marketplace, Gumtree, eBay and similar sites across London. Share the listing so we can see what the item is.",
      },
      {
        q: "Do I need to be there at collection?",
        a: "No, as long as the seller is there and has been paid. We’ll send you photos of the item before loading so you can check it.",
      },
      {
        q: "What if the item won’t fit through my door?",
        a: "That’s why we ask for measurements before you buy. If it’s tight on the day, we’ll try removing legs, doors or feet where practical. For items that really won’t fit, we can talk about hoisting.",
      },
      {
        q: "How much does marketplace collection cost?",
        a: "Marketplace collection and delivery starts from £50. The price depends on the item, the crew needed, the access and the distance between addresses — you get a fixed price before booking.",
      },
    ],
  },

  "ikea-collection-and-assembly": {
    intro: [
      "Phi Movers’ IKEA collection and assembly service collects your order from a London IKEA store or click-and-collect point, delivers it to your home and builds it — PAX wardrobes, MALM chests and beds, KALLAX shelving and the rest. One booking, one crew, and no flat-pack boxes to wrestle up the stairs yourself. We are not affiliated with IKEA: you place and pay for your order with IKEA, and we handle the pickup, delivery and assembly.",
      "Tall and heavy flat-pack needs more than an Allen key. A PAX frame is built lying down and tipped upright, so it needs ceiling clearance; a MALM chest of drawers should be fixed to the wall with its anti-tip kit; a bed needs the slats and centre beam fitted properly so it doesn’t creak or sag. Our crew builds to the instructions and fits the supplied wall fixings where your walls allow.",
      "When everything’s built we take the cardboard and packaging away, so you’re not left with a hallway full of boxes. IKEA collection and assembly starts from £60, with the final price depending on what you’ve ordered and how much there is to build.",
    ],
    included: [
      "Collection from a London IKEA store or click-and-collect point",
      "Delivery to your home and carrying to the right rooms",
      "Assembly to the manufacturer’s instructions",
      "Wall-fixing of tall and heavy furniture using the supplied anti-tip kits, where your walls allow",
      "Packaging and cardboard removed and taken away",
      "A final check that drawers, doors and hinges run properly",
    ],
    idealFor: [
      "PAX wardrobes and other tall flat-pack storage",
      "MALM, HEMNES and other chests of drawers and beds",
      "KALLAX and BILLY shelving and bookcases",
      "Furnishing a new flat or a whole room at once",
      "Anyone without a car big enough for an IKEA order",
    ],
    steps: [
      {
        title: "Place your order",
        body: "Order directly with IKEA, online for click-and-collect or in store, and pay for the goods yourself. Send us the order number, the name on the order, the collection point and a list of the items so we can plan the van and the build time.",
      },
      {
        title: "Check the room",
        body: "Measure the ceiling height where a tall wardrobe is going and tell us what the walls are made of if you know — plasterboard, brick or concrete affects which fixings work. Clear the space where furniture is being built.",
      },
      {
        title: "Collection",
        body: "We collect the order from the store or collection point with your reference, check the number of packages against the order, and load it securely so boxes and panels aren’t damaged on the way.",
      },
      {
        title: "Delivery and assembly",
        body: "Boxes are carried to the right rooms and built to the instructions. Tall and heavy pieces are fixed to the wall with the supplied anti-tip kit where the wall allows; if it doesn’t, we’ll tell you and leave it safe.",
      },
      {
        title: "Packaging away and final check",
        body: "We check that drawers, doors and hinges run properly, collect up the cardboard and packaging, and take it away with us.",
      },
    ],
    affects: [
      "How many items there are and how long they take to build",
      "Large or tall pieces such as wardrobes and beds",
      "Wall-fixing requirements and wall type",
      "Stairs, lifts and carry distance at your address",
      "Which store or collection point we collect from",
      "Packaging volume to take away",
    ],
    faqs: [
      {
        q: "Are you affiliated with IKEA?",
        a: "No. Phi Movers is an independent removals company and is not affiliated with IKEA. You order and pay for your goods with IKEA, and we collect, deliver and assemble them for you.",
      },
      {
        q: "Can you collect my IKEA click-and-collect order?",
        a: "Yes. Send us the order number, the name on the order and the collection point. Check with IKEA whether a third party can collect your order and what they need to bring.",
      },
      {
        q: "Do you fix wardrobes and drawers to the wall?",
        a: "Yes, where your walls allow. Tall and heavy furniture should be fixed to the wall with its anti-tip kit. If the supplied fixings aren’t right for your wall type, we’ll tell you before going ahead.",
      },
      {
        q: "Do you take the packaging away?",
        a: "Yes. We collect the cardboard and packaging once everything is built and take it away with us.",
      },
      {
        q: "How much does IKEA collection and assembly cost?",
        a: "IKEA collection and assembly starts from £60. The price depends on how much there is to collect and build, the collection point and the access at your home. You get a clear price before booking.",
      },
    ],
  },

  "antique-and-fine-art-moving": {
    intro: [
      "Antiques and artwork don’t forgive rushed handling. A gilt frame chips, a veneer lifts, a longcase clock’s movement is damaged by a bump, a mirror cracks under its own weight. Phi Movers’ antique and fine art moving service slows the job down: every piece is assessed, photographed and wrapped individually, then carried, loaded and secured with the care it needs.",
      "We move antique furniture, paintings and framed artwork, mirrors, clocks, sculptures and other fragile or valuable pieces across London and between London and the rest of the UK — as single items, as part of a house move, or into storage. Pieces are soft-wrapped in acid-free tissue, blankets or padding suited to the surface, and bespoke crating can be arranged on request for the most fragile or valuable items.",
      "Before anything is moved, we’ll record the condition of each piece with photos and ask you about its value, so we can check that the insurance suits it. For very valuable collections, talk to your own insurer or a specialist fine art insurer too — we’ll give you the information they need.",
    ],
    included: [
      "Assessment of each piece from photos or a survey visit",
      "Condition photos taken before moving, shared with you",
      "Soft-wrapping suited to the surface — tissue, padding and blankets",
      "Bespoke crating arranged on request",
      "Careful carrying, loading and securing in the van",
      "Placement, hanging guidance and unwrapping at the destination",
      "Goods-in-transit and public liability insurance, with a check that cover suits declared values",
    ],
    idealFor: [
      "Antique furniture, including veneered, inlaid and gilded pieces",
      "Paintings, prints and framed artwork",
      "Large mirrors and glass",
      "Longcase, bracket and wall clocks",
      "Sculptures, ceramics and other fragile objects",
    ],
    steps: [
      {
        title: "Photos, details and values",
        body: "Send photos and rough measurements of each piece, tell us what it is and roughly what it’s worth. For valuable items, a recent insurance valuation helps. We’ll tell you which pieces need extra wrapping or crating.",
      },
      {
        title: "Condition record",
        body: "Before anything is touched on the day, the crew photographs each piece and notes any existing marks, chips or repairs, and shares the record with you. It protects you and us if there’s ever a question later.",
      },
      {
        title: "Wrapping and crating",
        body: "Each piece is wrapped to suit its surface: tissue against painted and gilded finishes, padding on corners and frames, blankets over furniture. Crated items are packed into their crates, and clocks are prepared for travel as advised by your clock specialist.",
      },
      {
        title: "Handling and transport",
        body: "Pieces are carried with enough people, loaded upright where needed and strapped so they can’t shift or touch. We plan the timing to avoid long waits in a cold or hot van.",
      },
      {
        title: "Delivery and unwrapping",
        body: "At the destination we unwrap each piece in the room it’s going to, check it against the condition record with you and place it where you want it.",
      },
    ],
    affects: [
      "How many pieces are being moved and their size and weight",
      "Whether pieces need crating as well as wrapping",
      "Declared values and insurance requirements",
      "Access at both addresses, including stairs and tight turns",
      "Distance, and whether the move is in London or to elsewhere in the UK",
      "Storage, hanging or other services you add",
    ],
    faqs: [
      {
        q: "How do you protect antiques and artwork in transit?",
        a: "Each piece is wrapped individually to suit its surface, carried with enough people and strapped in the van so it can’t move or touch anything else. The most fragile or valuable pieces can be crated on request.",
      },
      {
        q: "Will my antiques be insured?",
        a: "Every job includes goods-in-transit and public liability insurance. Tell us the value of your pieces when you enquire so we can check the cover suits them. For very valuable items, check with your own insurer too.",
      },
      {
        q: "Do you hang pictures and mirrors?",
        a: "We can place pictures and mirrors in the rooms you want and lean them safely. For heavy mirrors and valuable works, use a picture hanger who can check the wall and fixings.",
      },
      {
        q: "Can you move a longcase clock?",
        a: "Yes, with preparation. The pendulum and weights usually need removing and the movement securing before it’s moved. Ask a clock specialist to prepare it, or tell us and we’ll plan around them.",
      },
      {
        q: "How much does antique and fine art moving cost?",
        a: "Antique and fine art moves are a custom quote based on how many pieces there are, the wrapping or crating each needs, the access and the distance. Send photos and details for a clear price.",
      },
    ],
  },
};

/** Build a complete, detailed copy object for any service. */
export function buildServiceCopy(item: ServiceItem, areaName?: string): ServiceCopy {
  const c = copy[item.slug] ?? {};
  const t = item.title;
  const lower = item.desc.replace(/\.$/, "").toLowerCase();

  let intro =
    c.intro ??
    [
      `${t} from Phi Movers is a fully insured, fixed-price service designed to take the stress out of your move. In short, it means ${lower} — handled by an experienced, London-based crew who do this every single day. Whatever you’re moving and wherever you’re going in the capital, we bring the right van, the right people and the right equipment to get it done properly.`,
      `We believe a good move starts with a clear price. That’s why we quote up front based on your specific needs — the size of the job, the access at both ends and any extras you choose — with no hidden charges added on the day. Loading, transport and careful unloading are always part of the service, not costly add-ons.`,
      `Operating across all 32 London boroughs, we understand the practical realities of moving in the capital: tight streets, permit zones, congestion and ULEZ, narrow staircases and awkward lifts. That local expertise is what keeps your ${t.toLowerCase()} on time, on budget and free of the usual moving-day headaches.`,
    ];

  if (areaName) {
    intro = intro.map((p, idx) => {
      let res = p;
      if (idx === 0) {
        res = res.replace(/in the capital/g, `across ${areaName}`);
        res = res.replace(/moving in the capital/g, `moving in ${areaName}`);
      }
      if (idx === 2) {
        res = res.replace(/moving in the capital/g, `moving in ${areaName}`);
        res = res.replace(/moving in the capital:/g, `moving in ${areaName}:`);
      }
      return res;
    });
  }

  const included =
    c.included ??
    [
      "A clean, well-maintained van sized to the job",
      "An experienced, uniformed London crew",
      "Loading and unloading help included as standard",
      "Blankets, straps, trolleys and floor protection",
      "First 10 journey miles included in your quote",
      "Goods-in-transit and public liability insurance",
    ];

  const idealFor =
    c.idealFor ??
    [
      "Homes and businesses across every London borough",
      "Jobs that need care, experience and the right kit",
      "Customers who want a clear fixed price up front",
      "Short-notice and flexible scheduling needs",
    ];

  const faqs =
    c.faqs ??
    [
      {
        q: `How much does ${t.toLowerCase()} cost?`,
        a: `Every job is quoted individually so you only pay for what you need. Your fixed quote covers the crew, the vehicle and the first 10 miles, with no hidden extras. Use our instant estimate for a price in about a minute, or request a free home survey for larger jobs.`,
      },
      {
        q: "Which areas of London do you cover?",
        a: "We cover all 32 London boroughs, from central Westminster and Camden out to Croydon, Ealing, Bromley and beyond — with local crews who know each area well.",
      },
      {
        q: "Are my belongings insured?",
        a: "Yes. Every job includes goods-in-transit and public liability insurance as standard, so your items are protected from the moment we load them to the moment they’re delivered.",
      },
    ];

  let steps = c.steps ?? defaultSteps;
  if (areaName) {
    let sum = 0;
    for (let i = 0; i < areaName.length; i++) {
      sum += areaName.charCodeAt(i);
    }
    const hash = sum % 3;
    if (hash === 1) {
      steps = steps.map((s, idx) => {
        if (idx === 0) return { title: `Enquire for ${areaName}`, body: `Start your quote in under a minute for ${areaName} removals. Tell us what you need moving, your postcodes and preferred date. We'll reply with a clear price.` };
        if (idx === 1) return { title: "Secure your booking", body: "Pick a date that works for you. A small deposit secures the slot and is deducted from your final balance on completion day." };
        if (idx === 2) return { title: "Protection on the day", body: "Our crew will arrive on time with protective blankets, straps and floor runners to keep both your old and new homes safe." };
        if (idx === 3) return { title: `Transport through ${areaName}`, body: `We load, secure, and drive your belongings safely using vans selected for ${areaName} streets and ULEZ restrictions.` };
        return { title: "Unload & final check", body: "We place your items exactly where you want them, reassemble furniture, and make sure you're happy before taking payment." };
      });
    } else if (hash === 2) {
      steps = steps.map((s, idx) => {
        if (idx === 0) return { title: "Get a free quote", body: `Message us with your move details, postcodes in ${areaName}, and inventory. We usually respond with a fixed quote within one hour.` };
        if (idx === 1) return { title: "Lock in the slot", body: "Confirm the booking with a small deposit. We'll send you an email confirmation with helpful prep tips for your move." };
        if (idx === 2) return { title: "Packing & wrapping", body: "We wrap furniture, protect doors and stairs, and load everything carefully using premium removals equipment." };
        if (idx === 3) return { title: "Safe transport", body: `Your belongings are moved using well-maintained vehicles driven by experienced crews familiar with ${areaName} traffic routes.` };
        return { title: "Delivery and setup", body: "Our team carries everything in, places it in the correct rooms, and completes any agreed dismantling/assembly before we leave." };
      });
    }
  }

  return {
    intro,
    included,
    idealFor,
    steps,
    affects: c.affects ?? defaultAffects,
    faqs,
  };
}
