import { Icon as IconifyIcon } from '@iconify/react';
import styles from './Spinner.module.css';

type SpinnerProps = {
  size?: number;
  label?: string;
};

/**
 * Animated loading indicator from the `svg-spinners` Iconify
 * collection. Lazy-fetched on first use, cached afterwards.
 */
export const Spinner = ({ size = 20, label = 'Loading' }: SpinnerProps) => (
  <span className={styles.wrap} role="status" aria-label={label}>
    <IconifyIcon
      icon="svg-spinners:bars-rotate-fade"
      width={size}
      height={size}
    />
  </span>
);
