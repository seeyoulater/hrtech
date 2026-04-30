import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { Icon } from '@/shared/components/Icon';
import { ProgressDots } from '@/shared/components/ProgressDots';
import { GOAL } from '@/constants/application';
import styles from './GoalBanner.module.css';

type GoalBannerProps = {
  count: number;
};

export function GoalBanner({ count }: GoalBannerProps) {
  if (count >= GOAL) return null;
  const filled = Math.min(count, GOAL);
  return (
    <section className={styles.banner} aria-label="Progress goal">
      <h2 className={styles.title}>Hit your goal</h2>
      <p className={styles.copy}>
        Generate and send out couple more job applications today to get hired
        faster
      </p>
      <Link to="/new" className={styles.cta}>
        <Button size="lg" iconLeft={<Icon name="plus" size={18} />} tabIndex={-1}>
          Create New
        </Button>
      </Link>
      <ProgressDots total={GOAL} filled={filled} size="md" />
      <p className={styles.count}>
        {filled} out of {GOAL}
      </p>
    </section>
  );
}
