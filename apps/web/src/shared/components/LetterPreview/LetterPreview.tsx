import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Icon } from '@/shared/components/Icon';
import { useCopy } from '@/shared/hooks/useCopy';
import { useAiConfigured } from '@/shared/hooks/useAiConfigured';
import styles from './LetterPreview.module.css';

type LetterPreviewProps = {
  letter: string;
  loading: boolean;
  error: string | null;
};

export const LetterPreview = ({
  letter,
  loading,
  error,
}: LetterPreviewProps) => {
  const { copied, copy } = useCopy();
  const aiStatus = useAiConfigured();
  const hasContent = letter.length > 0;
  const showPlaceholder = !hasContent && !loading && !error;

  return (
    <Card tone="subtle" className={styles.card}>
      <div className={styles.bodyWrap}>
        {showPlaceholder ? (
          <>
            <p className={styles.placeholderText}>
              Your personalized job application will appear here…
            </p>
            {aiStatus === 'mock' ? (
              <p className={styles.statusHint}>
                Backend has no API key configured — using a mock generator.
              </p>
            ) : null}
            {aiStatus === 'offline' ? (
              <p className={styles.statusHint}>
                Backend unreachable — start the API with{' '}
                <code>pnpm dev:api</code>.
              </p>
            ) : null}
          </>
        ) : (
          <p className={styles.body}>
            {letter}
            {loading ? <span className={styles.caret} aria-hidden="true" /> : null}
          </p>
        )}
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
      <div className={styles.footer}>
        <Button
          variant="ghost"
          size="md"
          disabled={!hasContent || loading}
          iconRight={<Icon name={copied ? 'carbon:checkmark' : 'carbon:copy'} size={16} />}
          onClick={() => copy(letter)}
        >
          {copied ? 'Copied' : 'Copy to clipboard'}
        </Button>
      </div>
    </Card>
  );
};
