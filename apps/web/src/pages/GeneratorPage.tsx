import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ApplicationForm,
  EMPTY_FORM,
  type FormValues,
} from '@/components/ApplicationForm';
import { LetterPreview } from '@/components/LetterPreview';
import { GoalBanner } from '@/components/GoalBanner';
import { useApplications } from '@/hooks/useApplications';
import { generateLetter } from '@/lib/ai';
import styles from './GeneratorPage.module.css';

export function GeneratorPage() {
  const { applications, create, update } = useApplications();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const headline = useMemo(() => {
    const role = values.jobTitle.trim();
    const co = values.company.trim();
    if (!role && !co) return 'New application';
    if (role && co) return `${role}, ${co}`;
    return role || co;
  }, [values.jobTitle, values.company]);

  const handleGenerate = async () => {
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
      // for this generator session.
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
          <h1 className={styles.title}>{headline}</h1>
          <ApplicationForm
            values={values}
            onChange={setValues}
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
