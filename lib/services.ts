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
      "Sofa & bulky-furniture hoisting up tight staircases (carried by hand — no crane)",
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
        a: "Yes — sofa and bulky-furniture hoisting up tight staircases is included and done by hand. We don’t use cranes; if access is extremely tight we’ll assess photos or a survey first.",
      },
      {
        q: "What’s included in the fixed price?",
        a: "Your quote covers the crew, the van, loading and unloading, basic protection materials and the first 10 journey miles. Optional extras like packing or storage are itemised clearly before you book.",
      },
      {
        q: "What size van do I need for my house?",
        a: "As a guide: studio / 1-bed often suits a small or transit van; a typical 2–3 bed house usually needs a Luton; larger homes may need a Luton plus extra crew or a second run. WhatsApp photos of your rooms and we’ll confirm the right van in your quote.",
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
        a: "Student moves start from £45 per hour with a two-hour minimum. Most room moves finish inside that window; larger flat shares may need a little longer or an extra helper.",
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
      "We wrap and protect the sofa, carry it by hand (no crane), and place it in the room you choose. Corner sofas, leather sets and narrow Victorian stairs are everyday work for us across all 32 boroughs.",
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
        body: "WhatsApp or call with pickup and delivery postcodes, which floor at each end, and a couple of photos of the sofa. Most sofa quotes come back within about one working hour. No deposit and no card details to enquire.",
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
      "WhatsApp and phone updates on the day",
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
        a: "Typically the same day or within one working day of the survey, sent by email or WhatsApp with a clear breakdown.",
      },
    ],
  },
};

/** Build a complete, detailed copy object for any service. */
export function buildServiceCopy(item: ServiceItem): ServiceCopy {
  const c = copy[item.slug] ?? {};
  const t = item.title;
  const lower = item.desc.replace(/\.$/, "").toLowerCase();

  const intro =
    c.intro ??
    [
      `${t} from Phi Movers is a fully insured, fixed-price service designed to take the stress out of your move. In short, it means ${lower} — handled by an experienced, London-based crew who do this every single day. Whatever you’re moving and wherever you’re going in the capital, we bring the right van, the right people and the right equipment to get it done properly.`,
      `We believe a good move starts with a clear price. That’s why we quote up front based on your specific needs — the size of the job, the access at both ends and any extras you choose — with no hidden charges added on the day. Loading, transport and careful unloading are always part of the service, not costly add-ons.`,
      `Operating across all 32 London boroughs, we understand the practical realities of moving in the capital: tight streets, permit zones, congestion and ULEZ, narrow staircases and awkward lifts. That local expertise is what keeps your ${t.toLowerCase()} on time, on budget and free of the usual moving-day headaches.`,
    ];

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

  return {
    intro,
    included,
    idealFor,
    steps: c.steps ?? defaultSteps,
    affects: c.affects ?? defaultAffects,
    faqs,
  };
}
