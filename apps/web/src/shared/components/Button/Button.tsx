import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import { Spinner } from '@/shared/components/Spinner';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  flat?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      iconLeft,
      iconRight,
      fullWidth,
      loading,
      flat,
      disabled,
      children,
      className,
      type = 'button',
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        styles.btn,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        {
          [styles.fullWidth]: fullWidth,
          [styles.loading]: loading,
          [styles.flat]: flat,
        },
        className,
      )}
      disabled={disabled || loading}
      data-loading={loading ? 'true' : undefined}
      {...rest}
    >
      {loading ? (
        <Spinner size={size === 'lg' ? 24 : size === 'sm' ? 14 : 18} />
      ) : (
        <>
          {iconLeft ? <span className={styles.icon}>{iconLeft}</span> : null}
          <span className={styles.label}>{children}</span>
          {iconRight ? <span className={styles.icon}>{iconRight}</span> : null}
        </>
      )}
    </button>
  ),
);

Button.displayName = 'Button';
