import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { Icon } from '@/shared/components/Icon';
import { Grid } from '@/shared/components/Grid';
import { ApplicationCard } from '@/shared/components/ApplicationCard';
import { EmptyState } from '@/shared/components/EmptyState';
import { GoalBanner } from '@/shared/components/GoalBanner';
import { useApplications } from '@/shared/hooks/useApplications';
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
        <Grid as="ul" columns={2} collapse="tabletDown" gap={4}>
          {applications.map((a) => (
            <li key={a.id}>
              <ApplicationCard application={a} onDelete={handleDelete} />
            </li>
          ))}
        </Grid>
      )}

      <GoalBanner count={applications.length} />
    </div>
  );
}
