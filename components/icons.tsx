"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import * as HI from "@hugeicons/core-free-icons";

type IconProps = {
  name: string;
  className?: string;
  strokeWidth?: number;
  size?: number;
};

// Map our semantic names -> ordered candidate HugeIcons export names.
// The first candidate that exists in the installed pack is used, so a single
// missing/renamed icon can never crash the build.
const CANDIDATES: Record<string, string[]> = {
  home: ["Home01Icon", "Home03Icon", "Home02Icon", "HomeIcon"],
  briefcase: ["Briefcase01Icon", "Briefcase02Icon", "BriefcaseIcon"],
  box: ["PackageIcon", "Package01Icon", "DeliveryBox01Icon", "BoxIcon"],
  shield: ["Shield01Icon", "ShieldIcon", "SecurityCheckIcon", "Shield02Icon"],
  truck: [
    "DeliveryTruck01Icon",
    "DeliveryTruck02Icon",
    "Truck01Icon",
    "TruckIcon",
    "TruckDelivery01Icon",
  ],
  globe: ["GlobalIcon", "Globe02Icon", "Global02Icon", "EarthIcon"],
  wrench: ["Wrench01Icon", "WrenchIcon", "Tools01Icon", "Wrench02Icon"],
  cart: ["ShoppingCart01Icon", "ShoppingCart02Icon", "ShoppingCartIcon"],
  star: ["StarIcon", "Star01Icon", "FavouriteIcon"],
  user: ["UserIcon", "User01Icon", "UserAccountIcon"],
  clock: ["Clock01Icon", "ClockIcon", "Time04Icon", "Time01Icon"],
  sofa: ["Sofa01Icon", "SofaIcon", "Sofa02Icon", "Sofa03Icon"],
  sparkles: [
    "SparklesIcon",
    "Sparkle01Icon",
    "AiMagicIcon",
    "MagicWand01Icon",
    "CleaningBucketIcon",
  ],
  calendar: ["Calendar01Icon", "Calendar02Icon", "Calendar03Icon", "CalendarIcon"],
  mapPin: [
    "Location01Icon",
    "Location04Icon",
    "MapPinIcon",
    "PinLocation01Icon",
    "MapsLocation01Icon",
  ],
  route: ["RouteIcon", "Route01Icon", "Route02Icon", "RoutingIcon"],
  cube: ["Cube01Icon", "CubeIcon"],
  tag: [
    "Tag01Icon",
    "Tags01Icon",
    "PriceTag01Icon",
    "Coupon01Icon",
    "Invoice01Icon",
  ],
  // UI icons
  search: ["Search01Icon", "SearchIcon", "Search02Icon"],
  chevronDown: ["ArrowDown01Icon", "ArrowDown02Icon", "ChevronDownIcon"],
  arrowLeft: ["ArrowLeft01Icon", "ArrowLeft02Icon"],
  arrowRight: ["ArrowRight01Icon", "ArrowRight02Icon"],
  arrowUp: ["ArrowUp01Icon", "ArrowUp02Icon", "ChevronUpIcon", "ArrowUpDouble01Icon"],
  quote: ["QuoteDownIcon", "QuoteUpIcon", "QuoteDown01Icon", "LeftToRightBlockQuoteIcon"],
  link: ["Link01Icon", "Link02Icon", "LinkSquare01Icon", "Hyperlink01Icon"],
  copy: ["Copy01Icon", "Copy02Icon", "CopyIcon"],
  share: ["Share01Icon", "Share02Icon", "Share03Icon", "ShareLocation01Icon"],
  twitter: ["NewTwitterIcon", "TwitterIcon", "NewTwitterRectangleIcon"],
  facebook: ["Facebook01Icon", "Facebook02Icon", "FacebookIcon"],
  linkedin: ["Linkedin01Icon", "Linkedin02Icon", "LinkedinIcon"],
  whatsapp: ["WhatsappBusinessIcon", "WhatsappIcon", "Whatsapp02Icon"],
  check2: ["CheckmarkCircle02Icon", "Tick02Icon"],
  phone: ["Call02Icon", "CallIcon", "Call01Icon", "TelephoneIcon"],
  menu: ["Menu01Icon", "Menu02Icon", "MenuIcon", "Menu03Icon"],
  dashboard: [
    "DashboardCircleIcon",
    "DashboardSquare01Icon",
    "DashboardSquare02Icon",
    "Menu01Icon",
  ],
  sun: ["Sun01Icon", "Sun02Icon", "SunIcon", "Sun03Icon"],
  moon: ["Moon02Icon", "MoonIcon", "Moon01Icon"],
  close: ["Cancel01Icon", "CancelIcon", "MultiplicationSignIcon", "Cross01Icon"],
  check: ["Tick02Icon", "CheckmarkCircle02Icon", "Tick01Icon", "CheckmarkSquare01Icon"],
  plus: ["Add01Icon", "PlusSignIcon", "AddIcon", "PlusSignSquareIcon"],
  minus: ["MinusSignIcon", "Remove01Icon", "SubtractIcon", "MinusSignSquareIcon"],
  mail: ["Mail01Icon", "MailIcon", "Mail02Icon", "MailAtSign01Icon"],
  lock: ["SquareLock01Icon", "LockIcon", "SquareLockPasswordIcon", "Shield01Icon"],
  doc: ["DocumentText01Icon", "LegalDocument01Icon", "File01Icon", "DocumentTextIcon"],
  scale: ["JusticeScale01Icon", "JusticeScale02Icon", "LegalDocument01Icon", "Shield01Icon"],
  accessibility: ["AccessibilityIcon", "HumanAccessibilityIcon", "UserIcon"],
  cookie: ["Cookie02Icon", "CookieIcon", "PackageIcon"],
  info: ["InformationCircleIcon", "InformationSquareIcon", "Alert01Icon", "HelpCircleIcon"],
  alert: ["Alert01Icon", "AlertCircleIcon", "AlertDiamondIcon", "InformationCircleIcon"],
  edit: ["Edit02Icon", "PencilEdit01Icon", "Edit01Icon", "PencilIcon"],
};

const cache: Record<string, unknown> = {};

function resolve(name: string): unknown {
  if (cache[name]) return cache[name];
  const pack = HI as Record<string, unknown>;
  const list = CANDIDATES[name] ?? [];
  for (const c of list) {
    if (pack[c]) {
      cache[name] = pack[c];
      return pack[c];
    }
  }
  const fallback = ["PackageIcon", "Home01Icon", "StarIcon", "CircleIcon"]
    .map((n) => pack[n])
    .find(Boolean);
  cache[name] = fallback;
  return fallback;
}

function sizeFromClass(cn?: string): number | undefined {
  if (!cn) return undefined;
  if (/\bh-4\b/.test(cn)) return 16;
  if (/\bh-5\b/.test(cn)) return 20;
  if (/\bh-6\b/.test(cn)) return 24;
  if (/\bh-\[18px\]/.test(cn)) return 18;
  return undefined;
}

export function Icon({ name, className, strokeWidth = 1.8, size }: IconProps) {
  const icon = resolve(name);
  if (!icon) return null;
  return (
    <HugeiconsIcon
      icon={icon as never}
      className={className}
      size={size ?? sizeFromClass(className) ?? 20}
      strokeWidth={strokeWidth}
      color="currentColor"
    />
  );
}
