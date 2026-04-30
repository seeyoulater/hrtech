import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { Icon } from '@/shared/components/Icon';
import styles from './EmptyState.module.css';

export function EmptyState() {
  return (
    <div className={styles.wrap}>
      <div className={styles.illustration} aria-hidden="true">
        <span className={styles.sheet} />
        <span className={styles.sheet} />
        <span className={styles.sheet} />
      </div>
      <h2 className={styles.title}>No applications yet</h2>
      <p className={styles.copy}>
        Create your first cover letter and start hitting your weekly goal of
        five applications.
      </p>
      <Link to="/new" className={styles.cta}>
        <Button size="lg" iconLeft={<Icon name="plus" size={18} />} tabIndex={-1}>
          Create New
        </Button>
      </Link>
    </div>
  );
}
