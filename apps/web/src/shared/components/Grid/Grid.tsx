import { createElement } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import styles from './Grid.module.css';

type Tag = 'div' | 'ul' | 'ol' | 'section' | 'nav';

type CollapseAt = 'mobile' | 'tabletDown' | 'laptopDown' | false;

export type GridProps = {
  /** HTML element to render. Defaults to `div`. Use `ul`/`ol` for lists. */
  as?: Tag;
  /** Columns at default (>laptop) viewport. Default 2. */
  columns?: number;
  /**
   * Breakpoint at which the grid collapses to a single column. Pass
   * `false` to keep `columns` at every viewport width. Default
   * `tabletDown` (≤720px).
   */
  collapse?: CollapseAt;
  /** Gap as a number on the --space-X scale. Default 4. */
  gap?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

const COLLAPSE_CLASS: Record<Exclude<CollapseAt, false>, string> = {
  mobile: styles.collapseMobile,
  tabletDown: styles.collapseTabletDown,
  laptopDown: styles.collapseLaptopDown,
};

export function Grid({
  as = 'div',
  columns = 2,
  collapse = 'tabletDown',
  gap = 4,
  className,
  style,
  children,
}: GridProps) {
  const classes = [
    styles.grid,
    collapse ? COLLAPSE_CLASS[collapse] : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const styleVars: CSSProperties = {
    ...style,
    ['--grid-cols' as string]: columns,
    ['--grid-gap' as string]: `var(--space-${gap})`,
  };

  return createElement(as, { className: classes, style: styleVars }, children);
}
