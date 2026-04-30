import styles from './Spinner.module.css';

type SpinnerProps = {
  size?: number;
  label?: string;
};

const TICKS = 8;

export function Spinner({ size = 20, label = 'Loading' }: SpinnerProps) {
  return (
    <span className={styles.wrap} role="status" aria-label={label}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={styles.svg}
        aria-hidden="true"
        focusable="false"
      >
        {Array.from({ length: TICKS }).map((_, i) => (
          <rect
            key={i}
            x="11"
            y="2"
            width="2"
            height="6"
            rx="1"
            fill="currentColor"
            transform={`rotate(${(360 / TICKS) * i} 12 12)`}
            opacity={0.15 + ((i + 1) / TICKS) * 0.85}
          />
        ))}
      </svg>
    </span>
  );
}
