// Five faded hero background variations. Pass `variant` 1-5.
// Each layer sits behind the hero content (-z-10) and fades out toward the
// bottom so it blends smoothly into the page.

const fadeBottom = "linear-gradient(to bottom, #000 55%, transparent 100%)";
const fadeTop = "radial-gradient(ellipse 62% 60% at 50% 0%, #000 55%, transparent 100%)";

export default function HeroBg({ variant = 1 }: { variant?: number }) {
  switch (variant) {
    // 1 — Green mesh gradient
    case 1:
      return (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: [
              "radial-gradient(at 15% 15%, rgba(159,232,112,0.42), transparent 45%)",
              "radial-gradient(at 85% 8%, rgba(122,216,84,0.32), transparent 45%)",
              "radial-gradient(at 72% 72%, rgba(22,51,0,0.10), transparent 45%)",
              "radial-gradient(at 5% 65%, rgba(159,232,112,0.26), transparent 45%)",
            ].join(","),
            maskImage: fadeBottom,
            WebkitMaskImage: fadeBottom,
          }}
        />
      );

    // 2 — Grid lines (top-masked)
    case 2:
      return (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(22,51,0,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(22,51,0,0.09) 1px, transparent 1px)",
              backgroundSize: "38px 38px",
              maskImage: fadeTop,
              WebkitMaskImage: fadeTop,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 -z-10 mx-auto h-80 max-w-3xl"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, rgba(159,232,112,0.32), transparent 70%)",
            }}
          />
        </>
      );

    // 3 — Dot grid (top-masked)
    case 3:
      return (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(rgba(22,51,0,0.16) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              maskImage: fadeTop,
              WebkitMaskImage: fadeTop,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 -z-10 mx-auto h-80 max-w-3xl"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, rgba(159,232,112,0.30), transparent 70%)",
            }}
          />
        </>
      );

    // 4 — Aurora blobs
    case 4:
      return (
        <>
          <div className="pointer-events-none absolute -left-24 -top-10 -z-10 h-80 w-80 rounded-full bg-[#9fe870]/45 blur-[90px]" />
          <div className="pointer-events-none absolute right-0 -top-6 -z-10 h-72 w-72 rounded-full bg-[#7ad14f]/40 blur-[90px]" />
          <div className="pointer-events-none absolute left-1/3 top-28 -z-10 h-72 w-72 rounded-full bg-[#163300]/15 blur-[110px]" />
          <div className="pointer-events-none absolute right-1/4 top-40 -z-10 h-64 w-64 rounded-full bg-[#c2f59c]/50 blur-[100px]" />
        </>
      );

    // 5 — Spotlight + fine grid combo
    case 5:
      return (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(22,51,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(22,51,0,0.06) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
              maskImage: fadeBottom,
              WebkitMaskImage: fadeBottom,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-[460px] max-w-4xl"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 0%, rgba(159,232,112,0.45), rgba(159,232,112,0.10) 45%, transparent 72%)",
            }}
          />
        </>
      );

    // 6 — Mesh gradient + grid overlay (mix of 1 and 2)
    case 6:
      return (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: [
                "radial-gradient(at 15% 15%, rgba(159,232,112,0.42), transparent 45%)",
                "radial-gradient(at 85% 8%, rgba(122,216,84,0.32), transparent 45%)",
                "radial-gradient(at 72% 72%, rgba(22,51,0,0.10), transparent 45%)",
                "radial-gradient(at 5% 65%, rgba(159,232,112,0.26), transparent 45%)",
              ].join(","),
              maskImage: fadeBottom,
              WebkitMaskImage: fadeBottom,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(22,51,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(22,51,0,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage:
                "linear-gradient(to bottom, #000 30%, transparent 80%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 30%, transparent 80%)",
            }}
          />
        </>
      );

    default:
      return null;
  }
}
