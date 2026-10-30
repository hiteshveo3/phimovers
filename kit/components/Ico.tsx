import type { Icon, IconProps } from 'iconsax-reactjs';

// The site's one icon set is Iconsax (Linear by default). Pass the icon component, e.g. <Ico icon={CallIcon} />.
export type IconType = Icon;

export function Ico({ icon: I, size = 18, variant = 'Linear', ...rest }: { icon: Icon } & IconProps) {
  return <I size={size} variant={variant} color="currentColor" aria-hidden="true" focusable="false" {...rest} />;
}
