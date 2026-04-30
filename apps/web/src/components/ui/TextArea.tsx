import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import styles from './TextArea.module.css';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  showCounter?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    { label, id, className, showCounter, value, maxLength, ...rest },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const length = typeof value === 'string' ? value.length : 0;

    return (
      <div className={[styles.field, className].filter(Boolean).join(' ')}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          className={styles.textarea}
          value={value}
          maxLength={maxLength}
          {...rest}
        />
        {showCounter && maxLength ? (
          <div className={styles.counter} aria-live="polite">
            {length}/{maxLength}
          </div>
        ) : null}
      </div>
    );
  },
);
