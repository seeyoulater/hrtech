import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './IconButton.module.css';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  variant?: 'outline' | 'ghost';
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, children, variant = 'outline', className, type = 'button', ...rest },
    ref,
  ) {
    const cls = [styles.btn, styles[`variant_${variant}`], className]
      .filter(Boolean)
      .join(' ');
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={cls}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
