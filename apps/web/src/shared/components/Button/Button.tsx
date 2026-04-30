import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from '@/shared/components/Spinner';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    iconLeft,
    iconRight,
    fullWidth,
    loading,
    disabled,
    children,
    className,
    type = 'button',
    ...rest
  },
  ref,
) {
  const cls = [
    styles.btn,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={cls}
      disabled={disabled || loading}
      data-loading={loading ? 'true' : undefined}
      {...rest}
    >
      {loading ? (
        <Spinner size={size === 'lg' ? 24 : 18} />
      ) : (
        <>
          {iconLeft ? <span className={styles.icon}>{iconLeft}</span> : null}
          <span className={styles.label}>{children}</span>
          {iconRight ? <span className={styles.icon}>{iconRight}</span> : null}
        </>
      )}
    </button>
  );
});
