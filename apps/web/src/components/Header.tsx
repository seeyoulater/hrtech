import { Link } from 'react-router-dom';
import { Logo } from './ui/Logo';
import { ProgressDots } from './ui/ProgressDots';
import { IconButton } from './ui/IconButton';
import { Icon } from './ui/Icon';
import { GOAL } from '@/lib/applications';
import styles from './Header.module.css';

type HeaderProps = {
  count: number;
};

export function Header({ count }: HeaderProps) {
  const filled = Math.min(count, GOAL);
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
            <ProgressDots total={GOAL} filled={filled} />
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
