import type { ReactNode } from "react";

// 10 highlight styles for a headline keyword.
export const highlightLabels: Record<number, string> = {
  1: "Marker (angled)",
  2: "Highlighter block",
  3: "Thick underline",
  4: "Wavy underline",
  5: "Gradient text",
  6: "Solid green text",
  7: "Brush stroke",
  8: "Double underline",
  9: "Outline box",
  10: "Dashed underline",
};

export default function Highlight({
  variant = 1,
  children,
}: {
  variant?: number;
  children: ReactNode;
}) {
  switch (variant) {
    case 1:
      return (
        <span className="relative inline-block whitespace-nowrap">
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-1 h-3 -rotate-1 rounded-sm bg-[#9fe870] md:h-4"
          />
          <span className="relative">{children}</span>
        </span>
      );

    case 2:
      return (
        <span className="box-decoration-clone rounded-lg bg-[#9fe870] px-2 py-0.5 text-[#163300]">
          {children}
        </span>
      );

    case 3:
      return (
        <span className="border-b-[6px] border-[#9fe870] pb-0.5">
          {children}
        </span>
      );

    case 4:
      return (
        <span
          style={{
            textDecoration: "underline wavy #9fe870",
            textUnderlineOffset: "8px",
            textDecorationThickness: "2px",
          }}
        >
          {children}
        </span>
      );

    case 5:
      return (
        <span className="bg-gradient-to-r from-[#163300] via-[#3f7d1e] to-[#6fce46] bg-clip-text text-transparent">
          {children}
        </span>
      );

    case 6:
      return <span className="text-[#163300]">{children}</span>;

    case 7:
      return (
        <span className="relative inline-block whitespace-nowrap">
          <span className="relative z-10">{children}</span>
          <svg
            aria-hidden
            className="absolute -bottom-2 left-0 z-0 w-full"
            height="12"
            viewBox="0 0 300 12"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              className="brush-draw"
              d="M4 8 Q 70 2 150 6 T 296 5"
              stroke="#9fe870"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      );

    case 8:
      return (
        <span
          style={{
            textDecoration: "underline double #9fe870",
            textUnderlineOffset: "6px",
            textDecorationThickness: "2px",
          }}
        >
          {children}
        </span>
      );

    case 9:
      return (
        <span className="rounded-lg border-2 border-[#9fe870] px-2 py-0.5">
          {children}
        </span>
      );

    case 10:
      return (
        <span className="border-b-[3px] border-dashed border-[#9fe870] pb-0.5">
          {children}
        </span>
      );

    default:
      return <span>{children}</span>;
  }
}
