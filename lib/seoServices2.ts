import type { ServiceSeo } from "./seoTargets";

/**
 * Keyword-led SEO copy for a second batch of service pages. Same shape as
 * `serviceSeo` in ./seoTargets — merge the two maps where the page reads SEO.
 * Specialist pages (single item, sofa, furniture assembly, bed & mattress,
 * motorbike) carry the most depth because they earn the most clicks.
 */
export const moreServiceSeo: Record<string, ServiceSeo> = {
  /* ---------------- House & residential ---------------- */

  "flat-removals": {
    title: "Flat Removals London | Apartment Movers from £249 | Phi Movers",
    description:
      "Flat removals and apartment movers across London — walk-ups, lifts, concierge rules and permit streets planned in advance. Studio from £249, 1-bed from £329.",
    h1: "Flat Removals & Apartment Movers in London",
    lead:
      "Flat moving in London is mostly about access: stairs with no lift, a lift you have to book, a concierge with set move hours and a street where the van can’t stop. We plan all of that before the day and give you a fixed price — studios from £249, one-beds from £329 and two-beds from £499.",
    overviewH2: "Flat movers who plan around London buildings",
    sections: [
      {
        id: "building-rules",
        label: "Building rules",
        h2: "Moving flats in London: lifts, porters and move-in hours",
        paras: [
          "Many London apartment blocks and mansion blocks have house rules for removals — a lift that must be booked and padded, move hours that stop at 5pm or exclude weekends, a named loading entrance and sometimes a refundable damage deposit. Ask your managing agent or concierge for these as soon as you have a date, at both the old and the new address, and send them to us with your quote request.",
          "If there’s no lift, tell us the floor and send a photo of the stairwell, especially the half-landings. A third-floor walk-up with a tight turn needs a different crew plan from a ground-floor flat, and we’d rather price that honestly up front than discover it on the morning.",
        ],
        list: [
          "Lift booking and lift protection arranged with your building",
          "Walk-ups priced from floor count and stair photos",
          "Concierge and porter move hours respected",
          "Parking suspension advice for permit streets",
        ],
      },
      {
        id: "flat-sizes",
        label: "Flat sizes",
        h2: "Flat removal prices by size",
        paras: [
          "Most flat moves fit a single van and a two-person crew. As a guide, a studio flat move starts from £249, a one-bedroom flat from £329 and a two-bedroom flat from £499. Larger apartments, high floors without a lift and long carries from the parking spot add time, and that’s reflected in the fixed quote rather than charged on the day.",
          "If you’re only moving a few pieces between flats, hourly man and van from £50/hour (two-hour minimum) can work out cheaper. Tell us what’s going and we’ll recommend whichever option costs you less.",
        ],
      },
      {
        id: "prepare",
        label: "Preparing",
        h2: "How to prepare for an apartment move",
        paras: [
          "Measure anything large against the narrowest point of the route — usually the front door of the flat, the lift door or the stair turn. Pack everything except furniture into boxes so it can be stacked in the van, and keep a separate bag with keys, chargers, documents and the first night’s essentials.",
          "On the day, have the lift booked from the agreed start time and let neighbours know if the hallway will be busy for an hour. If you’re moving into a new-build, check whether the developer requires floor protection in communal areas.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you move me if my building only allows weekday moves?",
        a: "Yes. Tell us the permitted hours at each address and we’ll book a slot inside them. If the two buildings have different rules, we can collect one day and deliver the next, with the load kept on the van or in storage overnight.",
      },
      {
        q: "Do you need a parking suspension for a flat move?",
        a: "Not always. On a quiet street a short loading stop may be fine, but on busy permit streets a council parking suspension avoids fines and long carries. We’ll tell you which applies when we see your postcodes.",
      },
      {
        q: "Can you move a flat with storage in between?",
        a: "Yes. If your new tenancy starts later, we load your flat, keep it in secure storage from £15 a week and deliver when you have the keys.",
      },
    ],
  },

  "studio-moves": {
    title: "Studio Flat Removals London | Small Moves | Phi Movers",
    description:
      "Studio flat removals across London with a two-person crew and the right-sized van. Fixed studio moves from £199 or hourly man and van from £50/hour.",
    h1: "Studio Flat Removals in London",
    lead:
      "A studio move is small, but it still has to fit around key handover, stairs and parking. We send the right-sized van and two people, carry everything in one trip, and give you a fixed price from £199 — or hourly man and van from £50/hour if you only have a few pieces.",
    overviewH2: "Studio moves sized properly",
    sections: [
      {
        id: "van-sizes",
        label: "Van sizes",
        h2: "Removal van sizes for a studio flat",
        paras: [
          "Most furnished studios fit comfortably in a long-wheelbase panel van or a Luton box van. As a rough guide, a long-wheelbase panel van holds around 10–12 cubic metres and a Luton around 18–20 — enough for a double bed, a sofa, a wardrobe and 20–30 boxes with room to strap everything safely.",
          "If you’re leaving furniture behind in a furnished let, a smaller van may do. Send us a list or a couple of photos of the room and we’ll choose the van, so you don’t pay for space you won’t use or end up needing a second trip.",
        ],
        list: [
          "Unfurnished studio with bed, sofa and boxes: usually a Luton",
          "Furnished let with boxes and a few pieces: often a panel van",
          "Studio plus storage unit or second address: tell us both",
        ],
      },
      {
        id: "fixed-or-hourly",
        label: "Fixed or hourly",
        h2: "Fixed studio price or hourly man and van?",
        paras: [
          "A fixed studio move from £199 suits a full studio with furniture, because the price is agreed before the day and doesn’t change if the stairs take longer than expected. Hourly man and van from £50/hour with a two-hour minimum suits a light load you’ve already packed, where the job will be quick.",
          "We’ll tell you honestly which works out cheaper for your load. If you’re unsure, a quick video call around the room is enough for us to say.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does a studio move take?",
        a: "For a packed studio with straightforward access, loading usually takes around an hour, plus travel and unloading. Stairs without a lift, long carries from parking and unpacked items add time.",
      },
      {
        q: "Can you move a studio and a storage unit in one booking?",
        a: "Yes — tell us both pickup addresses and we’ll plan the route so everything arrives at the new flat in one go.",
      },
    ],
  },

  "house-clearance": {
    title: "House Clearance London | Probate & Flat Clearance | Phi Movers",
    description:
      "House, flat and probate clearance across London, including Croydon and East London. Items sorted for reuse, recycling or disposal. Clearances from £120.",
    h1: "House Clearance in London",
    lead:
      "House, flat, garage and probate clearances across London — from Croydon to East Ham. We sort what you’re keeping, take away the rest and leave the property empty and swept. Clearances start from £120, priced on volume and access before we start.",
    overviewH2: "House and flat clearance, handled carefully",
    sections: [
      {
        id: "probate",
        label: "Probate clearance",
        h2: "Probate and estate clearances",
        paras: [
          "Clearing a family member’s home is rarely just a removal job. We work at your pace: first agree what the family is keeping, what should be set aside for valuation or documents, and what can go. Kept items can be delivered to relatives’ addresses or into storage on the same visit, so the property is emptied in one go rather than over several weekends.",
          "If you’re an executor working from a distance, we can collect keys, clear to an agreed list and send photos when the property is empty. Anything unexpected — paperwork, photographs, jewellery — is set aside for you rather than thrown away.",
        ],
        list: [
          "Keep, donate and dispose items agreed before we start",
          "Kept items delivered to family or put into storage",
          "Paperwork and personal items set aside, not binned",
          "Property left empty and swept for agents or valuers",
        ],
      },
      {
        id: "flat-clearance",
        label: "Flat clearance",
        h2: "Flat, garage and furniture clearance",
        paras: [
          "Flat clearances in London often mean several flights of stairs and nowhere to put a skip. We carry everything down by hand straight into the van, so there’s no skip permit and nothing left on the pavement. We regularly clear flats and houses in Croydon, Sutton, Newham and across every other borough.",
          "Furniture clearance works the same way — a single sofa, a bedroom of furniture or a garage full of old units. Landlords can book a clearance between tenants and add an end of tenancy clean afterwards.",
        ],
      },
      {
        id: "disposal",
        label: "Disposal",
        h2: "What happens to cleared items — and what we can’t take",
        paras: [
          "Usable furniture and household goods are separated for reuse or donation where condition allows, metals and electricals go for recycling, and the rest goes to licensed waste facilities. Fridges, freezers and mattresses need specific handling, so they can carry a disposal charge — we’ll list it in the quote rather than add it later.",
          "Under UK waste rules, householders have a duty of care to use a registered waste carrier. Ask any clearance firm, including us, for their registration details before booking. Office furniture disposal works the same way: desks, chairs and storage units are cleared, with reusable pieces kept out of landfill where possible.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you clear a property and move the items we’re keeping?",
        a: "Yes. We can split one visit into a removal and a clearance — kept items go to your new address or storage, the rest is cleared — under one quote.",
      },
      {
        q: "How quickly can you do a house clearance?",
        a: "Small flat or room clearances can often be booked within a few days. Full houses with a lot of sorting may need a short survey first so we send enough crew and van space.",
      },
      {
        q: "Do you clear offices?",
        a: "Yes — office furniture disposal and clearance of desks, chairs, pedestals and storage, usually out of hours so the space is empty for a refit or handback.",
      },
    ],
  },

  /* ---------------- Sofa, furniture & single items ---------------- */

  "sofa-delivery": {
    title: "Sofa Delivery & Sofa Movers London | From £55 | Phi Movers",
    description:
      "Sofa delivery and sofa movers in London — collection, two-person carry, stairs and doorways measured first. Hoisting available. Dedicated sofa runs from £55.",
    h1: "Sofa Delivery & Sofa Movers in London",
    lead:
      "A sofa courier that measures first and carries it in. We collect from showrooms, warehouses, marketplace sellers or your old flat, carry the sofa up the stairs with two people and place it in the room. Dedicated sofa runs start from £55 — and if it won’t go up the stairs, we can hoist it.",
    overviewH2: "Sofa moving service across London",
    sections: [
      {
        id: "measure",
        label: "Measuring",
        h2: "Will your sofa fit? How to measure stairs and doorways",
        paras: [
          "Most failed sofa deliveries come down to one tight spot — a door frame, a stair turn or a low ceiling over a staircase. Before you buy, or before we collect, measure the sofa and the narrowest point of the route. It takes ten minutes and saves a wasted trip.",
          "Measure the sofa’s height, depth and width, plus its diagonal depth (from the top of the back to the front edge of the seat). A sofa usually goes through a doorway on its side or on its back, so the number that matters is whether the depth or height is smaller than the door’s clear width. Standard UK internal doors are around 76cm wide once open, and front doors are often a little wider — but older London properties vary, so measure rather than assume.",
          "On stairs, measure the stair width, the headroom above the stairs at the turn and the size of any half-landing. Sofas usually have to be stood on end to get round a turn, so the ceiling height over the landing matters as much as the width.",
        ],
        list: [
          "Sofa: height, depth, width and diagonal depth",
          "Every door on the route: clear width with the door fully open",
          "Stairs: width, headroom at the turn and landing size",
          "Lift: door width plus internal depth and height",
          "Send photos of the stairwell with your quote request",
        ],
      },
      {
        id: "hoisting",
        label: "Hoisting",
        h2: "When the stairs won’t work: hoisting over a balcony or through a window",
        paras: [
          "Some sofas simply won’t go up a London staircase, however carefully they’re handled — typically long three-seaters with fixed arms, corner units that don’t separate, or flats where the stair turn has very little headroom. In those cases the sofa can be lifted over a balcony or through a window that opens wide enough.",
          "Hoisting is available through our Sofa & Furniture Hoisting service, which has its own page. It needs a window or balcony opening larger than the sofa’s smallest cross-section, clear ground below and enough crew to control the lift. Send us photos of the sofa, the stairs and the window or balcony from inside and outside, and we’ll say honestly whether stairs, dismantling or hoisting is the right route.",
        ],
      },
      {
        id: "dismantling",
        label: "Dismantling",
        h2: "Taking a sofa apart to get it in",
        paras: [
          "Before anyone suggests hoisting, it’s worth checking whether the sofa comes apart. Many modern sofas have screw-in or plate-mounted feet, and corner and modular sofas usually split into sections joined by metal connectors. Some have bolt-on arms or backs that lift off brackets — removing those can take 10–15cm off the size that has to clear the door.",
          "Our crew removes legs, separates modules and takes off detachable backs and arms where the design allows, then refits everything in the room. If a sofa has a fixed frame with upholstery stapled over the joins, it isn’t designed to come apart and we won’t force it — that’s when hoisting or an alternative route comes in.",
        ],
      },
      {
        id: "marketplace-sofas",
        label: "Marketplace sofas",
        h2: "Sofa pickup and delivery from sellers and showrooms",
        paras: [
          "For Facebook Marketplace, Gumtree and eBay sofas, ask the seller for the sofa’s measurements and whether it splits before you agree to buy. Pay the seller directly and confirm a collection time when someone will be home, then send us both addresses, the seller’s phone number and the floor at each end.",
          "For showroom and warehouse collections, have your order number and collection reference ready, and check whether the store releases goods to a third party. Most do with a reference and your name, but some ask for an authorisation email.",
        ],
        list: [
          "Seller’s address, phone number and collection window",
          "Sofa dimensions and whether it comes apart",
          "Floor and access at both ends, with photos if possible",
          "Order or collection reference for shop pickups",
        ],
      },
      {
        id: "same-day-sofa",
        label: "Same-day sofa",
        h2: "Same-day sofa delivery and moving a sofa between homes",
        paras: [
          "Same-day sofa moves are often possible when a van and two crew are free nearby — mid-week mornings are the easiest to fit in. Call early with both postcodes and the sofa size and we’ll confirm a time and price straight away, or offer the earliest next slot if we can’t make today.",
          "Moving a sofa from one place to another doesn’t have to be part of a full removal. We regularly move a single sofa between flats, from a parent’s house or into storage, wrapped in blankets and strapped upright in the van so fabric and leather arrive unmarked.",
        ],
      },
    ],
    faqs: [
      {
        q: "What happens if the sofa won’t fit on the day?",
        a: "We’ll try every sensible option first — removing legs, separating sections and alternative routes through the property. If it still won’t go in safely, we stop rather than damage the sofa or your walls, and talk you through hoisting or returning it. Measuring beforehand avoids most of these situations.",
      },
      {
        q: "Do you move corner and L-shaped sofas?",
        a: "Yes. Most corner sofas separate into two or three sections, which makes them easier to carry than a long fixed three-seater. Tell us the make or send a photo of the joins and we’ll confirm.",
      },
      {
        q: "Can you take my old sofa away when you deliver the new one?",
        a: "Often yes, if we plan van space for it. Disposal of upholstered furniture can carry a charge, which we’ll include in the quote rather than add on the day.",
      },
    ],
  },

  "bed-and-mattress-delivery": {
    title: "Bed & Mattress Delivery London | Mattress Movers | Phi Movers",
    description:
      "Mattress movers and bed delivery in London — collected, wrapped, carried in and the frame built in your bedroom. Stairs and tight turns handled. From £50.",
    h1: "Bed & Mattress Delivery in London",
    lead:
      "Need to move a mattress from one place to another, or get a new bed home and built? We collect from the store, seller or your old flat, keep the mattress wrapped and clean, carry it up the stairs and assemble the frame in your bedroom. Bed and mattress deliveries start from £50.",
    overviewH2: "Mattress movers who carry it to the bedroom",
    sections: [
      {
        id: "mattress-sizes",
        label: "Mattress sizes",
        h2: "Mattress sizes and London stairs",
        paras: [
          "UK mattresses are larger than they look once you try to turn one on a staircase. A standard double is 135 × 190cm, a king is 150 × 200cm and a super king is 180 × 200cm. Pocket-sprung mattresses flex a little; foam and hybrid models flex more; heavy pocket-sprung kings with deep pillow tops barely flex at all.",
          "For most London stairs, a double or king can be carried upright round the turn. Super kings and very deep mattresses on narrow stairs are where it gets tight — send us a photo of the stairwell and the mattress depth, and we’ll tell you before the day whether it will go.",
        ],
        list: [
          "Single: 90 × 190cm",
          "Double: 135 × 190cm",
          "King: 150 × 200cm",
          "Super king: 180 × 200cm",
        ],
      },
      {
        id: "hygiene",
        label: "Protection",
        h2: "Keeping the mattress clean in transit",
        paras: [
          "A mattress is the one item you don’t want touching a van floor. New mattresses stay in their factory wrapping; used ones are covered in a mattress bag or wrapped before they leave the room, and carried rather than dragged. In the van they’re stood on edge and strapped so they don’t fold or pick up marks.",
          "If you’re moving your own mattress, take the bedding off the night before and let it air. Mattress bags are available with our packing materials if you’d like one ready before the crew arrives.",
        ],
      },
      {
        id: "bed-frames",
        label: "Bed frames",
        h2: "Bed frame dismantling and assembly",
        paras: [
          "Most bed frames have to come apart to leave a room, and many new ones arrive flat-packed. We dismantle wooden, metal and upholstered frames, bag and label the bolts for each bed, and rebuild them at the new address. Ottoman and storage beds with gas struts take longer and are handled with the lift mechanism secured.",
          "Divan bases on a king or super king are usually two halves joined by a clip — we separate them for the stairs and rejoin them in the room. Headboards bolted to the wall or to the base are removed and refitted.",
        ],
      },
      {
        id: "collections",
        label: "Collections",
        h2: "Store and marketplace bed collections",
        paras: [
          "We collect from bed shops, furniture stores and warehouses, and from private sellers on Facebook Marketplace, Gumtree and eBay. For second-hand beds, ask the seller whether the frame is already dismantled — if not, we can take it apart on collection, which adds time to the booking.",
          "For new mattresses, check the delivery note before we load it: confirm the size and firmness match your order, because once the wrapping is opened most retailers treat it as used.",
        ],
      },
      {
        id: "old-mattress",
        label: "Old mattress",
        h2: "Swapping a bed: removing the old one on the same visit",
        paras: [
          "If the new bed is replacing an old one, we can dismantle the old frame, carry out the old mattress and fit the new bed in a single visit. Old mattresses can’t go in household bins and usually carry a disposal charge, so tell us when you book and we’ll include it in the quote.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can one person move a mattress, or do I need two?",
        a: "Singles and light foam doubles can be carried by one person on easy access. Kings, super kings, pocket-sprung mattresses and anything going up stairs should be two people — it’s safer for the mattress, the walls and the crew.",
      },
      {
        q: "Will a super king mattress fit up my stairs?",
        a: "Often, but not always — it depends on stair width and the headroom at the turn. Send a photo of the stairwell and the mattress depth and we’ll tell you before booking.",
      },
      {
        q: "Can you deliver a bed and mattress from two different shops?",
        a: "Yes. Give us both collection addresses and references and we’ll plan the route so both arrive and the bed is built in one visit.",
      },
    ],
  },

  "appliance-delivery": {
    title: "Appliance Delivery & Moving Service London | Phi Movers",
    description:
      "Appliance moving service in London — fridges, American fridge freezers, washing machines and dryers carried in on trolleys and positioned. From £50.",
    h1: "Appliance Delivery & Moving in London",
    lead:
      "Fridges, freezers, washing machines and dryers are heavy, awkward and easy to damage if they’re carried the wrong way. Our appliance moving service uses two people, a stair-capable trolley and straps, and positions the appliance where you need it. Single appliance runs start from £50.",
    overviewH2: "White goods moved the right way",
    sections: [
      {
        id: "fridges",
        label: "Fridges",
        h2: "Moving fridges and American fridge freezers",
        paras: [
          "Fridges should travel upright wherever possible, because laying them flat can let compressor oil move into the cooling pipes. Once delivered, most manufacturers recommend leaving the fridge standing for a few hours before switching it on — check your manual, as some say longer if it was tilted in transit.",
          "American-style fridge freezers are typically around 90cm wide and close to 180cm tall, which is wider than a standard 76cm internal door. Many will only pass through once the doors are removed. Measure your doorways before you buy and tell us the model, so we know whether to plan door removal or a different route.",
        ],
        list: [
          "Empty, defrost and dry the fridge the day before",
          "Tape or remove loose shelves and drawers",
          "Measure door widths against the fridge’s width and depth",
          "Leave it standing before switching on at the new address",
        ],
      },
      {
        id: "washers",
        label: "Washers & dryers",
        h2: "Washing machines, dryers and dishwashers",
        paras: [
          "Washing machines must travel with their transit bolts fitted — the bolts lock the drum so it can’t swing and damage the suspension. If you still have them, fit them before we arrive (they go in the back of the machine where they were removed at installation). If they’re lost, replacement sets for most brands are inexpensive and easy to order by model number.",
          "Drain the machine and disconnect water and waste hoses before collection. We can disconnect and reconnect simple plug-in appliances when agreed, but plumbing, waste connections and anything gas-fired need a qualified plumber or Gas Safe engineer.",
        ],
      },
      {
        id: "store-collections",
        label: "Store pickups",
        h2: "Store and marketplace appliance collections",
        paras: [
          "We collect appliances from retailers, warehouses and private sellers, including Facebook Marketplace and eBay listings marked collection only. For second-hand machines, ask the seller to drain and disconnect it before we arrive — waiting for a washer to drain or a freezer to defrost on the day adds time to the booking.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you carry a fridge freezer up stairs?",
        a: "Yes — with two people and a stair trolley, upright and strapped. Very large American-style units on narrow stairs may need doors removed; we’ll check the model and the stair photos first.",
      },
      {
        q: "Do you take the old appliance away?",
        a: "Often yes, if we plan van space. Fridges and freezers contain refrigerants and must go to a proper recycling facility, so there may be a disposal charge — we’ll include it in the quote.",
      },
    ],
  },

  "single-item-delivery": {
    title: "Single Item Movers London | One Item Delivery £50 | Phi Movers",
    description:
      "Single item movers in London for eBay, Gumtree and Facebook Marketplace buys. Two-person delivery for heavy and bulky items, carried in and placed. From £50.",
    h1: "Single Item Movers & Delivery in London",
    lead:
      "Need to move one item of furniture? We collect single items across London — eBay and Marketplace buys, shop pickups and pieces moving between homes — carry them in and place them in the room. Fixed prices from £50, with two-person delivery for anything heavy or bulky.",
    overviewH2: "A moving service for one item",
    sections: [
      {
        id: "marketplace",
        label: "Marketplace buys",
        h2: "eBay, Gumtree and Facebook Marketplace collections",
        paras: [
          "Plenty of the best second-hand furniture is listed as collection only, and the seller won’t deliver. We act as your eBay pick-up service and Marketplace courier: you buy the item, we collect it from the seller and bring it to your door. It works for heavy and bulky items that parcel couriers won’t touch — sideboards, wardrobes, dining tables, gym kit, arcade cabinets and similar.",
          "Before booking, ask the seller for the item’s measurements and weight if they know it, whether it’s on the ground floor or upstairs, and whether it’s already dismantled. Pay the seller directly and agree a collection window when they’ll be home — we’ll call them when the crew is on the way.",
        ],
        list: [
          "Seller’s address, phone number and a collection window",
          "Item measurements and photos from the listing",
          "Floor and access at both ends (lift, stairs, parking)",
          "Listing or order number if the seller asks for one",
        ],
      },
      {
        id: "two-person",
        label: "Two-person delivery",
        h2: "Two-man delivery for heavy and bulky items",
        paras: [
          "Lots of delivery companies send one driver and leave the item at the kerb. For anything one person can’t carry safely — a sofa, a wardrobe, a solid oak table, a treadmill — we send two people, carry it up the stairs and put it where you want it. That’s the standard for heavy items, not an upgrade you have to ask for.",
          "Lighter items, such as a desk chair, a bedside table or a boxed TV, can often go with one person and cost less. Tell us what the item is and we’ll quote for the crew it actually needs.",
        ],
      },
      {
        id: "pricing",
        label: "How it’s priced",
        h2: "How single item delivery is charged",
        paras: [
          "Single item moves are a fixed job price rather than an hourly bill. The price starts from £50 and depends on four things: the size and weight of the item, how many people it needs, the stairs and carry distance at each end, and the distance between the addresses. You’ll know the full price before the van leaves.",
          "If the job grows — a desk becomes a desk, a chair and six boxes — hourly man and van from £50/hour (two-hour minimum) is usually better value, with an extra helper at £20/hour if needed. We’ll tell you which works out cheaper.",
        ],
      },
      {
        id: "what-we-move",
        label: "What we move",
        h2: "Single items we move every week",
        paras: [
          "Most single item jobs are furniture, but anything that fits in a van and can be carried safely is fair game. Fragile pieces get extra wrapping; very heavy items such as pianos, safes or cast-iron baths are better suited to our specialist services, where crew size and kit are planned for the weight.",
        ],
        list: [
          "Sofas, armchairs and footstools",
          "Wardrobes, chests of drawers and sideboards",
          "Dining tables, desks and bookcases",
          "Beds, mattresses and headboards",
          "Fridges, washing machines and other appliances",
          "Treadmills, bikes, exercise benches and gym kit",
          "TVs, mirrors, artwork and glass-top tables",
        ],
      },
      {
        id: "store-pickups",
        label: "Store pickups",
        h2: "Shop, warehouse and auction collections",
        paras: [
          "Bought something in store that won’t fit in a car? We collect from furniture shops, retail parks, click-and-collect points and auction houses. Bring or send the order number, the name on the order and the collection reference — most stores release goods to a third party with those details, though some auction houses ask for written authorisation in advance.",
          "We also move single items between homes: a piece of furniture from a parent’s house, an item out of storage or a desk from the office to a home office.",
        ],
      },
    ],
    faqs: [
      {
        q: "What if the seller isn’t there when you arrive?",
        a: "We’ll call the seller and you. If nobody can release the item, we may have to charge for the wasted journey, so please confirm the time with the seller before booking and share their number with us.",
      },
      {
        q: "Can you check the item before loading it?",
        a: "We’ll take a quick look for obvious damage and send you a photo if something doesn’t match the listing, so you can decide before it’s loaded. We can’t test electrical items or judge whether a price is fair — that’s between you and the seller.",
      },
      {
        q: "Can you collect a single item outside London?",
        a: "Our crews are London-based. For collections just outside London, send both postcodes and we’ll tell you whether we can help and what it costs.",
      },
    ],
  },

  "furniture-assembly": {
    title: "Furniture Assembly & Dismantling London | IKEA | Phi Movers",
    description:
      "Furniture dismantling and assembly in London — wardrobes, beds, sofas and IKEA flat-pack taken apart, moved and rebuilt properly. Assembly from £60.",
    h1: "Furniture Assembly & Dismantling in London",
    lead:
      "Wardrobes that won’t fit through the door, sofas that need splitting, and boxes of IKEA flat-pack waiting to be built. Our furniture dismantling and assembly service takes furniture apart for the move, keeps every fixing together and rebuilds it solid at the other end. From £60.",
    overviewH2: "Furniture dismantle and reassemble, done properly",
    sections: [
      {
        id: "wardrobes",
        label: "Wardrobes",
        h2: "Wardrobe dismantling service",
        paras: [
          "Large wardrobes are the item most likely to need taking apart. Tall flat-pack wardrobes such as IKEA PAX frames are around 2.3m high and were built inside the room — they won’t tip upright under a standard ceiling once they’re out, and they don’t fit down most London stairs assembled. Doors, rails, shelves and drawers come out first, then the carcass comes apart panel by panel.",
          "Solid wood wardrobes are often designed to split: a cornice that lifts off, a plinth that unbolts and a top section that separates from the base. We take them apart along those joints rather than forcing anything.",
          "Hinges, runners and fittings are bagged and labelled per unit, doors are wrapped separately and the panels are stacked flat in the van. At the new address we rebuild, re-hang and adjust the doors so they close level.",
        ],
        list: [
          "Doors, drawers and hanging rails removed and wrapped",
          "Fittings bagged and labelled for each wardrobe",
          "Panels travel flat, protected with blankets",
          "Doors re-hung and adjusted on reassembly",
        ],
      },
      {
        id: "sofa-dismantling",
        label: "Sofa dismantling",
        h2: "Sofa dismantling and reassembly",
        paras: [
          "If a sofa won’t clear a doorway or stair turn, taking it apart is usually the next step. Most modern sofas have screw-in or plate-mounted legs, corner and modular sofas separate into sections joined by metal connectors, and many have backs or arms that lift off brackets or unbolt from inside the frame. Removing them can take 10–15cm off the size that has to get through the door.",
          "We look under the sofa for connector plates and bolts, check the zips on the back cushions for access to fixings, and take apart only what the manufacturer designed to come apart. If a sofa has a fixed frame with fabric stapled across the joins, dismantling it would mean upholstery work — we’ll tell you, and talk through hoisting or another route instead.",
        ],
      },
      {
        id: "ikea",
        label: "IKEA & flat-pack",
        h2: "IKEA pickup and assembly",
        paras: [
          "We collect flat-pack orders from IKEA stores and click-and-collect points around London — such as Wembley, Croydon, Greenwich and Tottenham — and from other flat-pack retailers, then deliver and build them in one visit. We aren’t affiliated with IKEA; you place the order and we handle the collection and assembly.",
          "Flat-pack assembly includes unboxing, building to the manufacturer’s instructions, fitting doors and drawers, and taking away the packaging where disposal is practical. Tall units like bookcases and wardrobes come with wall-fixing kits to stop them tipping; tell us if you’d like those fitted, and whether the wall is plasterboard, brick or concrete so we bring the right fixings.",
        ],
        list: [
          "Wardrobes, chests of drawers and bookcases",
          "Bed frames, bunk beds and storage beds",
          "Desks, shelving units and TV stands",
          "Kitchen islands, dining tables and chairs",
        ],
      },
      {
        id: "moving-flat-pack",
        label: "Moving flat-pack",
        h2: "Moving flat-pack furniture without wrecking it",
        paras: [
          "Chipboard flat-pack is designed to be assembled once. Every time cam locks and dowels are pulled out and refitted, the holes wear a little. Small units can often travel built-up, wrapped and strapped; large ones should be dismantled. We’ll judge each piece on the day and tell you if something is already loose or swollen and unlikely to survive another rebuild.",
          "If you still have the instructions, keep them with the furniture — most IKEA manuals can also be found online by product name. It helps to have the screws for each piece kept separately rather than in one shared tin.",
        ],
      },
      {
        id: "with-a-move",
        label: "With a move",
        h2: "Furniture moving and assembly in one booking",
        paras: [
          "Most assembly work is booked alongside a removal: we dismantle on the morning of the move, load the panels and fixings together, and rebuild at the new address before we leave. It’s quicker than booking a separate handyman because the same crew that took it apart puts it back together.",
          "You can also book assembly on its own — for flat-pack you’ve had delivered, for furniture moving between rooms, or for a landlord furnishing a property before new tenants move in. Price depends on the number of pieces and how complex they are; send a list or photos for a fixed quote.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does it take to dismantle and rebuild a wardrobe?",
        a: "A simple two-door flat-pack wardrobe is usually quick to take down and rebuild. Large sliding-door or corner wardrobes take considerably longer at each end. Tell us the type and size and we’ll build the time into your quote.",
      },
      {
        q: "Can you assemble furniture that I’ve started myself?",
        a: "Yes, but if a step has been done wrongly we may need to take it back apart first. Let us know what stage it’s at so we allow the time.",
      },
      {
        q: "Do you fit furniture to the wall?",
        a: "We can fit the anti-tip kits supplied with tall furniture when you ask us to and the wall is suitable. We don’t do structural fixings such as wall-hung units on plasterboard without suitable fixings, and we’ll ask before drilling.",
      },
      {
        q: "Will you dismantle a sofa you’ve bought second-hand?",
        a: "Yes — on collection, if the design allows. Ask the seller to send a photo of the underside and the back so we can see how it’s put together.",
      },
    ],
  },

  /* ---------------- Business & office ---------------- */

  "it-and-server-relocation": {
    title: "IT Relocation London | Server & Computer Moves | Phi Movers",
    description:
      "IT relocation services in London — office computers, servers and network kit packed, labelled and moved out of hours with your IT team. From £450.",
    h1: "IT & Server Relocation in London",
    lead:
      "Office IT relocation planned with your IT team: every computer, screen and server labelled to its new desk or rack, packed in protective crates and moved out of hours so your users log on to a working office. IT relocations start from £450.",
    overviewH2: "Computer relocation services for London offices",
    sections: [
      {
        id: "desk-it",
        label: "Desk IT",
        h2: "Office IT relocation: desks, screens and docking stations",
        paras: [
          "Most of an office IT move is desktops, monitors, docks and phones. Before the day, we agree a desk numbering plan with you — usually a floor plan of the new office with each desk numbered. Every item is labelled with its new desk number, so the computer, screens, dock, keyboard and cables for one person travel together and land at the right desk.",
          "Screens are wrapped individually and travel upright, tower PCs are packed in protective crates or wrapped and strapped, and cables are bagged per desk. At the new office we place each set on its desk ready for your IT team or provider to connect and test.",
        ],
        list: [
          "Desk numbering plan agreed before the move",
          "Every item labelled with its new desk number",
          "Screens wrapped and carried upright",
          "Cables and peripherals bagged per desk",
        ],
      },
      {
        id: "servers",
        label: "Servers",
        h2: "Server relocation: sequence, packing and downtime",
        paras: [
          "Server relocation starts with your IT team: take and verify backups, document the cabling, power down in the agreed order and remove servers from the rack. Most racks aren’t designed to be moved loaded — the weight in a moving rack can damage rails and drives — so servers usually travel separately, wrapped and padded, with the empty rack moved and rebuilt.",
          "We schedule the physical move inside your maintenance window — often a Friday evening or weekend — and keep each server with our crew from rack to rack. Your IT team or provider then re-racks, recables and powers up at the other end, or we position the kit and they take over.",
        ],
      },
      {
        id: "inventory",
        label: "Asset tracking",
        h2: "A secure IT move with an asset list",
        paras: [
          "For a secure IT move, send us your asset list or let us build one from serial numbers on the day. Kit is checked out of the old office and checked into the new one against the same list, so you can see that everything arrived. Equipment stays with our crew from loading to unloading and isn’t left unattended in a vehicle.",
          "Retiring old kit at the same time? Tell us what’s being disposed of. Equipment containing data should be wiped or destroyed by a certified IT disposal provider before it leaves your control — we can move it to them, but we don’t handle data destruction ourselves.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you do IT relocations outside London?",
        a: "Our crews work from London. For office IT relocation elsewhere in the UK, send both addresses and the size of the move and we’ll tell you whether we can help.",
      },
      {
        q: "What does our IT team need to do before the move?",
        a: "Back up and verify data, label or document the cabling, and plan the power-down order and who reconnects what. We handle labelling, packing and transport around that plan.",
      },
      {
        q: "Can you move IT for just a few desks?",
        a: "Yes. Small office IT moves are common — a handful of desks to a new floor or building, often as part of a wider office removal.",
      },
    ],
  },

  "retail-shop-move": {
    title: "Shop Removals London | Retail Relocation | Phi Movers",
    description:
      "Shop removals and retail relocations across London — stock, fixtures and tills moved overnight or out of hours so you keep trading. Quote after a walkthrough.",
    h1: "Shop & Retail Removals in London",
    lead:
      "Shop removals planned around your trading hours. We move stock, fixtures, display units and tills after you close and set them out in the new unit to your plan, so you can open again with as little lost trading as possible. Every retail move is quoted after a short walkthrough or video survey.",
    overviewH2: "Retail relocation without losing trading days",
    sections: [
      {
        id: "sequence",
        label: "Move order",
        h2: "How a shop move is sequenced",
        paras: [
          "A good shop move runs in reverse order of what you need to trade. Back-of-house stock and spare fixtures can go days ahead. Front-of-house displays and shelving move after the last day of trading. Tills, card machines and the stock you need on the shop floor move last and are set up first in the new unit.",
          "Before the move, agree a layout plan for the new unit and label every fixture and stock crate with its zone. That way the crew puts each item in its final position instead of stacking everything in the middle of the floor.",
        ],
        list: [
          "Back-of-house stock and spares moved in advance",
          "Fixtures and displays moved after close",
          "Tills and essential stock moved last, set up first",
          "Every crate and fixture labelled with its new zone",
        ],
      },
      {
        id: "high-street",
        label: "High-street access",
        h2: "Loading on London high streets",
        paras: [
          "High-street units bring their own access problems: red routes where loading is only allowed in marked bays at set times, shared service yards, pedestrianised streets and shopping centres with booked loading docks and goods lifts. We check the loading rules at both units before the day and plan the timing around them.",
          "If you’re in a shopping centre, ask centre management for their contractor requirements early — many need insurance documents and a method statement before they’ll book the loading dock.",
        ],
      },
      {
        id: "stock-control",
        label: "Stock",
        h2: "Protecting stock and displays",
        paras: [
          "Stock is packed by category into labelled crates or boxes so it can be counted out and back in. Glass shelves, mirrors and display cases are wrapped individually, mannequins travel upright and padded, and garment rails move with the clothes still on them where practical.",
          "Shopfitting and electrical work in the new unit stays with your shopfitter or electrician — we coordinate timings so fixtures arrive when the space is ready for them.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you move a shop in one night?",
        a: "Many small and medium shops, yes — especially if back-of-house stock goes ahead. Larger units or moves with significant fixture work may need two nights or a Sunday. We’ll give you a realistic plan after the walkthrough.",
      },
      {
        q: "Do you move cafés and salons?",
        a: "Yes — furniture, chairs, stations and stock. Plumbed or gas equipment, such as coffee machines or salon basins, needs disconnecting and reconnecting by a qualified engineer before and after.",
      },
    ],
  },

  "warehouse-removals": {
    title: "Warehouse Removals London | Warehouse Movers | Phi Movers",
    description:
      "Warehouse movers in London for stock, racking and packing stations — staged loading, evening or weekend cutovers and a written quote after survey.",
    h1: "Warehouse Removals in London",
    lead:
      "Warehouse movers for small and medium London units: stock, shelving, racking and packing stations moved in a planned order so you can keep picking orders. Every warehouse removal is quoted after a survey of volume, access and loading facilities at both sites.",
    overviewH2: "Warehouse moves planned around your orders",
    sections: [
      {
        id: "staging",
        label: "Staged moves",
        h2: "Moving a warehouse while it keeps working",
        paras: [
          "Most businesses can’t stop dispatching for a week. We usually stage a warehouse move by zone: slow-moving stock and spare racking go first, the new site is set up and labelled, then fast-moving lines and packing stations move over a weekend so you can start picking from the new unit on Monday.",
          "Bin locations and stock labels are agreed in advance, so every crate goes straight to its new bay. That makes the stock count afterwards a check rather than a hunt.",
        ],
        list: [
          "Slow-moving stock and spare racking moved ahead",
          "Fast-moving lines and packing stations at cutover",
          "Crates labelled with their new bay or bin location",
          "Evening and weekend cutovers available",
        ],
      },
      {
        id: "pallets",
        label: "Pallets & vans",
        h2: "Pallets, loading bays and van capacity",
        paras: [
          "Tell us how your stock is stored. Palletised stock needs a forklift or pallet truck and a loading dock or level access at both ends to move as whole pallets; without that, pallets are broken down and hand-loaded, which takes longer and is priced accordingly. Loose and shelved stock is crated and loaded by hand.",
          "A Luton box van carries roughly a tonne, so heavy stock such as paper, tiles or metal parts fills the weight limit long before the space. We plan the number of loads from weight as well as volume, which is why a survey matters for warehouse jobs.",
        ],
      },
      {
        id: "racking",
        label: "Racking",
        h2: "Racking and shelving",
        paras: [
          "Bolt-together shelving and light racking can be dismantled, moved and rebuilt by our crew. Pallet racking systems should be reinstalled or inspected by a qualified racking installer, because beam heights, load ratings and floor fixings all need checking — we can move the components and work alongside your installer.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you move heavy machinery?",
        a: "Workshop and warehouse machinery is covered by our Heavy & Machinery Moving service, which plans crew and kit around the weight. Light equipment like packing benches and label printers moves with the warehouse removal.",
      },
      {
        q: "How far ahead should we book a warehouse move?",
        a: "As early as you can — a few weeks lets us survey both sites, plan the stages and book weekend crews. Smaller stock moves can sometimes be arranged within days.",
      },
    ],
  },

  /* ---------------- Packing & storage ---------------- */

  "fragile-only-packing": {
    title: "Fragile Packing Service London | Glass & Art | Phi Movers",
    description:
      "Fragile-only packing in London — glassware, crockery, mirrors and art packed by professional packers before your move or courier run. From £80.",
    h1: "Fragile-Only Packing Service in London",
    lead:
      "Pack the books and clothes yourself; let us pack the glass, crockery, mirrors and artwork. Our packers wrap and box your breakables properly, label every carton and can move them with the rest of your home. Fragile-only packing starts from £80.",
    overviewH2: "Professional packing for breakables only",
    sections: [
      {
        id: "how-we-pack",
        label: "How we pack",
        h2: "How professional packers pack fragile items",
        paras: [
          "Plates travel on their edges, not stacked flat, with paper between each one — that’s far stronger than a pile. Glasses are filled and wrapped with paper, inside and out, and stood upright with dividers or padding. Bowls nest with paper between them, and the gaps in every box are filled so nothing can shift when it’s carried.",
          "Mirrors and framed pictures go in picture or mirror cartons with corner protection; large mirrors and glass table tops are wrapped in blankets and travel on edge. Every box is marked fragile, with an arrow for which way is up and the room it’s going to.",
        ],
        list: [
          "Plates packed on edge with paper between each",
          "Glasses wrapped inside and out, travelling upright",
          "Mirrors and artwork in cartons with corner protection",
          "Every box labelled fragile, this way up and destination room",
        ],
      },
      {
        id: "movers-packers",
        label: "Movers & packers",
        h2: "Movers and packers in one booking",
        paras: [
          "Booking the same company to pack and move your fragile items means the people who packed a box are the ones who load it — they know which cartons need to go on top and which can’t be stacked. Packing usually happens the day before or the morning of the move, so boxes aren’t sitting in the hallway for a week.",
          "If you want everything packed rather than just breakables, our full packing service from £150 covers the whole home.",
        ],
      },
      {
        id: "fragile-courier",
        label: "Fragile courier",
        h2: "A fragile goods courier for single pieces",
        paras: [
          "Sometimes it’s only one fragile item that needs to move — a mirror, a framed artwork, a glass cabinet or a box of family china. We can pack it on collection and deliver it across London as a single item job, wrapped, carried by hand and strapped upright in the van, rather than going through a parcel network.",
        ],
      },
    ],
    faqs: [
      {
        q: "Should I pack anything fragile myself?",
        a: "Pack whatever you’re confident with — many people do everyday mugs and plastic items. Leave glassware, good china, mirrors and artwork to us, and tell us roughly how much there is so we bring enough materials.",
      },
      {
        q: "Can you pack fragile items for storage?",
        a: "Yes. Items going into storage are packed the same way, with boxes labelled so you can find what you need without opening everything.",
      },
    ],
  },

  "packing-materials": {
    title: "Moving Boxes & Packing Materials London | Phi Movers",
    description:
      "Moving boxes, tape, paper and bubble wrap delivered across London. Packing kits from £50, with reusable crate hire available instead of cardboard.",
    h1: "Moving Boxes & Packing Materials in London",
    lead:
      "Removal-grade boxes, tape, paper and bubble wrap delivered to your door, so you can pack properly without collecting supermarket cartons. Packing material kits start from £50 — or hire reusable plastic crates instead if you’d rather not buy cardboard.",
    overviewH2: "Packing materials that survive a move",
    sections: [
      {
        id: "kit",
        label: "What’s in a kit",
        h2: "What to order: boxes, wrap and the extras people forget",
        paras: [
          "A packing kit is built around three box sizes. Small boxes are for books, files and anything heavy, so no box gets too heavy to lift. Medium boxes take kitchen items, toys and general household goods. Large boxes are for light, bulky things like bedding, cushions and towels. Wardrobe boxes let hanging clothes travel on the hanger.",
          "Then you need tape, a tape dispenser, packing paper for crockery and glass, bubble wrap for electronics and pictures, and a marker for labelling. Mattress bags and sofa covers are worth adding if you’re moving furniture without a full crew.",
        ],
        list: [
          "Small boxes for books and heavy items",
          "Medium boxes for kitchen and general items",
          "Large boxes for bedding and light, bulky things",
          "Wardrobe boxes, tape, paper, bubble wrap and markers",
          "Optional mattress bags and sofa covers",
        ],
      },
      {
        id: "buy-or-hire",
        label: "Buy or hire",
        h2: "Buy cardboard boxes or hire reusable crates?",
        paras: [
          "If you’d rather rent moving boxes than buy them, our Moving Crate Hire service delivers reusable plastic crates and collects them after the move. Crates stack well, don’t need tape and suit office moves and short flat moves where you unpack quickly.",
          "Cardboard is better when items will sit in storage, when you need odd sizes like wardrobe or picture boxes, or when you’ll unpack slowly over several weeks. Many people mix both: crates for the kitchen and books, cardboard for storage and wardrobes.",
        ],
      },
      {
        id: "packing-tips",
        label: "Packing tips",
        h2: "Packing tips that save time on moving day",
        paras: [
          "Pack heavy items in small boxes and light items in large ones, fill gaps so the contents can’t shift, and tape the bottom of each box with two strips across the seam. Write the room and a short description on the side of the box, not just the top — once boxes are stacked, the tops can’t be seen.",
          "Start with rooms you use least, such as spare rooms and lofts, and leave the kitchen and bathroom until last. Keep one box open for the first night: kettle, mugs, chargers, toilet roll, bedding and any medication.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can packing materials be delivered with my move?",
        a: "Yes, but it’s better to have them a week or two beforehand. If you book a removal with us, we can drop materials off ahead of the day.",
      },
      {
        q: "Can I order just tape and bubble wrap?",
        a: "Yes. Tell us what you need and we’ll put together a smaller bundle for your top-up.",
      },
    ],
  },

  /* ---------------- Specialist & vehicle ---------------- */

  "motorbike-transport": {
    title: "Motorcycle Transport London | Motorbike Movers | Phi Movers",
    description:
      "Motorcycle transport across London — bikes and scooters moved inside an enclosed van, strapped and chocked. Non-runners considered. From £80.",
    h1: "Motorcycle Transport in London",
    lead:
      "Motorbike transport across London by people who load and strap bikes properly. Scooters, commuters, sports bikes and tourers travel inside an enclosed van, held upright and away from the weather, with collection and delivery windows agreed in advance. Motorcycle transport starts from £80.",
    overviewH2: "Motorcycle movers for London",
    sections: [
      {
        id: "loading",
        label: "Loading & securing",
        h2: "How we load and secure a motorcycle",
        paras: [
          "Bikes are loaded by ramp, with one person steering and another controlling the bike from the side — never ridden into the van. Inside, the front wheel goes into a wheel chock or against a padded bulkhead, and the bike is held upright with ratchet straps on both sides.",
          "Straps go on solid points — fork lowers, triple clamps or frame — using soft ties so the ratchet hooks never touch paint, bars or levers. The suspension is compressed slightly so the bike can’t bounce loose, and the rear is strapped to stop any sideways movement. Mirrors are folded and loose items are removed before the doors are closed.",
        ],
        list: [
          "Ramp loading with two people controlling the bike",
          "Front wheel chocked or braced against the bulkhead",
          "Soft ties on solid points, ratchet straps both sides",
          "Rear strapped to stop sideways movement",
        ],
      },
      {
        id: "enclosed",
        label: "Enclosed transport",
        h2: "Enclosed motorcycle transport — not an open trailer",
        paras: [
          "Every bike travels inside an enclosed van rather than on an open trailer, so it’s out of the rain, road grime and sight of passers-by for the whole journey. For a London run that’s often the difference between a bike that needs a wash and a bike that’s ready to ride.",
          "It also suits bikes that are being sold, delivered to a buyer or moved to a garage for work, where you want the condition on arrival to match the condition at collection. We photograph the bike before loading so there’s a record for both sides.",
        ],
      },
      {
        id: "uses",
        label: "When to use it",
        h2: "Motorcycle collection and delivery: common jobs",
        paras: [
          "Most of our motorbike moves are one of a handful of jobs: collecting a bike bought from a private seller or dealer, taking a bike to or from a garage for MOT or repair, moving it as part of a house move, or getting a bike to storage over winter. We cover every London borough, from Bexley and Bromley to Hillingdon and Enfield.",
          "If the bike is moving with a house removal, it can travel on the same van as the rest of your belongings when there’s space to secure it properly, or on a separate run if not.",
        ],
        list: [
          "Private sale and dealer collections",
          "Garage, MOT and repair runs",
          "Bikes moving with a house or flat removal",
          "Seasonal storage drop-offs and pickups",
        ],
      },
      {
        id: "non-runners",
        label: "Non-runners",
        h2: "Non-running and damaged motorcycles",
        paras: [
          "A bike doesn’t have to run to be moved, but it does need to roll. Tell us if the brakes are seized, the tyres are flat, the steering is locked without a key, or the bike has accident damage. Each of those changes the loading method and how many people we need.",
          "Heavy tourers and adventure bikes, and bikes with missing or bent wheels, may need extra hands or specialist kit. Send photos and the model when you ask for a quote and we’ll tell you honestly whether we can move it — and if we can’t, our Vehicle Transport service may be able to.",
        ],
      },
      {
        id: "prepare-bike",
        label: "Preparing the bike",
        h2: "How to prepare your bike for transport",
        paras: [
          "A little preparation makes collection quicker and safer. Have the key ready (the steering lock must be off), the alarm and immobiliser disarmed, and the fuel tank low rather than full. Remove anything that could come loose — tank bags, top boxes that aren’t locked on, phone mounts and covers.",
          "Take your own photos of the bike before collection as well as ours, and tell us about existing scratches or damage. If someone else is handing the bike over — a seller or a garage — give us their name and number and let them know when the van is coming.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you move more than one motorbike at once?",
        a: "Often yes, depending on the size of the bikes and the van. Tell us how many and what models, and we’ll confirm whether they can travel together safely.",
      },
      {
        q: "Do I need to be there for collection and delivery?",
        a: "Someone needs to hand over the key and the bike at collection and receive it at delivery. It doesn’t have to be you — a seller, garage or friend is fine if you give us their details.",
      },
      {
        q: "Do you transport motorcycles outside London?",
        a: "Our crews are based in London. For longer UK runs from London, send both postcodes and we’ll tell you whether we can help and what it costs.",
      },
    ],
  },

  /* ---------------- Timing, clean & international ---------------- */

  "same-day-move": {
    title: "Same Day Removals London | Same Day Man & Van | Phi Movers",
    description:
      "Same day removals and same day man and van across London when a crew is free. Fast quote, fixed price before we dispatch. Same-day jobs from £70.",
    h1: "Same Day Removals in London",
    lead:
      "Need a van today? When a crew is free nearby, we can collect and move the same day — a sofa, a room of boxes or a small flat. Call with both postcodes and what’s moving, and we’ll confirm a time and fixed price straight away. Same-day jobs start from £70.",
    overviewH2: "Same-day moves when the plan changes",
    sections: [
      {
        id: "faster",
        label: "Getting a slot",
        h2: "How to get a same-day slot quickly",
        paras: [
          "Same-day work comes down to matching your job to a crew that’s already nearby with time free. The more we know when you first call, the quicker we can say yes. Mornings give us the most flexibility; late Friday afternoons are the hardest to fit.",
          "Have these ready: both postcodes, the floor and lift situation at each end, a list or photos of what’s moving, and whether parking is easy. If everything is packed and ready to go, say so — it makes a short slot far more likely to work.",
        ],
        list: [
          "Both postcodes and access at each end",
          "A list or photos of what’s moving",
          "Whether everything is packed and ready",
          "Parking situation at both addresses",
        ],
      },
      {
        id: "same-day-items",
        label: "Same-day items",
        h2: "Same-day sofa and single item delivery",
        paras: [
          "Many same-day jobs aren’t full moves at all: a sofa from a seller who wants it gone today, a fridge to replace one that’s broken, or a desk needed in a home office tomorrow. Single items are often the easiest to fit around existing bookings, anywhere from Ilford to Ealing.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you do a full house move the same day?",
        a: "Occasionally, for smaller homes when a full crew happens to be free. Larger moves usually need at least a day’s notice so we can send enough people and the right van.",
      },
      {
        q: "Do you need payment upfront for same-day jobs?",
        a: "A small deposit confirms the booking as with any job, and the balance is paid on completion.",
      },
    ],
  },

  "last-minute-removals": {
    title: "Emergency Removals London | Last Minute Movers | Phi Movers",
    description:
      "Emergency and last minute removals across London when dates change suddenly — fixed price before dispatch, storage if you have nowhere to go. From £65.",
    h1: "Emergency & Last Minute Removals in London",
    lead:
      "Completion brought forward, a tenancy ending early, a leak that’s made your flat unliveable — when you need to move urgently, we find the soonest crew that can do it properly and confirm a fixed price before we set off. Last-minute removals start from £65.",
    overviewH2: "Urgent removals without cutting corners",
    sections: [
      {
        id: "emergency-storage",
        label: "Emergency storage",
        h2: "Emergency removals and storage",
        paras: [
          "In a lot of urgent moves, the problem isn’t only getting out — it’s that there’s nowhere to go yet. We can load your home and take everything straight into secure storage from £15 a week, then deliver when you have the keys to your next place. You only need to sort out a bag for yourself; the rest stays together and protected.",
          "This is common after flooding or a leak, when a relationship ends, when a landlord’s works mean you have to leave, or when a completion date slips but your old property has to be empty.",
        ],
      },
      {
        id: "urgent-checklist",
        label: "Urgent checklist",
        h2: "What to do first when you have to move urgently",
        paras: [
          "Call us with both postcodes, or the one address and “storage” if you don’t have the second yet, and a rough idea of how much there is. A video call round the property is the fastest way for us to price it accurately.",
          "Then pack what you can, starting with documents, medication, valuables and anything you’ll need in the next week. If you can’t pack everything in time, tell us — our packers and materials can be added to the same booking.",
        ],
        list: [
          "Call with addresses (or storage) and rough volume",
          "Show us round on a video call for a fast price",
          "Pack documents, medication and valuables first",
          "Add packing if there isn’t time to do it yourself",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you help if I’ve been told to leave a property at short notice?",
        a: "We can help with the move itself and with storage while you find somewhere. For questions about whether the notice is valid, contact Shelter or Citizens Advice — we can’t advise on tenancy law.",
      },
      {
        q: "Do you do emergency removals at night?",
        a: "Evening slots are often possible. Overnight work is arranged case by case, and some buildings don’t allow late moves, so tell us the situation when you call.",
      },
    ],
  },

  "evening-and-weekend-moves": {
    title: "Evening & Weekend Removals London | Phi Movers",
    description:
      "Evening and weekend removals across London — Saturday and Sunday moves, after-work slots and out-of-hours office cutovers. Man and van from £60/hour.",
    h1: "Evening & Weekend Removals in London",
    lead:
      "Moves that fit around work rather than the other way round. We run after-work slots, Saturday and Sunday removals and out-of-hours office and shop cutovers across London, with the same crew, insurance and fixed pricing as a weekday move. Out-of-hours man and van starts from £60/hour.",
    overviewH2: "Out-of-hours moves across London",
    sections: [
      {
        id: "weekend",
        label: "Weekend moves",
        h2: "Saturday and Sunday removals",
        paras: [
          "Saturdays are the most requested moving day of the week, particularly at the end of the month when tenancies start and end, so book them as early as you can. Sundays are often easier to get and can be quicker on the road. Many controlled parking zones don’t operate on Sundays, but some do — check the signs on your street.",
          "Before you book a weekend move, check your building’s rules. Some London blocks don’t allow moves on Sundays or after a set time on Saturdays, and some concierge desks can’t book lifts at weekends.",
        ],
      },
      {
        id: "evening",
        label: "Evening moves",
        h2: "After-work and evening moves",
        paras: [
          "Evening moves work well for small flats, single items and short moves within London — you finish work, the crew arrives, and you’re in by the evening. They’re also useful when you collect keys late in the day and don’t want to wait until the weekend.",
          "Larger homes are better started earlier, because a full house move can take most of a day. If an evening start is the only option, we can split the move: load in the evening, keep the van secure overnight and deliver first thing.",
        ],
      },
      {
        id: "business-hours",
        label: "Business cutovers",
        h2: "Out-of-hours office and shop moves",
        paras: [
          "For businesses, out-of-hours timing is often the whole point. Offices typically move on a Friday evening or over a weekend so staff log on to a working office on Monday, and shops move after closing so they’re trading again the next morning. Larger business moves get a fixed quote that already includes the out-of-hours timing.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are bank holiday moves available?",
        a: "Often yes, subject to crew. Bank holidays are popular, so book early and check your building allows moves that day.",
      },
      {
        q: "Is a weekday move cheaper?",
        a: "Usually, yes. If your dates are flexible, a mid-week daytime slot is the lowest-cost option — we’ll show you both prices.",
      },
    ],
  },

  "european-moves": {
    title: "Removals to Europe from London | Part Load | Phi Movers",
    description:
      "Removals to Europe from London by road — part load or dedicated vehicle, export packing and inventory, with one UK contact. Quoted after a survey.",
    h1: "Removals to Europe from London",
    lead:
      "Moving to France, Spain, Germany or anywhere else in Europe? We pack and load in London, then your belongings travel by road on a part load or a dedicated vehicle to your new front door, with one UK contact throughout. European removals are quoted after a home or video survey.",
    overviewH2: "European removals by road",
    sections: [
      {
        id: "part-load",
        label: "Part load",
        h2: "Part load or dedicated vehicle?",
        paras: [
          "A part load removal means your belongings share a vehicle with other households heading the same way. You pay for the space you use, which makes it much cheaper for smaller moves — a flat, a few rooms or a student’s belongings. The trade-off is timing: delivery dates depend on when the vehicle fills and the route it takes.",
          "A dedicated vehicle carries only your load, on your dates, directly to your new home. It costs more but suits full houses, tight deadlines and moves where you need collection and delivery on specific days. We’ll price both options where they make sense.",
        ],
        list: [
          "Part load: cheaper, flexible delivery window",
          "Dedicated vehicle: your dates, direct route",
          "Both include London packing, loading and inventory",
        ],
      },
      {
        id: "paperwork",
        label: "Paperwork",
        h2: "Paperwork for moving belongings to the EU",
        paras: [
          "Since the UK left the EU, household goods crossing the border need customs documentation. Many EU countries offer relief from import duty and VAT on personal belongings when you move your main residence there — often called Transfer of Residence relief — but the conditions vary by country and usually include how long you’ve owned the items and proof of your new address.",
          "We prepare a detailed inventory with your move and tell you what’s typically needed for your destination. Check the exact rules with the destination country’s customs authority early, as some applications need to be made before the goods arrive.",
        ],
      },
      {
        id: "dont-pack",
        label: "What not to pack",
        h2: "What can’t go on a European removal",
        paras: [
          "Flammable items — aerosols, paint, gas canisters, fuel and fireworks — can’t travel on a removal vehicle. Plants and soil face plant health rules when entering the EU, and food, alcohol and tobacco may be restricted or need declaring. Pets, cash, passports and important documents should travel with you, not in the van.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you store my things before they go to Europe?",
        a: "Yes. If your new home isn’t ready, we can load in London, keep everything in secure storage from £15 a week and send it when you have a delivery date.",
      },
      {
        q: "Do you move to Ireland?",
        a: "Yes — UK to Ireland removals are covered with our International Moves service, by road and ferry.",
      },
    ],
  },

  "end-of-tenancy-clean": {
    title: "End of Tenancy Cleaning London | From £120 | Phi Movers",
    description:
      "End of tenancy cleaning in London to a check-out standard — kitchen, bathrooms, floors and inside cupboards, with oven and carpet add-ons. From £120.",
    h1: "End of Tenancy Cleaning in London",
    lead:
      "A deep clean of your empty flat or house before you hand back the keys, worked to a room-by-room checklist that matches what check-out clerks look at. Book it straight after your removal and leave the property ready for inspection. End of tenancy cleans start from £120.",
    overviewH2: "Move-out cleaning, done to a checklist",
    sections: [
      {
        id: "checkout",
        label: "Check-out",
        h2: "What landlords and agents check at move-out",
        paras: [
          "At check-out, the property is compared against the check-in inventory, room by room. The usual reasons for deposit deductions are cleaning ones: grease inside the oven and extractor, limescale on taps, shower screens and toilets, dust on skirting boards and the tops of doors, marks on kitchen cupboard fronts and dirt left inside cupboards and drawers.",
          "Our clean focuses on those areas first. Get your check-in inventory out before the clean and tell us if anything was noted as particularly clean or new, such as carpets or the oven, so we can add the right extras.",
        ],
        list: [
          "Inside oven, hob and extractor (oven clean add-on)",
          "Limescale on taps, tiles, screens and toilets",
          "Skirting boards, door tops, switches and sockets",
          "Inside every cupboard, drawer and wardrobe",
        ],
      },
      {
        id: "before-clean",
        label: "Before the clean",
        h2: "How to prepare for an end of tenancy clean",
        paras: [
          "The property needs to be empty, with electricity and hot water still on — we can’t clean properly without them. Empty and defrost the fridge and freezer the day before so they can be cleaned dry, and take everything out of cupboards, including the bathroom cabinet.",
          "If you’re moving with us, we’ll schedule the clean after the van leaves. Allow time between the clean and the check-out so you can walk round and check the work.",
        ],
      },
      {
        id: "limits",
        label: "What a clean can’t fix",
        h2: "What a clean can and can’t fix",
        paras: [
          "Cleaning removes dirt, grease, limescale and surface marks. It can’t fix damage — burns, holes, scuffed paintwork that needs redecorating, broken fittings or deep stains in carpets — and long-established mould may need treatment beyond a clean. Your deposit is held in a government-approved tenancy deposit scheme, and disputes about deductions are handled through that scheme rather than by the cleaner.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you clean carpets as part of the end of tenancy clean?",
        a: "Carpets are vacuumed as standard. A deeper carpet clean is an add-on — worth booking if your tenancy agreement or check-in inventory mentions professionally cleaned carpets.",
      },
      {
        q: "Can you clean a property before I move in?",
        a: "Yes. A pre-move-in clean of an empty property uses the same checklist and is easy to book alongside your removal.",
      },
    ],
  },

  "free-home-survey": {
    title: "Free Home Survey for Removals London | Phi Movers",
    description:
      "Free home or video survey for removals in London — accurate volume, access and crew planning, then a written fixed quote. More reliable than a calculator.",
    h1: "Free Removals Survey in London",
    lead:
      "A free home or video survey is the most accurate way to price a removal. We look at what you’re moving, the access at your property and anything awkward, then send a written fixed quote. No charge and no obligation to book.",
    overviewH2: "Why a survey beats a removals calculator",
    sections: [
      {
        id: "calculator",
        label: "Survey vs calculator",
        h2: "Removals calculator or survey — which should you use?",
        paras: [
          "An online removals calculator is useful for a rough idea of cost. It turns a list of rooms or items into an estimated volume, then a van size and crew. The problem is that most people underestimate what they own — lofts, sheds, under-bed storage and full kitchen cupboards rarely make it onto a list — and a calculator can’t see a narrow stair turn or a 30-metre carry from the nearest parking space.",
          "A survey catches those things before the day, so the van is big enough, the crew is the right size and the price doesn’t need to change. For studios and one-beds a quote from a list and photos is usually fine; for anything larger or more complicated, a survey is worth the time.",
        ],
      },
      {
        id: "video-or-home",
        label: "Video or in person",
        h2: "Video survey or home visit?",
        paras: [
          "A video survey works on a normal phone video call. You walk us round each room, opening wardrobes and cupboards and showing the loft and any outside space, then step outside to show the street and parking. It suits most flats and houses and can be booked at short notice.",
          "An in-person visit is better for large houses, properties with very awkward access, moves with pianos or specialist items, and office or warehouse moves where we need to measure and plan the route through the building.",
        ],
        list: [
          "Open wardrobes, cupboards and storage spaces",
          "Show the loft, garage, shed and garden",
          "Point out anything that isn’t coming with you",
          "Show the stairs, lift and route to the street",
          "Step outside to show parking and access",
        ],
      },
    ],
    faqs: [
      {
        q: "What should I have ready for the survey?",
        a: "Your moving date or date range, the new address and any access details you know about it, and a rough idea of what you’re leaving behind or selling. Questions about packing or storage can be answered at the same time.",
      },
      {
        q: "What if I add items after the survey?",
        a: "Let us know as soon as you can. Small additions are often absorbed; if something significant is added, we’ll update the quote before moving day rather than on the doorstep.",
      },
    ],
  },
};
