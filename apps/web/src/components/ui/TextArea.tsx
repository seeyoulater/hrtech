import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import styles from './TextArea.module.css';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  /** Show "n/max" counter under the field. */
  showCounter?: boolean;
  /** Explicit count override (use when the value is owned by react-hook-form). */
  count?: number;
  /** Soft cap shown in the counter. NOT applied as the HTML `maxLength`,
   *  so the user can type past it and see the error state. */
  countMax?: number;
  error?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      label,
      id,
      className,
      showCounter,
      count,
      countMax,
      value,
      error,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const length = count ?? (typeof value === 'string' ? value.length : 0);
    const overCap = countMax !== undefined && length > countMax;
    const isError = error ?? overCap;

    return (
      <div className={[styles.field, className].filter(Boolean).join(' ')}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          className={[styles.textarea, isError ? styles.error : ''].filter(Boolean).join(' ')}
          aria-invalid={isError || undefined}
          value={value}
          {...rest}
        />
        {showCounter && countMax !== undefined ? (
          <div
            className={[styles.counter, isError ? styles.counterError : '']
              .filter(Boolean)
              .join(' ')}
            aria-live="polite"
          >
            {length}/{countMax}
          </div>
        ) : null}
      </div>
    );
  },
);
