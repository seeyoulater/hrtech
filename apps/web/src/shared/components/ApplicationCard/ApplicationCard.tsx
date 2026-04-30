import { Link } from 'react-router-dom';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Icon } from '@/shared/components/Icon';
import { useCopy } from '@/shared/hooks/useCopy';
import type { Application } from '@/shared/types/application';
import styles from './ApplicationCard.module.css';

type ApplicationCardProps = {
  application: Application;
  onDelete: (id: string) => void;
};

export function ApplicationCard({ application, onDelete }: ApplicationCardProps) {
  const { copied, copy } = useCopy();
  return (
    <Card className={styles.card}>
      <Link
        to={`/applications/${application.id}`}
        className={styles.bodyLink}
        aria-label={`Open application for ${application.company || 'this company'}`}
      >
        <div className={styles.body}>
          <p className={styles.text}>{application.letter}</p>
          <span className={styles.fade} aria-hidden="true" />
          <span className={styles.openCue} aria-hidden="true">
            <Icon name="carbon:arrow-up-right" size={14} />
          </span>
        </div>
      </Link>
      <div className={styles.actions}>
        <Button
          variant="ghost"
          size="md"
          iconLeft={<Icon name="carbon:trash-can" size={16} />}
          onClick={() => onDelete(application.id)}
        >
          Delete
        </Button>
        <Button
          variant="ghost"
          size="md"
          iconRight={<Icon name={copied ? 'carbon:checkmark' : 'carbon:copy'} size={16} />}
          onClick={() => copy(application.letter)}
        >
          {copied ? 'Copied' : 'Copy to clipboard'}
        </Button>
      </div>
    </Card>
  );
}
