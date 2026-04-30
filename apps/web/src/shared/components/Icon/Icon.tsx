import { forwardRef } from 'react';
import { Icon as IconifyIcon } from '@iconify/react';
import type { IconProps } from '@iconify/react';
import cn from 'classnames';
import styles from './Icon.module.css';

/**
 * Iconify wrapper. Names are constrained to two collections:
 * - https://icones.js.org/collection/carbon  (primary)
 * - https://icones.js.org/collection/streamline  (secondary)
 *
 * Carbon is the default set; reach for Streamline only when Carbon
 * doesn't have the right glyph. Adding new icons doesn't require any
 * registration here; @iconify/react fetches them on demand and caches
 * to localStorage.
 */
type IconName = `carbon:${string}` | `streamline:${string}`;

type Size = 12 | 14 | 16 | 18 | 24;

type Props = Omit<IconProps, 'icon'> & {
  name: IconName;
  size?: Size;
  color?: string;
  className?: string;
};

export const Icon = forwardRef<SVGSVGElement, Props>(function Icon(
  { name, size = 16, color, className, ...rest },
  ref,
) {
  return (
    <IconifyIcon
      ref={ref}
      icon={name}
      width={size}
      height={size}
      color={color}
      className={cn(styles.icon, className)}
      {...rest}
    />
  );
});
