"use client";

import { useState } from "react";
import { Icon } from "./icons";

type Props = {
  src: string;
  alt: string;
  icon?: string;
  className?: string;
  imgClassName?: string;
  /** object-cover etc on the img only */
  priority?: boolean;
};

/** Local service/blog image with lime icon fallback if the file is missing. */
export default function SoftImage({
  src,
  alt,
  icon = "box",
  className = "",
  imgClassName = "h-full w-full object-cover",
  priority = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  const isRemote = src.startsWith("http");
  const showFallback = failed || (!src && !isRemote);

  if (showFallback) {
    return (
      <div
        className={
          "flex items-center justify-center bg-[#9fe870]/35 text-[#163300] " +
          className
        }
        role="img"
        aria-label={alt}
      >
        <Icon name={icon} className="h-12 w-12" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
      className={imgClassName + (className ? ` ${className}` : "")}
    />
  );
}
