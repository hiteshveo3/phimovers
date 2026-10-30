/**
 * Hand-written depth for pages targeting specific low-difficulty keywords the
 * owner supplied from Semrush (house removals chelmsford, house removals
 * sevenoaks, house removals walton on thames, rayleigh removal company,
 * house removals sidcup / upminster / tooting, house clearances hertfordshire).
 * Rendered after the standard sections on town, area and county hub pages.
 */
export type ExtraSection = { h2: string; paras: string[]; list?: string[] };
export type ExtraFaq = { q: string; a: string };
export type PageExtras = { sections: ExtraSection[]; faqs: ExtraFaq[] };

/** Keyed by town slug (/removals/{slug}). */
export const townExtras: Record<string, PageExtras> = {
  chelmsford: {
    sections: [
      {
        h2: "House removals in Chelmsford, planned properly",
        paras: [
          "Most house removals in Chelmsford fall into two groups: families moving out from east London for more space, and people moving within the city — from a Moulsham terrace to a bigger house in Great Baddow, Springfield or Broomfield, or into one of the new-build estates such as Beaulieu or Channels.",
          "Each needs a different plan. Victorian terraces in Moulsham often have narrow halls and on-street parking only, while new-build estates usually mean easier parking but tight turns on modern staircases. We price from your inventory and the access at both addresses, so the quote covers exactly the crew and van your move needs.",
        ],
        list: [
          "2-bed house moves from £499, 3-bed from £749, 4-bed and larger from £999",
          "Full packing from £150, or fragile-only packing for kitchens and glass",
          "Furniture dismantling and reassembly on the day",
          "Secure storage from £15/week if your completion dates don’t line up",
        ],
      },
      {
        h2: "Removal companies in Chelmsford, Essex: what to compare",
        paras: [
          "When you compare removal companies in Chelmsford, check three things: whether the price is fixed or an estimate that can rise on the day, whether goods-in-transit and public liability insurance are included, and whether the firm will look at your inventory properly before quoting. A cheap hourly rate can easily end up costing more than a fixed price once stairs, a longer carry or a second trip are added.",
          "Our quotes are fixed and include the crew, the van, loading, the journey and unloading — and because we’re London-based, a London–Chelmsford move along the A12 is a simple single-day job.",
        ],
      },
    ],
    faqs: [
      { q: "How much are house removals in Chelmsford?", a: "A 2-bed house move starts from £499 and a 3-bed from £749. Your fixed quote depends on your inventory, access at both addresses and the distance." },
      { q: "Do you move new-build homes in Beaulieu and Channels?", a: "Yes. New-build estates are usually easy to load, but we check staircase turns and any estate parking rules before the day." },
      { q: "Can you move us from London to Chelmsford in one day?", a: "Yes — at around 40 miles along the A12, most London–Chelmsford house moves are loaded, driven and unloaded in a single day." },
    ],
  },
  sevenoaks: {
    sections: [
      {
        h2: "House removals in Sevenoaks for larger family homes",
        paras: [
          "House removals in Sevenoaks tend to be bigger jobs than in London: four and five-bedroom detached homes around Kippington and the Wildernesse, period cottages in Sevenoaks Weald, and plenty of garden furniture, garages and lofts to clear before the move.",
          "For homes this size we recommend a free survey, so the crew size, van count and packing time are right first time. Large moves often run over two days — packing on day one and loading and delivery on day two — which keeps moving day calm.",
        ],
        list: [
          "4-bed and larger homes from £999 with a fixed price",
          "Full packing from £150, including wardrobe cartons and dish packs",
          "Garden furniture, sheds and garage contents planned into the quote",
          "Pianos and heavy items handled by a specialist crew",
        ],
      },
      {
        h2: "Sevenoaks hills, lanes and access",
        paras: [
          "Sevenoaks is hilly, and many of the larger houses sit on private roads or long drives. Some lanes in the surrounding villages are too narrow for a large removal van, so we may use a smaller shuttle vehicle for the last stretch — we’ll tell you at the survey, not on the day.",
        ],
      },
    ],
    faqs: [
      { q: "How long does a house move to Sevenoaks take?", a: "Most 3- and 4-bed moves from London are completed in one day; larger homes are usually packed the day before. Sevenoaks is around 25 miles from central London via the A21 and M25." },
      { q: "Do you offer a free survey for Sevenoaks moves?", a: "Yes. For larger homes we recommend a free home or video survey so your fixed price is accurate." },
    ],
  },
  "walton-on-thames": {
    sections: [
      {
        h2: "House removals in Walton-on-Thames",
        paras: [
          "House removals in Walton-on-Thames range from riverside apartments near Walton Bridge to large family houses around Ashley Park and towards Hersham and St George’s Hill. Many of our Walton moves are families relocating from south-west London for schools and space, so we often combine packing, the move and short-term storage.",
          "Riverside apartment blocks usually have lift bookings and managed parking, while the larger houses can mean long drives, gravel and a lot of furniture. We plan both at quote stage so your fixed price stays fixed.",
        ],
        list: [
          "Fixed-price house moves: 3-bed from £749, 4-bed and larger from £999",
          "Lift and parking arrangements with apartment management",
          "Packing, dismantling and storage from one team",
        ],
      },
    ],
    faqs: [
      { q: "Are you a removals company in Walton on Thames?", a: "We’re a London-based removals company that regularly moves families to and from Walton-on-Thames — it’s only around 18 miles from central London, so moves are single-day jobs." },
      { q: "Can you move a riverside flat in Walton?", a: "Yes. We book the lift and loading area with building management and send our insurance certificate in advance if asked." },
    ],
  },
  rayleigh: {
    sections: [
      {
        h2: "Rayleigh removal company for houses and bungalows",
        paras: [
          "As a removal company working in Rayleigh, we see a lot of whole-house moves and downsizing moves — families moving out from east London, and people moving from a larger home into one of Rayleigh’s many bungalows. Bungalows are quick to load with no stairs, which often keeps the price down.",
          "Downsizing moves usually mean deciding what to keep, store or clear. We can move what you’re keeping, put the rest into storage from £15/week, and clear anything you no longer need from £120 — all from one quote.",
        ],
        list: [
          "Fixed prices: 2-bed from £499, 3-bed from £749",
          "Storage and house clearance alongside your move",
          "Easy access via the A127 and A1245 for London–Rayleigh moves",
        ],
      },
    ],
    faqs: [
      { q: "How much does a Rayleigh removal company charge?", a: "Our house moves start from £499 for a 2-bed home. Every Rayleigh move gets a fixed quote based on inventory, access and distance." },
      { q: "Can you help us downsize to a bungalow in Rayleigh?", a: "Yes — we move what you’re keeping, store or clear the rest, and place everything room by room in the new home." },
    ],
  },
};

/** Keyed by area slug (/areas/{slug}). */
export const areaHubExtras: Record<string, PageExtras> = {
  sidcup: {
    sections: [
      {
        h2: "House removals in Sidcup",
        paras: [
          "Most house removals in Sidcup are family moves: 1930s semis and detached homes around Lamorbey, Blackfen and Foots Cray, many with driveways that make loading quick. We also move a lot of people from inner south-east London out to Sidcup for more space.",
          "Sidcup sits on the A20 and the Dartford Loop line, around 12 miles from central London, so London–Sidcup house moves are comfortable single-day jobs.",
        ],
        list: [
          "2-bed house moves from £499, 3-bed from £749",
          "Packing from £150 and storage from £15/week",
          "Driveway loading planned in advance to save time",
        ],
      },
    ],
    faqs: [
      { q: "How much do house removals in Sidcup cost?", a: "A 2-bed house move starts from £499 and a 3-bed from £749, with a fixed price agreed before moving day." },
    ],
  },
  upminster: {
    sections: [
      {
        h2: "House removals in Upminster",
        paras: [
          "House removals in Upminster are mostly family homes and downsizing moves — 1930s semis, detached houses and bungalows around Upminster, Cranham and Corbets Tey. Many homes have driveways, which keeps loading fast.",
          "Upminster is at the end of the District line and on the c2c line to Fenchurch Street, with the A127 and M25 close by, so moves into Essex or across London are straightforward to plan.",
        ],
        list: [
          "Fixed-price moves: 2-bed from £499, 3-bed from £749, 4-bed from £999",
          "Downsizing help: move, store and clear in one booking",
        ],
      },
    ],
    faqs: [
      { q: "Do you move bungalows in Upminster?", a: "Yes — bungalows are quick to load with no stairs, which often keeps the price down." },
    ],
  },
  tooting: {
    sections: [
      {
        h2: "House removals in Tooting",
        paras: [
          "House removals in Tooting are often flat-to-house moves: from a conversion flat near Tooting Broadway to a terrace near Tooting Bec or the common. Victorian terraces here have narrow halls and steep stairs, so we check sofa and wardrobe sizes against the stairs at quote stage.",
          "Tooting Broadway and Tooting Bec are both on the Northern line, and the high street is part of the busy A24 — we load from side streets with a suspended bay where needed.",
        ],
        list: [
          "1-bed flat moves from £329, 2-bed houses from £499",
          "Sofa hoisting if a sofa won’t make it up the stairs",
          "Man and van from £50/hour for smaller moves",
        ],
      },
    ],
    faqs: [
      { q: "What if my sofa won’t fit up the stairs in Tooting?", a: "We can remove feet and cushions, dismantle where possible, or hoist it in through a window with our sofa and furniture hoisting service." },
    ],
  },
};

/** Keyed by county slug (/removals/county/{slug}). */
export const countyExtras: Record<string, PageExtras> = {
  hertfordshire: {
    sections: [
      {
        h2: "House clearances across Hertfordshire",
        paras: [
          "House clearances in Hertfordshire are a large part of our work in the county: clearing a family home after a move, an empty property for sale or probate, or a loft and garage before a renovation. Our crew loads everything, takes it away and leaves the rooms empty and swept.",
          "Items in good condition are separated for reuse or donation where possible and the rest is sorted for recycling and responsible disposal. Clearances start from £120, priced from photos of each room.",
        ],
        list: [
          "Whole houses, flats, lofts, garages and sheds",
          "Probate and empty-property clearances with key collection by arrangement",
          "Clear and move in one visit if you’re keeping some furniture",
        ],
      },
    ],
    faqs: [
      { q: "How much do house clearances in Hertfordshire cost?", a: "House clearances start from £120. Send photos of each room and we’ll give you a fixed price that includes travel from London." },
    ],
  },
};
