import type { Area } from "./areas";
import type { ServiceItem } from "./data";

export type ComboFaq = { q: string; a: string };

export type ComboCopy = {
  hero: string;
  intro: string[];
  tip: string;
  faq: ComboFaq;
  /** Phase 3 high-intent borough × service */
  priority: boolean;
};

/** Highest-search boroughs (Phase 3 spotlight). */
export const PRIORITY_BOROUGHS = [
  "camden",
  "islington",
  "hackney",
  "westminster",
  "croydon",
  "wandsworth",
  "kensington-and-chelsea",
  "tower-hamlets",
  "lambeth",
  "southwark",
  "brent",
  "ealing",
] as const;

/** Highest-intent services (Phase 3 spotlight). */
export const PRIORITY_SERVICES = [
  "house-removals",
  "flat-removals",
  "studio-moves",
  "man-and-van",
  "sofa-delivery",
  "office-removals",
  "full-packing-service",
  "same-day-move",
] as const;

/** Local angle for every borough — keeps all 990 combos distinct. */
const boroughAngle: Record<string, string> = {
  "barking-and-dagenham":
    "terraced streets, estate bays and A13 links across Barking and Dagenham",
  barnet:
    "Victorian houses, Finchley high streets and suburban drives toward High Barnet",
  bexley:
    "suburban semis, riverside flats and generally Luton-friendly residential roads",
  brent:
    "Wembley high-rises, Willesden terraces and event-day traffic to plan around",
  bromley:
    "large family houses, private estates and longer south-east carries",
  camden:
    "Georgian terraces, mansion blocks and controlled parking near Camden Town and Kentish Town",
  "city-of-london":
    "Square Mile loading rules, early slots and office-heavy security desks",
  croydon:
    "high-rise lift bookings in the centre and Victorian streets further out",
  ealing:
    "period houses, Acton mansion blocks and ULEZ-aware west London routing",
  enfield:
    "A10-corridor houses, town-centre flats and wider suburban access",
  greenwich:
    "riverside apartments, peninsula lifts and mixed permit streets inland",
  hackney:
    "conversions, narrow Dalston streets and strong weekend demand around Hackney Central",
  "hammersmith-and-fulham":
    "Victorian terraces, mansion blocks and evening demand around Fulham and Hammersmith",
  haringey:
    "Tottenham estates through to Muswell Hill houses — access changes neighbourhood to neighbourhood",
  harrow:
    "suburban family homes and generally good Luton access off the high street",
  havering:
    "Romford-area suburban drives and longer runs into inner London",
  hillingdon:
    "Uxbridge houses, Heathrow-corridor timing and student-area flats",
  hounslow:
    "terraces, new builds and airport-side routes that need timed slots",
  islington:
    "Victorian walk-ups, Angel parking zones and busy Highbury key-exchange weekends",
  "kensington-and-chelsea":
    "stucco terraces, basement flats and strict permit etiquette",
  "kingston-upon-thames":
    "riverside flats, suburban houses and busy Saturday key exchanges",
  lambeth:
    "Brixton terraces through to riverside blocks with A-road traffic into town",
  lewisham:
    "Victorian terraces, new-build lifts and mixed parking rules across Catford and beyond",
  merton:
    "Wimbledon family houses, driveway access and careful gate approaches",
  newham:
    "Stratford towers, terraces and strong flat / student-move demand",
  redbridge:
    "Ilford-area suburban houses and typically straightforward van streets",
  "richmond-upon-thames":
    "period houses, leafy streets and riverside flats that need floor protection",
  southwark:
    "warehouse conversions, estate loading points and river-side building rules",
  sutton:
    "family semis, quieter suburban roads and school-run timing watches",
  "tower-hamlets":
    "Docklands loading bays, Canary Wharf towers and city-edge timing rules",
  "waltham-forest":
    "Walthamstow terraces, Leyton conversions and popular man & van routes",
  wandsworth:
    "busy Saturday house moves across Battersea, Balham and Tooting edges",
  westminster:
    "porter desks, tight loading bays and early slots that keep mansion-block moves calm",
};

type ServiceBuilder = (area: Area, angle: string) => Omit<ComboCopy, "priority">;

/** One builder per service — used across all 33 boroughs (Phase 4). */
const serviceBuilders: Record<string, ServiceBuilder> = {
  "house-removals": (area, angle) => ({
    hero: `Fixed-price house removals in ${area.name} — quoted from your inventory and access, not an open-ended hourly guess. Local crews who know ${angle}.`,
    intro: [
      `Moving a whole house in ${area.name} means planning rooms, parking and carry distance before the van arrives. ${area.blurb}`,
      `We price ${area.name} house moves as a clear fixed quotation: van, crew, loading and the first included miles. ${area.housing}`,
      `Access matters here: ${area.access} Tell us both addresses and we’ll lock the quote before moving day.`,
    ],
    tip: `In ${area.name}, book parking or a suspended bay early on tighter streets — it often saves more than it costs on carry time.`,
    faq: {
      q: `How much is a house removal in ${area.name}?`,
      a: `Full house moves in ${area.name} get an individually calculated fixed quote from volume, floors and distance. WhatsApp your inventory for a number that fits your addresses.`,
    },
  }),

  "flat-removals": (area, angle) => ({
    hero: `Flat removals in ${area.name} built for walk-ups, lifts and permit streets — fixed quote from floors and inventory. Built around ${angle}.`,
    intro: [
      `Flat moves in ${area.name} succeed or stall on access. ${area.blurb}`,
      `${area.housing} We quote from floor count, lift access and volume so you’re not paying mystery hours on stair turns.`,
      `${area.access} Share photos of the stairwell or lift and we’ll size the crew before we set off.`,
    ],
    tip: `If your ${area.name} building needs a goods-lift booking, tell us the slot — we’ll time the crew around it.`,
    faq: {
      q: `Do you move walk-up flats in ${area.name}?`,
      a: `Yes — walk-ups are common in ${area.name}. Tell us how many floors and whether there’s a lift; photos help us quote the right crew size.`,
    },
  }),

  "studio-moves": (area, angle) => ({
    hero: `Studio moves in ${area.name} — fast, affordable and quoted clearly for compact inventories. Ideal around ${angle}.`,
    intro: [
      `Studio and micro-flat moves in ${area.name} shouldn’t be priced like a four-bed house. ${area.blurb}`,
      `We keep the van and crew matched to a studio load — sofa, bed, boxes and the awkward doorway turns that come with ${angle}.`,
      `${area.access} WhatsApp both postcodes and a couple of photos for a fixed studio quote or hourly option if that suits better.`,
    ],
    tip: `Studios in ${area.name} move fastest when mattress and sofa sizes are in the first message — we can confirm stair clearance early.`,
    faq: {
      q: `How much does a studio move cost in ${area.name}?`,
      a: `Studio moves in ${area.name} guide from around £199 depending on floors and distance. Very light loads may suit hourly man & van instead.`,
    },
  }),

  "man-and-van": (area, angle) => ({
    hero: `Man & van in ${area.name} from £50/hour with a two-hour minimum — loading help included. Handy for ${angle}.`,
    intro: [
      `Need a flexible van for a small load in ${area.name}? Our man & van service covers single rooms, marketplace runs and studio-scale jobs. ${area.blurb}`,
      `You’re charged by the hour (from £50, two-hour minimum from £100) with loading help included. ${area.housing}`,
      `${area.access} Tell us the item list and floors so we know if a second helper will keep the clock down.`,
    ],
    tip: `For ${area.name} man & van jobs, clear the path to the door before we arrive — every minute of carry time is on the hourly clock.`,
    faq: {
      q: `Is there a minimum man & van booking in ${area.name}?`,
      a: `Yes — two hours minimum (from £100 before extras). That covers most small ${area.name} jobs including travel between addresses.`,
    },
  }),

  "student-moves": (area, angle) => ({
    hero: `Student moves in ${area.name} — budget-friendly vans for halls, shared houses and term-date chaos. Built around ${angle}.`,
    intro: [
      `Term dates in ${area.name} don’t wait for a perfect diary. ${area.blurb}`,
      `We keep student moves simple: clear hourly or fixed options, careful with shared-house stairs, and no jargon. Ideal around ${angle}.`,
      `${area.access} Message your hall or flat details and we’ll confirm the cheapest honest option.`,
    ],
    tip: `Share kitchen and bathroom access rules for ${area.name} halls — it stops delays on moving-out day.`,
    faq: {
      q: `Do you offer student moves in ${area.name}?`,
      a: `Yes — student and shared-house moves across ${area.name} with clear pricing and loading help included.`,
    },
  }),

  "house-clearance": (area, angle) => ({
    hero: `House clearance in ${area.name} — clear unwanted items responsibly with a fixed quote. Tuned for ${angle}.`,
    intro: [
      `Clearing a property in ${area.name} is different from a full house move — volume, access and disposal all matter. ${area.blurb}`,
      `We quote from what needs to leave and how easy the van can load. Useful for probate, landlords and declutter jobs around ${angle}.`,
      `${area.access} Photos of rooms and the entrance help us price accurately.`,
    ],
    tip: `Separate keep / donate / dispose piles before we arrive in ${area.name} — it speeds the clearance and keeps the quote honest.`,
    faq: {
      q: `How much does house clearance cost in ${area.name}?`,
      a: `Clearance in ${area.name} is quoted from volume and access. Send photos for a fixed price before we book the crew.`,
    },
  }),

  "sofa-delivery": (area, angle) => ({
    hero: `Sofa delivery in ${area.name} from £55 — marketplace collections, showroom pickups and stair carries included. Tuned for ${angle}.`,
    intro: [
      `Bought a sofa in or into ${area.name}? We collect, protect and place it — including tight landings and walk-ups. ${area.blurb}`,
      `Dedicated sofa runs start from £55 once we know size, floors and distance. That’s separate from hourly man & van. ${area.housing}`,
      `${area.access} Send two photos of the sofa and the stairwell for a clear fixed price before we set off.`,
    ],
    tip: `In ${area.name}, corner sofas often need legs off or a modular split — tell us the make if you can and we’ll plan the turn.`,
    faq: {
      q: `Can you carry a sofa up stairs in ${area.name}?`,
      a: `Yes — we move sofas by hand on ${area.name} staircases every week. Extreme access is flagged from photos before booking.`,
    },
  }),

  "bed-and-mattress-delivery": (area, angle) => ({
    hero: `Bed and mattress delivery in ${area.name} from around £50 — placed in-room with stairs covered. Built for ${angle}.`,
    intro: [
      `New bed or mattress heading to ${area.name}? We collect, protect and place it without you wrestling it through the tube. ${area.blurb}`,
      `Optional dismantle of an old frame and basic new-frame assembly when booked. Ideal around ${angle}.`,
      `${area.access} Tell us floor level and parking so the quote stays fixed.`,
    ],
    tip: `Measure the stair turn in your ${area.name} flat before delivery day — king mattresses need a clear path.`,
    faq: {
      q: `Will you assemble a bed frame in ${area.name}?`,
      a: `Basic frame assembly can be included when booked. Complex storage beds may need extra time — tell us the make when you enquire.`,
    },
  }),

  "appliance-delivery": (area, angle) => ({
    hero: `Appliance delivery in ${area.name} from around £50 — fridges, washers and white goods placed carefully. Tuned for ${angle}.`,
    intro: [
      `White goods need careful handling in ${area.name} kitchens and walk-ups. ${area.blurb}`,
      `We protect floors, use the right trolleys and position the appliance where you need it. Plumbing and gas stay with qualified trades. Built around ${angle}.`,
      `${area.access} Empty and defrost fridges before collection.`,
    ],
    tip: `Check doorway width for American-style fridges in ${area.name} flats — photos help us plan the crew.`,
    faq: {
      q: `Do you plumb in appliances in ${area.name}?`,
      a: `We position units and can help with simple plug-in disconnect/reconnect when agreed. Water, waste and gas need a qualified engineer.`,
    },
  }),

  "single-item-delivery": (area, angle) => ({
    hero: `Single item delivery in ${area.name} from around £50 — one piece, one clear fixed job. Handy for ${angle}.`,
    intro: [
      `One desk, TV, bike or gym piece across ${area.name} shouldn’t mean a full house-move crew. ${area.blurb}`,
      `We quote a fixed single-item run from size, stairs and distance. Multi-item loads may suit hourly man & van instead. Ideal around ${angle}.`,
      `${area.access} Confirm the seller still has the item before we set off.`,
    ],
    tip: `For marketplace pickups in ${area.name}, send the seller’s number — we can call on arrival if access is gated.`,
    faq: {
      q: `What counts as a single item in ${area.name}?`,
      a: `One main piece — desk, TV, bike and similar. Extra furniture usually means a different quote.`,
    },
  }),

  "furniture-delivery": (area, angle) => ({
    hero: `Furniture delivery in ${area.name} — store, warehouse and private-seller collections with placement included. Tuned for ${angle}.`,
    intro: [
      `Furniture runs in ${area.name} cover flat-pack, showroom pieces and awkward doorways. ${area.blurb}`,
      `Fixed quotes from item size, floors and distance; optional basic assembly when booked. Built around ${angle}.`,
      `${area.access} Packaging removal available where disposal is practical.`,
    ],
    tip: `Clear the delivery room in your ${area.name} home before we arrive — it keeps placement quick.`,
    faq: {
      q: `Can you collect from IKEA for a ${area.name} address?`,
      a: `Yes — give us the pickup details and delivery floor. We’ll confirm a fixed price before booking.`,
    },
  }),

  "furniture-assembly": (area, angle) => ({
    hero: `Furniture assembly in ${area.name} from around £60 — beds, wardrobes and flat-pack built properly. Suited to ${angle}.`,
    intro: [
      `Bought flat-pack for a ${area.name} flat and don’t want a weekend lost to allen keys? ${area.blurb}`,
      `We dismantle and reassemble agreed pieces with the right tools and time built into the quote. Ideal around ${angle}.`,
      `${area.access} A simple photo list is enough to price most jobs.`,
    ],
    tip: `Keep all screws and fittings labelled for ${area.name} assembly jobs — missing packs slow everything down.`,
    faq: {
      q: `How much is furniture assembly in ${area.name}?`,
      a: `From around £60 depending on piece count and complexity. We’ll quote from a list or photos.`,
    },
  }),

  "office-removals": (area, angle) => ({
    hero: `Office removals in ${area.name} with evening and weekend cutovers — one project contact and a fixed commercial quote. Planned around ${angle}.`,
    intro: [
      `Business moves in ${area.name} need timing as much as muscle. ${area.blurb}`,
      `We plan desks, IT and labelling around your downtime — often evenings or weekends. Built for ${angle}.`,
      `${area.access} A short survey locks crew, vans and the written quote.`,
    ],
    tip: `Share ${area.name} loading-bay and security check-in rules early — it keeps the cutover on schedule.`,
    faq: {
      q: `Can you move our ${area.name} office out of hours?`,
      a: `Yes — most commercial moves in ${area.name} run evening or weekend around your operating hours.`,
    },
  }),

  "it-and-server-relocation": (area, angle) => ({
    hero: `IT and server relocation in ${area.name} — careful packing, upright transport and timed cutovers. Tuned for ${angle}.`,
    intro: [
      `Tech moves in ${area.name} need chain-of-custody thinking, not just a big van. ${area.blurb}`,
      `We coordinate with your IT team on power-down windows, wrap kit properly and move upright where required. Built around ${angle}.`,
      `${area.access} Live cabling and commissioning stay with your IT provider — we handle the physical relocation.`,
    ],
    tip: `Label racks and cables before collection day in ${area.name} — rebuilds are faster at the new site.`,
    faq: {
      q: `Do you power down servers in ${area.name}?`,
      a: `Physical relocation and careful packing are our job. Power-down and commissioning are typically your IT team — we align timings.`,
    },
  }),

  "retail-shop-move": (area, angle) => ({
    hero: `Retail and shop moves in ${area.name} — overnight and out-of-hours so you keep trading. Planned around ${angle}.`,
    intro: [
      `Shop moves in ${area.name} can’t kill a week of sales. ${area.blurb}`,
      `We move fixtures, stock and till points on evening or overnight windows with a labelled placement plan. Ideal around ${angle}.`,
      `${area.access} A walkthrough locks timing and crew size.`,
    ],
    tip: `Photograph your ${area.name} shop layout before dismantle — it speeds reassembly in the new unit.`,
    faq: {
      q: `Can you move a ${area.name} shop overnight?`,
      a: `That’s our preferred retail approach — agree close time, crew size and reopen target so you’re trading again fast.`,
    },
  }),

  "warehouse-removals": (area, angle) => ({
    hero: `Warehouse removals in ${area.name} — stock, racking and staged cutovers with a commercial quote. Tuned for ${angle}.`,
    intro: [
      `Warehouse jobs in ${area.name} need bay planning and the right van count. ${area.blurb}`,
      `We handle stock and agreed racking work with evening or weekend cutovers when you can’t stop operations. Built around ${angle}.`,
      `${area.access} A survey fixes volume, access and price.`,
    ],
    tip: `Clear forklift routes in your ${area.name} unit before moving day — it keeps loading safe and fast.`,
    faq: {
      q: `Do you dismantle racking in ${area.name}?`,
      a: `Yes when booked. Specialist systems may need your supplier — we’ll flag that at quoting stage.`,
    },
  }),

  "full-packing-service": (area, angle) => ({
    hero: `Full packing service in ${area.name} — materials included, room-by-room labelling, ready for the van. Suited to ${angle}.`,
    intro: [
      `Packing eats evenings before a ${area.name} move. Our crew brings materials and packs room by room. ${area.blurb}`,
      `Kitchens, glass and wardrobes get proper wrapping. Ideal when you’re juggling ${angle}.`,
      `${area.access} Add packing to a move or book it the day before.`,
    ],
    tip: `Leave an “open first” box aside in ${area.name} — kettle, chargers, bedding — so night one is calm.`,
    faq: {
      q: `How long does full packing take in ${area.name}?`,
      a: `A typical one–two bed in ${area.name} is often a day; larger homes need longer. We’ll estimate from your room list.`,
    },
  }),

  "fragile-only-packing": (area, angle) => ({
    hero: `Fragile-only packing in ${area.name} from around £80 — kitchens, glass and valuables wrapped properly. Tuned for ${angle}.`,
    intro: [
      `You pack the easy boxes; we take the breakables in ${area.name}. ${area.blurb}`,
      `Smart middle ground before a move around ${angle} — less cost than full packing, more safety where it matters.`,
      `${area.access} Materials for fragile work are included in the quote.`,
    ],
    tip: `Pull kitchen glass and framed art into one room before we arrive in ${area.name} — packing is faster.`,
    faq: {
      q: `What’s included in fragile-only packing in ${area.name}?`,
      a: `Typically kitchens, glassware, mirrors and similar valuables. We’ll confirm the list when you book.`,
    },
  }),

  "packing-materials": (area, angle) => ({
    hero: `Packing materials delivered in ${area.name} from around £50 — boxes, tape and wrap to your door. Handy for ${angle}.`,
    intro: [
      `Good packing in ${area.name} starts with decent boxes, not supermarket cartons. ${area.blurb}`,
      `We deliver kits sized to your move so you’re ready before the van day. Ideal around ${angle}.`,
      `${area.access} Same-week delivery is often available.`,
    ],
    tip: `Order materials a week ahead for ${area.name} moves — rushing the night before creates weak boxes.`,
    faq: {
      q: `Can you deliver packing kits across ${area.name}?`,
      a: `Yes — to your ${area.name} address. Tell us roughly how many rooms and we’ll recommend a kit size.`,
    },
  }),

  "secure-storage": (area, angle) => ({
    hero: `Secure storage for ${area.name} moves — clean units, CCTV and collection when dates don’t line up. Tuned for ${angle}.`,
    intro: [
      `Keys in ${area.name} rarely land on the same day as keys out. ${area.blurb}`,
      `We collect, store and deliver when you’re ready — flexible terms, monitored units. Ideal around ${angle}.`,
      `${area.access} Combine with packing or man & van for an end-to-end gap solution.`,
    ],
    tip: `If your ${area.name} completion might slip, book storage early — last-minute unit sizes go first.`,
    faq: {
      q: `How much is storage for a ${area.name} move?`,
      a: `From around £15/week depending on volume. We’ll recommend a unit size after a quick chat about your items.`,
    },
  }),

  "piano-and-specialist": (area, angle) => ({
    hero: `Piano and specialist moves in ${area.name} from around £180 — trained crew and the right kit. Built for ${angle}.`,
    intro: [
      `Pianos and awkward heavy pieces in ${area.name} need more than a standard van booking. ${area.blurb}`,
      `We assess stairs, turns and landing strength before moving day. Tuned for ${angle}.`,
      `${area.access} Photos and make/model help us quote accurately.`,
    ],
    tip: `Measure stair width and tell us about tight ${area.name} landings before we send the specialist crew.`,
    faq: {
      q: `Do you move upright and grand pianos in ${area.name}?`,
      a: `Yes — with the right crew and protection. Access decides the method; we’ll say so before booking.`,
    },
  }),

  "vehicle-transport": (area, angle) => ({
    hero: `Vehicle transport in ${area.name} — cars and equipment moved safely with a fixed quote. Tuned for ${angle}.`,
    intro: [
      `Need a car or piece of kit relocated to or from ${area.name} without driving it yourself? ${area.blurb}`,
      `We arrange suitable loading and securing for the vehicle type. Ideal around ${angle}.`,
      `${area.access} Tell us if it runs, sits low or needs winching.`,
    ],
    tip: `Have keys and any alarms ready at both ${area.name} ends — it keeps loading windows short.`,
    faq: {
      q: `Can you move a non-running car in ${area.name}?`,
      a: `Often yes with winch or specialist loading. Flag seized brakes or low ride height when you enquire.`,
    },
  }),

  "motorbike-transport": (area, angle) => ({
    hero: `Motorbike transport in ${area.name} from around £80 — strapped, protected and delivered. Built for ${angle}.`,
    intro: [
      `Moving a bike across ${area.name} shouldn’t mean a risky trailer favour. ${area.blurb}`,
      `Proper strapping and wheel support, quoted from bike size and distance. Ideal around ${angle}.`,
      `${area.access} Non-runners need a heads-up so we send the right kit.`,
    ],
    tip: `Fold mirrors and remove soft luggage before pickup in ${area.name} when you can — safer loading.`,
    faq: {
      q: `How much is motorbike transport in ${area.name}?`,
      a: `From around £80 for a straightforward run. Distance, bike size and whether it starts affect the fixed quote.`,
    },
  }),

  "same-day-move": (area, angle) => ({
    hero: `Same-day moves in ${area.name} when keys land early or plans change — subject to crew capacity. Fast response around ${angle}.`,
    intro: [
      `When a ${area.name} completion jumps forward, you need capacity today. ${area.blurb}`,
      `Subject to availability we’ll match a crew, confirm a fixed price and move. Tuned for ${angle}.`,
      `${area.access} Message early with addresses and volume for the best chance of a slot.`,
    ],
    tip: `Same-day in ${area.name} is easiest mid-week mornings — Friday afternoons and peak Saturdays fill first.`,
    faq: {
      q: `Is same-day always available in ${area.name}?`,
      a: `It depends on crew capacity. Contact us early with both ${area.name} addresses — we’ll confirm within minutes.`,
    },
  }),

  "last-minute-removals": (area, angle) => ({
    hero: `Last-minute removals in ${area.name} — short-notice slots when dates suddenly change. Tuned for ${angle}.`,
    intro: [
      `Landlord moved the date or keys appeared early in ${area.name}? ${area.blurb}`,
      `We confirm a fixed price fast and turn up with the right van when capacity allows. Built around ${angle}.`,
      `${area.access} Mid-week is usually easier than peak Saturday.`,
    ],
    tip: `Send volume and floor count in the first ${area.name} message — we can say yes/no on capacity faster.`,
    faq: {
      q: `How last-minute can you book in ${area.name}?`,
      a: `Same-day and next-day are often possible mid-week. Message addresses and volume and we’ll confirm quickly.`,
    },
  }),

  "evening-and-weekend-moves": (area, angle) => ({
    hero: `Evening and weekend moves in ${area.name} — out-of-hours slots around work and key exchange. Ideal for ${angle}.`,
    intro: [
      `Not everyone in ${area.name} can move at 10am on a Tuesday. ${area.blurb}`,
      `Evening and weekend windows keep jobs around your diary, with clear out-of-hours pricing. Tuned for ${angle}.`,
      `${area.access} Tell us any quiet-hour or porter rules.`,
    ],
    tip: `Saturday mornings in ${area.name} book out first — mid-week evenings are often the flexible alternative.`,
    faq: {
      q: `Do evening moves cost more in ${area.name}?`,
      a: `Out-of-hours man & van guides from £60/hour. Full house/office jobs get a fixed quote that includes evening or weekend timing.`,
    },
  }),

  "international-moves": (area, angle) => ({
    hero: `International moves from ${area.name} — survey, export packing and door-to-door coordination. Tuned for ${angle}.`,
    intro: [
      `Leaving ${area.name} for overseas means packing standards and paperwork awareness, not just a big van. ${area.blurb}`,
      `We survey, agree road/sea/air options and keep one UK contact through collection. Ideal around ${angle}.`,
      `${area.access} Storage is available if flight and collection dates don’t match.`,
    ],
    tip: `Start your ${area.name} international survey early — inventories and packing days take planning.`,
    faq: {
      q: `Do you handle customs for moves from ${area.name}?`,
      a: `We guide you on typical personal-effects requirements and work with destination partners. Final declarations remain your responsibility.`,
    },
  }),

  "european-moves": (area, angle) => ({
    hero: `European road moves from ${area.name} — part-load or dedicated options with export-aware packing. Built for ${angle}.`,
    intro: [
      `Heading from ${area.name} to Europe by road is often faster than sea for household loads. ${area.blurb}`,
      `Survey, inventory and clear transit windows — one UK contact at the London end. Tuned for ${angle}.`,
      `${area.access} We’ll recommend part-load vs dedicated from your volume.`,
    ],
    tip: `Have passports and any residence docs ready early for ${area.name} European collections — paperwork checks save delays.`,
    faq: {
      q: `How long does a European move from ${area.name} take?`,
      a: `Often several days depending on country and part-load schedules. We’ll give a realistic window with your quote.`,
    },
  }),

  "end-of-tenancy-clean": (area, angle) => ({
    hero: `End of tenancy cleaning in ${area.name} from around £120 — checklist-style deep clean after you move out. Tuned for ${angle}.`,
    intro: [
      `Deposit day in ${area.name} shouldn’t hang on a missed oven shelf. ${area.blurb}`,
      `We clean to a professional check-out standard once the property is empty. Ideal around ${angle}.`,
      `${area.access} Combine with your removal so cleaning starts after the van leaves.`,
    ],
    tip: `Hand over keys only after the ${area.name} clean when you can — agents prefer an empty, finished flat.`,
    faq: {
      q: `Do you guarantee my ${area.name} deposit back?`,
      a: `No cleaner can legally guarantee a deposit — that’s the agent’s decision — but we clean to a professional end-of-tenancy standard.`,
    },
  }),

  "free-home-survey": (area, angle) => ({
    hero: `Free home survey in ${area.name} — no-obligation visit or video survey for an accurate fixed quote. Ideal for ${angle}.`,
    intro: [
      `Some ${area.name} moves are too complex to price from a form alone. ${area.blurb}`,
      `A surveyor checks inventory, stairs and parking, then you get a written quote with no pressure to book. Built around ${angle}.`,
      `${area.access} Completely free — no hidden survey fee.`,
    ],
    tip: `Have a rough inventory list ready for your ${area.name} survey — it keeps the visit short and the quote tight.`,
    faq: {
      q: `Is the home survey really free in ${area.name}?`,
      a: `Yes — no charge and no obligation. If you book, the survey quote is the one we work to.`,
    },
  }),
};

function angleFor(area: Area): string {
  return boroughAngle[area.slug] ?? area.blurb;
}

export function isPriorityCombo(boroughSlug: string, serviceSlug: string): boolean {
  return (
    (PRIORITY_BOROUGHS as readonly string[]).includes(boroughSlug) &&
    (PRIORITY_SERVICES as readonly string[]).includes(serviceSlug)
  );
}

/** Resolve combo copy for any borough × service (all 990). */
export function getComboCopy(area: Area, item: ServiceItem): ComboCopy {
  const builder = serviceBuilders[item.slug];
  const angle = angleFor(area);
  const priority = isPriorityCombo(area.slug, item.slug);

  if (builder) {
    return { ...builder(area, angle), priority };
  }

  // Safety fallback if a new service is added before a builder exists
  return {
    hero: `${item.desc} Book ${item.title.toLowerCase()} in ${area.name} with a clear quote and crews who know local access.`,
    intro: [
      `${area.blurb} When you book ${item.title.toLowerCase()} in ${area.name}, you get pricing for your addresses.`,
      `What we see on the ground: ${area.housing}`,
      `Access we plan for: ${area.access}`,
    ],
    tip: `Tell us where the van can stop in ${area.name} — we’ll build it into your quote.`,
    faq: {
      q: `Do you offer ${item.title.toLowerCase()} in ${area.name}?`,
      a: `Yes — across ${area.name} and every London borough. Guide price: ${item.price}.`,
    },
    priority,
  };
}

export function priorityComboCount(): number {
  return PRIORITY_BOROUGHS.length * PRIORITY_SERVICES.length;
}

/** Coverage snapshot for planning. */
export function contentCoverage() {
  const builderCount = Object.keys(serviceBuilders).length;
  const angleCount = Object.keys(boroughAngle).length;
  return {
    boroughAngles: angleCount,
    serviceBuilders: builderCount,
    fullMatrixCombos: angleCount * builderCount,
    priorityCombos: priorityComboCount(),
  };
}
