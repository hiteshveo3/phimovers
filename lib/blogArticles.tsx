import type { ReactNode } from "react";
import { LIME, MUTED, Photo, card, h3Style } from "../kit/components/DcPage";

export type TocItem = { id: string; label: string };

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="dc-text" style={{ scrollMarginTop: 100 }}>
      {children}
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="dc-text">{children}</p>;
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
    <figure style={{ margin: "0 0 22px" }}>
      <div style={{ aspectRatio: "16/9", borderRadius: 20, border: "1px solid rgba(15,26,9,.14)", overflow: "hidden", background: "#e9e8e2" }}>
        <Photo src={`/blog/${seed}.jpg`} alt={alt} />
      </div>
      <figcaption style={{ marginTop: 8, textAlign: "center", fontSize: 13, color: "rgba(15,26,9,.6)" }}>
        {caption}
      </figcaption>
    </figure>
  );
}

function Check({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((t) => (
        <li key={t} className="dc-text">
          {t}
        </li>
      ))}
    </ul>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol style={{ margin: "0 0 18px", paddingLeft: 22 }}>
      {items.map((t) => (
        <li key={t} className="dc-text">
          {t}
        </li>
      ))}
    </ol>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <blockquote style={{ background: LIME, borderRadius: 18, padding: "20px 24px", margin: "0 0 22px" }}>
      <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, fontStyle: "italic", color: "#0f1a09" }}>
        {children}
      </p>
    </blockquote>
  );
}

function ArticleCta({
  title = "Ready to plan your move?",
  body = "Call us or send a quote request with your addresses — most replies within about one working hour.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div style={{ ...card(false, 24), margin: "30px 0", display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ minWidth: 220, flex: 1 }}>
        <p style={h3Style(21, "0 0 6px")}>{title}</p>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: MUTED }}>{body}</p>
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <a href="/contact#quote" className="dc-btn dc-btn-lime dc-btn-mark" style={{ fontSize: 15, padding: "13px 20px" }}>
          Get a quote
        </a>
      </div>
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
    <div className="dc-table-wrap">
      <table className="dc-table">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h || "k"} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, j) => (
                <td key={j} style={j === 0 ? { fontWeight: 600 } : undefined}>
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

function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="dc-table-wrap">
      <table className="dc-table">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={h || `k${i}`} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, j) => (
                <td key={j} style={j === 0 ? { fontWeight: 600 } : undefined}>
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

function Q({ children }: { children: ReactNode }) {
  return (
    <h3 className="dc-text" style={h3Style(19, "22px 0 8px")}>
      {children}
    </h3>
  );
}

export type Article = {
  toc: TocItem[];
  body: React.ReactNode;
};

const articles: Record<string, Article> = {
  "how-much-does-it-cost-to-move-house-uk": {
    toc: [
      { id: "average", label: "Average cost of moving house in the UK" },
      { id: "by-size", label: "Removals prices by property size" },
      { id: "van", label: "Moving van cost: man & van vs removals" },
      { id: "packing-storage", label: "Packing and storage costs" },
      { id: "extras", label: "Specialist items, piano removal cost & extras" },
      { id: "legal", label: "The other costs of moving house" },
      { id: "examples", label: "Worked examples: three typical moves" },
      { id: "save", label: "Ways to cut the cost of moving home" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          How much does it cost to move house? It’s usually the first question
          people ask us — and the honest answer is “it depends”, but not in a
          vague way. The cost of moving home comes down to a handful of things
          you can measure: how much you own, how far it’s going, how easy the
          access is at each end, and how much of the work you want done for
          you. This guide breaks down the typical costs to move house in the
          UK, shows our own London removals prices by property size, and
          explains the extras — from packing and storage to stamp duty — that
          make up the real total.
        </P>
        <P>
          A quick note before the numbers: UK-wide figures below are typical
          ranges, not quotes. Prices vary by region, season and company. The
          Phi Movers prices you’ll see are our own published London starting
          prices, covering all 32 boroughs.
        </P>
        <H2 id="average">Average cost of moving house in the UK</H2>
        <P>
          Across the UK, the removals part of a move typically lands somewhere
          between a few hundred pounds for a studio or small flat and roughly
          £1,000–£2,000 or more for a larger family house, especially over
          longer distances. Small local man &amp; van jobs can come in under
          £200; a four or five-bed house moving across the country with full
          packing can run well beyond £2,500.
        </P>
        <P>
          The removals bill is only one part of the costs of moving house. If
          you’re buying, legal fees, surveys and stamp duty usually dwarf it.
          If you’re renting, the bigger costs tend to be deposits, the first
          month’s rent and an end-of-tenancy clean on the way out. We cover
          those further down.
        </P>
        <P>
          Region makes a difference too. London and the South East are
          generally the most expensive places to move, partly because of
          traffic, parking restrictions and the number of flats with stairs
          and no lift. Moves in smaller towns tend to be cheaper per hour, but
          longer distances between addresses can even things out. Whatever
          the region, the same factors decide your price:
        </P>
        <Check
          items={[
            "Volume: the number of rooms and big pieces is the biggest single driver.",
            "Distance: local moves are priced on time; long-distance moves on time, fuel and mileage.",
            "Access: stairs without a lift, long carries and restricted parking all add time.",
            "Service level: loading only, or packing, dismantling and storage too.",
            "Timing: Fridays, weekends and month-end dates are in highest demand.",
          ]}
        />
        <H2 id="by-size">Removals prices by property size</H2>
        <P>
          For anything bigger than a few items, most removal companies quote a
          fixed price based on your inventory. Here are our London starting
          prices, which include the van, the crew, loading, transport and
          unloading — plus goods-in-transit and public liability insurance.
        </P>
        <DataTable
          head={["Property size", "Phi Movers London (from)", "Typical crew & van", "Typical UK range (local move)"]}
          rows={[
            ["Studio flat", "£249", "2 movers, medium/Luton van", "Approx. £200–£400"],
            ["1-bed flat", "£329", "2 movers, Luton van", "Approx. £300–£600"],
            ["2-bed house or flat", "£499", "2–3 movers, Luton van", "Approx. £500–£900"],
            ["3-bed house", "£749", "3 movers, 1–2 Lutons", "Approx. £700–£1,400"],
            ["4-bed house or larger", "£999", "3–4 movers, 2 Lutons", "Approx. £1,000–£2,000+"],
          ]}
        />
        <P>
          “From” prices assume reasonable access and a typical amount of
          furniture for that size of home. A third-floor walk-up, a garage full
          of tools or a loft that hasn’t been cleared in a decade will push the
          figure up — which is exactly why we offer a free home survey (in
          person or by video) before we fix the price.
        </P>
        <P>
          Distance matters less than people think for local moves — most of
          the time on a London job is spent carrying, not driving. For
          long-distance removals, such as London to Manchester or Edinburgh,
          expect the price to rise with fuel, driver hours and sometimes an
          overnight stay. Those moves are quoted individually, but the same
          principle applies: the more accurate your inventory, the more
          accurate the price.
        </P>
        <P>
          When you compare removals prices, check what each quote actually
          includes. A lower figure that leaves out insurance, dismantling or a
          third mover on a walk-up isn’t really cheaper. With a fixed quote
          you should know, in writing, the crew size, the vehicle, the date,
          what’s covered and what would change the price.
        </P>
        <Figure
          seed="complete-guide-to-moving-home-in-london"
          alt="Removals crew carrying boxes from a London terraced house to a van"
          caption="Fixed-price removals are quoted from your inventory, so the total is agreed before moving day."
        />
        <H2 id="van">Moving van cost: man &amp; van vs removals</H2>
        <P>
          If you’re wondering how much for removals versus a simple van, the
          difference is mostly about who carries the risk of time running over.
          A man &amp; van is charged by the hour; a full removal is a fixed job
          price.
        </P>
        <P>
          Our{" "}
          <a href="/services/man-and-van">
            man &amp; van
          </a>{" "}
          service starts from £50/hour with a two-hour minimum, billed in
          30-minute blocks after that, with the first 10 miles included. An
          extra helper is £20/hour. That makes it the cheapest option for
          studios, single rooms and smaller loads where you can help — and a
          less obvious choice for a full house, where an hourly clock can
          overtake a fixed quote.
        </P>
        <CostTable />
        <P>
          DIY van hire looks cheapest on paper, but remember to add fuel,
          insurance excess, parking, your own time and the risk of injury or
          damage. For many people, a two-hour man &amp; van job costs little
          more than a day’s hire once everything is added up. We compare the
          two in more detail in{" "}
          <a href="/blog/man-and-van-vs-full-removal">
            man &amp; van vs full removal
          </a>
          .
        </P>
        <P>
          As a worked example: a one-bed flat move that takes three and a half
          hours with two people on our man &amp; van would be 3.5 hours at
          £50/hour plus 3.5 hours for the extra helper at £20/hour — around
          £245. A fixed one-bed removal starts from £329 and won’t go up if a
          lift breaks or the stairs take longer than expected. Which is better
          depends on how confident you are about the time.
        </P>
        <H2 id="packing-storage">Packing and storage costs</H2>
        <P>
          Packing is where moves lose the most time. Even a well-organised
          two-bed can need 40–60 boxes, and doing it yourself over several
          evenings is fine — but it isn’t free once you count materials.
        </P>
        <Check
          items={[
            "Packing materials kit: from £50 (boxes, tape, paper and wrap).",
            "Fragile-only packing: from £80 — kitchens, glassware, pictures and mirrors.",
            "Full packing service: from £150 — we pack the whole home the day before or the morning of the move.",
            "Storage: from £15/week or £55/month for clean, secure storage between properties.",
          ]}
        />
        <P>
          Storage matters when completion dates don’t line up, which happens
          more often than anyone would like. Rather than hire two vans and pay
          twice, we can collect, store and deliver when your keys arrive. See{" "}
          <a href="/services/secure-storage">
            secure storage
          </a>{" "}
          or our guide to{" "}
          <a href="/blog/storage-costs-london-uk">
            storage costs per month
          </a>
          .
        </P>
        <H2 id="extras">Specialist items, piano removal cost &amp; extras</H2>
        <P>
          Some items need extra people, equipment or vehicles. They’re worth
          mentioning at the quote stage so nothing is a surprise on the day.
        </P>
        <DataTable
          head={["Extra", "Phi Movers London (from)", "Notes"]}
          rows={[
            ["Piano & specialist items", "£180", "Uprights, safes, large mirrors and artwork"],
            ["Single item / furniture delivery", "£50", "Marketplace finds and shop collections"],
            ["Same-day move", "£70", "Subject to crew and van availability"],
            ["Motorbike transport", "£80", "Secured in the van with straps"],
            ["End of tenancy clean", "£120", "Useful for deposit returns"],
            ["Vehicle transport / international", "Custom quote", "Priced on route and vehicle"],
          ]}
        />
        <P>
          Piano removal cost varies most of all: a small upright on the ground
          floor is a straightforward job; a baby grand up two flights needs
          more hands, skids and careful planning. Photos of the piano and the
          stairs let us quote properly — see{" "}
          <a href="/services/piano-and-specialist">
            piano &amp; specialist moves
          </a>
          .
        </P>
        <P>
          London-specific extras can include parking bay suspensions (set by
          each borough), Congestion Charge and ULEZ where routes pass through
          them. We flag these in your quote when they apply.
        </P>
        <H2 id="legal">The other costs of moving house</H2>
        <P>
          If you’re buying, the removals bill is usually the smaller part of
          the costs to move house. These are the main ones to budget for —
          figures are broad, typical ranges and will depend on your purchase
          price and circumstances.
        </P>
        <Check
          items={[
            "Stamp duty (SDLT) in England and Northern Ireland: set by price bands and buyer status — use the GOV.UK calculator for your figure.",
            "Conveyancing: commonly around £1,000–£2,000 including searches, depending on price and complexity.",
            "Survey: from a few hundred pounds for a basic report to £1,000 or more for a full building survey.",
            "Estate agent fees when selling: often around 1–3% plus VAT.",
            "Mortgage fees, if applicable: arrangement and valuation fees vary by lender.",
            "Renters: holding deposit, tenancy deposit and an end-of-tenancy clean.",
          ]}
        />
        <Tip>
          Ask your conveyancer for a written estimate early. Removals are easy
          to price — the legal side is what usually catches people out.
        </Tip>
        <H2 id="examples">Worked examples: three typical moves</H2>
        <P>
          Headline prices are useful, but it helps to see how a real budget
          comes together. These three examples use our published London
          starting prices and assume reasonable access. They’re illustrations,
          not quotes — your own figure depends on your inventory and
          addresses.
        </P>
        <DataTable
          head={["Move", "Service chosen", "Removals budget (from)", "What drives it up"]}
          rows={[
            ["Renter, studio in Hackney to Walthamstow", "Man & van, 3 hours, driver + helper", "Around £210", "Stairs, no parking, unpacked boxes"],
            ["Couple, 1-bed flat to 2-bed flat", "Fixed 1-bed removal + fragile packing", "£329 + £80", "Third-floor walk-up, large wardrobe"],
            ["Family, 3-bed house with a gap between keys", "Fixed 3-bed removal + full packing + storage", "£749 + £150 + storage from £55/month", "Loft, garage, number of weeks stored"],
          ]}
        />
        <P>
          The studio example shows why hourly pricing suits small moves: three
          hours at £50/hour plus a helper at £20/hour comes to around £210,
          comfortably under the fixed studio price — as long as everything is
          packed and the van can park outside. Add an hour of searching for
          parking or packing on the day and the gap narrows quickly.
        </P>
        <P>
          The one-bed example is the most common job we quote. Most couples pack
          their own clothes, books and bedding over a couple of weekends and
          hand the kitchen to us, because glassware and crockery are slow to
          wrap well and the most likely things to break. That keeps the total
          predictable without paying for full packing.
        </P>
        <P>
          The family example is where costs genuinely stack up, and it’s also
          where planning saves the most. The storage element depends entirely
          on how long the gap lasts, so it’s worth asking your solicitor for a
          realistic completion window before you commit to a unit size.
          Storing only what you won’t need for a few weeks — not the whole
          house — can bring the monthly figure right down.
        </P>
        <P>
          What we see on real jobs is that the final bill rarely changes
          because of distance. It changes because of things nobody mentioned
          at quote stage: a loft that needs emptying, a garden shed, a sofa
          that won’t go round the landing or a lift that turns out to be out of
          service. A five-minute walk round with your phone camera before you
          ask for quotes is the cheapest insurance against all of them.
        </P>
        <H2 id="save">Ways to cut the cost of moving home</H2>
        <Steps
          items={[
            "Declutter before you get quotes — every wardrobe you sell is one you don’t pay to move.",
            "Move mid-week or mid-month if your dates allow; demand is lower than on Fridays and weekends.",
            "Pack the easy rooms yourself and book fragile-only packing for the kitchen.",
            "Measure big pieces against stairwells so nothing gets stuck and wastes crew time.",
            "Sort parking at both addresses so the van can stop close to the door.",
            "Get a fixed quote for anything bigger than a studio — it caps your risk.",
            "Send clear photos or book the free home survey so the quote is accurate first time.",
          ]}
        />
        <P>
          The biggest savings almost always come from the first step. People
          are often surprised by how much of a move is made up of things they
          no longer use — old bed frames, spare chairs, boxes from the last
          move that were never unpacked. Selling, donating or recycling them
          before you get quotes can bring the job down a whole size band.
        </P>
        <P>
          Be wary of saving money in the wrong places, though. Uninsured
          operators, vague “estimates” and cash-only deals can cost far more
          if something gets damaged or the crew doesn’t turn up. A fixed price
          from an insured company is the safest way to keep the cost of moving
          home predictable.
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>How much does it cost to move house in the UK on average?</Q>
        <P>
          For removals alone, typically a few hundred pounds for a small flat
          and roughly £1,000–£2,000 or more for a large house. Buyers should
          budget separately for legal fees, surveys and stamp duty.
        </P>
        <Q>How much does it cost to move a 3-bed house?</Q>
        <P>
          In the UK a local 3-bed move typically costs roughly £700–£1,400 for
          removals alone, more with packing or long distances. Our London
          3-bed moves start from £749 as a fixed price.
        </P>
        <Q>Is man &amp; van cheaper than a removal company?</Q>
        <P>
          For small loads, usually yes. Our man &amp; van is from £50/hour with
          a two-hour minimum. For a full flat or house, a fixed removals quote
          is often similar or cheaper once you factor in stairs and packing.
        </P>
        <Q>How much is a piano removal?</Q>
        <P>
          Our piano and specialist item moves start from £180 in London. The
          final price depends on the type of piano, floors and access.
        </P>
        <Q>Do your prices include insurance?</Q>
        <P>
          Yes. Every Phi Movers job includes goods-in-transit and public
          liability cover, and quotes are fixed before moving day.
        </P>
        <ArticleCta
          title="Want an exact figure for your move?"
          body="Send your addresses and a rough inventory — we’ll come back with a fixed price, usually within about one working hour."
        />
        <P>
          Prefer to talk it through? <a href="/contact">Contact us</a> or see
          our{" "}
          <a href="/services/house-removals">
            house removals
          </a>{" "}
          page for what’s included.
        </P>
      </>
    ),
  },

  "how-long-does-it-take-to-move-house": {
    toc: [
      { id: "overview", label: "How long to move house: the short answer" },
      { id: "buying", label: "Buying and selling: the full timeline" },
      { id: "renting", label: "Moving between rentals" },
      { id: "moving-day", label: "How long does a house move take on the day?" },
      { id: "hour-by-hour", label: "A 2-bed moving day, hour by hour" },
      { id: "factors", label: "What slows a move down" },
      { id: "faster", label: "How to move faster" },
      { id: "countdown", label: "A moving-week countdown" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          How long does it take to move house? There are really two answers.
          The whole process — from accepting an offer to getting the keys —
          usually takes a few months in the UK. The physical move itself, on
          the day, takes anywhere from a couple of hours for a studio to a full
          day (sometimes two) for a large family home. This guide covers both,
          so you can plan your notice periods, book the van at the right time
          and set realistic expectations for moving day.
        </P>
        <H2 id="overview">How long to move house: the short answer</H2>
        <Check
          items={[
            "Buying or selling a home in the UK: typically around 12–20 weeks from offer accepted to completion.",
            "Cash buyer with no chain: can be quicker — often 6–10 weeks.",
            "Moving between rented homes: commonly 4–8 weeks, driven by notice periods.",
            "Moving day: from about 2–3 hours for a studio to 8–10+ hours for a 4-bed house.",
          ]}
        />
        <P>
          These are approximate averages. Chains, mortgage delays and
          leasehold paperwork can stretch them; a simple, chain-free purchase
          can shorten them.
        </P>
        <H2 id="buying">Buying and selling: the full timeline</H2>
        <P>
          The average time to move house in the UK when you’re buying is
          usually quoted at three to four months. Here’s roughly how it
          breaks down.
        </P>
        <DataTable
          head={["Stage", "Typical time", "What happens"]}
          rows={[
            ["Finding a property & offer", "Varies", "Viewings, offer accepted, solicitor instructed"],
            ["Mortgage & survey", "2–4 weeks", "Valuation, mortgage offer, building survey"],
            ["Conveyancing & searches", "6–12 weeks", "Local searches, enquiries, contract checks"],
            ["Exchange of contracts", "1 day", "The move becomes legally binding; date is set"],
            ["Exchange to completion", "1–4 weeks", "Book removals, pack, final arrangements"],
            ["Completion & moving day", "1 day", "Funds transfer, keys released, you move in"],
          ]}
        />
        <P>
          Leasehold flats — very common in London — often take longer, because
          the solicitor needs management pack information from the freeholder
          or managing agent. If you’re in a chain, the whole chain moves at the
          pace of its slowest link.
        </P>
        <P>
          Conveyancing is where most of the waiting happens. Local authority
          searches can take anything from a few days to several weeks
          depending on the council, and your solicitor will raise enquiries
          with the seller’s side about boundaries, guarantees, planning and —
          for flats — service charges and lease terms. Each round of questions
          and answers adds time, so replying quickly to your own solicitor
          really does help.
        </P>
        <P>
          Once contracts are exchanged, the completion date is fixed and
          legally binding. A gap of one to two weeks between exchange and
          completion is common, though some buyers exchange and complete on
          the same day. That shorter window is the main reason to have
          removals quotes lined up early: you may only have a few days to
          confirm the van.
        </P>
        <Tip>
          Get provisional removals quotes before exchange, then confirm the
          date the moment you exchange. Popular Fridays and month-end dates can
          book up weeks ahead.
        </Tip>
        <H2 id="renting">Moving between rentals</H2>
        <P>
          Renters usually move faster, but the timeline is set by notice
          periods rather than solicitors. Check your tenancy for the notice
          you need to give, allow time for referencing on the new place, and
          try to overlap the two tenancies by a day or two if you can afford
          it — it takes a lot of pressure off moving day.
        </P>
        <P>
          Don’t forget the end-of-tenancy clean. Booking it for the day after
          the move is often easier than cleaning around boxes. Ours start from
          £120.
        </P>
        <H2 id="moving-day">How long does a house move take on the day?</H2>
        <P>
          This is the part we can be precise about. Times below are typical
          for a local London move with reasonable access, including loading,
          driving and unloading.
        </P>
        <DataTable
          head={["Property size", "Typical crew", "Approx. time on the day", "Phi Movers London (from)"]}
          rows={[
            ["Studio flat", "2 movers", "2–4 hours", "£249"],
            ["1-bed flat", "2 movers", "3–5 hours", "£329"],
            ["2-bed house or flat", "2–3 movers", "4–7 hours", "£499"],
            ["3-bed house", "3 movers", "6–9 hours", "£749"],
            ["4-bed house or larger", "3–4 movers", "8–10+ hours, sometimes 2 days", "£999"],
          ]}
        />
        <Figure
          seed="studio-flat-move-checklist"
          alt="Packed boxes and furniture ready to load in a small flat"
          caption="A well-packed studio can be loaded, moved and unloaded in a few hours."
        />
        <P>
          Long-distance moves add driving time on top. And if you’ve booked
          full packing, we usually pack the day before so moving day stays
          focused on loading and unloading.
        </P>
        <P>
          Completion day has its own rhythm when you’re buying. Funds usually
          move between solicitors in the late morning or early afternoon, and
          keys are only released once that’s confirmed. That means the crew
          often loads in the morning, then waits for the green light before
          unloading. Building that wait into your plan — rather than hoping
          for a 10am key release — keeps the day calm.
        </P>
        <P>
          For smaller jobs on our{" "}
          <a href="/services/man-and-van">
            man &amp; van
          </a>{" "}
          service (from £50/hour, two-hour minimum), time is the price, so
          every minute saved on the day is money saved. On a fixed-price
          removal the total doesn’t change, but a well-prepared home still
          means you’re settled in sooner.
        </P>
        <H2 id="hour-by-hour">A 2-bed moving day, hour by hour</H2>
        <P>
          Averages are helpful, but it’s easier to plan when you can see where
          the hours actually go. This is a typical local 2-bed flat move with
          three movers, everything packed in advance, a lift at the new
          building and a parking bay suspended outside both addresses.
        </P>
        <DataTable
          head={["Time", "What’s happening", "Notes"]}
          rows={[
            ["8:00", "Crew arrives, walk-round and floor protection", "Point out anything not going and anything fragile"],
            ["8:20", "Beds, wardrobes and tables dismantled", "Fixings bagged and taped to each piece"],
            ["9:00", "Boxes loaded first, then furniture", "Heavy items low and forward in the van"],
            ["11:00", "Van loaded, final sweep of the flat", "Check cupboards, balcony and meter cupboard"],
            ["11:30", "Drive to the new address", "Allow for traffic; London cross-town runs vary"],
            ["12:15", "Unloading, room by room", "Labelled boxes go straight to the right rooms"],
            ["14:00", "Beds and tables reassembled", "Make the beds before you start unpacking"],
            ["14:30", "Crew leaves", "Check items before signing off"],
          ]}
        />
        <P>
          That’s roughly six and a half hours, right in the middle of the
          4–7 hour range for a 2-bed. Take away the lift at the new building
          and add two flights of stairs, and you can add an hour. Leave the
          kitchen unpacked for the crew to deal with on the day, and it can add
          two.
        </P>
        <P>
          What we see on real jobs is that the clock is rarely lost in the
          middle of the day. It’s lost in the first half hour — waiting for
          someone to find the keys to the bike store, clearing a hallway, or
          discovering that the wardrobe was never measured against the
          landing — and in the last half hour, when bits and pieces nobody
          boxed up are gathered from around the flat. Getting those two
          moments right is the quickest way to a shorter day.
        </P>
        <Tip>
          Put a box labelled “last on, first off” by the front door: kettle,
          mugs, loo roll, phone chargers, bedding and the tools you’ll need to
          reassemble the bed.
        </Tip>
        <H2 id="factors">What slows a move down</H2>
        <Check
          items={[
            "Unpacked rooms when the crew arrives — the biggest single delay we see.",
            "No parking near the door, meaning long carries on every trip.",
            "Walk-ups without a lift, or lifts that haven’t been booked.",
            "Furniture that needs dismantling and wasn’t mentioned at quote stage.",
            "Waiting for keys on completion day — often early to mid-afternoon.",
            "Lofts, sheds and garages that haven’t been sorted.",
          ]}
        />
        <H2 id="faster">How to move faster</H2>
        <Steps
          items={[
            "Declutter a few weeks out so there’s less to pack and carry.",
            "Pack and label everything except an essentials bag before the crew arrives.",
            "Arrange parking or bay suspensions at both addresses.",
            "Book goods lifts and tell building management the crew window.",
            "Add an extra helper (£20/hour on man & van) if you have lots of stairs.",
            "Consider storage if keys won’t be ready — it avoids an idle van.",
          ]}
        />
        <P>
          If your dates don’t line up, we can collect, hold your things in{" "}
          <a href="/services/secure-storage">
            secure storage
          </a>{" "}
          and deliver when you’re ready.
        </P>
        <H2 id="countdown">A moving-week countdown</H2>
        <P>
          However long the legal side takes, the last week is where a move is
          won or lost. This simple countdown keeps moving day to the times in
          the table above.
        </P>
        <Steps
          items={[
            "Seven days out: confirm the crew, the arrival time and parking at both addresses.",
            "Five days out: pack everything you won’t need this week, room by room.",
            "Three days out: dismantle spare beds and furniture you can live without.",
            "Two days out: defrost the freezer and run down the food in it.",
            "The day before: pack the kitchen, label boxes and set aside an essentials bag.",
            "Moving day: meter readings, a final sweep of every cupboard, then hand over the keys.",
          ]}
        />
        <P>
          If that sounds like too much alongside work, our{" "}
          <a href="/services/full-packing-service">
            full packing service
          </a>{" "}
          (from £150) takes the packing off your hands entirely.
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>How long does it take to move house in the UK on average?</Q>
        <P>
          When buying, typically around 12–20 weeks from offer to completion.
          The physical move usually takes one day.
        </P>
        <Q>Can you move house in one day?</Q>
        <P>
          Yes — almost all local moves up to a 3-bed house are done in a single
          day. Very large homes or long-distance moves can take two.
        </P>
        <Q>How long does a 2-bed move take?</Q>
        <P>
          Usually around 4–7 hours with two or three movers, depending on
          stairs, parking and how much is packed in advance.
        </P>
        <Q>How far ahead should I book removals?</Q>
        <P>
          Two to four weeks is comfortable for most moves; book as soon as you
          exchange if you’re buying. Short-notice and same-day moves (from
          £70) are possible when we have capacity.
        </P>
        <ArticleCta
          title="Got your moving date?"
          body="Tell us the date and addresses — we’ll confirm a crew and a fixed price."
        />
        <P>
          See our{" "}
          <a href="/services/house-removals">
            house removals
          </a>{" "}
          service or <a href="/contact">get in touch</a> to hold a date.
        </P>
      </>
    ),
  },

  "how-much-does-an-office-move-cost": {
    toc: [
      { id: "drivers", label: "What decides office moving cost" },
      { id: "table", label: "Office removal costs: drivers at a glance" },
      { id: "it-furniture", label: "IT, furniture and disposal" },
      { id: "quote", label: "How to get an accurate office removals quote" },
      { id: "timeline", label: "Office relocation planning timeline" },
      { id: "reduce", label: "Ways to reduce the cost of an office move" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          Office moving cost is harder to pin down than the cost of a house
          move, because no two offices are laid out the same way. Two
          businesses with twenty staff each can have very different bills:
          one has hot desks, a few laptops and a lift; the other has a
          comms cabinet, a wall of filing and a fourth-floor walk-up. This
          guide explains what actually drives office removal costs, how to
          get a quote you can rely on, and the practical ways to bring the
          price down without cutting corners.
        </P>
        <P>
          You won’t find a price list here. At Phi Movers we quote every
          office relocation individually after a survey, because a figure
          given without seeing the space is a guess — and a guess is how
          businesses end up with surprise charges on the night of the move.
          What we can do is show you exactly what goes into the price, so
          you can compare quotes properly.
        </P>
        <H2 id="drivers">What decides office moving cost</H2>
        <P>
          Almost every office relocation cost comes back to one thing: how
          many crew hours and vehicle loads the job needs. Each of the
          factors below adds to one or both.
        </P>
        <Check
          items={[
            "Headcount and desks: the number of workstations is the quickest guide to the size of the job — each one usually means a desk, a chair, a pedestal and a crate or two of personal items.",
            "Volume beyond the desks: meeting room tables, kitchen equipment, filing cabinets, archive boxes, stationery cupboards and stock.",
            "Floors and lifts: a goods lift that can be booked for the evening is very different from a passenger lift shared with other tenants, or no lift at all.",
            "Access and loading: a loading bay at the door saves time; a long carry from a side street, or a building that limits van access, adds it.",
            "IT equipment: monitors, docking stations, printers and any comms or server kit need extra protection and careful handling.",
            "Out-of-hours timing: evening, overnight and weekend moves keep your team working, but crew time outside normal hours is generally priced higher.",
            "Distance: within London, most of the time is spent carrying rather than driving; moving to another city adds fuel, driver hours and sometimes an overnight stop.",
            "Packing and crates: whether staff pack their own desks into hired crates or the crew packs everything for you.",
            "Furniture dismantling and reassembly: bench desks, meeting tables and storage walls often have to come apart to move.",
            "Disposal: old furniture that isn’t coming with you has to go somewhere, and responsible disposal is a cost of its own.",
          ]}
        />
        <P>
          The two that surprise businesses most are access and timing. A
          building that only lets contractors use the goods lift between
          7pm and 7am effectively decides when your move happens — and that,
          in turn, shapes the crew and the price. It’s worth asking your
          current and new building managers about their rules before you
          ask anyone for a quote.
        </P>
        <Figure
          seed="evening-weekend-moves-london"
          alt="Movers loading office crates and wrapped desks into a van in the evening"
          caption="Many office moves happen in the evening or at the weekend, so the team can log off in one building and log on in the next."
        />
        <H2 id="table">Office removal costs: drivers at a glance</H2>
        <P>
          Use this table to see which parts of your move are likely to push
          the price up, and what you can do about each one. It’s a guide to
          the cost drivers, not a price list.
        </P>
        <DataTable
          head={["Cost driver", "Lower-cost situation", "Higher-cost situation", "What helps"]}
          rows={[
            ["Headcount and desks", "Small team, hot desks, laptops", "Many fixed workstations with pedestals", "An accurate desk count and floor plan"],
            ["Volume", "Paperless, little storage", "Filing, archives, stock and kitchen kit", "Clear out and scan before the survey"],
            ["Floors and lifts", "Ground floor or bookable goods lift", "Upper floors, shared or no lift", "Book lifts early at both buildings"],
            ["IT", "Laptops that travel with staff", "Desktops, printers, comms cabinet", "Your IT team or provider disconnects and reconnects"],
            ["Timing", "Weekday daytime", "Overnight, weekend or bank holiday", "Keep out-of-hours to the parts that need it"],
            ["Distance", "Within the same area of London", "Another city, or multi-site", "Plan the route and parking early"],
            ["Packing", "Staff pack their own crates", "Crew packs everything", "Crate hire and a simple labelling plan"],
            ["Furniture", "Freestanding pieces", "Bench desks and storage walls to dismantle", "Decide early what is actually moving"],
            ["Disposal", "Everything is moving", "Large amounts of old furniture to clear", "Sell, donate or recycle ahead of the move"],
          ]}
        />
        <P>
          Rough industry ranges for office moves do get quoted online, but
          the spread is so wide — a two-person studio and a multi-floor
          headquarters are both “an office move” — that a range rarely tells
          you anything useful about your own job. A short survey does.
        </P>
        <H2 id="it-furniture">IT, furniture and disposal</H2>
        <P>
          These three areas are where office moves differ most from home
          moves, and where a quote can go wrong if they aren’t discussed up
          front.
        </P>
        <P>
          Start with IT. Standard kit — monitors, keyboards, docking
          stations, printers — can travel with the rest of the move as long as
          it’s properly packed and labelled to the right desk. Comms cabinets,
          servers and network equipment are different: they need a planned
          shutdown, careful packing and someone ready to bring them back up
          at the other end. Our{" "}
          <a href="/services/it-and-server-relocation">
            IT &amp; server relocation
          </a>{" "}
          service covers the physical move of that equipment; your own IT
          team or provider should handle the shutdown, data and reconnection.
        </P>
        <P>
          Moving furniture between offices is
          usually more about dismantling than carrying. Bench desks, boardroom
          tables and tall storage units rarely fit through doors or lifts in
          one piece. The cost to move office furniture depends on how much
          needs taking apart and putting back together, so tell us early if
          you’re moving desks, buying new ones or doing a mix. See{" "}
          <a href="/services/office-furniture-removals">
            office furniture removals
          </a>{" "}
          for how we handle it.
        </P>
        <P>
          Then there’s disposal. Many businesses use a move as the moment
          to replace tired furniture. Whatever isn’t coming with you needs
          clearing, and leaving it until the last week usually means paying
          for a rushed collection. Selling, donating or arranging a licensed
          clearance in good time is almost always cheaper.
        </P>
        <Tip>
          Label every desk, crate and monitor with the same number as its
          spot on the new floor plan. It’s the cheapest thing you can do to
          make the unload fast.
        </Tip>
        <H2 id="quote">How to get an accurate office removals quote</H2>
        <P>
          An office removals quote is only as good as the information behind
          it. To get a fixed price you can budget around, give each company
          the same brief:
        </P>
        <Steps
          items={[
            "Book a survey of the current office, in person or by video — walk through every room, store cupboard and server space.",
            "Share the headcount, desk count and a floor plan of the new office if you have one.",
            "List what’s not moving: furniture being replaced, items being disposed of or left for the landlord.",
            "Give building details for both addresses: floors, lifts, loading bays, parking and any time restrictions.",
            "Say what you want the crew to do — packing, crates, dismantling, reassembly, IT handling — and what your staff will do.",
            "Confirm your preferred dates and whether the move needs to happen out of hours.",
            "Ask for the quote in writing, with crew size, vehicles, timings, insurance and what would change the price.",
          ]}
        />
        <P>
          With that brief, comparing quotes becomes straightforward. If one
          is noticeably lower, check whether it leaves out crates, dismantling
          or out-of-hours timing, or assumes a smaller crew than the job needs.
          Our{" "}
          <a href="/services/office-removals">
            office removals
          </a>{" "}
          are quoted as a fixed written price after the survey, with
          goods-in-transit and public liability cover included.
        </P>
        <H2 id="timeline">Office relocation planning timeline</H2>
        <P>
          How far ahead you need to start depends on the size of the office,
          but for most small and medium businesses this timeline works well.
        </P>
        <DataTable
          head={["When", "What to do"]}
          rows={[
            ["3–6 months before", "Confirm the lease dates, appoint someone internally to run the move, and check notice and reinstatement terms on the old space."],
            ["8–12 weeks before", "Book surveys and get written quotes; agree the new floor plan; talk to your IT provider about connectivity at the new site."],
            ["6–8 weeks before", "Confirm the removals company and move date; book goods lifts and loading bays at both buildings; decide what furniture is being replaced or cleared."],
            ["3–4 weeks before", "Arrange disposal of old furniture; start clearing archives; tell clients, suppliers and the post room about the new address."],
            ["1–2 weeks before", "Crates are delivered; staff pack non-essential items; desk and crate labels are matched to the new floor plan."],
            ["Move week", "Final desk packing; IT shutdown plan confirmed; the move itself, often in the evening or at the weekend."],
            ["After the move", "Snagging walk-round, collection of empty crates, and a check that every desk and monitor ended up in the right place."],
          ]}
        />
        <P>
          Larger moves, or moves with server rooms, need longer. And if your
          building only allows moves at certain times, book those slots as
          early as you can — they’re often the hardest part of the schedule
          to change.
        </P>
        <H2 id="reduce">Ways to reduce the cost of an office move</H2>
        <Steps
          items={[
            "Clear out before the survey — every filing cabinet you empty is one less to move.",
            "Scan or archive paper records you only keep for compliance.",
            "Have staff pack their own desks into hired crates, following one simple labelling system.",
            "Move only what needs moving out of hours; some items can go in the days before.",
            "Book lifts, loading bays and parking at both buildings well in advance.",
            "Decide early which furniture is staying, going or being replaced, so the crew isn’t moving things twice.",
            "Give an accurate inventory up front so the right crew and vehicles are sent first time.",
          ]}
        />
        <P>
          Crates are one of the easiest savings. Plastic crates stack safely,
          close without tape and can be labelled per desk, which speeds up
          both packing and unpacking. Our{" "}
          <a href="/services/moving-crate-hire">
            moving crate hire
          </a>{" "}
          delivers them before the move and collects them once you’ve
          unpacked.
        </P>
        <P>
          What we see on real jobs is that the costliest delays aren’t on the
          road. They’re a lift that wasn’t booked, a set of bench desks nobody
          mentioned, or a store room full of old equipment discovered on the
          night. A thorough walk-round at survey stage avoids nearly all of
          them.
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>How much does an office move cost?</Q>
        <P>
          It depends on headcount, volume, access, IT, timing and distance,
          which is why we quote every office move individually after a
          survey. You’ll get a fixed written price covering the crew,
          vehicles, materials and timing.
        </P>
        <Q>Is it more expensive to move an office at the weekend?</Q>
        <P>
          Out-of-hours crew time is generally priced higher than weekday
          daytime work, but it usually saves far more in lost working time.
          Many businesses move the bulk at the weekend and smaller items in
          the days before.
        </P>
        <Q>Do you move IT equipment and servers?</Q>
        <P>
          Yes. Standard IT is handled as part of the move, and we offer a
          dedicated IT &amp; server relocation service for comms and server
          equipment. Your IT team or provider should manage shutdown and
          reconnection.
        </P>
        <Q>How far in advance should I book an office move?</Q>
        <P>
          For most small and medium offices, start getting quotes around two
          to three months ahead, and book lifts and loading bays as soon as
          your date is confirmed.
        </P>
        <ArticleCta
          title="Planning an office move?"
          body="Book a free survey, in person or by video — we’ll come back with a fixed written quote for the whole relocation."
        />
        <P>
          See <a href="/services/office-removals">office removals</a> or{" "}
          <a href="/contact">contact us</a> to talk it through.
        </P>
      </>
    ),
  },

  "storage-costs-london-uk": {
    toc: [
      { id: "per-month", label: "Storage costs per month: typical prices" },
      { id: "sizes", label: "Unit size guide: what fits" },
      { id: "three-bed", label: "Storage costs for a 3 bedroom house" },
      { id: "types", label: "Self storage vs managed storage" },
      { id: "factors", label: "What affects the price" },
      { id: "example", label: "Worked example: storing between moves" },
      { id: "save", label: "How to keep storage costs down" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          Storage costs per month vary more than most people expect — the same
          sized unit can cost very different amounts depending on the city, the
          facility and whether you need collection. If you’re wondering how
          much self storage is a month, or what you’ll pay to store a whole
          house between moves, this guide gives you typical UK ranges, a simple
          size guide and our own London storage prices.
        </P>
        <H2 id="per-month">Storage costs per month: typical prices</H2>
        <P>
          Across the UK, self storage is usually priced by square foot of
          floor space. As a rough guide, small lockers and units can start
          from around £10–£25 a week, mid-sized units suitable for a flat
          typically fall in the £100–£250 a month range, and large units for a
          family house can be £250–£450+ a month. London prices generally sit
          at the higher end, and central locations cost more than outer
          boroughs.
        </P>
        <P>
          Our own{" "}
          <a href="/services/secure-storage">
            secure storage
          </a>{" "}
          starts from £15/week or £55/month, with the final price set by the
          volume you store. Because we can collect from your old home and
          deliver to your new one, you avoid booking separate vans either side.
        </P>
        <P>
          Weekly and monthly prices aren’t always directly comparable. Some
          facilities advertise a low introductory rate for the first few
          weeks, then move to a standard rate. Others quote per four-week
          period rather than per calendar month, which adds up to thirteen
          payments a year instead of twelve. When you compare storage costs
          per month, ask for the total cost of your expected stay, including
          insurance and any one-off fees.
        </P>
        <Figure
          seed="self-storage-guide-london"
          alt="Boxes and furniture neatly stacked in a storage unit"
          caption="Well-stacked storage uses height — so you pay for less floor space."
        />
        <H2 id="sizes">Unit size guide: what fits</H2>
        <P>
          Sizes are usually given in square feet of floor space. Ceiling
          height matters too — a taller unit lets you stack more in the same
          footprint.
        </P>
        <DataTable
          head={["Unit size (approx.)", "Roughly equivalent to", "What typically fits"]}
          rows={[
            ["10–15 sq ft", "A large wardrobe", "15–25 boxes, suitcases, a bike"],
            ["25–35 sq ft", "A garden shed", "Studio contents without large furniture"],
            ["50 sq ft", "A small box room", "Studio or small 1-bed flat"],
            ["75–100 sq ft", "A single garage (half to full)", "1–2 bed flat"],
            ["150 sq ft", "A large single garage", "3-bed house"],
            ["200+ sq ft", "A double garage", "4-bed house or larger"],
          ]}
        />
        <P>
          These are guides, not guarantees. A minimalist two-bed can fit in a
          smaller unit than a cluttered one-bed. Tell us what you have and
          we’ll recommend a size — better slightly roomy than crushed.
        </P>
        <H2 id="three-bed">Storage costs for a 3 bedroom house</H2>
        <P>
          A typical 3-bed house needs around 150 sq ft. In the UK that
          commonly costs somewhere around £200–£400 a month, depending on the
          location and provider, with London and the South East at the upper
          end. Add the cost of getting your things there: a 3-bed removal in
          London starts from £749, and you’ll need a second delivery when you
          move into the new place.
        </P>
        <Tip>
          Combining removals and storage with one company usually costs less
          than two separate van bookings — and means one team has handled
          your things from start to finish.
        </Tip>
        <P>
          A full 3-bed house is the upper end of what most people store. If
          you’re only storing part of the house — say, the contents of a
          spare room and the garage while you renovate — you may only need a
          50–75 sq ft unit, which brings the monthly cost down considerably.
          It’s worth separating what genuinely needs to go into storage from
          what can stay in a room you’re not working on.
        </P>
        <H2 id="types">Self storage vs managed storage</H2>
        <P>
          There are two main ways to store your things, and they suit
          different people.
        </P>
        <Check
          items={[
            "Self storage: you rent a unit, take your things there and access it yourself. Flexible, but you arrange (and pay for) transport both ways.",
            "Managed or containerised storage: a removals company collects, stores and redelivers. Less hands-on access, but one booking covers everything.",
            "Drive-up units: convenient for frequent access, usually at a higher price.",
            "Indoor units: better protected from damp and temperature changes.",
          ]}
        />
        <P>
          If you need to get to your things every week, self storage near home
          makes sense. If you’re storing between two moves and won’t need
          access, managed storage usually works out simpler and cheaper
          overall.
        </P>
        <H2 id="factors">What affects the price</H2>
        <Check
          items={[
            "Location: London and city-centre facilities cost more per square foot.",
            "Unit size and height: you pay for space, so packing well saves money.",
            "Length of stay: longer contracts often get better weekly rates.",
            "Access: 24/7 drive-up units cost more than access by arrangement.",
            "Insurance: most facilities require cover for the value of your goods.",
            "Collection and delivery: van and crew costs at both ends.",
            "Extras: padlocks, boxes, pallets and admin fees.",
          ]}
        />
        <H2 id="example">Worked example: storing between moves</H2>
        <P>
          The monthly rate is only part of the picture. Here’s how the total
          comes together for a common London scenario: a couple selling a
          1-bed flat, with an eight-week gap before they can move into their
          new home.
        </P>
        <DataTable
          head={["Cost", "Self storage route", "Collection and storage route"]}
          rows={[
            ["Getting things in", "Van hire or man & van to the facility", "Collected from the flat by the same crew"],
            ["Storage (8 weeks)", "Facility’s monthly or four-weekly rate", "From £15/week, set by volume"],
            ["Insurance", "Often a separate monthly charge", "Ask what’s included in your quote"],
            ["Getting things out", "A second van booking to the new home", "Delivered to the new address on the day"],
            ["Your time", "Two trips, plus loading the unit yourself", "One booking, no handling by you"],
          ]}
        />
        <P>
          On paper, a self storage unit can look cheaper per week. But once
          you add two separate van bookings, two lots of carrying and any
          insurance charge, the gap often closes — and if you don’t need
          access during those eight weeks, you’re paying extra for a key you
          never use.
        </P>
        <P>
          What we see on real jobs is that gaps rarely stay the length people
          first expect. Completion dates slip by a week or two more often than
          they move forward, so it’s sensible to budget for a little longer
          than your solicitor’s first estimate and to check the notice period
          for ending the storage early.
        </P>
        <P>
          Before anything goes in, put together a simple inventory: a list of
          boxes by room, the large pieces of furniture and photos of anything
          valuable. It takes half an hour and makes it far easier to ask for a
          specific box to be brought out mid-stay, or to check everything when
          it’s delivered.
        </P>
        <Check
          items={[
            "Store clean, dry items only — damp clothes and bedding can develop mould.",
            "Defrost and dry fridges and freezers, and leave the doors slightly open.",
            "Wrap mattresses and upholstered furniture in breathable covers.",
            "Keep documents, passports and valuables with you, not in storage.",
            "Number your boxes and keep the list on your phone.",
          ]}
        />
        <H2 id="save">How to keep storage costs down</H2>
        <Steps
          items={[
            "Declutter before storing — don’t pay monthly for things you’ll throw away later.",
            "Dismantle beds and tables so they stack flat.",
            "Use uniform, sealed boxes that stack to the ceiling.",
            "Store only what you need to — keep everyday items with you.",
            "Be realistic about the length of stay and ask about longer-term rates.",
            "Book collection and delivery with your removals to avoid duplicate van hire.",
          ]}
        />
        <P>
          It’s also worth reviewing your storage every few months. Short stays
          have a habit of becoming long ones, and things that felt essential
          at the start can turn out to be easy to sell or donate.
        </P>
        <P>
          For packing tips and when storage makes sense, see our{" "}
          <a href="/blog/self-storage-guide-london">
            simple guide to self storage in London
          </a>
          .
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>How much is self storage a month?</Q>
        <P>
          In the UK, small units often cost around £40–£100 a month and
          flat-sized units around £100–£250, with London higher. Phi Movers
          storage starts from £55/month.
        </P>
        <Q>What size storage unit do I need for a 1-bed flat?</Q>
        <P>
          Usually around 50–75 sq ft, depending on how much furniture you
          have and how well it’s packed.
        </P>
        <Q>Is storage insured?</Q>
        <P>
          Most facilities require you to insure the contents. Ask what cover
          is included and what it’s based on before you sign.
        </P>
        <Q>Can you collect and deliver my things?</Q>
        <P>
          Yes. We collect from anywhere in London, store securely and deliver
          when you’re ready.
        </P>
        <ArticleCta
          title="Need storage between moves?"
          body="Tell us what you’re storing and for how long — we’ll quote collection, storage and delivery together."
        />
        <P>
          See <a href="/services/secure-storage">secure storage</a> or{" "}
          <a href="/contact">contact us</a> for a price.
        </P>
      </>
    ),
  },

  "how-to-choose-a-long-distance-moving-company": {
    toc: [
      { id: "what-matters", label: "What the best long distance moving companies get right" },
      { id: "price", label: "Fixed price vs estimate" },
      { id: "insurance", label: "Insurance and inventory" },
      { id: "crews", label: "Who actually does the move?" },
      { id: "logistics", label: "Drivers’ hours, overnight stops and part-loads" },
      { id: "compare", label: "Comparison table: what to check" },
      { id: "red-flags", label: "Red flags and questions to ask" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          Searching for the best long distance moving companies usually
          turns up a wall of near-identical websites, all promising
          stress-free moves at great prices. The truth is that the best
          company for you isn’t the one with the slickest advert — it’s the
          one whose quote, insurance and plan for the day stand up to a few
          straightforward questions. This guide is a practical buyer’s
          checklist for long distance removals in the UK, whether you’re
          moving from London to another city or the other way round.
        </P>
        <P>
          We’re a removals company ourselves, so where it’s useful we’ll
          explain how we handle each point. But the checklist works for any
          firm you’re considering, and you should hold us to it too.
        </P>
        <H2 id="what-matters">What the best long distance moving companies get right</H2>
        <P>
          A local move forgives a lot. If the van is too small, it can do a
          second trip; if the crew runs late, they finish an hour later. Over
          200 miles there’s no second trip and no quick fix, so the planning
          has to be right before the van leaves. Good long distance moving
          companies tend to share the same habits:
        </P>
        <Check
          items={[
            "They survey or properly review your home before giving a price.",
            "They give a fixed written quote that says exactly what’s included.",
            "They can tell you their insurance cover and its limits without hesitation.",
            "They’re clear about who will carry out the move and in what vehicle.",
            "They plan the driving day, including breaks and any overnight stop.",
            "They explain the difference between a dedicated van and a part-load.",
          ]}
        />
        <Figure
          seed="complete-guide-to-moving-home-in-london"
          alt="Removals crew loading a van outside a London home for a long-distance move"
          caption="On a long-distance move there’s no second trip, so the inventory and van size have to be right first time."
        />
        <H2 id="price">Fixed price vs estimate</H2>
        <P>
          The first thing to establish is what kind of price you’re being
          given. A fixed price is the amount you pay unless the job itself
          changes — more items, different addresses, a different date. An
          estimate is a best guess, and the final bill can move with the
          hours worked, the mileage or the volume on the day.
        </P>
        <P>
          For long-distance moves, a fixed price is almost always the safer
          choice, because so much can affect the time: motorway traffic,
          roadworks, waiting for keys, a narrow street at the far end. With
          an hourly or estimated price, that risk sits with you. With a fixed
          price, it sits with the company — which is also an incentive for
          them to plan properly.
        </P>
        <P>
          Read the small print either way. A fixed quote should list the
          crew size, vehicle, date, services included and the specific things
          that would change the price. If it doesn’t, ask. For a sense of how
          moving costs build up, see our guide to{" "}
          <a href="/blog/how-much-does-it-cost-to-move-house-uk">
            how much it costs to move house in the UK
          </a>
          .
        </P>
        <H2 id="insurance">Insurance and inventory</H2>
        <P>
          There are two types of cover you should expect any removals company
          to hold:
        </P>
        <Check
          items={[
            "Goods in transit: covers your belongings against loss or damage while they’re being moved.",
            "Public liability: covers damage to property and injury to other people caused during the move — a scraped hallway, a damaged lift, a broken gate.",
          ]}
        />
        <P>
          Having insurance isn’t the end of the question. Ask what the
          limits are, whether there’s a per-item cap, what the excess is and
          whether items you pack yourself are covered in the same way as
          items the crew packs. If you own something of high value — artwork,
          antiques, a piano — mention it so the cover can be checked against
          it.
        </P>
        <P>
          An inventory is the other half of protection. A written list of
          what’s going, ideally with photos of valuable or fragile pieces,
          makes the quote more accurate and gives everyone something to check
          against at delivery. On a long move it’s also how you’ll know if
          anything has gone missing. Every Phi Movers job includes
          goods-in-transit and public liability cover, and we work from an
          agreed inventory.
        </P>
        <H2 id="crews">Who actually does the move?</H2>
        <P>
          This is the question most people forget to ask. Some companies run
          their own crews and vehicles. Others take the booking and pass the
          job to another firm or to independent drivers. Subcontracting isn’t
          automatically bad — plenty of reputable firms work with trusted
          partners — but you have a right to know, because it affects who is
          responsible if something goes wrong.
        </P>
        <Check
          items={[
            "Will your own staff carry out the move, or will it be subcontracted?",
            "If subcontracted, whose insurance covers my goods, and who do I deal with if there’s a claim?",
            "Will the crew that loads also unload, or will my things change vehicles on the way?",
            "Who is my point of contact on the day?",
          ]}
        />
        <Tip>
          Ask for the answers in writing. A company that’s confident in how it
          runs its moves won’t mind putting it in an email.
        </Tip>
        <H2 id="logistics">Drivers’ hours, overnight stops and part-loads</H2>
        <P>
          Long-distance moves are limited by the law as much as the road.
          Larger removal lorries are covered by drivers’ hours rules and
          tachographs, which require regular breaks — typically a 45-minute
          break after four and a half hours of driving — and cap the amount
          of driving in a day. Smaller vans fall under different rules, but a
          responsible company still builds in breaks for safety.
        </P>
        <P>
          In practice, that means a long move involves more than a driving
          time from a route planner. Loading, breaks, traffic and unloading
          all have to fit into the crew’s day. For longer routes, the honest
          plan may be to load one day, stop overnight and deliver the next
          morning. A company that promises to load a large house in London
          and unload it in Scotland the same evening should be able to
          explain exactly how.
        </P>
        <P>
          The other big choice is between a dedicated van and a part-load.
        </P>
        <DataTable
          head={["", "Dedicated van", "Part-load (shared van)"]}
          rows={[
            ["How it works", "The van carries only your belongings, direct to your address", "Your items share space with other customers’ moves on the same route"],
            ["Price", "Higher — you pay for the whole vehicle and crew", "Usually lower for smaller loads"],
            ["Dates", "Collection and delivery on the dates you choose", "Delivery window can be wider, set by the route"],
            ["Best for", "Full homes and fixed completion dates", "A few items, a room or a small flat with flexible dates"],
          ]}
        />
        <P>
          A part-load can be a sensible way to cut the cost of moving a small
          amount a long way, as long as you know the delivery window up
          front. See{" "}
          <a href="/services/part-load-removals">
            part-load removals
          </a>{" "}
          for how it works with us, or{" "}
          <a href="/services/long-distance-removals">
            long-distance removals
          </a>{" "}
          for dedicated moves.
        </P>
        <H2 id="compare">Comparison table: what to check</H2>
        <P>
          When you have two or three quotes, put them side by side against the
          same checklist. The cheapest quote is only cheaper if it covers the
          same things.
        </P>
        <DataTable
          head={["What to check", "Good sign", "Warning sign"]}
          rows={[
            ["Price", "Fixed written quote with what’s included", "Verbal price or a vague estimate"],
            ["Survey", "In-person or video survey before quoting", "Price given without seeing your inventory"],
            ["Insurance", "Goods in transit and public liability, with limits stated", "Can’t or won’t say what cover they hold"],
            ["Who moves you", "Clear answer on own crews or named partners", "Unclear who will turn up"],
            ["Route planning", "Breaks and any overnight stop planned up front", "Same-day promise with no explanation"],
            ["Van type", "Dedicated or part-load explained clearly", "Shared van with no delivery window"],
            ["Reviews", "Recent reviews mentioning long-distance moves", "Few reviews, or only very old ones"],
            ["Terms", "Clear cancellation, delay and claims terms", "No written terms at all"],
          ]}
        />
        <P>
          Reviews are worth reading properly rather than just counting stars.
          Look for recent reviews that mention long-distance moves
          specifically, and pay attention to how the company responds when
          something went wrong — that tells you more than a page of five-star
          ratings.
        </P>
        <H2 id="red-flags">Red flags and questions to ask</H2>
        <P>
          Most long distance moving companies are honest, but these are
          reasons to slow down:
        </P>
        <Check
          items={[
            "A firm price given over the phone with no idea of what you own.",
            "A large deposit demanded well before the move, especially in cash.",
            "No physical address, landline or trading history you can check.",
            "Pressure to book today to keep the price.",
            "Reluctance to say who will actually carry out the move.",
            "A quote far below everyone else’s with no explanation of why.",
          ]}
        />
        <P>
          And these are the questions worth asking every company on your
          shortlist:
        </P>
        <Steps
          items={[
            "Is the price fixed, and what exactly would change it?",
            "What insurance do you hold, and what are the limits and excess?",
            "Will your own crew do the move, start to finish?",
            "Is this a dedicated van or a part-load, and what are the delivery dates?",
            "How are the driving day, breaks and any overnight stop planned?",
            "What happens if my keys are delayed at the other end?",
            "Can you pack, dismantle furniture or store items if my dates don’t line up?",
          ]}
        />
        <P>
          If your dates don’t line up, storage can bridge the gap — ours
          starts from £15/week — and full packing starts from £150. If
          you’re moving to or from a specific town, our{" "}
          <a href="/removals">
            UK removals pages
          </a>{" "}
          cover distances and local details for each one.
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>How do I find the best long distance moving company?</Q>
        <P>
          Get two or three written quotes after a survey, then compare them
          on fixed price, insurance, who carries out the move, route planning
          and recent reviews — not on headline price alone.
        </P>
        <Q>Is a part-load cheaper than a dedicated van?</Q>
        <P>
          Usually, for smaller loads, because you share the vehicle with other
          moves. The trade-off is a wider delivery window. For a full home or
          a fixed completion date, a dedicated van is normally the better fit.
        </P>
        <Q>Will a long-distance move take more than one day?</Q>
        <P>
          Sometimes. Drivers’ hours rules, loading time and the distance all
          count, so longer routes may involve an overnight stop and delivery
          the next morning. A good company will plan this up front.
        </P>
        <Q>Do you do long-distance moves from London?</Q>
        <P>
          Yes. We move from London to towns and cities across the UK, quoted
          as a fixed price with goods-in-transit and public liability cover
          included.
        </P>
        <ArticleCta
          title="Moving from London to another city?"
          body="Send both postcodes and a rough inventory — we’ll plan the route and come back with a fixed price."
        />
        <P>
          See{" "}
          <a href="/services/long-distance-removals">
            long-distance removals
          </a>{" "}
          or <a href="/contact">contact us</a> to talk it through.
        </P>
      </>
    ),
  },

  "cheapest-way-to-send-furniture-uk": {
    toc: [
      { id: "options", label: "Your options at a glance" },
      { id: "man-van", label: "Man & van" },
      { id: "marketplaces", label: "Courier marketplaces" },
      { id: "diy", label: "DIY van hire" },
      { id: "removals", label: "Removal companies" },
      { id: "spain", label: "Cheapest way to move furniture to Spain" },
      { id: "examples", label: "Which option is cheapest? Real scenarios" },
      { id: "prepare", label: "How to prepare furniture for transport" },
      { id: "save", label: "How to cut furniture transport costs" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          Bought a sofa on a marketplace, inherited a dining table, or sending
          a wardrobe to a new flat across the country? The cheapest way to
          transport furniture in the UK depends on three things: how many
          items, how far, and whether you can help carry. This guide compares
          the main options — man &amp; van, courier marketplaces, DIY van hire
          and removal companies — with honest pros, cons and typical costs, plus
          a short section on shipping furniture to Spain and Europe.
        </P>
        <H2 id="options">Your options at a glance</H2>
        <DataTable
          head={["Option", "Best for", "Typical cost", "Watch out for"]}
          rows={[
            ["Man & van", "1–10 items, local or regional", "Hourly — from £50/hour in London", "Minimum hours"],
            ["Furniture delivery service", "Single items, fixed price", "From £50 in London", "Stairs and access details"],
            ["Courier marketplaces", "Flexible dates, longer routes", "Varies by bid", "Variable insurance and reliability"],
            ["DIY van hire", "You have helpers and time", "Hire + fuel + insurance", "Injury, damage, parking"],
            ["Removal company", "Whole rooms or homes", "Fixed quote", "Overkill for one item"],
          ]}
        />
        <H2 id="man-van">Man &amp; van</H2>
        <P>
          For local moves of a handful of items, man &amp; van is usually the
          cheapest way to move furniture with someone else doing the lifting.
          You pay for the time used, the driver helps load and unload, and the
          van is the right size for the job.
        </P>
        <P>
          Our London{" "}
          <a href="/services/man-and-van">
            man &amp; van
          </a>{" "}
          is from £50/hour with a two-hour minimum, billed in 30-minute blocks
          after that, and the first 10 miles are included. If an item needs
          two people up the stairs, an extra helper is £20/hour.
        </P>
        <P>
          Man &amp; van works best when you can group jobs together. Picking up
          a marketplace wardrobe, collecting a table from a relative and
          dropping both at your flat in one booking is far cheaper than three
          separate deliveries. It’s also flexible on the day — if the seller
          has a bookcase they’d like gone too, there’s room in the van.
        </P>
        <P>
          The limit is distance. Hourly pricing is ideal across a city, but on
          a 200-mile run you’re paying for the return trip as well, so a
          fixed-price delivery or a shared load usually makes more sense.
        </P>
        <H2 id="marketplaces">Courier marketplaces</H2>
        <P>
          Online marketplaces let you post a job and receive bids from
          independent drivers. They can be good value on long routes, because
          a driver already heading that way may fill spare space cheaply.
        </P>
        <Check
          items={[
            "Pros: competitive prices on longer UK routes, flexible dates.",
            "Cons: quality and insurance vary driver to driver.",
            "Check: goods-in-transit cover, reviews and whether the driver will carry upstairs.",
            "Check: collection windows — part-loads can mean waiting days.",
          ]}
        />
        <P>
          The lowest bid is often a single driver with no helper, which is fine
          for a flat-packed chest of drawers but not for a three-seater sofa up
          two flights. Read the job description carefully, state the floors and
          whether there’s a lift, and confirm in writing who is carrying what.
        </P>
        <H2 id="diy">DIY van hire</H2>
        <P>
          Hiring a van and doing it yourself can be cheap if you already have
          strong friends and a free weekend. But the total is more than the hire
          price: add fuel, insurance excess, any parking or charging-zone costs,
          protective blankets and straps, and the time it takes. Heavy items on
          tight stairs are also where most injuries and wall damage happen.
        </P>
        <Tip>
          If the hire alone is close to the cost of a two-hour man &amp; van
          job, the professional option usually wins — you get the help and the
          insurance included.
        </Tip>
        <H2 id="removals">Removal companies</H2>
        <P>
          A removal company is rarely the cheapest way to send one item, but it
          is often the cheapest way to move a lot of furniture safely, because
          a fixed quote caps your cost. For single pieces, many firms —
          including us — also offer dedicated delivery services.
        </P>
        <Check
          items={[
            "Furniture and single item delivery: from £50 — see furniture delivery.",
            "Sofa delivery: fixed-price sofa runs, including tight London stairs.",
            "Flat and house removals: fixed quotes from £249 for a studio.",
          ]}
        />
        <P>
          See{" "}
          <a href="/services/furniture-delivery">
            furniture delivery
          </a>{" "}
          and{" "}
          <a href="/services/sofa-delivery">
            sofa delivery
          </a>
          , and our guide to{" "}
          <a href="/blog/sofa-delivery-narrow-stairs-london">
            sofa delivery up narrow stairs
          </a>
          .
        </P>
        <Figure
          seed="sofa-delivery-narrow-stairs-london"
          alt="Two movers carrying a sofa up a narrow staircase"
          caption="Measure stairs and doorways first — it’s the cheapest way to avoid a wasted trip."
        />
        <H2 id="spain">Cheapest way to move furniture to Spain</H2>
        <P>
          The cost of shipping furniture to Spain depends mainly on volume and
          whether you need a dedicated van or can share space. As a rough
          guide:
        </P>
        <Check
          items={[
            "Part-load or shared van: usually the cheapest for a few items or a small flat, but dates are less flexible.",
            "Dedicated van: costs more, but goes on your date directly to your address.",
            "Shipping container: tends to suit larger homes and longer-term relocations.",
            "Paperwork: since Brexit, check customs and transfer-of-residence rules before you book.",
          ]}
        />
        <P>
          European moves are always priced individually. Tell us what you’re
          sending and when — see{" "}
          <a href="/services/european-moves">
            European moves
          </a>{" "}
          for how we handle it.
        </P>
        <P>
          Whatever the route, a detailed inventory with rough measurements is
          the quickest way to an accurate price. Wrapping and protecting
          furniture properly matters more on a long journey than a short one,
          so check what protection is included before you compare quotes on
          price alone.
        </P>
        <H2 id="examples">Which option is cheapest? Real scenarios</H2>
        <P>
          The right answer changes with the job, so here are the situations we
          get asked about most, and the option that usually works out cheapest
          for each. London prices are our own; anything else is a general
          guide.
        </P>
        <DataTable
          head={["Scenario", "Usually cheapest", "Why"]}
          rows={[
            ["One marketplace armchair, across town", "Single item delivery (from £50)", "Fixed price, no minimum hours to fill"],
            ["Three-seater sofa to a second-floor flat", "Sofa delivery (from £55)", "Two people carry it; access is checked first"],
            ["Five or six pieces from two addresses", "Man & van, 2–3 hours", "One van does both pickups in a single booking"],
            ["A wardrobe and bed from London to Leeds", "Shared load or courier marketplace", "Long routes are cheaper when the van is going anyway"],
            ["Contents of a whole 1-bed flat", "Fixed removal (from £329)", "Price capped however long the stairs take"],
          ]}
        />
        <P>
          The pattern is simple: fixed single-item prices win for one or two
          pieces, hourly man &amp; van wins once you have several stops close
          together, and a fixed removal wins as soon as you’re moving a room’s
          worth or more. Long distances favour anyone who already has the van
          on that route.
        </P>
        <P>
          What we see on real jobs is that the cheapest-looking option often
          stops being cheapest at the front door. A single driver can’t safely
          take a three-seater up two flights alone, so either you carry the
          other end or the job gets rebooked with a second person. Always say
          how many floors there are and whether there’s a lift when you ask
          for a price.
        </P>
        <H2 id="prepare">How to prepare furniture for transport</H2>
        <P>
          A little preparation protects the furniture and shortens the job,
          which matters most when you’re paying by the hour.
        </P>
        <Check
          items={[
            "Empty drawers and cupboards — full drawers make a chest far heavier and can split the runners.",
            "Remove glass shelves and pack them separately, wrapped and labelled.",
            "Take off legs, feet and handles where they unscrew, and bag the fixings.",
            "Tape doors and drawers closed with low-tack tape that won’t mark the finish.",
            "Measure the item and the narrowest point of the route out, including turns on the stairs.",
            "Photograph the item before collection so its condition is clear.",
          ]}
        />
        <P>
          For flat-pack furniture, it’s often quicker and safer to take it
          apart than to carry it whole, especially wardrobes, which tend to
          twist when lifted assembled. If you’d rather not do it yourself, our{" "}
          <a href="/services/furniture-assembly">
            furniture assembly
          </a>{" "}
          team can dismantle and reassemble it as part of the job.
        </P>
        <H2 id="save">How to cut furniture transport costs</H2>
        <Steps
          items={[
            "Measure items, doorways and stairwells before booking so nothing gets turned away.",
            "Remove sofa legs, table legs and bed headboards in advance where you can.",
            "Group several pickups or drops into one booking.",
            "Be flexible on dates — mid-week slots are easier to fit in.",
            "Have the item ready at the door and parking sorted at both ends.",
            "Send clear photos so the right van and crew are sent first time.",
          ]}
        />
        <Tip>
          A wasted trip is the most expensive delivery of all. Five minutes with
          a tape measure saves it.
        </Tip>
        <H2 id="faqs">FAQs</H2>
        <Q>What is the cheapest way to transport furniture in the UK?</Q>
        <P>
          For a few items locally, a man &amp; van or single-item delivery is
          usually cheapest. For long routes with flexible dates, a courier
          marketplace can be competitive. For a whole home, a fixed removals
          quote is usually best value.
        </P>
        <Q>How much does it cost to move a sofa?</Q>
        <P>
          In London, our furniture and single item delivery starts from £50,
          with sofa runs priced on size, floors and distance.
        </P>
        <Q>Is my furniture insured in transit?</Q>
        <P>
          With Phi Movers, yes — every job includes goods-in-transit and public
          liability cover. With marketplace drivers, always check.
        </P>
        <ArticleCta
          title="Moving a few pieces of furniture?"
          body="Send photos and both postcodes — we’ll tell you the cheapest way to do it."
        />
        <P>
          Or <a href="/contact">contact us</a> directly for a fixed price.
        </P>
      </>
    ),
  },

  "car-transport-cost-uk": {
    toc: [
      { id: "typical", label: "Typical car delivery cost in the UK" },
      { id: "distance", label: "Cost by distance: 100 and 300 miles" },
      { id: "open-enclosed", label: "Open vs enclosed transport" },
      { id: "non-running", label: "Running vs non-running cars" },
      { id: "calculator", label: "Car delivery cost calculators" },
      { id: "prepare", label: "How to prepare your car for transport" },
      { id: "house-move", label: "Moving house and a car together" },
      { id: "questions", label: "Questions to ask a car transporter" },
      { id: "motorbikes", label: "Motorbikes and smaller vehicles" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          Moving house to the other end of the country, buying a car online or
          shipping a classic to a show? Car delivery cost in the UK depends on
          distance, the type of transport, and whether the car runs. This
          guide explains those factors, gives typical approximate prices for
          common distances, and shows how to get an accurate quote rather than
          a guess.
        </P>
        <P>
          The figures below are typical UK market ranges, not our prices. Our
          own{" "}
          <a href="/services/vehicle-transport">
            vehicle transport
          </a>{" "}
          is always priced as a custom quote based on your route and vehicle.
        </P>
        <H2 id="typical">Typical car delivery cost in the UK</H2>
        <P>
          For a standard running car on an open transporter, short local
          deliveries often start from around £100–£200, mid-distance moves are
          commonly a few hundred pounds, and end-to-end UK journeys can be
          £500–£900 or more. Enclosed transport, prestige vehicles and urgent
          dates sit above those ranges.
        </P>
        <Check
          items={[
            "Distance: the main driver — but cost per mile usually falls on longer trips.",
            "Transport type: open, enclosed, single-car trailer or driven delivery.",
            "Vehicle size and value: vans, 4x4s and prestige cars cost more.",
            "Condition: non-runners need winching and suitable equipment.",
            "Timing: fixed or urgent dates cost more than flexible ones.",
            "Access: narrow streets and restricted parking at either end.",
          ]}
        />
        <H2 id="distance">Cost by distance: 100 and 300 miles</H2>
        <P>
          Two of the most common questions are how much to transport a car 100
          miles in the UK, and how much to transport a car 300 miles. These
          are broad, approximate ranges for a standard running car:
        </P>
        <DataTable
          head={["Distance", "Example route", "Open transport (approx.)", "Enclosed (approx.)"]}
          rows={[
            ["Under 50 miles", "Across London", "£100–£200", "£200–£350"],
            ["Around 100 miles", "London to Birmingham", "£150–£300", "£300–£500"],
            ["Around 200 miles", "London to Manchester", "£250–£450", "£450–£700"],
            ["Around 300 miles", "London to Newcastle", "£350–£600", "£550–£900"],
            ["400+ miles", "London to Edinburgh", "£450–£900", "£700–£1,200+"],
          ]}
        />
        <P>
          Treat these as a sense-check. Prices change with fuel costs, demand
          and how well your route matches a transporter’s existing schedule.
        </P>
        <P>
          You’ll notice the price doesn’t double when the distance does. A
          large part of the cost is fixed — loading, securing the car,
          paperwork and getting the transporter to the collection point — so
          longer journeys usually work out cheaper per mile. Popular motorway
          routes between big cities also tend to be better value than remote
          rural addresses, where a transporter may have to make a special trip.
        </P>
        <P>
          Driven delivery (where a trade plate driver drives your car to its
          destination) can sometimes be cheaper on short routes, but it adds
          mileage and wear. Most people moving house prefer the car to travel
          on a transporter.
        </P>
        <H2 id="open-enclosed">Open vs enclosed transport</H2>
        <P>
          Open transporters are the multi-car lorries you see on motorways.
          They’re the cheapest option per car, and fine for most everyday
          vehicles. Enclosed transport protects the car from weather and road
          debris and suits classics, prestige cars and anything with paintwork
          you’d rather not risk — at a higher price.
        </P>
        <Tip>
          A single-car trailer or enclosed van usually means a direct journey
          on your date, rather than waiting for a multi-drop route to fill.
        </Tip>
        <H2 id="non-running">Running vs non-running cars</H2>
        <P>
          A non-running car needs to be winched on and off, which takes more
          time and the right equipment. Expect a surcharge, and tell your
          transporter upfront — including whether the wheels turn and the
          steering and handbrake work. Arriving with the wrong equipment is
          the quickest way to a failed collection.
        </P>
        <P>
          The same applies to cars with flat tyres, low ground clearance or
          modifications. Lowered sports cars may need a transporter with a
          gentle ramp angle, and very large vehicles may not fit on a standard
          trailer. The more you describe upfront, the more accurate the price.
        </P>
        <H2 id="calculator">Car delivery cost calculators</H2>
        <P>
          A car delivery cost calculator in the UK can give you a ballpark in
          seconds, but most only factor in distance and vehicle size. They
          won’t know about a tight mews, a non-runner or a specific date. For
          an accurate price, share:
        </P>
        <Steps
          items={[
            "Collection and delivery postcodes.",
            "Make, model and whether the car runs.",
            "Your preferred dates and how flexible they are.",
            "Access notes and photos at both ends.",
            "Whether you need open or enclosed transport.",
          ]}
        />
        <Figure
          seed="complete-guide-to-moving-home-in-london"
          alt="A removals van parked on a London residential street"
          caption="Moving house and a car at the same time? Ask for both in one quote."
        />
        <H2 id="prepare">How to prepare your car for transport</H2>
        <Check
          items={[
            "Wash the car so existing marks are easy to see, then photograph every side.",
            "Remove personal items and anything loose in the boot.",
            "Leave around a quarter of a tank — enough to load, not extra weight.",
            "Fold mirrors, remove roof boxes and secure aerials.",
            "Note the mileage and any warning lights before collection.",
            "Hand over a spare key if the transporter asks for one.",
          ]}
        />
        <P>
          A simple condition check at collection and delivery, signed by both
          sides, protects you and the driver if there’s ever a question about
          damage.
        </P>
        <H2 id="house-move">Moving house and a car together</H2>
        <P>
          Most of the car transport enquiries we see come from people moving
          home a long way — London to Scotland, the North East or the South
          West — who have two cars and only one driver, or who would rather not
          spend a day on the motorway after loading a house. In that case, the
          car is one more item on the moving plan, and the timing matters as
          much as the price.
        </P>
        <Steps
          items={[
            "Decide whether the car needs to arrive before you, with you or after you.",
            "Check parking at the new address — a transporter needs room to unload, and some streets can’t take one.",
            "Agree a meeting point if the street is too narrow, such as a nearby wider road or car park.",
            "Keep the documents, spare key and any locking wheel nut with you, not in the removals van.",
            "Tell your insurer the car’s new address once it’s delivered.",
          ]}
        />
        <P>
          Flexibility saves money here. If the car can travel a few days either
          side of your moving date, a transporter can fit it onto a route it’s
          already running rather than making a dedicated trip. If you need the
          car on the same day as the keys, expect that to be reflected in the
          price.
        </P>
        <P>
          What we see on real jobs is that the street at the delivery end is
          the most common problem. A large multi-car transporter can’t always
          get down a residential road lined with parked cars, so the handover
          happens round the corner. Sending a photo of the street and
          mentioning width or weight restrictions when you ask for a quote
          avoids a failed delivery.
        </P>
        <H2 id="questions">Questions to ask a car transporter</H2>
        <P>
          Prices for the same route can vary widely, so compare like with like.
          Before you book, ask:
        </P>
        <Check
          items={[
            "Is the price fixed, and does it include fuel, tolls and any charging zones?",
            "Will the car travel on an open or enclosed transporter, and is it a direct journey?",
            "What is the goods-in-transit limit, and does it cover the car’s full value?",
            "How is the condition check done at collection and delivery?",
            "What are the collection and delivery windows — a set day, or a range of days?",
            "What happens, and who pays, if the car can’t be collected or delivered as planned?",
          ]}
        />
        <P>
          Get the answers in writing. If anything is vague — particularly the
          insurance — treat it as a reason to keep looking rather than a
          detail to sort out later.
        </P>
        <H2 id="motorbikes">Motorbikes and smaller vehicles</H2>
        <P>
          Motorbikes are much simpler: they can travel securely strapped in a
          van, sometimes alongside your other belongings. Our{" "}
          <a href="/services/motorbike-transport">
            motorbike transport
          </a>{" "}
          starts from £80.
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>How much to transport a car 100 miles in the UK?</Q>
        <P>
          Typically around £150–£300 on an open transporter for a standard
          running car, more for enclosed or non-running vehicles.
        </P>
        <Q>How much to transport a car 300 miles in the UK?</Q>
        <P>
          Roughly £350–£600 on open transport and around £550–£900 enclosed,
          depending on the route, vehicle and dates.
        </P>
        <Q>Is car transport insured?</Q>
        <P>
          Reputable transporters carry goods-in-transit cover. Always ask what
          the limit is and check it covers your car’s value.
        </P>
        <Q>Do you transport cars as well as house contents?</Q>
        <P>
          Yes. Vehicle transport is quoted individually, and we can coordinate
          it with your house move.
        </P>
        <ArticleCta
          title="Need a car moved?"
          body="Send the route, vehicle and dates — we’ll come back with a custom quote."
        />
        <P>
          See <a href="/services/vehicle-transport">vehicle transport</a> or{" "}
          <a href="/contact">contact us</a>.
        </P>
      </>
    ),
  },

  "man-and-van-prices-uk": {
    toc: [
      { id: "how", label: "How man and van pricing works" },
      { id: "rates", label: "Typical man and van prices across the UK" },
      { id: "included", label: "What should be included" },
      { id: "hidden", label: "Hidden costs to watch for" },
      { id: "london", label: "Man and van prices in London" },
      { id: "examples", label: "Example costs for common jobs" },
      { id: "bill", label: "How an hourly bill adds up" },
      { id: "quote", label: "How to get an accurate quote" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          Man and van prices in the UK look simple — an hourly rate — but two
          quotes with the same rate can end up very different bills. Whether
          you’re comparing man with a van prices in Sheffield, Liverpool,
          Manchester or London, the same rules apply: check the minimum hours,
          how time is billed, what’s included and what counts as an extra.
          This guide explains how it works, gives typical hourly ranges and
          shows exactly what our London man &amp; van costs.
        </P>
        <H2 id="how">How man and van pricing works</H2>
        <P>
          Most man and van firms charge by the hour, from when the van arrives
          to when the last item is unloaded. On top of the rate, look at:
        </P>
        <Check
          items={[
            "Minimum booking: often two hours, sometimes more at weekends.",
            "Billing increments: 15 minutes, 30 minutes or full hours after the minimum.",
            "Number of people: one driver-helper, or an extra helper for heavy items.",
            "Mileage: some include local miles; others charge fuel or mileage separately.",
            "Travel time: some charge for driving to your first address.",
          ]}
        />
        <P>
          For bigger moves, many firms will switch to a fixed price — which is
          often fairer for both sides.
        </P>
        <H2 id="rates">Typical man and van prices across the UK</H2>
        <P>
          These are broad, approximate ranges based on the wider UK market,
          not quotes. Prices depend on van size, crew and demand.
        </P>
        <DataTable
          head={["Area", "1 person + van (approx.)", "2 people + van (approx.)"]}
          rows={[
            ["Smaller towns", "£35–£55/hour", "£50–£75/hour"],
            ["Northern cities (e.g. Sheffield, Liverpool, Leeds)", "£40–£60/hour", "£55–£85/hour"],
            ["Large cities (e.g. Manchester, Birmingham, Bristol)", "£45–£65/hour", "£60–£90/hour"],
            ["London", "£50–£75/hour", "£70–£100/hour"],
          ]}
        />
        <P>
          A cheaper hourly rate isn’t always cheaper overall. A small van with
          one person might take twice as long as a Luton with two, and you’ll
          pay for every extra hour.
        </P>
        <P>
          That’s why searches like “man with a van Sheffield prices” or “man
          and van Liverpool prices” turn up such a wide spread. Rates differ
          between cities, but they differ just as much between firms in the
          same city, depending on van size, whether a second person is
          included and how time is billed. Comparing the total for your job,
          rather than the hourly rate, is the only fair test.
        </P>
        <P>
          Demand also moves the price. Fridays, Saturdays and the last few days
          of the month are the busiest times for moves everywhere in the UK.
          Some firms charge more at weekends or set longer minimums; mid-week
          mornings are usually the easiest slots to book.
        </P>
        <Figure
          seed="man-and-van-vs-full-removal"
          alt="A man and van loading boxes outside a flat"
          caption="The right van size and crew usually saves more than a lower hourly rate."
        />
        <H2 id="included">What should be included</H2>
        <Check
          items={[
            "A clean, suitably sized van with blankets, straps and a trolley.",
            "Help loading and unloading — not just driving.",
            "Basic dismantling and reassembly of beds or tables, if agreed.",
            "Goods-in-transit and public liability insurance.",
            "A clear written price: rate, minimum, increments and extras.",
          ]}
        />
        <H2 id="hidden">Hidden costs to watch for</H2>
        <Check
          items={[
            "Charging from the depot rather than from arrival at your address.",
            "Fuel or mileage charges beyond a small local radius.",
            "Congestion Charge, ULEZ, tolls and parking — who pays?",
            "Stairs or long-carry surcharges not mentioned upfront.",
            "Packing materials added on the day.",
            "Minimum hours that are longer than advertised at weekends.",
          ]}
        />
        <Tip>
          Ask “what would make this cost more than the quote?” A good firm will
          give you a straight answer before you book.
        </Tip>
        <H2 id="london">Man and van prices in London</H2>
        <P>
          Our{" "}
          <a href="/services/man-and-van">
            London man &amp; van
          </a>{" "}
          pricing is deliberately simple:
        </P>
        <Check
          items={[
            "From £50/hour with a two-hour minimum (from £100).",
            "Billed in 30-minute blocks after the minimum.",
            "First 10 miles included.",
            "Extra helper: £20/hour.",
            "Loading help and insurance included, across all 32 boroughs.",
          ]}
        />
        <P>
          For a studio or a few big items that’s usually the cheapest
          option. For a full flat or house, we’ll often suggest a fixed quote
          instead — studio moves from £249, one-beds from £329 — so you’re not
          watching the clock. Not sure which suits you? Read{" "}
          <a href="/blog/man-and-van-vs-full-removal">
            man &amp; van vs full removal
          </a>
          .
        </P>
        <H2 id="examples">Example costs for common jobs</H2>
        <P>
          These examples use our London rates and typical timings with
          reasonable access. Your job may be quicker or slower depending on
          stairs, parking and how ready everything is.
        </P>
        <DataTable
          head={["Job", "Typical time", "Crew", "Approx. cost"]}
          rows={[
            ["Single sofa or wardrobe, local", "Up to 2 hours", "Driver + helper", "From £50 as a single item delivery"],
            ["A few items from a marketplace", "2 hours", "Driver", "£100 (two-hour minimum)"],
            ["Student room or small studio", "2–3 hours", "Driver", "£100–£150"],
            ["Studio with stairs", "3 hours", "Driver + helper", "Around £210"],
            ["1-bed flat", "3–4 hours", "Driver + helper", "Around £210–£280"],
          ]}
        />
        <P>
          Once a move reaches a full one-bed or more, compare the hourly total
          with a fixed quote — one-bed removals start from £329 with the price
          locked in before the day.
        </P>
        <H2 id="bill">How an hourly bill adds up</H2>
        <P>
          The easiest way to understand man and van prices is to follow one
          job from start to finish. Here’s a studio move in London with a
          driver and an extra helper, using our rates of £50/hour plus
          £20/hour for the helper, a two-hour minimum and 30-minute blocks
          after that.
        </P>
        <DataTable
          head={["Stage", "Time", "Running total"]}
          rows={[
            ["Arrive, walk-round, dismantle bed", "20 minutes", "Within the two-hour minimum"],
            ["Load boxes and furniture (second floor, no lift)", "1 hour 10 minutes", "Within the two-hour minimum"],
            ["Drive 4 miles across town", "30 minutes", "Two-hour minimum reached: £140"],
            ["Unload and reassemble bed", "45 minutes", "Billed as two 30-minute blocks: £210"],
          ]}
        />
        <P>
          Total time was 2 hours 45 minutes, which rounds up to three hours in
          30-minute blocks: £150 for the van and driver plus £60 for the
          helper, or £210 in all. The drive was within the 10 miles included,
          so there was no mileage charge.
        </P>
        <P>
          Now imagine the same job with the boxes still half packed when the
          van arrived. An extra 40 minutes of packing on the day pushes the
          total to three and a half hours — another £35 — and that’s before
          anyone has had to wait for a parking space. This is why the same
          hourly rate can produce very different bills, and why preparation
          matters more on man &amp; van than on any other kind of move.
        </P>
        <P>
          What we see on real jobs is that an extra helper usually pays
          for themselves on walk-ups. On a ground-floor flat a single driver can move
          steadily; on a third floor without a lift, two people carrying
          together are much more than twice as quick on the big pieces, and
          safer for the walls and banisters too.
        </P>
        <Check
          items={[
            "Small or medium van: single items, student rooms and small studios.",
            "Luton van: most studios and 1-bed flats in one trip, with room for a sofa and bed.",
            "Second trip: if the van is too small, the return journey is billed time — pick the bigger van.",
            "Extra helper: worth it for stairs, heavy furniture or long carries from the parking spot.",
          ]}
        />
        <H2 id="quote">How to get an accurate man and van quote</H2>
        <Steps
          items={[
            "List the big items: sofa, beds, wardrobes, fridge, washing machine.",
            "Estimate the boxes — and be honest, it’s usually more than you think.",
            "Give the floors and lift details at both addresses.",
            "Say where the van can park and how far the carry is.",
            "Send photos of anything awkward or unusually heavy.",
          ]}
        />
        <P>
          With that information, a good firm can tell you roughly how many
          hours to expect — and whether you’d be better off on a fixed price.
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>How much is a man and van per hour in the UK?</Q>
        <P>
          Typically around £35–£65/hour for one person and a van, and more for
          two people or in London. Ours start from £50/hour.
        </P>
        <Q>Is there a minimum charge?</Q>
        <P>
          Most firms have one. Ours is two hours, then billed in 30-minute
          blocks.
        </P>
        <Q>Do I need to help carry?</Q>
        <P>
          No — loading help is included. If you have heavy items or lots of
          stairs, an extra helper (£20/hour) usually speeds things up.
        </P>
        <Q>When is a fixed price better than hourly?</Q>
        <P>
          For whole flats and houses, or anywhere stairs and access could make
          time unpredictable, a fixed quote is usually better value.
        </P>
        <Q>Is a bigger van more expensive?</Q>
        <P>
          Not necessarily in total. If a smaller van means a second trip, the
          extra driving time usually costs more than the right-sized van would
          have. Tell us roughly what you’re moving and we’ll suggest the size.
        </P>
        <ArticleCta
          title="Want a man & van price?"
          body="Send photos and postcodes — we’ll estimate the hours or quote a fixed price."
        />
        <P>
          Or <a href="/contact">contact us</a> to book.
        </P>
      </>
    ),
  },

  "what-is-a-removal-service": {
    toc: [
      { id: "what", label: "What is a removal service?" },
      { id: "types", label: "Types of removal service" },
      { id: "process", label: "How a removal works, step by step" },
      { id: "included", label: "What’s included — and what isn’t" },
      { id: "need", label: "Do you need a removal service?" },
      { id: "choose", label: "How to choose a removal company" },
      { id: "red-flags", label: "Warning signs to watch for" },
      { id: "ask", label: "Questions to ask before you book" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          What is a removal service? Put simply, it’s a company that moves your
          belongings from one property to another — but a good removal service
          does far more than drive a van. It plans the move, provides the right
          crew and vehicle, protects your furniture, and can take care of
          packing, storage and awkward items too. Here’s what removal companies
          actually do, the main types of service, and how to pick the right
          one.
        </P>
        <H2 id="what">What is a removal service?</H2>
        <P>
          A removal service (or removals company) is a business that handles
          the physical side of moving home or office. At a minimum, that means
          a van, a trained crew, loading, transport and unloading. Most also
          offer packing, dismantling and reassembly, storage and specialist
          handling — and a professional firm will be insured for your goods in
          transit and for any damage to property.
        </P>
        <P>
          The difference between a removal service and simply hiring a van is
          responsibility. With van hire, you plan, lift, drive and carry the
          risk. With a removal company, a trained crew does the work, the job
          is insured, and — with a fixed quote — the price is agreed before
          the day. You’re paying for experience as much as muscle: knowing how
          to take a wardrobe round a tight landing, how to load a van so
          nothing shifts, and how long a three-storey walk-up really takes.
        </P>
        <Figure
          seed="studio-flat-move-checklist"
          alt="Packed boxes and wrapped furniture ready for a removals crew"
          caption="A removal service covers the planning, protection and heavy lifting — not just the van."
        />
        <H2 id="types">Types of removal service</H2>
        <DataTable
          head={["Service", "What it covers", "Best for"]}
          rows={[
            ["Full house removal", "Fixed-price move of a whole home with crew and van", "Flats and houses"],
            ["Man & van", "Hourly van with driver who helps load", "Small moves and single items"],
            ["Packing", "Full or fragile-only packing, plus materials", "Busy movers and kitchens"],
            ["Storage", "Secure storage between properties", "Gaps between completion dates"],
            ["Specialist", "Pianos, antiques, safes and large artwork", "Heavy or valuable items"],
            ["Vehicle & international", "Car transport and moves abroad", "Relocations"],
          ]}
        />
        <P>
          In London, our{" "}
          <a href="/services/house-removals">
            house removals
          </a>{" "}
          start from £249 for a studio and £499 for a 2-bed house; man &amp; van
          from £50/hour (two-hour minimum); full packing from £150; storage from
          £15/week; and piano and specialist moves from £180.
        </P>
        <P>
          Many moves combine several of these. A typical family move might be a
          full house removal with fragile-only packing for the kitchen, a
          specialist crew for the piano and a few weeks of storage while the
          new place is decorated. A good removal company will put that together
          as one plan and one price, rather than leaving you to coordinate
          separate suppliers.
        </P>
        <H2 id="process">How a removal works, step by step</H2>
        <Steps
          items={[
            "Quote: you share addresses and an inventory, or book a free home survey.",
            "Plan: date, crew size, vehicle and any parking or lift bookings are agreed.",
            "Pack: you pack, or the crew packs for you the day before or that morning.",
            "Load: furniture is wrapped and protected, then loaded safely.",
            "Move: your belongings travel insured to the new address.",
            "Unload: items go into the right rooms and beds are reassembled.",
          ]}
        />
        <P>
          In London, planning also means parking. Many streets need a
          suspended bay or permit for a removals van, and mansion blocks often
          need lift bookings or porter notice. An experienced local company
          will flag these when they quote, not on the morning of the move.
        </P>
        <H2 id="included">What’s included — and what isn’t</H2>
        <P>
          One of the most common sources of friction on moving day is a
          different idea of what the price covers. Most of it is
          straightforward, but it’s worth checking the grey areas in writing.
        </P>
        <DataTable
          head={["Task", "Usually included", "Usually extra or excluded"]}
          rows={[
            ["Loading, transport and unloading", "Yes", "—"],
            ["Wrapping furniture in blankets", "Yes", "Specialist crating for artwork or antiques"],
            ["Dismantling beds and tables", "Often, if listed at quote stage", "Complex wardrobes, wall-mounted units"],
            ["Packing boxes", "Only if booked", "Full packing (from £150) or fragile-only (from £80)"],
            ["Disconnecting appliances", "Moving them, yes", "Plumbing or gas work needs a qualified trade"],
            ["Taking down TVs, shelves and curtain poles", "Rarely", "A handyman job, best done before the day"],
            ["Disposing of unwanted items", "No", "A clearance service, booked separately"],
          ]}
        />
        <P>
          The appliance line catches people out most often. A crew will carry a
          washing machine, but disconnecting a gas cooker must be done by a Gas
          Safe registered engineer, and plumbing a dishwasher into a new
          kitchen is a job for a plumber. Book those trades for either side of
          the move.
        </P>
        <P>
          What we see on real jobs is that the smoothest moves are the ones
          where the customer has already decided what isn’t coming. A sticker
          or a note on anything staying behind — the landlord’s bedside
          table, the old fridge in the garage — saves a lot of questions and
          stops things being loaded by mistake.
        </P>
        <H2 id="need">Do you need a removal service?</H2>
        <P>
          Not every move needs a full removals team. If you’re moving a few
          boxes and a bed across town and you have help, a man &amp; van may
          be all you need. A full removal service makes sense when:
        </P>
        <Check
          items={[
            "You’re moving a whole flat or house, not a few items.",
            "There are stairs, no lift or heavy furniture.",
            "You want the total price fixed before moving day.",
            "You don’t have the time — or the helpers — to pack and carry.",
            "Your completion dates don’t line up and you need storage.",
            "You have valuable, fragile or specialist items.",
          ]}
        />
        <H2 id="choose">How to choose a removal company</H2>
        <Check
          items={[
            "Fixed, written quotes — not vague estimates.",
            "Proper insurance: goods-in-transit and public liability.",
            "Recent, genuine reviews from local customers.",
            "Clear terms on cancellation, waiting time and delays.",
            "Local knowledge — in London, of parking, permits and building rules.",
            "A survey, in person or by video, for anything larger than a flat.",
          ]}
        />
        <Tip>
          The cheapest quote is often the one that missed something. Compare
          what’s included, not just the headline figure.
        </Tip>
        <H2 id="red-flags">Warning signs to watch for</H2>
        <P>
          Most removal companies are honest, but a few habits are worth
          treating as a reason to look elsewhere:
        </P>
        <Check
          items={[
            "A price given over the phone without any idea of what you own or the access at each end.",
            "No written quote, or a quote that only says “estimate” with no detail.",
            "Unable or unwilling to tell you what insurance they hold.",
            "A large cash deposit requested well before the move.",
            "No landline, address or trading history you can check.",
            "Pressure to book today to keep a price.",
          ]}
        />
        <P>
          A good company will be happy to explain how it reached the price,
          what would change it and what happens if something goes wrong.
        </P>
        <H2 id="ask">Questions to ask before you book</H2>
        <Check
          items={[
            "Is the price fixed, and what could change it?",
            "What insurance do you have, and what’s the limit?",
            "How many movers and what size van are you sending?",
            "Do you dismantle and reassemble furniture?",
            "What happens if completion is delayed on the day?",
            "Can you store items if my dates don’t line up?",
          ]}
        />
        <H2 id="faqs">FAQs</H2>
        <Q>What’s the difference between a removal company and a man &amp; van?</Q>
        <P>
          A man &amp; van is usually hourly and suits small moves. A removal
          company typically offers fixed prices, bigger crews and extras like
          packing and storage. See{" "}
          <a href="/blog/man-and-van-vs-full-removal">
            man &amp; van vs full removal
          </a>
          .
        </P>
        <Q>Do removal companies pack for you?</Q>
        <P>
          Most offer it. Ours ranges from fragile-only packing (from £80) to
          full packing (from £150).
        </P>
        <Q>Are removal services insured?</Q>
        <P>
          Reputable firms are. Every Phi Movers job includes goods-in-transit
          and public liability cover.
        </P>
        <Q>How much does a removal service cost?</Q>
        <P>
          It depends on size, distance and access — see our guide to{" "}
          <a href="/blog/how-much-does-it-cost-to-move-house-uk">
            how much it costs to move house
          </a>
          .
        </P>
        <ArticleCta
          title="Looking for a removal service in London?"
          body="Tell us about your move — we’ll recommend the right service and fix the price."
        />
        <P>
          See <a href="/services/house-removals">house removals</a> or{" "}
          <a href="/contact">contact us</a>.
        </P>
      </>
    ),
  },

  "how-to-hoist-a-sofa-through-a-window-or-balcony": {
    toc: [
      { id: "when", label: "When does a sofa need hoisting?" },
      { id: "measure", label: "Measurements to take first" },
      { id: "checks", label: "Window and balcony checks" },
      { id: "permission", label: "Permissions: landlord and building" },
      { id: "diy", label: "Why DIY rope lifts are risky" },
      { id: "job", label: "What a professional hoist job involves" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          How do you hoist a sofa into a flat when it won’t go up the stairs?
          Lifting furniture over a balcony or through a window is a real,
          everyday solution in London — but it’s one that needs planning,
          the right equipment and a trained crew. This guide explains when a
          furniture hoist is genuinely the best option, the measurements to
          take before you call anyone, the window and balcony checks that
          decide whether it’s possible, the permissions you’ll need and what a
          professional hoist job looks like on the day.
        </P>
        <P>
          If you already know your sofa can’t go up the stairs, our{" "}
          <a href="/services/sofa-and-furniture-hoisting">
            sofa and furniture hoisting
          </a>{" "}
          service can assess your property from photos. Every hoist is priced
          as a custom quote, because no two buildings are the same.
        </P>
        <H2 id="when">When does a sofa need hoisting?</H2>
        <P>
          Hoisting is the last resort, not the first. Most sofas that look
          stuck can be brought in another way — feet off, back cushions out,
          a door taken off its hinges, or the frame partly dismantled. We cover
          those options in{" "}
          <a href="/blog/sofa-wont-fit-up-the-stairs">
            what to do when your sofa won’t fit up the stairs
          </a>
          . Hoisting makes sense when:
        </P>
        <Check
          items={[
            "The staircase has a tight turn or low ceiling that the sofa physically can’t clear, even upended.",
            "The sofa is a one-piece frame that can’t be dismantled without damaging it.",
            "There’s no lift, or the lift is too small for the item.",
            "A window, French door or balcony on the front or rear of the building gives a clear opening that is larger than the sofa.",
            "You’d rather not risk scraping a newly decorated stairwell or a listed building’s banisters.",
          ]}
        />
        <P>
          It isn’t only sofas. Large wardrobes, American-style fridge freezers,
          king-size bed bases and corner units are all lifted this way when the
          stairs won’t cooperate. The same principles apply to each.
        </P>
        <H2 id="measure">Measurements to take first</H2>
        <P>
          Good measurements decide whether a hoist is possible before anyone
          visits. Use a metal tape, measure twice and write everything down in
          centimetres.
        </P>
        <DataTable
          head={["Measure", "Where", "Why it matters"]}
          rows={[
            ["Sofa length, depth and height", "At the widest points, including arms and feet", "The sofa must pass through the opening with room to spare"],
            ["Diagonal depth", "From the top of the back to the front edge of the seat", "Often lets a sofa tilt through a smaller opening"],
            ["Window or door opening", "Clear width and height once fully open, not the frame", "Sashes, mullions and stays reduce the usable space"],
            ["Balcony railing height", "From the balcony floor to the top rail", "The sofa has to be lifted clear of it"],
            ["Height from the ground", "Pavement or garden to the opening", "Decides the equipment and rigging needed"],
            ["Ground space below", "Clear area beneath the opening", "Somewhere safe to stage the lift and keep people away"],
          ]}
        />
        <P>
          Photographs help as much as numbers. Take one of the whole elevation
          from the street or garden, one of the opening from inside, one of the
          balcony or ledge, and one of the sofa from each side. That set is
          usually enough for a crew to say whether it’s worth a site visit.
        </P>
        <Tip>
          Measure the opening you actually have, not the window frame. A sash
          window that only opens halfway gives you half the height.
        </Tip>
        <H2 id="checks">Window and balcony checks</H2>
        <P>
          Not every opening that looks big enough can be used. Before a lift
          goes ahead, a crew will check:
        </P>
        <Check
          items={[
            "Whether the window can be fully opened or removed — some casements and sashes can be taken out by a glazier and refitted after.",
            "The condition of the frame and sill, which mustn’t take any weight from the load.",
            "Balcony railings: whether the sofa can pass over them without leaning on or levering against them.",
            "Overhead obstructions: cables, satellite dishes, trees, signage and balconies above.",
            "The ground below: railings, basement lightwells, steps, parked cars and how pedestrians can be kept clear.",
            "Wind and weather on the day, as a large sofa catches the wind like a sail.",
          ]}
        />
        <P>
          What we see on real jobs is that the ground is as important as the
          opening. A perfect French door on the second floor is no use if the
          only space below it is a basement lightwell with spiked railings, or
          a busy pavement with no way to keep people out of the lift zone.
        </P>
        <Figure
          seed="prepare-for-flat-move-london"
          alt="A London mansion block with balconies above a residential street"
          caption="Balconies and full-height windows are the most common openings used for hoisting in London flats."
        />
        <H2 id="permission">Permissions: landlord and building management</H2>
        <P>
          A hoist uses the outside of the building, so it’s rarely just your
          decision. Ask early, because getting answers can take a few days.
        </P>
        <Steps
          items={[
            "Check your lease or tenancy for rules on alterations, windows and use of balconies.",
            "Ask your landlord in writing if you rent — especially if a window needs removing.",
            "Contact the managing agent or building management for flats; many have a process for lifts and contractors.",
            "Ask whether the building needs to see the contractor’s insurance and a risk assessment.",
            "If the lift happens over the pavement, check with the crew whether any local authority permission is needed for that spot.",
            "Tell the neighbours below — a lift past their windows is less alarming with a note through the door.",
          ]}
        />
        <P>
          Listed buildings and conservation areas can carry extra restrictions,
          particularly on removing original windows. If in doubt, ask your
          building manager before booking anything.
        </P>
        <H2 id="diy">Why DIY rope lifts are risky</H2>
        <P>
          It’s tempting to borrow some rope, gather three friends and haul the
          sofa up over the balcony. Please don’t. A three-seater sofa is heavy,
          awkward and unbalanced, and once it’s off the ground there’s very
          little anyone can do if it slips.
        </P>
        <Check
          items={[
            "Ordinary rope and knots aren’t rated for lifting and can fail or slip without warning.",
            "Hauling by hand puts people at the top close to an open edge, leaning out at height.",
            "Railings, sills and frames aren’t designed to carry a load being dragged over them.",
            "A swinging sofa can hit windows, people below or the building.",
            "Home and contents insurance may not cover damage caused this way — check before you take the risk.",
          ]}
        />
        <P>
          In the UK, lifting operations carried out at work fall under the
          Lifting Operations and Lifting Equipment Regulations (LOLER), which
          require lifts to be planned, supervised and carried out with suitable
          equipment. That’s the standard to expect from anyone you pay to do
          the job.
        </P>
        <H2 id="job">What a professional hoist job involves</H2>
        <P>
          A professional sofa hoist is mostly planning. The lift itself is often
          the quickest part of the day.
        </P>
        <Steps
          items={[
            "Assessment: measurements and photos, then a site visit if needed to confirm the opening, anchor points and ground space.",
            "Quote and paperwork: a custom price, plus a risk assessment and method statement for your building if management asks for one.",
            "Preparation: windows removed if needed, the sofa wrapped and padded, and the lift zone below cordoned off.",
            "Rigging: suitable lifting equipment set up by trained staff, with the load secured and guided.",
            "The lift: the sofa raised steadily with someone controlling it from below and receiving it above.",
            "Finish: the sofa carried to its room, the window refitted if it was removed, and the area left clear.",
          ]}
        />
        <P>
          Ask any company you’re considering how they will lift the item, who
          will be on site, what insurance they hold and what happens if the
          weather turns on the day. Clear answers are a good sign.
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>How much does it cost to hoist a sofa?</Q>
        <P>
          It depends on the height, the opening, the equipment needed and
          whether a window must be removed. We quote every hoist individually
          after seeing photos — there’s no one-size price.
        </P>
        <Q>Can any sofa be hoisted?</Q>
        <P>
          Only if there’s an opening big enough, safe ground space below and
          permission from the building. Some properties simply can’t be
          hoisted safely, in which case dismantling may be the answer.
        </P>
        <Q>Do I need my landlord’s permission?</Q>
        <P>
          If you rent, yes — and in most flats you’ll need the managing agent’s
          agreement too, particularly if a window needs removing.
        </P>
        <Q>Can you hoist other furniture?</Q>
        <P>
          Yes. Wardrobes, bed bases, large fridges and other bulky items are
          lifted the same way when the stairs won’t take them.
        </P>
        <ArticleCta
          title="Sofa won’t go up the stairs?"
          body="Send photos of the sofa, the stairs and the window or balcony — we’ll tell you whether a hoist is possible and quote it."
        />
        <P>
          See{" "}
          <a href="/services/sofa-and-furniture-hoisting">
            sofa and furniture hoisting
          </a>{" "}
          or <a href="/contact">contact us</a>.
        </P>
      </>
    ),
  },

  "sofa-wont-fit-up-the-stairs": {
    toc: [
      { id: "first", label: "First, check why it won’t fit" },
      { id: "feet", label: "Option 1: remove feet and cushions" },
      { id: "dismantle", label: "Option 2: dismantle the sofa" },
      { id: "door-window", label: "Option 3: remove a door or window" },
      { id: "hoist", label: "Option 4: hoist it in" },
      { id: "return", label: "Option 5: return or swap it" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          Your sofa won’t fit up the stairs. It’s wedged on the half-landing,
          the delivery driver is shrugging and you’re wondering whether you’ve
          just bought a very expensive hallway ornament. Don’t panic — this is
          one of the most common problems we’re called about in London, and
          most stuck sofas do end up in the living room. This guide walks
          through the options in the order we’d try them, from the simplest to
          the most involved.
        </P>
        <H2 id="first">First, check why it won’t fit</H2>
        <P>
          A sofa usually gets stuck for one of three reasons, and the fix
          depends on which one it is.
        </P>
        <DataTable
          head={["Where it sticks", "Likely problem", "Most likely fix"]}
          rows={[
            ["Front door or flat door", "Width of the opening", "Remove feet, take the door off its hinges"],
            ["Turn on the stairs", "Length of the sofa against the landing", "Upend and pivot, or dismantle"],
            ["Low ceiling over the stairs", "Height when tilted", "Remove the back or arms if they detach"],
            ["Doorway into the room", "Width plus the turn from the hallway", "Door off, feet off, careful angling"],
          ]}
        />
        <P>
          Measure the sofa’s depth and height, and the diagonal from the top
          of the back to the front edge of the seat. The diagonal is often
          smaller than the depth, which is why tilting a sofa back through a
          doorway can work when carrying it flat can’t. Then measure the
          narrowest point of the route: door widths, stair width, and the
          ceiling height above the tightest turn.
        </P>
        <Tip>
          Stop before anything is forced. A scraped wall can be repainted, but
          a cracked sofa frame or snapped spindle can’t be undone.
        </Tip>
        <H2 id="feet">Option 1: remove feet and cushions</H2>
        <P>
          It sounds obvious, but this solves more stuck sofas than anything
          else. Feet can add several centimetres, and they catch on door
          frames.
        </P>
        <Check
          items={[
            "Turn the sofa on its back and unscrew the feet — most twist off or use a single bolt.",
            "Take out seat and back cushions if they’re loose, and carry them separately.",
            "Check underneath for bolts holding the arms or back — some unbolt in minutes.",
            "Wrap the sofa in a blanket or cover so it can slide against walls without marking.",
            "Bag and label every fixing, and tape the bag to the frame.",
          ]}
        />
        <P>
          Once the feet are off, try carrying the sofa upright on its end
          through the tight section, pivoting it around the turn. Experienced
          movers do this almost by instinct; it takes two people at least, and
          three is better on a narrow London staircase.
        </P>
        <H2 id="dismantle">Option 2: dismantle the sofa</H2>
        <P>
          Many sofas are designed to come apart, even if the manual doesn’t
          make a fuss about it. Modular and corner sofas separate into
          sections; some models have backs or arms that slot or bolt on. Look
          for:
        </P>
        <Check
          items={[
            "Brackets or clips joining corner and modular sections.",
            "Bolts through the frame under a zipped or stapled fabric panel underneath.",
            "Slot-in backs that lift out once the bolts are released.",
            "Sofa beds, where the mechanism can sometimes be removed to lighten the frame.",
          ]}
        />
        <P>
          If the sofa isn’t designed to come apart, some specialists can
          partially dismantle the frame and rebuild it inside. That’s skilled
          work — taking out staples, opening fabric and refitting it neatly —
          and it may affect the manufacturer’s warranty, so check first. For
          sofas that are designed to separate, our{" "}
          <a href="/services/furniture-assembly">
            furniture assembly
          </a>{" "}
          team can take them apart and put them back together in the room.
        </P>
        <P>
          What we see on real jobs is that the sofa often comes apart more
          easily than people expect — the hard part is finding the fixings.
          A photo of the underside, with the dust cover pulled back slightly,
          tells a crew a lot before they arrive.
        </P>
        <H2 id="door-window">Option 3: remove a door or window</H2>
        <P>
          Sometimes the problem is a few centimetres at a single doorway. Taking
          the door off its hinges gives you the full width of the frame and
          removes the stop that the sofa catches on. Internal doors are usually
          straightforward; front doors on flats may be fire doors that your
          building manages, so ask before touching them.
        </P>
        <P>
          Removing a window is a bigger step. Some sash and casement windows
          can be taken out and refitted by a glazier, which turns a large
          window into an opening big enough for a sofa to be passed through at
          ground or first-floor level. You’ll need your landlord’s or
          freeholder’s agreement, and in listed buildings or conservation areas
          there may be restrictions.
        </P>
        <Figure
          seed="sofa-delivery-narrow-stairs-london"
          alt="Two movers carrying a wrapped sofa up a narrow London staircase"
          caption="Feet off, wrapped and upended — the first thing to try on a tight turn."
        />
        <H2 id="hoist">Option 4: hoist it in</H2>
        <P>
          When the stairs simply won’t allow it and the sofa can’t be
          dismantled, lifting it through a window or over a balcony may be the
          answer. Hoisting needs a clear opening, safe ground space below,
          permission from the building and properly rated lifting equipment —
          it isn’t something to attempt with a rope and some friends.
        </P>
        <P>
          Our{" "}
          <a href="/services/sofa-and-furniture-hoisting">
            sofa and furniture hoisting
          </a>{" "}
          service is priced as a custom quote after we’ve seen photos. For the
          full checklist of measurements and permissions, read{" "}
          <a href="/blog/how-to-hoist-a-sofa-through-a-window-or-balcony">
            how to hoist a sofa through a window or balcony
          </a>
          .
        </P>
        <H2 id="return">Option 5: return or swap it</H2>
        <P>
          If none of the above works, or the cost of getting it in outweighs
          the value of the sofa, returning it may be the sensible choice.
        </P>
        <Check
          items={[
            "Online purchases usually come with a 14-day cancellation period under the Consumer Contracts Regulations, but made-to-order and bespoke items are often excluded — check the retailer’s terms.",
            "Ask the retailer whether the same model comes in a modular or click-together version.",
            "Some brands sell sofas boxed or in sections specifically for flats with tight access.",
            "For marketplace finds, sell it on locally rather than paying to move it twice.",
          ]}
        />
        <P>
          If you need it collected and taken back, or moved to someone else, our{" "}
          <a href="/services/sofa-delivery">
            sofa delivery
          </a>{" "}
          service (from £55) handles collection and delivery across London.
        </P>
        <P>
          Whatever happens this time, the next sofa is easier if you check the
          route before you buy. These are the questions worth asking in the
          showroom or before you click “order”:
        </P>
        <Check
          items={[
            "Do the feet come off, and do the back or arms detach?",
            "Is the model available as modular sections or in a version made for tight access?",
            "What are the exact depth, height and diagonal measurements, not just the width?",
            "Will the retailer deliver to the room, and what happens if it doesn’t fit?",
            "Is it made to order, and does that affect your right to cancel?",
          ]}
        />
        <P>
          What we see on real jobs is that people measure the sofa carefully
          and the staircase barely at all. The single most useful number is
          the ceiling height above the tightest turn, because that’s what
          stops a sofa being upended — and it’s the one almost nobody checks.
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>How do I know if a sofa will fit before I buy it?</Q>
        <P>
          Measure the sofa’s depth, height and diagonal, then the narrowest
          door, stair width and ceiling height above the tightest turn. If the
          sofa’s smallest dimension is bigger than the narrowest gap, it won’t
          go — however it’s angled.
        </P>
        <Q>Will removing the feet really make a difference?</Q>
        <P>
          Often, yes. Feet add height and catch on frames, and taking them off
          is usually the difference on a tight doorway.
        </P>
        <Q>Can you take a sofa apart and rebuild it?</Q>
        <P>
          Sofas designed to separate can be taken apart and reassembled.
          Fixed-frame sofas need a specialist, and it may affect the warranty.
        </P>
        <Q>Is hoisting expensive?</Q>
        <P>
          It depends on the building, height and equipment. We quote each
          hoist individually from photos.
        </P>
        <Q>Who is responsible if the walls get marked?</Q>
        <P>
          With a professional crew, the job is covered by their public
          liability insurance — ask what it includes before you book. On a
          DIY attempt, any damage to the stairwell is usually yours to put
          right, which is one more reason not to force it.
        </P>
        <ArticleCta
          title="Sofa stuck on the stairs?"
          body="Send photos of the sofa, the staircase and any windows or balcony — we’ll suggest the simplest way to get it in."
        />
        <P>
          See <a href="/services/sofa-delivery">sofa delivery</a>,{" "}
          <a href="/services/furniture-assembly">furniture assembly</a> or{" "}
          <a href="/contact">contact us</a>.
        </P>
      </>
    ),
  },

  "moving-crates-vs-cardboard-boxes": {
    toc: [
      { id: "compare", label: "Moving crates vs cardboard boxes at a glance" },
      { id: "crates", label: "Plastic moving crates: pros and cons" },
      { id: "boxes", label: "Cardboard boxes: pros and cons" },
      { id: "how-many", label: "How many crates per room? A rough guide" },
      { id: "hire", label: "How crate hire works" },
      { id: "environment", label: "The environmental angle" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          Moving crates or cardboard boxes? More Londoners are choosing to
          rent moving boxes — sturdy plastic crates with lids — rather than
          buying flat-pack cardboard, especially for flat moves and office
          relocations. Crate hire in London is now a common service, but it
          isn’t automatically the right choice for every move. This guide
          compares the two honestly, gives a rough guide to how many crates
          you’ll need per room and explains how crate hire works.
        </P>
        <H2 id="compare">Moving crates vs cardboard boxes at a glance</H2>
        <DataTable
          head={["", "Hired plastic crates", "Cardboard boxes"]}
          rows={[
            ["Strength", "Rigid, stack without crushing", "Good when new, weaker if reused or damp"],
            ["Assembly", "None — open and fill", "Fold and tape each box"],
            ["Weather", "Water-resistant", "Can soften in rain"],
            ["Sizes", "Usually one or two standard sizes", "Wide range, including wardrobe boxes"],
            ["After the move", "Collected and reused", "Flatten, store or recycle"],
            ["Long-term storage", "Usually hired for weeks, not months", "Better suited to long stays"],
            ["Cost", "Hire for a set period", "Bought outright"],
          ]}
        />
        <P>
          In short: crates suit short, local moves where you’ll unpack quickly.
          Cardboard suits long storage, odd-shaped items and moves where
          unpacking will take weeks.
        </P>
        <DataTable
          head={["Your move", "Usually the better fit", "Why"]}
          rows={[
            ["Local flat move, unpacking within a week or two", "Crates", "Fast to pack, strong on stairs, collected afterwards"],
            ["Office relocation over a weekend", "Crates", "Uniform, sealable and quick to load and unload"],
            ["Move with weeks or months in storage", "Cardboard", "No hire period to worry about"],
            ["Lots of hanging clothes, pictures or lamps", "A mix", "Specialist cardboard boxes for odd shapes"],
            ["Long-distance move with a slow unpack", "Cardboard or a mix", "Unpacking may outlast a sensible hire period"],
          ]}
        />
        <H2 id="crates">Plastic moving crates: pros and cons</H2>
        <P>
          Moving crates are rigid plastic boxes, usually with interlocking or
          hinged lids so they stack securely and can be sealed. They’re
          delivered to your door before the move and collected afterwards.
        </P>
        <Check
          items={[
            "Pro: no folding or taping — packing starts the moment they arrive.",
            "Pro: they don’t crush, so heavy items like books and kitchenware are safer.",
            "Pro: uniform sizes stack neatly in the van, which speeds loading.",
            "Pro: lids with tag holes can be sealed with cable ties for some security.",
            "Con: they take floor space while empty and full — a pile of crates in a studio is noticeable.",
            "Con: you need to unpack by the collection date, or pay for longer hire.",
            "Con: not ideal for very large, flat or oddly shaped items such as mirrors, lamps and artwork.",
          ]}
        />
        <P>
          What we see on real jobs is that crates make the biggest difference
          on stairs. Crushed cardboard boxes at the bottom of a stack are a
          common cause of breakages; crates don’t have that problem, and their
          handles are easier to carry up a narrow staircase.
        </P>
        <H2 id="boxes">Cardboard boxes: pros and cons</H2>
        <P>
          Cardboard is still the default for most moves, and for good reasons.
        </P>
        <Check
          items={[
            "Pro: you can keep them as long as you like — handy if unpacking will be slow.",
            "Pro: a wide range of sizes, including wardrobe boxes for hanging clothes and picture boxes.",
            "Pro: suitable for longer-term storage.",
            "Pro: flat-packed boxes take little space before you start.",
            "Con: they need assembling and taping, which adds hours to packing.",
            "Con: they weaken when damp or overfilled, and reused boxes can split.",
            "Con: they create a pile of material to flatten and recycle afterwards.",
          ]}
        />
        <P>
          If you go with cardboard, buy double-walled boxes for heavy items
          and don’t overfill large ones. Our{" "}
          <a href="/services/packing-materials">
            packing materials
          </a>{" "}
          kits (from £50) include boxes, tape, paper and wrap.
        </P>
        <Figure
          seed="how-to-pack-a-kitchen-like-a-pro"
          alt="Packed and labelled boxes stacked in a kitchen ready for a move"
          caption="Heavy kitchen items travel better in rigid crates or double-walled boxes."
        />
        <H2 id="how-many">How many crates per room? A rough guide</H2>
        <P>
          This is a rough guide only — it assumes standard-sized crates and a
          typically furnished home. Book collectors, home cooks and anyone
          with a full loft will need more.
        </P>
        <DataTable
          head={["Room or home", "Rough guide (crates)", "Notes"]}
          rows={[
            ["Kitchen", "10–20", "Crockery, pans, food cupboards — the heaviest room"],
            ["Living room", "6–12", "Books, media, ornaments"],
            ["Double bedroom", "6–10", "Folded clothes, bedding, shoes"],
            ["Single or spare room", "4–8", "Depends on whether it doubles as storage"],
            ["Bathroom", "2–4", "Toiletries, towels, cleaning products"],
            ["Studio flat (whole home)", "20–30", "Fewer if you travel light"],
            ["1-bed flat (whole home)", "30–45", "A common starting point for hire"],
            ["2-bed flat or house", "45–70", "Plus a few cardboard boxes for odd shapes"],
          ]}
        />
        <P>
          Many people end up using a mix: crates for the heavy, regular-shaped
          things — books, kitchenware, shoes, toiletries — and a handful of
          cardboard or specialist boxes for lampshades, pictures and hanging
          clothes.
        </P>
        <H2 id="hire">How crate hire works</H2>
        <Steps
          items={[
            "Tell us your property size and moving date, and we’ll suggest a quantity.",
            "Crates are delivered before the move, giving you time to pack.",
            "Pack, close the lids and label each crate by room.",
            "We move them with the rest of your belongings.",
            "Unpack at the new place, then the empty crates are collected.",
          ]}
        />
        <P>
          Our{" "}
          <a href="/services/moving-crate-hire">
            moving crate hire
          </a>{" "}
          is priced as a custom quote based on the number of crates, the hire
          period and the addresses. It can be combined with a removal or used
          on its own if you’re moving yourself.
        </P>
        <Tip>
          Agree the collection date before you pack. Unpacking a kitchen and
          bookshelves takes longer than most people expect.
        </Tip>
        <P>
          A few habits get the most out of crates:
        </P>
        <Check
          items={[
            "Fill crates to the top so lids close flat and stack safely — fill gaps with tea towels or soft items.",
            "Keep heavy items, such as books and tins, to a weight one person can lift comfortably.",
            "Still wrap glasses and plates individually; rigid sides don’t stop items knocking together inside.",
            "Label the ends as well as the lid, so you can read them when stacked.",
            "Number crates and keep a simple list of what’s in each one.",
            "Wipe crates out before collection — they’re reused, and it keeps the process quick.",
          ]}
        />
        <H2 id="environment">The environmental angle</H2>
        <P>
          Crates are designed to be reused many times, so a single set can
          serve move after move instead of being made, used once and recycled.
          That means less packaging waste for you to deal with at the other
          end — no mountain of flattened boxes and tape in the hallway.
        </P>
        <P>
          Cardboard isn’t a bad choice either. It’s widely recyclable, and
          reusing good-quality boxes from a previous move, or passing yours on
          to someone else afterwards, extends their life. The least
          sustainable option is buying new boxes, using them once and leaving
          them damp in a shed. Whichever you choose, keep packing materials
          dry and reuse what you can.
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>Are moving crates cheaper than buying boxes?</Q>
        <P>
          It depends on how many you need and for how long. For short, local
          moves crates can compare well once you factor in tape and the time
          spent assembling boxes. For long storage, cardboard is usually
          better value.
        </P>
        <Q>How long can I keep hired crates?</Q>
        <P>
          It depends on the hire period you agree. Ask about extending if
          you’re not sure how long unpacking will take.
        </P>
        <Q>Can I use crates for storage?</Q>
        <P>
          They’re best for moves. For weeks or months in storage, cardboard
          boxes are usually more practical.
        </P>
        <Q>Do you deliver crates across London?</Q>
        <P>
          Yes — we deliver and collect crates across all 32 boroughs, with
          or without a removal booked.
        </P>
        <Q>Are crates good for packing a kitchen?</Q>
        <P>
          Very good. Their rigid sides protect crockery and pans from being
          crushed in the van. Wrap each item as you would in a box, keep the
          weight manageable and fill gaps so nothing moves. Our guide to{" "}
          <a href="/blog/how-to-pack-a-kitchen-like-a-pro">
            packing a kitchen like a pro
          </a>{" "}
          works just as well with crates.
        </P>
        <ArticleCta
          title="Thinking about crate hire?"
          body="Tell us your property size and dates — we’ll suggest how many crates you need and quote delivery and collection."
        />
        <P>
          See <a href="/services/moving-crate-hire">moving crate hire</a> or{" "}
          <a href="/contact">contact us</a>.
        </P>
      </>
    ),
  },

  "how-to-move-a-mattress": {
    toc: [
      { id: "prepare", label: "Before you start: check the type" },
      { id: "wrap", label: "How to wrap a mattress" },
      { id: "bending", label: "Bending and folding: the rules" },
      { id: "stairs", label: "Carrying a mattress on stairs" },
      { id: "van", label: "Transporting it in a van" },
      { id: "disposal", label: "Disposing of an old mattress" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          How do you move a mattress without damaging it — or your walls? A
          mattress is light compared with a wardrobe, but it’s big, floppy and
          surprisingly easy to ruin. Fold the wrong type, drag it across a
          floor or let it get damp and it may never feel the same again. This
          guide explains how to move a mattress properly: wrapping, the
          bending rules for memory foam and pocket sprung, getting it down
          narrow stairs, transporting it and disposing of an old one.
        </P>
        <H2 id="prepare">Before you start: check the type</H2>
        <P>
          Different mattresses need different handling. Check the label or the
          manufacturer’s website before you move it, and look for any care or
          transport guidance — it varies more than people think.
        </P>
        <DataTable
          head={["Type", "Handling notes", "Weight"]}
          rows={[
            ["Open coil", "Fairly rigid; keep flat or on its side", "Moderate"],
            ["Pocket sprung", "Don’t fold; keep flat or on its side", "Often heavy, especially with extra layers"],
            ["Memory foam", "Follow the manufacturer’s guidance on bending and rolling", "Dense and floppy"],
            ["Latex", "Very heavy and flexible; needs two or more people", "Heavy"],
            ["Hybrid", "Treat as pocket sprung unless told otherwise", "Heavy"],
            ["Cot or child’s mattress", "Usually light; keep clean and dry", "Light"],
          ]}
        />
        <P>
          Strip the bed and wash the bedding first, and remove any mattress
          topper so it can be packed separately. If the mattress has handles,
          check whether they’re designed for lifting or only for turning — many
          are only for positioning on the bed and can tear under the full
          weight.
        </P>
        <H2 id="wrap">How to wrap a mattress</H2>
        <Steps
          items={[
            "Vacuum both sides and let the mattress air if it’s been cleaned recently — never wrap it damp.",
            "Slide it into a heavy-duty mattress bag that matches the size: single, double, king or super king.",
            "Seal the open end with tape, pressing out excess air so the bag doesn’t balloon.",
            "Add a removal blanket over the bag for the carry if the route is tight or the walls are freshly painted.",
            "Label the bag with the room it’s going to.",
          ]}
        />
        <P>
          A mattress bag keeps out dust, damp and dirt from the van floor, and
          it gives you a smoother surface to slide past walls and banisters.
          Don’t use cling film or sealed plastic for storage of more than a few
          days; trapped moisture can lead to mould, so use a breathable cover
          if it’s going into storage.
        </P>
        <P>
          Don’t forget the bed frame. Most frames are quicker and safer to
          move dismantled, and divan bases often separate into two halves.
          Before the day:
        </P>
        <Check
          items={[
            "Remove the headboard and unscrew the side rails and slats, bagging and labelling the fixings.",
            "Tie slats into a bundle with tape or string so none go missing.",
            "Check divan bases for a central zip or link bar that separates the halves.",
            "Remove storage drawers from divans and ottoman beds and move them separately.",
            "Keep the Allen key or tools with the fixings, not in a random box.",
          ]}
        />
        <P>
          If the mattress is going into storage for a while, store it flat or
          on its side as the manufacturer recommends, in a breathable cover,
          with nothing heavy stacked on top. Leaning it on a slope against a
          wall for weeks can leave it permanently misshapen.
        </P>
        <Tip>
          Wrap the mattress the night before and lean it against a wall, not
          the floor, so it’s ready for the crew and stays clean.
        </Tip>
        <H2 id="bending">Bending and folding: the rules</H2>
        <P>
          This is where most mattress damage happens. Folding a mattress in
          half to get it round a corner can break springs, crease foam layers
          and void the warranty.
        </P>
        <Check
          items={[
            "Pocket sprung and hybrid: don’t fold or bend beyond a gentle flex. The springs and their fabric pockets can be damaged.",
            "Memory foam: some can be rolled or bent briefly, others can’t — only do what the manufacturer allows, and never fold it tightly or leave it bent.",
            "Open coil: keep it flat or upright; bending can kink the coils permanently.",
            "Latex: flexible, but heavy layers can tear if strained at the fold.",
            "Never tie a mattress folded to make it easier to carry.",
            "If it arrived rolled in a box, that doesn’t mean it can be rolled again at home.",
          ]}
        />
        <P>
          What we see on real jobs is that the damage is usually done on a
          single tight turn, when someone bends the mattress to get it round the
          banister. If it won’t go round without folding, stop and look for
          another route — an upended carry over the banister, a different
          staircase or, for very large mattresses, a window.
        </P>
        <H2 id="stairs">Carrying a mattress on stairs</H2>
        <P>
          Two people are the minimum for anything bigger than a single, and
          three makes a king or super king far easier on a London staircase.
        </P>
        <Steps
          items={[
            "Clear the route: shoes, bikes, rugs and anything on the landing.",
            "Carry the mattress on its long side, upright, so it’s narrower and easier to control.",
            "The stronger person goes at the bottom on the way down, taking more of the weight.",
            "Hold the mattress itself or the bag, not flimsy side handles.",
            "Take turns slowly and call out each step.",
            "Rest it upright on a landing rather than letting it drop flat on the floor.",
          ]}
        />
        <Figure
          seed="studio-flat-move-checklist"
          alt="A wrapped mattress and packed boxes ready to load in a small flat"
          caption="Bagged, upright and ready to go — the easiest mattress to move."
        />
        <H2 id="van">Transporting it in a van</H2>
        <P>
          In a van, a mattress travels best upright on its side against the
          wall, strapped so it can’t slide or fall. Laying it flat underneath
          heavy items will crush it, and leaving it unsupported means it can
          slump and bend in transit.
        </P>
        <Check
          items={[
            "Load it after heavy furniture so nothing is stacked on top.",
            "Strap it upright to the van’s rails.",
            "Don’t tie a mattress to a car roof — it can act like a sail and come loose.",
            "If it’s a short-notice single item, a dedicated delivery is usually simpler than hiring a van.",
          ]}
        />
        <P>
          Our{" "}
          <a href="/services/bed-and-mattress-delivery">
            bed and mattress delivery
          </a>{" "}
          service (from £50) collects, protects and places mattresses and bed
          frames in the right room, including on walk-ups.
        </P>
        <H2 id="disposal">Disposing of an old mattress</H2>
        <P>
          Moving is a good time to replace an old mattress, but disposing of
          one isn’t as simple as putting it out with the bins.
        </P>
        <Check
          items={[
            "Council bulky waste collection: most London boroughs offer it for a fee — check your council’s website.",
            "Retailer take-back: some retailers will collect your old mattress when they deliver a new one, often for a charge.",
            "Household recycling centres: many accept mattresses if you can transport them.",
            "Charities: some accept mattresses with intact fire safety labels and in good condition — ask first.",
            "Never leave a mattress on the street; fly-tipping can lead to a fine.",
          ]}
        />
        <P>
          If you’re clearing more than a mattress, a{" "}
          <a href="/services/house-clearance">
            house clearance
          </a>{" "}
          can take several items in one visit.
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>Can I fold a memory foam mattress to move it?</Q>
        <P>
          Only if the manufacturer says it’s safe, and then only briefly.
          Many memory foam mattresses shouldn’t be folded at all.
        </P>
        <Q>Can a mattress go flat in a van?</Q>
        <P>
          It’s better upright on its side and strapped. Laid flat, it tends
          to get things stacked on top of it.
        </P>
        <Q>How many people do I need to move a mattress?</Q>
        <P>
          Two for a double, and ideally three for a king or super king on
          stairs.
        </P>
        <Q>Do you move just a mattress?</Q>
        <P>
          Yes — single mattress and bed deliveries start from £50 in London.
        </P>
        <Q>What if the mattress won’t go up the stairs?</Q>
        <P>
          Try carrying it upright on its long side and lifting it over the
          banister on the turn. If it still won’t pass without folding, don’t
          force it — a window or balcony lift may be possible. See{" "}
          <a href="/services/sofa-and-furniture-hoisting">
            sofa and furniture hoisting
          </a>
          , which also covers mattresses and bed bases.
        </P>
        <ArticleCta
          title="Need a mattress moved?"
          body="Tell us the size, both postcodes and the floors — we’ll quote a fixed delivery."
        />
        <P>
          See{" "}
          <a href="/services/bed-and-mattress-delivery">
            bed and mattress delivery
          </a>{" "}
          or <a href="/contact">contact us</a>.
        </P>
      </>
    ),
  },

  "how-to-move-gym-equipment-and-heavy-items": {
    toc: [
      { id: "assess", label: "Assess weight, size and access" },
      { id: "treadmills", label: "How to move a treadmill" },
      { id: "multi-gyms", label: "Multi-gyms, racks and weights" },
      { id: "safes", label: "Moving a safe" },
      { id: "floors", label: "Protecting floors and the building" },
      { id: "professional", label: "When to call a specialist" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          How do you move gym equipment and heavy items without hurting
          yourself or wrecking the floor? Treadmills, multi-gyms, squat racks
          and safes are among the hardest things in a home to move. They’re
          heavy, top-heavy or awkward — often all three — and they tend to live
          in garages, basements and spare rooms up a flight of stairs. This
          guide covers dismantling, floor protection, weight and access, and
          when it’s time to call in a specialist crew.
        </P>
        <H2 id="assess">Assess weight, size and access</H2>
        <P>
          Before you lift anything, find out what you’re dealing with. The
          manual or manufacturer’s website will usually list the weight and
          dimensions, and whether the item is designed to be dismantled.
        </P>
        <Check
          items={[
            "Weight: check the specification, and remember that the heaviest part may be a single motor or frame.",
            "Dimensions: assembled and, if relevant, folded or dismantled.",
            "Route: every door, turn, step and threshold between the item and the van.",
            "Floors: the floor type along the route and whether there are stairs, a lift or a basement.",
            "Ground: gravel, steps or a sloping drive outside can make trolleys hard to use.",
            "Destination: whether the new floor can take the load where you want it.",
          ]}
        />
        <P>
          What we see on real jobs is that the item is rarely the problem on its
          own — it’s the route. A treadmill on a ground-floor patio is a simple
          lift; the same treadmill in a loft conversion with a narrow,
          winding staircase is a completely different job.
        </P>
        <P>
          If you’re moving anything heavy yourself, a few basics make a big
          difference:
        </P>
        <Check
          items={[
            "Agree who is in charge and who calls each lift and each step.",
            "Bend your knees, keep the load close and avoid twisting while lifting.",
            "Wear gloves with grip and closed shoes — not slippers or sandals.",
            "Plan where you’ll rest the item before you lift it, especially on stairs.",
            "Stop if anyone is struggling. A dropped item is worse than a slow one.",
          ]}
        />
        <H2 id="treadmills">How to move a treadmill</H2>
        <Steps
          items={[
            "Unplug it and let it sit for a while if it’s been used recently.",
            "Check the manual: many folding treadmills have a transport lock or locking pin for the deck.",
            "Fold and lock the deck if it folds; if not, consider removing the console and arms.",
            "Remove the safety key and any loose accessories, and bag them with the power lead.",
            "Tape or secure the folded deck so it can’t drop open during the carry.",
            "Use the transport wheels only on smooth, level floors — never on stairs.",
            "On stairs, use enough people to carry it, keeping the heavy motor end downhill and under control.",
          ]}
        />
        <P>
          Non-folding commercial-style treadmills can be very heavy and often
          need partial dismantling — console, uprights and sometimes the motor
          cover — before they’ll fit through a doorway. Photograph each step
          and bag the bolts by section.
        </P>
        <H2 id="multi-gyms">Multi-gyms, racks and weights</H2>
        <P>
          Multi-gyms and cable machines almost always need dismantling. Moving
          one assembled risks bending the frame, snapping cables and dropping
          the weight stack.
        </P>
        <Check
          items={[
            "Remove the weight stack plates first and pack them in small, sturdy loads.",
            "Photograph the cable routing from several angles before you take anything apart.",
            "Release cable tension, then remove cables and pulleys and label them.",
            "Unbolt the frame in the reverse order of the assembly manual.",
            "Bag and label every bolt, washer and spacer by section.",
            "Strip plates from racks, benches and barbells before moving them.",
            "Pack dumbbells and plates in small boxes or crates — never one large box.",
          ]}
        />
        <P>
          Loose weights are deceptively dangerous. A box of plates can weigh more
          than one person should lift, and they can slide in a van if not
          secured low and forward. Keep loads small and spread them out.
        </P>
        <P>
          Exercise bikes, rowing machines and cross trainers are lighter but
          awkward. Many rowers fold or split into two sections, and the seat
          rail is easily bent if it takes weight. Exercise bikes are top-heavy,
          so carry them upright by the frame rather than the handlebars or
          seat post. On cross trainers, remove the arms and pedals if the
          manual allows it — they catch on door frames and stair walls.
        </P>
        <Tip>
          Take a short video while you dismantle a multi-gym. It’s far easier to
          follow than a manual when you rebuild it.
        </Tip>
        <Figure
          seed="man-and-van-vs-full-removal"
          alt="Movers loading heavy items into the back of a van"
          caption="Heavy items travel low and forward in the van, strapped in place."
        />
        <H2 id="safes">Moving a safe</H2>
        <P>
          Safes are compact but extremely heavy for their size, and many are
          bolted to the floor or wall. They need the most planning of anything in
          this guide.
        </P>
        <Check
          items={[
            "Empty it completely and keep the contents with you.",
            "Check whether it’s anchored, and how — some fixings are only reachable from inside.",
            "Find the weight from the manufacturer or model number.",
            "Plan the route with floor loading in mind, especially on suspended floors and stairs.",
            "Use equipment designed for the job, such as heavy-duty sack trucks or stair-climbing trolleys.",
            "Never try to walk a heavy safe down stairs on its edge.",
          ]}
        />
        <P>
          Tell your insurer if a safe is being moved, especially if your home
          insurance requires it to be installed in a particular way. The new
          location may need a professional installation to meet the same terms.
        </P>
        <H2 id="floors">Protecting floors and the building</H2>
        <P>
          Heavy items damage floors in two ways: point loads from feet and
          wheels, and scrapes from dragging. Both are avoidable.
        </P>
        <Check
          items={[
            "Lay hardboard, plywood or correx sheets along the route over wood, laminate and tiles.",
            "Use carpet protector film on carpets and stair runners.",
            "Pad door frames, banisters and corners with blankets or corner guards.",
            "Never drag a heavy item — lift it, or use a trolley on boards.",
            "Check thresholds and door bars, which can catch wheels.",
            "In flats, check the building’s rules for protecting shared areas and lifts.",
          ]}
        />
        <P>
          At the destination, think about where the item will stand. Rubber
          mats under gym equipment spread the load and stop vibration, and a
          safe or heavy machine on an upper floor should go near a load-bearing
          wall if possible.
        </P>
        <H2 id="professional">When to call a specialist</H2>
        <P>
          Some heavy items are fine to move yourself with a couple of strong
          friends. Others aren’t worth the risk. Call a specialist when:
        </P>
        <Check
          items={[
            "The item is heavier than your group can comfortably and safely lift.",
            "There are stairs, especially narrow or winding ones.",
            "The item needs dismantling you’re not confident about.",
            "It’s a safe, a commercial machine or anything bolted down.",
            "You’re moving it into a flat with shared areas or a lift with a weight limit.",
          ]}
        />
        <P>
          Our{" "}
          <a href="/services/heavy-and-machinery-moving">
            heavy and machinery moving
          </a>{" "}
          service is priced as a custom quote after we’ve seen the item and the
          access. For pianos, see{" "}
          <a href="/services/piano-and-specialist">
            piano and specialist moves
          </a>
          , which start from £180.
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>Can I move a treadmill on its wheels?</Q>
        <P>
          On smooth, level floors, yes. Not on stairs, gravel or thresholds —
          lift it instead.
        </P>
        <Q>Do I need to dismantle a multi-gym?</Q>
        <P>
          Almost always. Moving one assembled risks damaging the frame and
          cables, and it’s unlikely to fit through doorways.
        </P>
        <Q>How much does it cost to move a safe?</Q>
        <P>
          It depends on the weight, fixings and access. We quote heavy moves
          individually after seeing photos and details.
        </P>
        <Q>Will you reassemble gym equipment?</Q>
        <P>
          Ask when you book. Tell us the make and model so we can plan the
          dismantling and reassembly.
        </P>
        <Q>Can a heavy item go in a lift?</Q>
        <P>
          Only if the lift’s weight limit allows for the item plus the people
          and equipment travelling with it. Check the limit on the lift plate
          and ask building management — and protect the lift floor and walls
          before loading.
        </P>
        <ArticleCta
          title="Moving something heavy?"
          body="Send photos of the item and the route, plus the make and model — we’ll come back with a custom quote."
        />
        <P>
          See{" "}
          <a href="/services/heavy-and-machinery-moving">
            heavy and machinery moving
          </a>{" "}
          or <a href="/contact">contact us</a>.
        </P>
      </>
    ),
  },

  "storage-during-a-house-renovation": {
    toc: [
      { id: "why", label: "Why use storage during a renovation?" },
      { id: "what", label: "What to store — and what to keep" },
      { id: "timeline", label: "Planning the timeline" },
      { id: "inventory", label: "Making an inventory" },
      { id: "access", label: "Access while it’s in storage" },
      { id: "cost", label: "What it costs" },
      { id: "faqs", label: "FAQs" },
    ],
    body: (
      <>
        <P>
          Planning storage during a house renovation is one of those jobs that
          gets left until the builders are at the door. But dust, paint and
          heavy boots get everywhere, and furniture left under dust sheets in
          the next room rarely survives a kitchen refit or new flooring
          unscathed. Storage with collection — where a crew collects your
          belongings, stores them and brings them back when the work is done —
          is often the simplest answer. This guide covers what to store, how to
          plan the timeline, keeping an inventory and getting access mid-stay.
        </P>
        <H2 id="why">Why use storage during a renovation?</H2>
        <Check
          items={[
            "Protection from dust, which gets into upholstery, electronics and drawers even under sheets.",
            "Clear rooms let trades work faster, which can help keep the schedule on track.",
            "Less risk of damage from ladders, tools and materials being carried through the house.",
            "Easier for floors, plastering and decorating, which need empty rooms.",
            "Peace of mind if you’re moving out temporarily while the work happens.",
          ]}
        />
        <P>
          Collection and storage for a renovation in London is particularly
          useful because most homes don’t have a garage or spare room big
          enough to hold the contents of the rooms being worked on. A loft
          extension or a kitchen refit can mean clearing half the house.
        </P>
        <DataTable
          head={["Option", "Works well for", "Watch out for"]}
          rows={[
            ["Keep it in an unused room", "Small, contained jobs like a bathroom refit", "Dust spreads; the room may be needed by trades"],
            ["Garage or shed", "Hard-wearing items for a short time", "Damp, pests and security for upholstery and electronics"],
            ["Self storage unit", "People who want to visit and swap things often", "You arrange and pay for transport both ways"],
            ["Storage with collection", "Whole rooms or floors for weeks or months", "Access is by arrangement, not walk-in"],
          ]}
        />
        <P>
          For a single room, moving furniture into another part of the house
          can be enough. For anything that involves floors, kitchens, rewiring
          or structural work, getting the contents out of the house altogether
          is usually less stressful — and protects things that are expensive
          to clean or replace.
        </P>
        <H2 id="what">What to store — and what to keep</H2>
        <P>
          You don’t need to store everything. Clear the rooms being worked on
          and anywhere trades will pass through, and keep the things you use
          every day.
        </P>
        <DataTable
          head={["Store", "Keep at home (or with you)"]}
          rows={[
            ["Sofas, armchairs and upholstered furniture", "Everyday clothes and toiletries"],
            ["Dining tables, chairs and sideboards", "Laptops, chargers and work equipment"],
            ["Beds and mattresses from rooms being worked on", "Documents, passports and valuables"],
            ["Books, ornaments, pictures and mirrors", "Medication"],
            ["Out-of-season clothes and bedding", "A basic kitchen kit if you’re staying"],
            ["Rugs and lamps", "Children’s favourite toys and school things"],
          ]}
        />
        <P>
          What we see on real jobs is that people store too little on the first
          trip and then try to protect the rest under sheets. If a room is
          being plastered or sanded, clear it fully — dust from sanding in
          particular finds its way into everything.
        </P>
        <H2 id="timeline">Planning the timeline</H2>
        <P>
          Renovations run late more often than they run early, so build in a
          buffer. A simple timeline looks like this:
        </P>
        <Steps
          items={[
            "Four to six weeks before: agree the start date with your builder and book collection.",
            "Two weeks before: declutter — don’t pay to store things you’ll throw away afterwards.",
            "One week before: pack books, ornaments and clothes; dismantle beds if needed.",
            "Collection day: the crew wraps furniture, loads and takes everything to storage.",
            "During the works: ask for anything you need back by giving notice.",
            "When the work is finished: wait until floors are cured and paint is dry before delivery.",
            "Delivery day: furniture goes back into the right rooms and beds are rebuilt.",
          ]}
        />
        <Tip>
          Don’t book redelivery for the day the builders say they’ll finish.
          Leave a few days for snagging and a final clean.
        </Tip>
        <P>
          What we see on real jobs is that redelivery is the date most often
          moved. New floors may need time to settle before heavy furniture
          goes back, plaster needs to dry before it’s painted, and the last
          trades often overlap. Ask your builder for a realistic finish date,
          then ask what could push it back — and choose a storage arrangement
          that doesn’t penalise you for a few extra weeks.
        </P>
        <Figure
          seed="self-storage-guide-london"
          alt="Furniture and boxes neatly stored in a secure storage unit"
          caption="Wrapped, labelled and stacked — ready to come home when the work is done."
        />
        <H2 id="inventory">Making an inventory</H2>
        <P>
          A simple inventory saves time and worry. It makes it easy to ask for
          a particular box mid-stay and to check everything comes back.
        </P>
        <Check
          items={[
            "Number every box and write the room and a short contents list on two sides.",
            "Keep the list on your phone or in a shared document.",
            "Photograph large furniture and anything valuable before it’s collected.",
            "Note anything that’s already marked or damaged.",
            "Put fixings for dismantled furniture in labelled bags taped to the item.",
            "Mark the boxes you’re most likely to need back, and ask for them to be stored near the front.",
          ]}
        />
        <H2 id="access">Access while it’s in storage</H2>
        <P>
          With storage with collection, your things are usually stored by the
          company rather than in a unit you visit. Access is by arrangement:
          you ask for a box or item, and it’s brought out or delivered.
        </P>
        <P>
          If you think you’ll need regular access — seasonal clothes, sports
          kit, or work samples — tell us at the start. We can store those items
          where they’re easiest to reach. For longer renovations, it can also be
          worth splitting the job: store the furniture, and keep a small number
          of boxes you’ll need at home or with a friend.
        </P>
        <P>
          Before collection, it’s also worth checking a few practical points:
        </P>
        <Check
          items={[
            "Insurance: ask what cover applies while items are in storage, and tell your home insurer that contents are temporarily elsewhere.",
            "Notice: how much notice is needed to retrieve an item or end the storage.",
            "Partial redelivery: whether some rooms can come back before others if the work is phased.",
            "Appliances: fridges and washing machines should be clean, dry and drained before they’re stored.",
            "Builders’ materials: don’t let tiles, flooring or fixtures get packed with your belongings by mistake.",
          ]}
        />
        <H2 id="cost">What it costs</H2>
        <P>
          The total for renovation storage comes from three parts: collection,
          storage and redelivery. Our{" "}
          <a href="/services/secure-storage">
            secure storage
          </a>{" "}
          starts from £15/week or £55/month, depending on volume, and{" "}
          <a href="/services/storage-with-collection">
            storage with collection
          </a>{" "}
          adds the crew and van at both ends, quoted together so there’s one
          price for the whole job.
        </P>
        <P>
          The biggest influence on cost is how much you store and for how long.
          Decluttering first, dismantling furniture so it packs flat and being
          realistic about the length of the works all help keep it down. For a
          broader look at prices, see{" "}
          <a href="/blog/storage-costs-london-uk">
            storage costs in London and the UK
          </a>
          .
        </P>
        <H2 id="faqs">FAQs</H2>
        <Q>How long can I store my things during a renovation?</Q>
        <P>
          As long as you need. Short stays of a few weeks and longer projects
          are both common — tell us your expected timeline and we’ll plan
          around it.
        </P>
        <Q>Can you collect from my home and deliver back?</Q>
        <P>
          Yes. Storage with collection covers collecting, storing and
          delivering back once the work is finished.
        </P>
        <Q>Can I get things back during the works?</Q>
        <P>
          Yes, by arrangement. Give us notice and we’ll bring out or deliver
          what you need.
        </P>
        <Q>Do I need to pack everything myself?</Q>
        <P>
          No. You can pack yourself or book our packing service, which starts
          from £150.
        </P>
        <Q>Should I move out during the renovation?</Q>
        <P>
          It depends on the work. Many people stay for a bathroom or a single
          room, but kitchens, rewiring and work across several floors are
          much easier to live through elsewhere. If you move out, store
          furniture and keep only what you need for the temporary place.
        </P>
        <ArticleCta
          title="Planning a renovation?"
          body="Tell us what you need to store and for roughly how long — we’ll quote collection, storage and delivery together."
        />
        <P>
          See{" "}
          <a href="/services/storage-with-collection">
            storage with collection
          </a>
          , <a href="/services/secure-storage">secure storage</a> or{" "}
          <a href="/contact">contact us</a>.
        </P>
      </>
    ),
  },

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
          <a href="/services/house-removals">
            house removals
          </a>{" "}
          and{" "}
          <a href="/pricing">
            pricing
          </a>{" "}
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
          <a href="/services/fragile-only-packing">
            fragile-only packing
          </a>{" "}
          focuses on kitchens and glassware, or book{" "}
          <a href="/services/full-packing-service">
            full packing
          </a>{" "}
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
          <a href="/services/man-and-van">
            man &amp; van
          </a>{" "}
          and{" "}
          <a href="/services/house-removals">
            house removals
          </a>{" "}
          — or send a quote request and we&apos;ll recommend which is cheaper for
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
          <a href="/services/studio-moves">
            studio moves
          </a>
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
          <a href="/services/secure-storage">
            secure storage
          </a>
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
          <a href="/services/sofa-delivery">
            sofa delivery
          </a>
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
          body="Send us both postcodes — we’ll quote a fixed sofa run."
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
          <a href="/services/evening-and-weekend-moves">
            evening &amp; weekend moves
          </a>
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
          <a href="/services/same-day-move">
            same-day move
          </a>{" "}
          and{" "}
          <a href="/services/last-minute-removals">
            last-minute removals
          </a>
          .
        </P>
        <ArticleCta title="Need a van today?" body="Call us now — we’ll confirm capacity within minutes." />
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
          <a href="/services/flat-removals">
            flat removals
          </a>
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
