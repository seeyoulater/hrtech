import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './TextField.module.css';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, id, className, error, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <div className={cn(styles.field, className)}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(styles.input, { [styles.error]: error })}
          aria-invalid={error || undefined}
          {...rest}
        />
      </div>
    );
  },
);

TextField.displayName = 'TextField';
