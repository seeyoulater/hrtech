import { Link } from 'react-router-dom';
import { Logo } from '@/shared/components/Logo';
import { ProgressDots } from '@/shared/components/ProgressDots';
import { IconButton } from '@/shared/components/IconButton';
import { Icon } from '@/shared/components/Icon';
import { GOAL } from '@/shared/lib/applications';
import styles from './Header.module.css';

type HeaderProps = {
  count: number;
};

export function Header({ count }: HeaderProps) {
  const filled = Math.min(count, GOAL);
  const achieved = count >= GOAL;
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logoLink} aria-label="Go to dashboard">
          <Logo />
        </Link>
        <div className={styles.right}>
          <span className={styles.progress}>
            <span className={styles.progressLabel}>
              <strong>{filled}</strong>/{GOAL} applications generated
            </span>
            {achieved ? (
              <span
                className={styles.achievedBadge}
                aria-label={`${GOAL} of ${GOAL} applications generated`}
                role="img"
              >
                <Icon name="check" size={14} />
              </span>
            ) : (
              <ProgressDots total={GOAL} filled={filled} />
            )}
          </span>
          <Link to="/" aria-label="Dashboard" className={styles.homeLink}>
            <IconButton label="Dashboard" variant="outline" tabIndex={-1}>
              <Icon name="home" />
            </IconButton>
          </Link>
        </div>
      </div>
    </header>
  );
}
