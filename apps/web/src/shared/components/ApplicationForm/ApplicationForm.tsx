import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@/shared/components/TextField';
import { TextArea } from '@/shared/components/TextArea';
import { Button } from '@/shared/components/Button';
import { Icon } from '@/shared/components/Icon';
import { applicationSchema } from '@/shared/scheme';
import type { FormValues } from '@/shared/types/form';
import { DETAILS_MAX, EMPTY_FORM } from '@/shared/constants/form';
import styles from './ApplicationForm.module.css';

type ApplicationFormProps = {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  loading: boolean;
  hasGenerated: boolean;
};

type HeadlineParts = {
  /** Primary line (h1). Always present. */
  primary: string;
  /** Secondary line (company). Null when there's no second piece. */
  secondary: string | null;
};

const headlineParts = (jobTitle: string, company: string): HeadlineParts => {
  const role = jobTitle.trim();
  const co = company.trim();
  if (!role && !co) return { primary: 'New application', secondary: null };
  if (role && co) return { primary: role, secondary: co };
  // Whichever single field is filled becomes the primary line.
  return { primary: role || co, secondary: null };
};

export const ApplicationForm = ({
  defaultValues = EMPTY_FORM,
  onSubmit,
  loading,
  hasGenerated,
}: ApplicationFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
    mode: 'onChange',
  });

  const live = useWatch({ control });
  const { primary, secondary } = headlineParts(
    live.jobTitle ?? '',
    live.company ?? '',
  );
  const detailsLength = live.details?.length ?? 0;

  const submit = handleSubmit((vals) => onSubmit(vals));
  const canSubmit = isValid && !loading;

  return (
    <div className={styles.wrap}>
      <header className={styles.titleHeader}>
        <h1 className={styles.title} title={primary}>
          {primary}
        </h1>
        {secondary ? (
          <p className={styles.subtitle} title={secondary}>
            {secondary}
          </p>
        ) : null}
      </header>
      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.row}>
          <TextField
            label="Job title"
            placeholder="Product manager"
            autoComplete="off"
            errorMessage={errors.jobTitle?.message}
            {...register('jobTitle')}
          />
          <TextField
            label="Company"
            placeholder="Apple"
            autoComplete="off"
            errorMessage={errors.company?.message}
            {...register('company')}
          />
        </div>
        <TextField
          label="I am good at..."
          placeholder="HTML, CSS and doing things in time"
          autoComplete="off"
          errorMessage={errors.strengths?.message}
          {...register('strengths')}
        />
        <TextArea
          label="Additional details"
          placeholder="What should we mention? Projects, results, what you're looking for…"
          showCounter
          countMax={DETAILS_MAX}
          count={detailsLength}
          error={!!errors.details}
          {...register('details')}
        />
        <Button
          type="submit"
          size="lg"
          variant={hasGenerated ? 'secondary' : 'primary'}
          fullWidth
          loading={loading}
          disabled={!canSubmit}
          iconLeft={
            !loading && hasGenerated ? <Icon name="carbon:renew" size={18} /> : null
          }
        >
          {hasGenerated ? 'Try Again' : 'Generate Now'}
        </Button>
      </form>
    </div>
  );
};
