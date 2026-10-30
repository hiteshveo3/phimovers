import type { ServiceSeo } from "./seoTargets";

/**
 * Keyword targeting for the second batch of specialist service pages:
 * long distance removals, part load removals, office furniture removals,
 * marketplace collection & delivery, IKEA collection & assembly and
 * antique & fine art moving. Same shape and tone as `specialistSeo`.
 *
 * Crews are London-based: long-distance and part-load moves run between
 * London and the rest of the UK, never from depots elsewhere. No prices are
 * stated beyond the existing “from £50” (single item) and “from £60”
 * (assembly) figures; capability limits are phrased as “we’ll confirm”.
 */
export const specialistSeo2: Record<string, ServiceSeo> = {
  "long-distance-removals": {
    title: "Long Distance Removals UK | Long Distance Movers | Phi Movers",
    description:
      "Long distance removals between London and anywhere in the UK. Route planning, overnight stops, fixed inventory-based quotes and a checklist to compare movers.",
    h1: "Long Distance Removals from London",
    lead:
      "Moving from London to Manchester, Bristol, Edinburgh or anywhere else in the UK — or into London from elsewhere? Our London-based crew plans the route, the timing and the driver’s breaks, then loads, drives and unloads your home for a fixed price agreed before you book.",
    overviewH2: "How a long-distance move from London is planned",
    sections: [
      {
        id: "planning",
        label: "Planning",
        h2: "Planning a London to anywhere-in-the-UK move",
        paras: [
          "A cross-London move is mostly about parking and stairs. A long-distance move adds the clock. The crew has to load, drive a few hundred miles within legal driving limits, take proper breaks and still arrive with enough daylight and energy to unload safely — and the keys at the new address have to be released in time. We plan each of those before we quote, not on the day.",
          "Drivers of larger removal vehicles must follow drivers’ hours rules, which set maximum driving time and require regular breaks. That’s why a removal van can’t simply drive non-stop from London to Scotland. For shorter routes — London to the Midlands, the South West or the North West — the whole move often fits in one long day. For the longest routes, or for large homes that take most of a day to load, a two-day move is safer and usually less stressful.",
        ],
        list: [
          "Route and driving time checked against legal break requirements",
          "Arrival window agreed around key release at the new property",
          "Parking checked at both ends — permits, bay suspensions, narrow streets",
          "One-day move for shorter routes and smaller homes",
          "Two-day move with an overnight stop for large homes or the longest routes",
        ],
      },
      {
        id: "two-day-moves",
        label: "Two-day moves",
        h2: "Two-day moves and overnight stops",
        paras: [
          "On a two-day move we load on day one, drive part or all of the route, and the crew rests overnight with your belongings loaded and secured in the van. Day two starts early with unloading at your new home, so the most careful part of the job isn’t done at the end of a very long day.",
          "A two-day move also helps when completion happens late in the day. Rather than racing to unload in the dark, we can load the day before completion and deliver once the keys are released. We’ll tell you when we think a two-day plan is the right one and why.",
        ],
      },
      {
        id: "dedicated-vs-part-load",
        label: "Dedicated vs part load",
        h2: "Dedicated van or part load?",
        paras: [
          "A dedicated van carries only your belongings, on your dates, by the most direct route. It’s the right choice for a full house, fixed completion dates, or when you need collection and delivery on the same or consecutive days.",
          "A part load means sharing a van with other customers’ loads travelling the same way. You pay for the space you use, so it’s usually cheaper for a studio, a one-bed flat or a few items of furniture — in return for flexible date windows rather than fixed times. We’ll price both where they make sense.",
        ],
        list: [
          "Dedicated: your dates, direct route, best for full homes",
          "Part load: shared van, lower cost, flexible date windows",
          "Both: London-based crew, wrapping, loading, unloading and insurance",
        ],
      },
      {
        id: "comparing-movers",
        label: "Comparing movers",
        h2: "How to choose the best long distance moving company",
        paras: [
          "If you’re comparing long distance moving companies, the cheapest headline price isn’t always the cheapest move. Ask every firm the same questions, give them the same inventory, and compare like with like. A good mover will answer all of these clearly and in writing.",
        ],
        list: [
          "Fixed price or estimate? A fixed price shouldn’t change unless what you’re moving changes; an estimate can grow on the day",
          "Is the quote based on a proper inventory or a survey (home or video), or a guess from the number of bedrooms?",
          "What insurance is included — goods in transit and public liability — and what are the limits and exclusions?",
          "Are fuel, tolls, congestion and ULEZ charges and any overnight stop included in the price?",
          "Who does the move — the firm’s own crew, or is it passed to a subcontractor?",
          "How many crew and what size of vehicle, and will it be one day or two?",
          "What’s included: wrapping, dismantling and reassembly, packing materials?",
          "What deposit is asked for, and what are the cancellation and date-change terms?",
          "What happens if keys are released late or completion is delayed?",
        ],
      },
      {
        id: "preparing",
        label: "Preparing",
        h2: "Preparing for a long-distance move",
        paras: [
          "Book early if you can, especially for Fridays and month-ends. Declutter before you get quotes so you’re not paying to move things hundreds of miles you’ll throw away at the other end. Label boxes by room, keep an essentials box with you, and carry documents, keys, medication and valuables in your own car.",
          "Moving to a town outside London? Our UK removals pages cover individual towns and routes, and our house removals page explains what’s included in a full house move.",
        ],
      },
    ],
    faqs: [
      {
        q: "What should I look for in a long distance moving company?",
        a: "A written fixed price based on a proper inventory or survey, clear insurance cover, a plan for driving time and any overnight stop, the firm’s own crew doing the move, and clear deposit and cancellation terms. Compare every quote against the same inventory.",
      },
      {
        q: "Can you move me from London to anywhere in the UK?",
        a: "We move between London and towns and cities across mainland UK, including Scotland and Wales. Our crews are London-based, so every long-distance move starts or ends in London.",
      },
      {
        q: "Do you need an overnight stop for long moves?",
        a: "Sometimes. It depends on the distance, the size of your home and legal limits on driving time. For the longest routes and larger homes we plan a two-day move with an overnight stop, and we’ll tell you when we quote.",
      },
      {
        q: "Is it cheaper to do a part load for a long-distance move?",
        a: "Usually, for smaller loads. A part load shares van space with other customers going the same way, so you pay for the space you use. The trade-off is flexible dates rather than fixed times.",
      },
      {
        q: "How much do long distance removals cost?",
        a: "Long-distance removals are a custom quote based on distance, volume, crew, access and whether the move takes one day or two. Send both postcodes and an inventory, or book a free survey, for a fixed price.",
      },
    ],
  },

  "part-load-removals": {
    title: "Part Load Removals | Shared Van Moves London–UK | Phi Movers",
    description:
      "Part load and shared van removals between London and the UK. Pay for the space you use on a route we’re already running. Flexible dates, lower cost.",
    h1: "Part Load Removals Between London and the UK",
    lead:
      "Moving a flat, a few rooms or a handful of furniture a long way? With a part load, your belongings share a van with other loads going the same way, so you pay for the space you use rather than a whole van. We’ll tell you honestly what the date windows look like before you book.",
    overviewH2: "Shared van removals for smaller long-distance moves",
    sections: [
      {
        id: "how-it-works",
        label: "How it works",
        h2: "How a part load removal works",
        paras: [
          "On a part load, our van runs a planned route between London and other parts of the UK carrying several customers’ belongings. Each load is collected, labelled and secured in its own section of the van, then delivered in turn along the route. Because the cost of the van, fuel and crew is shared, each customer pays less than they would for a dedicated van.",
          "It’s the same idea as a courier backload — filling space that would otherwise travel empty — but planned in advance as a route rather than relying on a spare return journey.",
        ],
        list: [
          "You tell us what’s going, both postcodes and your available dates",
          "We match you to a van running your route and confirm date windows",
          "Your items are wrapped, labelled and loaded in their own section",
          "Delivery is confirmed as the van approaches your new address",
        ],
      },
      {
        id: "cost",
        label: "Why it’s cheaper",
        h2: "Why shared van removals cost less",
        paras: [
          "On a long-distance move, much of the cost is the vehicle, the fuel and the crew’s time on the road — and that’s the same whether the van is full or a quarter full. A part load splits it between everyone on board, so a small load doesn’t pay for empty space.",
          "Part loads are priced on how much space your belongings take up, so an accurate list matters. Declutter first, dismantle what you can and pack into strong, stackable boxes or crates to keep the space — and the price — down.",
        ],
      },
      {
        id: "trade-offs",
        label: "Trade-offs",
        h2: "The honest trade-offs: dates and time windows",
        paras: [
          "Part loads work on windows, not fixed times. Your collection and delivery days depend on when a van is running your route and where your stop falls on it. Collection and delivery may not be on the same day, and the time on the day can be a window rather than a set slot.",
          "That suits plenty of moves — a student going to university, furniture going to family, a flat move without a fixed completion date. It doesn’t suit a house sale with a fixed completion day, a move where you can’t be in for a window, or anything that has to arrive on a specific day. In those cases a dedicated long-distance van is the better choice, and we’ll quote both.",
        ],
        list: [
          "Good fit: flexible dates, smaller loads, no fixed completion day",
          "Not a good fit: fixed completion dates, very tight timings, full houses",
          "Your belongings may spend time on the van while other stops are made",
        ],
      },
      {
        id: "preparing",
        label: "Preparing",
        h2: "Preparing your load for a shared van",
        paras: [
          "Pack everything into sealed, labelled boxes or crates with your name and the destination room. Loose items take more space and are harder to keep separate. Keep valuables, documents, medication and anything you’ll need in the first few days with you, not on the van.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is a part load removal?",
        a: "A removal where your belongings share van space with other customers’ loads heading the same way. You pay for the space you use rather than a whole van, so it’s usually cheaper for smaller long-distance moves.",
      },
      {
        q: "Can I choose the exact date for a part load?",
        a: "Part loads run on date windows rather than fixed dates. We agree the collection and delivery windows with you before booking. If you need a specific day, a dedicated long-distance van is the better option.",
      },
      {
        q: "How are my belongings kept separate?",
        a: "Every item is labelled, loaded together in its own section of the van and checked off an inventory at collection and delivery.",
      },
      {
        q: "What’s the difference between a part load and a backload?",
        a: "A backload uses spare space on a van’s return journey. A part load is shared space on a planned route. Both lower the cost by filling space that would otherwise travel empty.",
      },
      {
        q: "How much does a part load removal cost?",
        a: "Part loads are a custom quote based on the space you need, the route and how flexible your dates are. Send a list of items and both postcodes for a clear price.",
      },
    ],
  },

  "office-furniture-removals": {
    title: "Office Furniture Removals London | Movers & Disposal | Phi Movers",
    description:
      "Office furniture removals in London — desks, bench desking, storage and meeting tables dismantled, moved, rebuilt, stored or cleared. Evenings and weekends.",
    h1: "Office Furniture Removals in London",
    lead:
      "Desks, bench desking, pedestals, meeting tables, storage and chairs — dismantled, moved between floors or sites, and rebuilt to your floor plan. We also take surplus furniture into storage or clear it, and work evenings and weekends so your team isn’t disrupted.",
    overviewH2: "Office furniture movers for London businesses",
    sections: [
      {
        id: "what-we-move",
        label: "What we move",
        h2: "Office furniture we dismantle, move and rebuild",
        paras: [
          "Office furniture is built to come apart, but not all of it comes apart the same way. Bench desking shares frames, beams and cable trays between positions; meeting tables often have separate tops and bases; tall storage needs emptying and sometimes unfixing from the wall. We label parts and fixings for each item as we dismantle, so everything goes back together the same way.",
        ],
        list: [
          "Single desks, sit-stand desks and bench desking",
          "Pedestals, lockers, filing cabinets and tambour storage",
          "Meeting and boardroom tables",
          "Task chairs, soft seating and breakout furniture",
          "Desk screens, cable trays and monitor arms",
          "Reception desks and shelving",
        ],
      },
      {
        id: "relocation",
        label: "Relocation",
        h2: "Office furniture relocation between floors and sites",
        paras: [
          "A lot of office furniture work happens inside one building: a team moves floors, a department expands, or a floor is reconfigured after a fit-out. These moves often need no van at all — just a crew, trolleys and a lift booking. For moves between sites, the furniture is wrapped, loaded and rebuilt at the new address to your floor plan.",
          "Share the floor plan before the move and we’ll agree a labelling system with you, so each desk, pedestal and storage unit has a destination and the crew can rebuild without guesswork.",
        ],
      },
      {
        id: "storage-disposal",
        label: "Storage & disposal",
        h2: "Office furniture storage and disposal",
        paras: [
          "Downsizing, hybrid working or a new fit-out often leaves surplus furniture. We can take it into storage if you might need it again, or clear it. Wherever practical, good-condition furniture is reused, resold or donated and the rest recycled, rather than everything going to landfill.",
          "When you compare office furniture disposal options, ask any provider where the furniture will go and how it will be disposed of, so you know it’s being handled responsibly.",
        ],
      },
      {
        id: "out-of-hours",
        label: "Out of hours",
        h2: "Evening and weekend office furniture moves",
        paras: [
          "Most office furniture moves are best done outside working hours. Staff clear their desks on Friday afternoon, we dismantle, move and rebuild over the evening or weekend, and the team arrives to working desks. Check your building’s rules for out-of-hours access, lift bookings and loading bays early.",
          "Moving the whole business? Our office removals service covers IT, files and everything else, and our guide to how much an office move costs explains what goes into the price.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you dismantle and rebuild bench desking?",
        a: "Yes. We dismantle bench desking, single desks and meeting tables, label parts and fixings, and rebuild them to your floor plan.",
      },
      {
        q: "Can you dispose of old office furniture?",
        a: "Yes. We clear unwanted desks, chairs and storage, with reuse, resale, donation or recycling wherever practical. We can also take surplus furniture into storage.",
      },
      {
        q: "Do you work evenings and weekends?",
        a: "Yes. Most office furniture moves are done out of hours so your team can keep working. Let us know your building’s access rules when you enquire.",
      },
      {
        q: "Do I need to empty pedestals and storage?",
        a: "Yes, please ask staff to clear desks and empty or lock pedestals and storage before the move. Loaded drawers make furniture heavier and contents can shift or spill.",
      },
      {
        q: "How much do office furniture removals cost?",
        a: "Office furniture removals are a custom quote based on how much furniture is moving, dismantling and reassembly, access and timing. Send a list or book a survey for a clear price.",
      },
    ],
  },

  "marketplace-collection-and-delivery": {
    title: "eBay & Marketplace Collection and Delivery London | Phi Movers",
    description:
      "eBay courier for heavy and bulky items, plus Gumtree and Facebook Marketplace furniture collection in London. Two-person carry, photos at pickup. From £50.",
    h1: "eBay, Gumtree & Facebook Marketplace Collection and Delivery",
    lead:
      "Bought something heavy or bulky that’s collection only? We collect it from the seller, photograph it before loading, carry it with two people and place it in the room you want. Marketplace collection and delivery starts from £50 across London.",
    overviewH2: "A collection service for marketplace buys",
    sections: [
      {
        id: "before-you-buy",
        label: "Before you buy",
        h2: "Check it will fit before you buy",
        paras: [
          "The most expensive marketplace mistake is a sofa or wardrobe that won’t go through your front door. Listing measurements are often approximate, so ask the seller to measure the item themselves — width, depth and height, plus the diagonal depth for sofas — and whether it comes apart.",
          "Then measure your route: the front door, any tight hallway turns, the stairs and the door of the room it’s going into. If the numbers are close, send them to us with photos of the item and your hallway and we’ll give you an honest view before you commit.",
        ],
        list: [
          "Item width, depth and height, measured by the seller",
          "Whether legs, feet, doors or sections come off",
          "Which floor it’s on at the seller’s, and whether there’s a lift",
          "Your front door, hallway turns, stairs and room door",
          "Photos from the listing and of the item from several angles",
        ],
      },
      {
        id: "paying-and-booking",
        label: "Paying & booking",
        h2: "Paying the seller and booking your collection",
        paras: [
          "Pay the seller directly, through the platform where it offers buyer protection or as you’ve agreed with them — we don’t take payment for the item on anyone’s behalf. Agree a collection window when the seller will definitely be home, and ask whether there’s parking or a loading spot nearby.",
          "When you book, send us the seller’s address and phone number, the collection window, your address and the access at both ends. We confirm a fixed price and call the seller when the crew is on the way. If the seller isn’t there and nobody can release the item, a wasted journey may be charged, so please confirm the time with them first.",
        ],
      },
      {
        id: "inspection",
        label: "Inspection photos",
        h2: "Inspection photos at pickup",
        paras: [
          "Before the item is loaded, the crew looks it over for obvious damage and sends you photos. If it doesn’t match the listing, you can decide whether to go ahead before it’s in the van. It also gives you a record of the item’s condition when it left the seller.",
          "We can’t test electrical items, check for hidden faults or judge whether the price was fair — that’s between you and the seller.",
        ],
      },
      {
        id: "two-person",
        label: "Two-person carry",
        h2: "Two-person carry for heavy and bulky items",
        paras: [
          "Parcel couriers usually won’t take a dining table, a wardrobe or a cast-iron radiator, and a single driver can’t carry them safely up a flight of stairs. For anything heavy or bulky we send two people, wrap the item, strap it in the van and carry it into the room you want.",
          "Bought several things from different sellers? Tell us when you book — collections can often be combined into one route. For a sofa that won’t go up the stairs, see our sofa hoisting service.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is there an eBay pick up service for large items?",
        a: "Yes. We collect heavy and bulky eBay items from the seller and deliver them to your door across London, with two people for anything one person can’t carry safely.",
      },
      {
        q: "Do you do Facebook Marketplace furniture collection?",
        a: "Yes. We collect furniture from Facebook Marketplace, Gumtree and eBay sellers. Pay the seller directly, agree a collection window and send us the details.",
      },
      {
        q: "Do I have to be at the collection?",
        a: "No. As long as the seller is there and has been paid, we’ll collect and send you photos of the item before loading.",
      },
      {
        q: "Can you collect from outside London?",
        a: "Our crews are London-based. For sellers just outside London, send both postcodes and we’ll tell you whether we can help and what it costs.",
      },
      {
        q: "How much does marketplace collection and delivery cost?",
        a: "It starts from £50. The price depends on the item, whether it needs one or two people, the access at both ends and the distance. You get a fixed price before booking.",
      },
    ],
  },

  "ikea-collection-and-assembly": {
    title: "IKEA Delivery & Assembly Service London | Phi Movers",
    description:
      "IKEA pickup and assembly in London: we collect from IKEA stores or click-and-collect, deliver, build and wall-fix. From £60. Not affiliated with IKEA.",
    h1: "IKEA Collection, Delivery & Assembly in London",
    lead:
      "We collect your IKEA order from a London store or click-and-collect point, deliver it, build it, fix tall furniture to the wall and take the packaging away — all in one visit. From £60. Phi Movers is independent and not affiliated with IKEA.",
    overviewH2: "IKEA pickup and assembly in one booking",
    sections: [
      {
        id: "collection",
        label: "Collection",
        h2: "Collecting from IKEA stores and click-and-collect",
        paras: [
          "You order and pay for your goods directly with IKEA, in store or online for click-and-collect. We then collect the order from the London store or collection point you’ve chosen and bring it to your home. Send us the order number, the name on the order and a list of the items so we can plan the van and the build time.",
          "Check with IKEA whether a third party can collect your order and what they need to bring. When we collect, we count the packages against the order so nothing is left behind.",
        ],
        list: [
          "Order number and the name on the order",
          "Which store or click-and-collect point it’s ready at",
          "A list of items, so we know what we’re building",
          "Your address, floor and access (lift, stairs, parking)",
        ],
      },
      {
        id: "assembly",
        label: "Assembly",
        h2: "Assembling PAX, MALM, KALLAX and beds",
        paras: [
          "Some flat-pack is quick to build; some needs planning. A PAX wardrobe frame is built lying down and tipped upright, so it needs enough ceiling height and floor space to do that — measure the ceiling before you order a tall frame. Doors, hinges and interior fittings then need adjusting so they hang straight.",
          "MALM and other chests of drawers take time because of the number of drawers and runners. KALLAX shelving is straightforward but heavy once built, so it’s best assembled in the room it’s staying in. Beds need slats and centre supports fitted properly so they don’t creak or sag.",
        ],
      },
      {
        id: "wall-fixing",
        label: "Wall-fixing",
        h2: "Wall-fixing and anti-tip kits",
        paras: [
          "Tall and heavy furniture such as wardrobes, chests of drawers and bookcases can tip over if it isn’t fixed to the wall, which is a serious risk around children. Most of this furniture comes with an anti-tip kit, and it should be fitted.",
          "The supplied fixings aren’t suitable for every wall. Plasterboard, brick and concrete each need the right fixings, and we’ll check before drilling. If the wall isn’t suitable or there are cables or pipes in the way, we’ll tell you and leave the furniture safe. If you rent, check with your landlord before fixing to the wall.",
        ],
      },
      {
        id: "packaging",
        label: "Packaging",
        h2: "Packaging removal and a final check",
        paras: [
          "A room’s worth of flat-pack leaves a surprising amount of cardboard and plastic. Once everything is built we gather it up and take it away, then check that drawers, doors and hinges run smoothly before we leave. Need furniture taken apart for a move as well? Our furniture assembly service covers dismantling and rebuilding.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are you part of IKEA?",
        a: "No. Phi Movers is an independent removals company and is not affiliated with IKEA. You buy from IKEA; we collect, deliver and assemble.",
      },
      {
        q: "Can you pick up my IKEA order and build it the same day?",
        a: "Usually, yes. Collection, delivery and assembly are normally done in one visit. Larger orders, such as a full bedroom of PAX wardrobes, can take longer, and we’ll tell you how long to allow.",
      },
      {
        q: "Do you fix furniture to the wall?",
        a: "Yes, where the wall allows. We fit the supplied anti-tip kits to tall and heavy furniture and check the wall type first. If you rent, check with your landlord.",
      },
      {
        q: "Do you take the cardboard away?",
        a: "Yes. We remove the packaging and cardboard once everything is built.",
      },
      {
        q: "How much does IKEA collection and assembly cost?",
        a: "It starts from £60. The price depends on what you’ve ordered, how long it takes to build, the collection point and access at your home.",
      },
    ],
  },

  "antique-and-fine-art-moving": {
    title: "Antique & Fine Art Movers London | Artwork Moving | Phi Movers",
    description:
      "Antique and fine art moving in London and to the UK — soft-wrapping, crating on request, condition photos and insurance checked against declared values.",
    h1: "Antique & Fine Art Moving in London",
    lead:
      "Antique furniture, paintings, mirrors, clocks and sculpture moved with time and care: every piece assessed, condition-photographed and wrapped individually, with bespoke crating on request. Send photos and details for a custom quote.",
    overviewH2: "Careful moves for antiques and artwork",
    sections: [
      {
        id: "what-we-move",
        label: "What we move",
        h2: "Antiques, artwork and fragile pieces we move",
        paras: [
          "We move single pieces, whole rooms of antiques and art as part of a house move, and items going into storage, across London and between London and the rest of the UK. Each piece is assessed first so we know how it’s made, where it’s weak and how it should be carried.",
        ],
        list: [
          "Antique furniture — veneered, inlaid, lacquered and gilded pieces",
          "Paintings, prints, drawings and framed artwork",
          "Large mirrors and glass-fronted cabinets",
          "Longcase, bracket and wall clocks",
          "Sculpture, ceramics, glass and other fragile objects",
        ],
      },
      {
        id: "wrapping-crating",
        label: "Wrapping & crating",
        h2: "Soft-wrapping and crating",
        paras: [
          "Wrapping is matched to the surface. Acid-free tissue goes against painted, gilded and delicate finishes; corners and frames are padded; furniture is blanketed and strapped so it can’t rub. Bubble wrap is never put directly against paintings or fragile finishes, as it can mark the surface.",
          "For the most fragile or valuable pieces — glazed artwork, large mirrors, sculpture — bespoke crating can be arranged on request. We’ll recommend it where we think it’s needed and explain why.",
        ],
      },
      {
        id: "condition",
        label: "Condition photos",
        h2: "Condition records and climate considerations",
        paras: [
          "Before anything is moved, the crew photographs each piece and notes existing marks, chips, loose veneer or previous repairs, and shares the record with you. At delivery the piece is unwrapped and checked against the record together.",
          "Antiques and art react to sudden changes in temperature and humidity: wood can move, veneers lift and paint become brittle. We plan timings so pieces don’t sit for long in a hot or cold van, keep them away from direct heat and let wrapped items acclimatise before unwrapping where needed. If items are going into storage, ask us about the storage conditions so you can decide whether they suit each piece.",
        ],
      },
      {
        id: "insurance",
        label: "Insurance",
        h2: "Insurance and valuations",
        paras: [
          "Every job includes goods-in-transit and public liability insurance. Tell us the value of each significant piece when you enquire, so we can check our cover suits it. A recent insurance valuation from a qualified valuer is the most reliable figure to use.",
          "For very valuable items or collections, speak to your home insurer or a specialist fine art insurer as well — many policies cover items in transit, and we’ll provide the details they need about the move.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you crate artwork?",
        a: "Bespoke crating can be arranged on request for the most fragile or valuable pieces, such as glazed artwork, large mirrors and sculpture. Most other pieces travel safely soft-wrapped.",
      },
      {
        q: "How do you move a longcase clock?",
        a: "The pendulum and weights normally need removing and the movement securing before the case is moved. We recommend a clock specialist prepares and sets it up; we wrap, carry and transport the case and parts.",
      },
      {
        q: "Are antiques covered by your insurance?",
        a: "Every job includes goods-in-transit and public liability insurance. Declare the value of significant pieces when you enquire so we can check the cover suits them, and check your own policy for very valuable items.",
      },
      {
        q: "Can you move antiques outside London?",
        a: "Yes. Our London-based crews move antiques and artwork between London and towns across the UK.",
      },
      {
        q: "How much does antique and fine art moving cost?",
        a: "It’s a custom quote based on the number of pieces, the wrapping or crating each needs, access and distance. Send photos and details for a clear price.",
      },
    ],
  },
};

/**
 * Suggested internal links for each page in this batch, kept separate in the
 * same way as `specialistLinks`.
 */
export const specialistLinks2: Record<string, { label: string; href: string }[]> = {
  "long-distance-removals": [
    { label: "Part load removals", href: "/services/part-load-removals" },
    { label: "House removals", href: "/services/house-removals" },
    { label: "UK removals by town", href: "/removals" },
  ],
  "part-load-removals": [
    { label: "Long distance removals", href: "/services/long-distance-removals" },
    { label: "UK removals by town", href: "/removals" },
    { label: "Moving crate hire", href: "/services/moving-crate-hire" },
  ],
  "office-furniture-removals": [
    { label: "Office removals", href: "/services/office-removals" },
    { label: "How much does an office move cost?", href: "/blog/how-much-does-an-office-move-cost" },
    { label: "Secure storage", href: "/services/secure-storage" },
  ],
  "marketplace-collection-and-delivery": [
    { label: "Single item delivery", href: "/services/single-item-delivery" },
    { label: "Sofa delivery", href: "/services/sofa-delivery" },
    { label: "Sofa & furniture hoisting", href: "/services/sofa-and-furniture-hoisting" },
  ],
  "ikea-collection-and-assembly": [
    { label: "Furniture assembly", href: "/services/furniture-assembly" },
    { label: "Furniture delivery", href: "/services/furniture-delivery" },
  ],
  "antique-and-fine-art-moving": [
    { label: "Piano & specialist moves", href: "/services/piano-and-specialist" },
    { label: "Fragile-only packing", href: "/services/fragile-only-packing" },
    { label: "Secure storage", href: "/services/secure-storage" },
  ],
};
