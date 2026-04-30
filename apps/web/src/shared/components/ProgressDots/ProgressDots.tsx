import cn from 'classnames';
import styles from './ProgressDots.module.css';

type ProgressDotsProps = {
  total: number;
  filled: number;
  size?: 'sm' | 'md';
};

export function ProgressDots({ total, filled, size = 'sm' }: ProgressDotsProps) {
  return (
    <span
      className={cn(styles.row, styles[`size_${size}`])}
      role="img"
      aria-label={`${filled} of ${total} completed`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(styles.dot, i < filled ? styles.filled : styles.empty)}
        />
      ))}
    </span>
  );
}
