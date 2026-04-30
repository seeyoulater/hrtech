import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { Icon } from '@/shared/components/Icon';
import { Grid } from '@/shared/components/Grid';
import { ApplicationCard } from '@/shared/components/ApplicationCard';
import { EmptyState } from '@/shared/components/EmptyState';
import { GoalBanner } from '@/shared/components/GoalBanner';
import { useConfirm } from '@/shared/components/Confirm';
import { useApplications } from '@/shared/hooks/useApplications';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { applications, remove } = useApplications();
  const confirm = useConfirm();
  const isEmpty = applications.length === 0;

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Delete this cover letter?',
      description: 'This cannot be undone.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (ok) remove(id);
  };

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Applications</h1>
        <Link to="/new" className={styles.cta}>
          <Button size="md" iconLeft={<Icon name="carbon:add" size={16} />} tabIndex={-1}>
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
