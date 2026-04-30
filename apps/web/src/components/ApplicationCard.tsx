import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';
import { useCopy } from '@/hooks/useCopy';
import type { Application } from '@/lib/applications';
import styles from './ApplicationCard.module.css';

type ApplicationCardProps = {
  application: Application;
  onDelete: (id: string) => void;
};

export function ApplicationCard({ application, onDelete }: ApplicationCardProps) {
  const { copied, copy } = useCopy();
  return (
    <Card className={styles.card}>
      <div className={styles.body}>
        <p className={styles.text}>{application.letter}</p>
        <span className={styles.fade} aria-hidden="true" />
      </div>
      <div className={styles.actions}>
        <Button
          variant="ghost"
          size="md"
          iconLeft={<Icon name="trash" size={16} />}
          onClick={() => onDelete(application.id)}
        >
          Delete
        </Button>
        <Button
          variant="ghost"
          size="md"
          iconRight={
            <Icon name={copied ? 'check' : 'copy'} size={16} />
          }
          onClick={() => copy(application.letter)}
        >
          {copied ? 'Copied' : 'Copy to clipboard'}
        </Button>
      </div>
    </Card>
  );
}
