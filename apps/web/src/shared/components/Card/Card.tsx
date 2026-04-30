import type { HTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './Card.module.css';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: 'subtle' | 'plain';
};

export function Card({ tone = 'subtle', className, ...rest }: CardProps) {
  return (
    <div
      className={cn(styles.card, styles[`tone_${tone}`], className)}
      {...rest}
    />
  );
}
