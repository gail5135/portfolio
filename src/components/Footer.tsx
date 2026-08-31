import styles from './Footer.module.scss';

export function Footer({ name }: { name: string }) {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} {name}</p>
    </footer>
  );
}
