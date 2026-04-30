import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: 'subtle' | 'plain';
};

export function Card({ tone = 'subtle', className, ...rest }: CardProps) {
  const cls = [styles.card, styles[`tone_${tone}`], className]
    .filter(Boolean)
    .join(' ');
  return <div className={cls} {...rest} />;
}
