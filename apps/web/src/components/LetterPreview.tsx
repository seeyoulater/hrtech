import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';
import { useCopy } from '@/hooks/useCopy';
import { useAiConfigured } from '@/hooks/useAiConfigured';
import styles from './LetterPreview.module.css';

type LetterPreviewProps = {
  letter: string;
  loading: boolean;
  error: string | null;
};

export function LetterPreview({ letter, loading, error }: LetterPreviewProps) {
  const { copied, copy } = useCopy();
  const aiStatus = useAiConfigured();
  const hasContent = letter.length > 0;
  const showPlaceholder = !hasContent && !loading && !error;

  return (
    <Card className={styles.card}>
      {showPlaceholder ? (
        <div className={styles.placeholder}>
          <span className={styles.placeholderTitle}>
            Your cover letter will appear here
          </span>
          <span className={styles.placeholderHint}>
            Fill out the form on the left, then hit "Generate cover letter".
          </span>
          {aiStatus === 'mock' ? (
            <span className={styles.placeholderHint}>
              Backend has no API key configured — using a mock generator.
            </span>
          ) : null}
          {aiStatus === 'offline' ? (
            <span className={styles.placeholderHint}>
              Backend unreachable — start the API with{' '}
              <code>pnpm dev:api</code>.
            </span>
          ) : null}
        </div>
      ) : (
        <>
          <div className={styles.bodyWrap}>
            <p className={styles.body}>
              {letter}
              {loading ? <span className={styles.caret} aria-hidden="true" /> : null}
            </p>
          </div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div className={styles.footer}>
            <Button
              variant="ghost"
              size="md"
              disabled={!hasContent || loading}
              iconRight={<Icon name={copied ? 'check' : 'copy'} size={16} />}
              onClick={() => copy(letter)}
            >
              {copied ? 'Copied' : 'Copy to clipboard'}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
