import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ApplicationCard } from '@/components/ApplicationCard';
import { EmptyState } from '@/components/EmptyState';
import { GoalBanner } from '@/components/GoalBanner';
import { useApplications } from '@/hooks/useApplications';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { applications, remove } = useApplications();
  const isEmpty = applications.length === 0;

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this cover letter? This cannot be undone.')) {
      remove(id);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Applications</h1>
        <Link to="/new" className={styles.cta}>
          <Button size="md" iconLeft={<Icon name="plus" size={16} />} tabIndex={-1}>
            Create New
          </Button>
        </Link>
      </div>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <ul className={styles.grid}>
          {applications.map((a) => (
            <li key={a.id}>
              <ApplicationCard application={a} onDelete={handleDelete} />
            </li>
          ))}
        </ul>
      )}

      <GoalBanner count={applications.length} />
    </div>
  );
}
