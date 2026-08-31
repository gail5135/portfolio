import styles from './Nav.module.scss';

export interface NavItem {
  id: string;
  label: string;
}

export function Nav({ items }: { items: NavItem[] }) {
  return (
    <nav className={styles.nav} aria-label="섹션 바로가기">
      <div className={styles.inner}>
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`} className={styles.link}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
