import styles from './Logo.module.css';

type LogoProps = { as?: 'div' | 'a' | 'span' };

export const Logo = ({ as: Tag = 'div' }: LogoProps) => (
  <Tag className={styles.logo}>
    <img src="/logo.svg" alt="Alt+Shift" height={48} />
  </Tag>
);
