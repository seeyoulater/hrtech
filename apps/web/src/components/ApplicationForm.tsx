import type { ChangeEvent, FormEvent } from 'react';
import { TextField } from './ui/TextField';
import { TextArea } from './ui/TextArea';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';
import styles from './ApplicationForm.module.css';

export type FormValues = {
  jobTitle: string;
  company: string;
  strengths: string;
  details: string;
};

export const EMPTY_FORM: FormValues = {
  jobTitle: '',
  company: '',
  strengths: '',
  details: '',
};

const DETAILS_MAX = 1200;

type ApplicationFormProps = {
  values: FormValues;
  onChange: (next: FormValues) => void;
  onSubmit: () => void;
  loading: boolean;
  hasGenerated: boolean;
};

export function ApplicationForm({
  values,
  onChange,
  onSubmit,
  loading,
  hasGenerated,
}: ApplicationFormProps) {
  const update =
    <K extends keyof FormValues>(key: K) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
      onChange({ ...values, [key]: e.target.value });
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  const canSubmit =
    values.jobTitle.trim().length > 0 && values.company.trim().length > 0;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <TextField
          label="Job title"
          placeholder="Product manager"
          value={values.jobTitle}
          onChange={update('jobTitle')}
          autoComplete="off"
          required
        />
        <TextField
          label="Company"
          placeholder="Apple"
          value={values.company}
          onChange={update('company')}
          autoComplete="off"
          required
        />
      </div>
      <TextField
        label="I am good at..."
        placeholder="HTML, CSS and doing things in time"
        value={values.strengths}
        onChange={update('strengths')}
        autoComplete="off"
      />
      <TextArea
        label="Additional details"
        placeholder="What should we mention? Projects, results, what you're looking for…"
        value={values.details}
        onChange={update('details')}
        maxLength={DETAILS_MAX}
        showCounter
      />
      <Button
        type="submit"
        size="lg"
        variant={hasGenerated ? 'secondary' : 'primary'}
        fullWidth
        loading={loading}
        disabled={!canSubmit}
        iconLeft={
          loading ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : hasGenerated ? (
            <Icon name="refresh" size={18} />
          ) : null
        }
      >
        {loading ? 'Generating…' : hasGenerated ? 'Try Again' : 'Generate Now'}
      </Button>
    </form>
  );
}
