import styles from './Logo.module.css';

type LogoProps = { as?: 'div' | 'a' | 'span' };

export const Logo = ({ as: Tag = 'div' }: LogoProps) => (
  <Tag className={styles.logo}>
    <span className={styles.mark}>
      <img src="/logo-mark.svg" alt="" width={24} height={24} />
    </span>
    <span className={styles.wordmark}>Alt+Shift</span>
  </Tag>
);
