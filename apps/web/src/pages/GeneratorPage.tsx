import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationForm } from '@/shared/components/ApplicationForm';
import { LetterPreview } from '@/shared/components/LetterPreview';
import { GoalBanner } from '@/shared/components/GoalBanner';
import { useApplications } from '@/shared/hooks/useApplications';
import { generateLetter } from '@/shared/lib/ai';
import { EMPTY_FORM, type FormValues } from '@/shared/lib/applicationSchema';
import styles from './GeneratorPage.module.css';

type GeneratorPageProps = {
  initialId?: string;
};

export function GeneratorPage({ initialId }: GeneratorPageProps) {
  const { applications, create, update } = useApplications();
  const navigate = useNavigate();

  const initial = useMemo(
    () => (initialId ? applications.find((a) => a.id === initialId) : undefined),
    // Only resolve once at mount — `key={id}` on the route remounts
    // for any URL change, so the dependency on `applications` would
    // just churn this every store update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [letter, setLetter] = useState(initial?.letter ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(initial?.id ?? null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Bad URL → bounce to dashboard.
  useEffect(() => {
    if (initialId && !initial) navigate('/', { replace: true });
  }, [initialId, initial, navigate]);

  const defaultValues: FormValues = initial
    ? {
        jobTitle: initial.jobTitle,
        company: initial.company,
        strengths: initial.strengths,
        details: initial.details,
      }
    : EMPTY_FORM;

  const handleGenerate = async (values: FormValues) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setLetter('');

    try {
      const finalText = await generateLetter(values, {
        signal: controller.signal,
        onToken: (chunk) => setLetter((prev) => prev + chunk),
      });

      // Persist after completion. Re-generations update the same record
      // for this generator session (or the loaded record if we arrived
      // from a dashboard card).
      if (savedId) {
        update(savedId, { ...values, letter: finalText });
      } else {
        const created = create({ ...values, letter: finalText });
        setSavedId(created.id);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(
        err instanceof Error ? err.message : 'Something went wrong, try again.',
      );
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <section className={styles.formCol}>
          <ApplicationForm
            defaultValues={defaultValues}
            onSubmit={handleGenerate}
            loading={loading}
            hasGenerated={Boolean(savedId) || letter.length > 0}
          />
        </section>
        <section className={styles.previewCol}>
          <LetterPreview letter={letter} loading={loading} error={error} />
        </section>
      </div>
      <GoalBanner count={applications.length} />
    </div>
  );
}
