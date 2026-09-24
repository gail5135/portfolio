import { useEffect, useRef, useState } from 'react';
import styles from './Nav.module.scss';

export interface NavItem {
  id: string;
  label: string;
  children?: NavItem[];
}

export function Nav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const previousSection = useRef('');

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = [...items].reverse().find((item) =>
        (document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity) <= 112,
      ) ?? items[0];
      if (!section) return;
      const child = [...(section.children ?? [])].reverse().find((item) =>
        (document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity) <= 112,
      );
      setActive(child?.id ?? section.id);
      if (previousSection.current !== section.id) {
        previousSection.current = section.id;
        setExpanded({ [section.id]: true });
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [items]);

  const navigate = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }));
  };

  return (
    <aside className={styles.sidebar} onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }}>
      <div className={styles.mobileBar}>
        <span>이해창 · Portfolio</span>
        <button ref={toggle} aria-expanded={open} aria-controls="portfolio-nav" onClick={() => setOpen(!open)}>
          {open ? '목차 닫기' : '목차 열기'}
        </button>
      </div>
      <nav id="portfolio-nav" className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="포트폴리오 목차">
        <p className={styles.caption}>ON THIS PAGE</p>
        <ul>
          {items.map((item) => {
            const containsActive = item.id === active || item.children?.some((child) => child.id === active);
            return (
              <li key={item.id}>
                <div className={styles.row}>
                  <a href={`#${item.id}`} className={containsActive ? styles.active : undefined}
                    aria-current={active === item.id ? 'location' : undefined} onClick={() => navigate(item.id)}>{item.label}</a>
                  {!!item.children?.length && <button aria-label={`${item.label} 하위 목차`}
                    aria-expanded={!!expanded[item.id]} aria-controls={`nav-${item.id}`}
                    onClick={() => setExpanded((value) => ({ ...value, [item.id]: !value[item.id] }))}>
                    <span aria-hidden="true">{expanded[item.id] ? '−' : '+'}</span>
                  </button>}
                </div>
                {!!item.children?.length && <ul id={`nav-${item.id}`} className={styles.children} hidden={!expanded[item.id]}>
                  {item.children.map((child) => <li key={child.id}>
                    <a href={`#${child.id}`} className={active === child.id ? styles.active : undefined}
                      aria-current={active === child.id ? 'location' : undefined} onClick={() => navigate(child.id)}>{child.label}</a>
                  </li>)}
                </ul>}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
