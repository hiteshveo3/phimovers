import Link from "next/link";
import SoftImage from "@/components/SoftImage";
import { Icon } from "@/components/icons";
import { WHATSAPP_HREF } from "@/lib/contact";

export type TocItem = { id: string; label: string };

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 pt-2 text-xl font-bold tracking-tight text-content md:text-2xl"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] leading-relaxed text-content/80">{children}</p>
  );
}

function Figure({
  seed,
  alt,
  caption,
}: {
  seed: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="my-2">
      <SoftImage
        src={`/blog/${seed}.jpg`}
        alt={alt}
        icon="box"
        className="aspect-[16/9] w-full rounded-2xl"
        imgClassName="aspect-[16/9] w-full rounded-2xl object-cover"
      />
      <figcaption className="mt-2 text-center text-xs text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

function Check({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 text-[15px] text-content/80">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5">
          <Icon
            name="check"
            className="mt-0.5 h-4 w-4 shrink-0 text-[#163300]"
            size={14}
            strokeWidth={2.4}
          />
          {t}
        </li>
      ))}
    </ul>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2.5 text-[15px] text-content/80">
      {items.map((t, i) => (
        <li key={t} className="flex items-start gap-3">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#9fe870] text-xs font-bold text-[#163300]">
            {i + 1}
          </span>
          {t}
        </li>
      ))}
    </ol>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-2 flex gap-4 rounded-2xl bg-cream p-5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#9fe870] text-[#163300]">
        <Icon name="quote" className="h-5 w-5" />
      </span>
      <p className="text-[15px] italic leading-relaxed text-content/80">
        {children}
      </p>
    </blockquote>
  );
}

function ArticleCta({
  title = "Ready to plan your move?",
  body = "WhatsApp a few photos and addresses — most replies within about one working hour.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="my-6 flex flex-col items-start justify-between gap-4 rounded-[24px] bg-[#9fe870] p-6 text-[#163300] sm:flex-row sm:items-center">
      <div>
        <p className="text-lg font-extrabold">{title}</p>
        <p className="mt-1 text-sm text-[#163300]/70">{body}</p>
      </div>
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="btn shrink-0 bg-[#163300] px-6 text-[#9fe870] hover:bg-[#0e2400]"
      >
        WhatsApp
        <Icon name="arrowRight" className="h-4 w-4" />
      </a>
    </div>
  );
}

function CostTable() {
  const head = ["", "Man & Van", "Full removal", "DIY van hire"];
  const rows: string[][] = [
    ["Best for", "Small loads / studios", "Flats & houses", "DIY with helpers"],
    ["Pricing", "From £50/hour (2hr min)", "Fixed quote", "Hire + fuel + time"],
    ["Loading help", "Included", "Included", "You / friends"],
    ["Surprises", "Time can overrun", "Price agreed first", "Parking / damage risk"],
  ];
  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-[#9fe870] text-[#163300]">
            {head.map((h) => (
              <th key={h || "k"} className="px-3 py-2.5 font-bold" scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r[0]} className={i % 2 ? "bg-cream" : "bg-surface"}>
              {r.map((c, j) => (
                <td
                  key={j}
                  className={
                    "border-t border-line px-3 py-2.5 " +
                    (j === 0 ? "font-semibold text-content" : "text-content/80")
                  }
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type Article = {
  toc: TocItem[];
  body: React.ReactNode;
};

const articles: Record<string, Article> = {
  "complete-guide-to-moving-home-in-london": {
    toc: [
      { id: "planning", label: "Planning your London move" },
      { id: "costs", label: "How much does a London move cost?" },
      { id: "van", label: "Choosing the right van & crew" },
      { id: "packing", label: "Packing tips that save time" },
      { id: "permits", label: "Parking & permits in London" },
      { id: "checklist", label: "Moving-day checklist" },
    ],
    body: (
      <>
        <P>
          Moving home in London comes with its own quirks — permit zones,
          congestion charges, narrow staircases and streets where a Luton van
          simply won&apos;t fit. This guide walks you through a smooth,
          fixed-price move across any of the 32 boroughs.
        </P>
        <H2 id="planning">Planning your London move</H2>
        <P>
          Start early. Weekend and month-end slots fill fast. Confirm your date
          one to two weeks ahead and declutter before you pack — every item you
          move costs money to move.
        </P>
        <H2 id="costs">How much does a London move cost?</H2>
        <P>
          Costs depend on home size, access and packing. Here&apos;s how common
          options compare — man &amp; van from £50/hour with a two-hour minimum,
          or a fixed quotation for full house and flat removals.
        </P>
        <CostTable />
        <P>
          For most one and two-bed flats, a fixed-price removal removes the
          guesswork — total agreed before the van arrives.
        </P>
        <H2 id="van">Choosing the right van &amp; crew</H2>
        <P>
          A small or transit van suits single items and studios; a Luton handles
          flats and houses. No lift and high floors? Add a helper — extra hands
          beat an extra hour on the clock.
        </P>
        <Figure
          seed="london-loading-van"
          alt="Movers loading furniture into a Luton removals van"
          caption="A Luton van comfortably fits a typical one to two-bed home."
        />
        <H2 id="packing">Packing tips that save time</H2>
        <Check
          items={[
            "Pack heavy items (books) in small boxes, light items in large ones.",
            "Label every box by room and mark fragile ones clearly.",
            "Keep screws in labelled bags taped to the furniture.",
            "Pack an essentials bag: chargers, documents, kettle, toiletries.",
          ]}
        />
        <Tip>
          Label boxes on the side, not the top — you can read them once
          they&apos;re stacked.
        </Tip>
        <H2 id="permits">Parking &amp; permits in London</H2>
        <P>
          Many boroughs need a suspended bay or visitor permit for a removals
          van. Sort both addresses a few working days ahead to avoid fines and
          waiting time.
        </P>
        <Figure
          seed="london-street-parking"
          alt="A London residential street with permit parking bays"
          caption="Check borough parking rules early — suspensions can take days to arrange."
        />
        <H2 id="checklist">Moving-day checklist</H2>
        <Steps
          items={[
            "Confirm van parking is clear at both addresses.",
            "Do a final sweep of cupboards, lofts and the garden.",
            "Take meter readings and photos of the empty rooms.",
            "Keep valuables and documents with you, not in the van.",
            "Check every room before the crew leaves the old place.",
          ]}
        />
        <ArticleCta />
        <P>
          Prefer a guided quote? See our{" "}
          <Link
            href="/services/house-removals"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            house removals
          </Link>{" "}
          and{" "}
          <Link
            href="/pricing"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            pricing
          </Link>{" "}
          pages.
        </P>
      </>
    ),
  },

  "how-to-pack-a-kitchen-like-a-pro": {
    toc: [
      { id: "order", label: "Pack in the right order" },
      { id: "glass", label: "Glass, plates and knives" },
      { id: "appliances", label: "Appliances" },
      { id: "labels", label: "Labelling that works" },
      { id: "help", label: "When to book packing help" },
    ],
    body: (
      <>
        <P>
          Kitchens break more moves than sofas. Plates chip, glasses crack, and
          knives migrate into soft bags. Here&apos;s a practical kitchen packing
          method London movers actually like to unload.
        </P>
        <H2 id="order">Pack in the right order</H2>
        <P>
          Start with rarely used kit — party platters, spare pans — a week out.
          Leave kettle, mugs, dishwasher tablets and a frying pan until the last
          morning. Empty and defrost the fridge the night before.
        </P>
        <H2 id="glass">Glass, plates and knives</H2>
        <Check
          items={[
            "Wrap glasses individually; stand them upright, never on their side.",
            "Plate stacks: paper between each, then wrap the stack as one block.",
            "Knives go in a blade guard or wrapped tightly and marked SHARP.",
            "Fill gaps with tea towels so nothing rattles in transit.",
          ]}
        />
        <Tip>
          Heavy crockery belongs in small boxes. A huge box of plates is how
          backs and bottoms fail.
        </Tip>
        <H2 id="appliances">Appliances</H2>
        <P>
          Disconnect washers carefully; tape hoses and doors shut. Fridges need
          time to settle upright after a move before you plug them back in —
          ask your crew if you&apos;re unsure.
        </P>
        <H2 id="labels">Labelling that works</H2>
        <P>
          Write KITCHEN + OPEN FIRST on the sides of essentials boxes. At the
          new place, those boxes go straight on the counter so you can make tea
          before the wardrobe mountain appears.
        </P>
        <H2 id="help">When to book packing help</H2>
        <P>
          Short on time? Our{" "}
          <Link
            href="/services/fragile-only-packing"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            fragile-only packing
          </Link>{" "}
          focuses on kitchens and glassware, or book{" "}
          <Link
            href="/services/full-packing-service"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            full packing
          </Link>{" "}
          for the whole home. Materials kits start from £50.
        </P>
        <ArticleCta title="Need kitchen packing help?" />
      </>
    ),
  },

  "moving-in-london-parking-and-permits": {
    toc: [
      { id: "why", label: "Why parking matters" },
      { id: "suspension", label: "Bay suspensions" },
      { id: "ulez", label: "ULEZ & Congestion Charge" },
      { id: "buildings", label: "Flats and porters" },
      { id: "checklist", label: "Parking checklist" },
    ],
    body: (
      <>
        <P>
          A perfect crew still loses an hour if the van can&apos;t stop near the
          door. London parking rules vary by borough — plan both addresses before
          moving day.
        </P>
        <H2 id="why">Why parking matters</H2>
        <P>
          Every extra metre of carry adds time. On hourly man &amp; van that
          costs money; on fixed quotes we still need a realistic plan so the day
          stays calm.
        </P>
        <H2 id="suspension">Bay suspensions</H2>
        <P>
          Many controlled streets need a suspended bay for a Luton. Apply a few
          working days ahead via your borough. If you&apos;re unsure whether your
          road needs one, ask us when you enquire — we see the same streets
          weekly.
        </P>
        <Figure
          seed="london-street-parking"
          alt="London permit parking street"
          caption="Suspended bays keep the van close and the carry short."
        />
        <H2 id="ulez">ULEZ &amp; Congestion Charge</H2>
        <P>
          Routes through charging zones can add cost. We plan west and central
          London jobs with this in mind and keep relevant charges transparent in
          your quote when they apply.
        </P>
        <H2 id="buildings">Flats and porters</H2>
        <P>
          Mansion blocks may need lift bookings, loading-bay slots and porter
          notice. Share building rules early so the crew arrives in the right
          window.
        </P>
        <H2 id="checklist">Parking checklist</H2>
        <Steps
          items={[
            "Photo both kerbs / drives and send them with your enquiry.",
            "Check resident bay rules at pickup and delivery.",
            "Apply for suspensions if the borough requires them.",
            "Book goods lifts the same day as the crew.",
            "Have a backup stop 20m away if a car blocks the bay.",
          ]}
        />
        <ArticleCta title="Not sure what your street needs?" />
      </>
    ),
  },

  "man-and-van-vs-full-removal": {
    toc: [
      { id: "hourly", label: "When man & van wins" },
      { id: "fixed", label: "When a fixed removal wins" },
      { id: "compare", label: "Quick comparison" },
      { id: "pick", label: "How to choose in 60 seconds" },
    ],
    body: (
      <>
        <P>
          Both get your things across London — they price risk differently. Man
          &amp; van is flexible time; a full removal is a fixed job price for a
          defined inventory.
        </P>
        <H2 id="hourly">When man &amp; van wins</H2>
        <Check
          items={[
            "Studio or single-room loads",
            "Marketplace sofa / single item runs",
            "You can help carry and want a lower entry price",
            "Volume is unclear and you prefer hourly honesty",
          ]}
        />
        <P>
          Our man &amp; van starts from £50/hour with a two-hour minimum (from
          £100). Loading help is included.
        </P>
        <H2 id="fixed">When a fixed removal wins</H2>
        <Check
          items={[
            "One or two-bed flats and family houses",
            "You want the total before moving day",
            "Stairs, packing or multiple trips would blow an hourly clock",
            "You’d rather not watch the timer",
          ]}
        />
        <H2 id="compare">Quick comparison</H2>
        <CostTable />
        <H2 id="pick">How to choose in 60 seconds</H2>
        <Tip>
          If the load fits in a few photos and under two hours of work, start
          with man &amp; van. If you&apos;re listing rooms, ask for a fixed
          quote.
        </Tip>
        <P>
          See{" "}
          <Link
            href="/services/man-and-van"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            man &amp; van
          </Link>{" "}
          and{" "}
          <Link
            href="/services/house-removals"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            house removals
          </Link>{" "}
          — or WhatsApp photos and we&apos;ll recommend which is cheaper for
          your addresses.
        </P>
        <ArticleCta title="Send photos — we’ll recommend the pricing" />
      </>
    ),
  },

  "studio-flat-move-checklist": {
    toc: [
      { id: "two-weeks", label: "Two weeks out" },
      { id: "week", label: "One week out" },
      { id: "day-before", label: "Day before" },
      { id: "day", label: "Moving day" },
      { id: "after", label: "After you arrive" },
    ],
    body: (
      <>
        <P>
          Studio moves are small but easy to underestimate — mattress turns,
          sofa legs, and shared-hallway rules. Use this checklist so nothing
          slips.
        </P>
        <H2 id="two-weeks">Two weeks out</H2>
        <Check
          items={[
            "Book your slot (weekends fill first).",
            "Measure sofa and mattress vs the stairwell.",
            "Declutter — storage unit if dates don’t line up.",
            "Order boxes or a materials kit (from £50).",
          ]}
        />
        <H2 id="week">One week out</H2>
        <Check
          items={[
            "Confirm parking / lift booking at both ends.",
            "Pack non-essentials; leave a week of clothes out.",
            "Tell building management the crew window.",
            "Change address on bills and council tax.",
          ]}
        />
        <H2 id="day-before">Day before</H2>
        <Check
          items={[
            "Defrost fridge; empty bins.",
            "Bag essentials bag (chargers, keys, meds, kettle).",
            "Photograph meter readings.",
            "Charge phone; save the crew contact.",
          ]}
        />
        <H2 id="day">Moving day</H2>
        <Steps
          items={[
            "Clear the path to the door before the van arrives.",
            "Protect floors if the building requires it.",
            "Load room by room — sofa and mattress last out / first in often helps.",
            "Final sweep: cupboards, bathroom cabinet, balcony.",
          ]}
        />
        <H2 id="after">After you arrive</H2>
        <P>
          Place bed and kettle first. Check for damage before the crew leaves.
          Studio moves in London often guide from around £199 as a fixed job —
          or hourly man &amp; van if the load is tiny. See{" "}
          <Link
            href="/services/studio-moves"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            studio moves
          </Link>
          .
        </P>
        <ArticleCta title="Booking a studio move?" />
      </>
    ),
  },

  "self-storage-guide-london": {
    toc: [
      { id: "when", label: "When storage helps" },
      { id: "size", label: "What size unit?" },
      { id: "pack", label: "How to pack a unit" },
      { id: "cost", label: "Costs & access" },
      { id: "combo", label: "Combine with a move" },
    ],
    body: (
      <>
        <P>
          London completions rarely line up perfectly. A clean, monitored unit
          bridges the gap without stuffing a mate&apos;s spare room.
        </P>
        <H2 id="when">When storage helps</H2>
        <Check
          items={[
            "Gap between move-out and move-in",
            "Renovation dust and paint weeks",
            "Downsizing before a smaller flat",
            "International move waiting on a sailing date",
          ]}
        />
        <H2 id="size">What size unit?</H2>
        <P>
          A studio often fits a small unit; a one-bed needs more height for
          mattresses and sofas stood carefully. We&apos;ll recommend size after a
          quick inventory chat — better slightly roomy than crushed.
        </P>
        <H2 id="pack">How to pack a unit</H2>
        <Steps
          items={[
            "Heavy boxes at the bottom; fragile up high.",
            "Leave an aisle so you can reach winter clothes mid-lease.",
            "Photograph valuable items as you load.",
            "Use sealed boxes — open bags invite dust.",
          ]}
        />
        <H2 id="cost">Costs &amp; access</H2>
        <P>
          Storage guides from around £15 per week depending on volume. Access is
          by arrangement — give notice when you need to pull items mid-stay.
        </P>
        <H2 id="combo">Combine with a move</H2>
        <P>
          We can collect from your old address, store, then deliver when keys
          appear — one team, fewer van hires. See{" "}
          <Link
            href="/services/secure-storage"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            secure storage
          </Link>
          .
        </P>
        <ArticleCta title="Need storage between keys?" />
      </>
    ),
  },

  "sofa-delivery-narrow-stairs-london": {
    toc: [
      { id: "measure", label: "Measure before you buy" },
      { id: "stairs", label: "Tight London stairs" },
      { id: "legs", label: "Legs, corners and modules" },
      { id: "cost", label: "What sofa delivery costs" },
      { id: "day", label: "Delivery day tips" },
    ],
    body: (
      <>
        <P>
          Marketplace sofas and showroom finds fail more often on the staircase
          than on the van. Here&apos;s how to get a sofa into a London flat
          without scrapes — or surprises on the day.
        </P>
        <H2 id="measure">Measure before you buy</H2>
        <Check
          items={[
            "Stair width at the narrowest turn",
            "Landing depth and ceiling height on the turn",
            "Doorway and hallway widths to the living room",
            "Lift size if you have one (and booking rules)",
          ]}
        />
        <H2 id="stairs">Tight London stairs</H2>
        <P>
          We carry sofas by hand — no crane. Photos of the sofa and stairwell
          let us say yes, or flag a problem, before you pay a deposit. Extreme
          corkscrew stairs sometimes need legs off or a modular split.
        </P>
        <H2 id="legs">Legs, corners and modules</H2>
        <P>
          Removable legs and corner sections turn impossible into awkward-but-doable.
          Tell us the make if you know it; send a photo of the underside fixings.
        </P>
        <H2 id="cost">What sofa delivery costs</H2>
        <P>
          Dedicated sofa delivery starts from £55 once size, floors and distance
          are known — separate from hourly man &amp; van (from £50/hour, two-hour
          minimum). See{" "}
          <Link
            href="/services/sofa-delivery"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            sofa delivery
          </Link>
          .
        </P>
        <H2 id="day">Delivery day tips</H2>
        <Steps
          items={[
            "Clear the hallway and protect sharp corners.",
            "Confirm the seller is ready before the crew sets off.",
            "Have parking sorted within a short carry.",
            "Decide the final room position before we lift upstairs.",
          ]}
        />
        <ArticleCta
          title="Got sofa + stair photos?"
          body="WhatsApp them with both postcodes — we’ll quote a fixed sofa run."
        />
      </>
    ),
  },

  "evening-weekend-moves-london": {
    toc: [
      { id: "why", label: "Why out-of-hours helps" },
      { id: "cost", label: "What it costs" },
      { id: "buildings", label: "Building quiet hours" },
      { id: "book", label: "How to book" },
    ],
    body: (
      <>
        <P>
          Not everyone can move at 10am on a Tuesday. Evening and weekend slots
          fit key exchanges, office cutovers and lives that don&apos;t pause for
          a van.
        </P>
        <H2 id="why">Why out-of-hours helps</H2>
        <Check
          items={[
            "Less daytime traffic on some routes",
            "Parking windows after rush hour",
            "Shops and offices can move overnight",
            "You keep your annual leave",
          ]}
        />
        <H2 id="cost">What it costs</H2>
        <P>
          Evening and weekend man &amp; van guides from £60/hour with a clear
          minimum. Full house or office jobs get a fixed quote that includes
          out-of-hours timing. Daytime rates may be lower if your diary allows.
        </P>
        <H2 id="buildings">Building quiet hours</H2>
        <P>
          Some mansion blocks ban late noise. Tell us porter rules and we&apos;ll
          finish inside the allowed window — or suggest a Saturday morning
          instead.
        </P>
        <H2 id="book">How to book</H2>
        <P>
          Saturdays book out first. Mid-week evenings are often the flexible
          option. Details:{" "}
          <Link
            href="/services/evening-and-weekend-moves"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            evening &amp; weekend moves
          </Link>
          .
        </P>
        <ArticleCta title="Need an evening or Saturday slot?" />
      </>
    ),
  },

  "same-day-removals-london": {
    toc: [
      { id: "when", label: "When same-day works" },
      { id: "need", label: "What we need from you" },
      { id: "cost", label: "Pricing" },
      { id: "limits", label: "Honest limits" },
    ],
    body: (
      <>
        <P>
          Keys appeared early, a seller pushed completion, or the marketplace
          sofa won&apos;t wait. Same-day capacity is real — and limited.
        </P>
        <H2 id="when">When same-day works</H2>
        <P>
          Mid-week mornings are easiest. Late Friday and peak Saturday fill
          first. Message as early as you can with both addresses and volume.
        </P>
        <H2 id="need">What we need from you</H2>
        <Check
          items={[
            "Pickup and delivery postcodes",
            "Floors / lift / stairs notes",
            "Photos of the main items",
            "A contact who can open both doors",
          ]}
        />
        <H2 id="cost">Pricing</H2>
        <P>
          You still get a clear fixed price before we dispatch. Short-notice can
          add a modest uplift depending on demand — always shown before you
          confirm. No surprise fee on the doorstep.
        </P>
        <H2 id="limits">Honest limits</H2>
        <P>
          If we&apos;re full we&apos;ll say so and offer the soonest alternative —
          often first thing next morning. See{" "}
          <Link
            href="/services/same-day-move"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            same-day move
          </Link>{" "}
          and{" "}
          <Link
            href="/services/last-minute-removals"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            last-minute removals
          </Link>
          .
        </P>
        <ArticleCta title="Need a van today?" body="WhatsApp now — we’ll confirm capacity within minutes." />
      </>
    ),
  },

  "prepare-for-flat-move-london": {
    toc: [
      { id: "access", label: "Access photos" },
      { id: "inventory", label: "Simple inventory" },
      { id: "building", label: "Building rules" },
      { id: "day", label: "Day-of habits" },
    ],
    body: (
      <>
        <P>
          Flat moves in London succeed or stall on access. A little prep gets you
          a tighter fixed quote and a calmer day.
        </P>
        <H2 id="access">Access photos</H2>
        <Check
          items={[
            "Stairwell from top and bottom",
            "Tightest turn on the landing",
            "Lift doors (if any)",
            "Where the van can actually stop",
          ]}
        />
        <H2 id="inventory">Simple inventory</H2>
        <P>
          List rooms and big pieces — sofa, beds, wardrobe, white goods. You
          don&apos;t need a spreadsheet; a voice note and photos are enough for
          most one and two-beds.
        </P>
        <H2 id="building">Building rules</H2>
        <P>
          Book goods lifts, warn neighbours, and check quiet hours. Walk-ups need
          honest floor counts so we send enough people.
        </P>
        <H2 id="day">Day-of habits</H2>
        <Steps
          items={[
            "Clear hallways before the crew rings the buzzer.",
            "Protect shared carpets if the freeholder requires it.",
            "Keep the kettle accessible.",
            "Do a cupboard sweep before you hand keys back.",
          ]}
        />
        <P>
          Guides for smaller flats start from around £249 as a fixed quote —
          details on{" "}
          <Link
            href="/services/flat-removals"
            className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2"
          >
            flat removals
          </Link>
          .
        </P>
        <ArticleCta title="Planning a flat move?" />
      </>
    ),
  },
};

export function getArticle(slug: string): Article | undefined {
  return articles[slug];
}
