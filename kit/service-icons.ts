// Phi's service icon keys (lib/data.ts) mapped to the Iconsax set used by the Alpha-style kit.
import type { Icon } from 'iconsax-reactjs';
import { Box, Box1, Briefcase, Calendar, Clock, Global, Home2, I3Dcube, MagicStar, ShieldTick, ShoppingCart, Star1, Setting2, Truck, User } from 'iconsax-reactjs';

const MAP: Record<string, Icon> = {
  home: Home2,
  truck: Truck,
  user: User,
  cart: ShoppingCart,
  sofa: Box1,
  cube: I3Dcube,
  box: Box,
  wrench: Setting2,
  briefcase: Briefcase,
  shield: ShieldTick,
  star: Star1,
  clock: Clock,
  calendar: Calendar,
  globe: Global,
  sparkles: MagicStar,
};

export const serviceIcon = (key: string): Icon => MAP[key] ?? Box;

// Service pictures that exist in /public/services. Every other service shows its illustration tile until the
// owner adds a picture at /public/services/{slug}.jpg and lists it here.
const SERVICE_PHOTOS: Record<string, string> = {
  'house-removals': '/services/house-removals.jpg',
  'man-and-van': '/services/man-and-van.jpg',
  'sofa-delivery': '/services/sofa-delivery.jpg',
  'office-removals': '/services/office-removals.jpg',
  'secure-storage': '/services/secure-storage.jpg',
  'studio-moves': '/services/studio-moves.jpg',
  'appliance-delivery': '/services/appliance-delivery.jpg',
  'house-clearance': '/services/house-clearance.jpg',
  'flat-removals': '/services/flat-removals.jpg',
  'furniture-delivery': '/services/furniture-delivery.jpg',
  'long-distance-removals': '/services/long-distance-removals.jpg',
  'full-packing-service': '/services/full-packing-service.jpg',
  'single-item-delivery': '/services/single-item-delivery.jpg',
  'student-moves': '/services/student-moves.jpg',
};

/** The real photo for a service, or '' when there is none yet. */
export const servicePhoto = (slug: string): string => SERVICE_PHOTOS[slug] ?? '';
