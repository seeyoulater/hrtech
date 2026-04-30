import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './TextField.module.css';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, id, className, error, ...rest }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <div className={[styles.field, className].filter(Boolean).join(' ')}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={[styles.input, error ? styles.error : ''].filter(Boolean).join(' ')}
          aria-invalid={error || undefined}
          {...rest}
        />
      </div>
    );
  },
);
