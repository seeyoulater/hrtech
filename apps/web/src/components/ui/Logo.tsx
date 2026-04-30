import { Icon } from './Icon';
import styles from './Logo.module.css';

export function Logo({ as: Tag = 'div' }: { as?: 'div' | 'a' | 'span' }) {
  return (
    <Tag className={styles.logo}>
      <span className={styles.mark}>
        <Icon name="logo" size={24} />
      </span>
      <span className={styles.wordmark}>Alt+Shift</span>
    </Tag>
  );
}
