import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'classnames';
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

const buildHeadline = (jobTitle: string, company: string): string => {
  const role = jobTitle.trim();
  const co = company.trim();
  if (!role && !co) return 'New application';
  if (role && co) return `${role}, ${co}`;
  return role || co;
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
  const headline = buildHeadline(live.jobTitle ?? '', live.company ?? '');
  const hasJobTitle = (live.jobTitle ?? '').trim().length > 0;
  const detailsLength = live.details?.length ?? 0;

  const submit = handleSubmit((vals) => onSubmit(vals));
  const canSubmit = isValid && !loading;

  return (
    <div className={styles.wrap}>
      <header className={styles.titleHeader}>
        <h1
          className={cn(styles.title, hasJobTitle && styles.titleFilled)}
          title={headline}
        >
          {headline}
        </h1>
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
          placeholder="Describe why you are a great fit or paste your bio"
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
