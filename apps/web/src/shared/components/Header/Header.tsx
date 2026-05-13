import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { Logo } from '@/shared/components/Logo';
import { ProgressDots } from '@/shared/components/ProgressDots';
import { IconButton } from '@/shared/components/IconButton';
import { Icon } from '@/shared/components/Icon';
import { GOAL } from '@/shared/constants/application';
import styles from './Header.module.css';

type HeaderProps = {
  count: number;
};

export const Header = ({ count }: HeaderProps) => {
  const filled = Math.min(count, GOAL);
  const achieved = count >= GOAL;
  const [scrolled, setScrolled] = useState(false);

  // Hysteresis — collapsing the header shrinks the document by ~48px, so
  // a single threshold causes oscillation when the page barely scrolls past
  // it (clamp → expand → re-trigger). Use distinct enter/exit cutoffs that
  // sit on either side of that gap.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 20 : y > 100));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn(styles.header, scrolled && styles.scrolled)}>
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
                <Icon name="carbon:checkmark" size={18} />
              </span>
            ) : (
              <ProgressDots total={GOAL} filled={filled} />
            )}
          </span>
          <Link to="/" aria-label="Dashboard" className={styles.homeLink}>
            <IconButton
              label="Dashboard"
              variant="outline"
              tabIndex={-1}
              className={styles.homeButton}
            >
              <Icon name="carbon:home" />
            </IconButton>
          </Link>
        </div>
      </div>
    </header>
  );
};
