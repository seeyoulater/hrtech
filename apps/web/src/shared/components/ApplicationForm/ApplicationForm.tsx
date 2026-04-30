import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@/shared/components/TextField';
import { TextArea } from '@/shared/components/TextArea';
import { Button } from '@/shared/components/Button';
import { Icon } from '@/shared/components/Icon';
import { applicationSchema } from '@/shared/scheme';
import type { FormValues } from '@/shared/types/form';
import { DETAILS_MAX, EMPTY_FORM } from '@/constants/form';
import styles from './ApplicationForm.module.css';

type ApplicationFormProps = {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  loading: boolean;
  hasGenerated: boolean;
};

const headlineFor = (jobTitle: string, company: string): string => {
  const role = jobTitle.trim();
  const co = company.trim();
  if (!role && !co) return 'New application';
  if (role && co) return `${role}, ${co}`;
  return role || co;
};

export function ApplicationForm({
  defaultValues = EMPTY_FORM,
  onSubmit,
  loading,
  hasGenerated,
}: ApplicationFormProps) {
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
  const headline = headlineFor(live.jobTitle ?? '', live.company ?? '');
  const detailsLength = live.details?.length ?? 0;

  const submit = handleSubmit((vals) => onSubmit(vals));
  const canSubmit = isValid && !loading;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{headline}</h1>
      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.row}>
          <TextField
            label="Job title"
            placeholder="Product manager"
            autoComplete="off"
            error={!!errors.jobTitle}
            {...register('jobTitle')}
          />
          <TextField
            label="Company"
            placeholder="Apple"
            autoComplete="off"
            error={!!errors.company}
            {...register('company')}
          />
        </div>
        <TextField
          label="I am good at..."
          placeholder="HTML, CSS and doing things in time"
          autoComplete="off"
          error={!!errors.strengths}
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
            !loading && hasGenerated ? <Icon name="refresh" size={18} /> : null
          }
        >
          {hasGenerated ? 'Try Again' : 'Generate Now'}
        </Button>
      </form>
    </div>
  );
}
