import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './TextField.module.css';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** Toggle the error border without a message. */
  error?: boolean;
  /** When set, also renders the message below the input and forces error styling. */
  errorMessage?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, id, className, error, errorMessage, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const isError = error || !!errorMessage;
    return (
      <div className={cn(styles.field, className)}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(styles.input, { [styles.error]: isError })}
          aria-invalid={isError || undefined}
          aria-describedby={errorMessage ? errorId : undefined}
          {...rest}
        />
        {errorMessage ? (
          <p id={errorId} className={styles.errorMessage} role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
