import { useEffect, useRef, useState, type MouseEvent } from 'react';
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
  const navigationTarget = useRef<string | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (navigationTarget.current) return;
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
    // 클릭 이동 중에는 목적지를 강조하고, 스크롤이 멈춘 뒤 추적을 재개한다.
    // 종료 시 바로 재계산하지 않아 화면 하단처럼 앵커 정렬이 제한된 곳도 선택을 유지한다.
    const onScroll = () => {
      if (navigationTarget.current) {
        clearTimeout(settleTimer.current);
        settleTimer.current = setTimeout(() => { navigationTarget.current = null; }, 160);
      } else schedule();
    };
    const resumeTracking = () => {
      if (!navigationTarget.current) return;
      navigationTarget.current = null;
      clearTimeout(settleTimer.current);
      schedule();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) resumeTracking();
    };
    schedule();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', resumeTracking, { passive: true });
    window.addEventListener('touchstart', resumeTracking, { passive: true });
    window.addEventListener('pointerdown', resumeTracking, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', resumeTracking);
      window.removeEventListener('touchstart', resumeTracking);
      window.removeEventListener('pointerdown', resumeTracking);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', schedule);
    };
  }, [items]);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    navigationTarget.current = id;
    clearTimeout(settleTimer.current);
    // 같은 위치를 클릭해 scroll 이벤트가 없는 경우에도 잠금을 해제한다.
    settleTimer.current = setTimeout(() => { navigationTarget.current = null; }, 300);
    setActive(id);
    const section = items.find((item) => item.id === id || item.children?.some((child) => child.id === id));
    if (section) {
      previousSection.current = section.id;
      setExpanded({ [section.id]: true });
    }
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
                    aria-current={active === item.id ? 'location' : undefined} onClick={(event) => navigate(event, item.id)}>{item.label}</a>
                  {!!item.children?.length && <button aria-label={`${item.label} 하위 목차`}
                    aria-expanded={!!expanded[item.id]} aria-controls={`nav-${item.id}`}
                    onClick={() => setExpanded((value) => ({ ...value, [item.id]: !value[item.id] }))}>
                    <span aria-hidden="true">{expanded[item.id] ? '−' : '+'}</span>
                  </button>}
                </div>
                {!!item.children?.length && <ul id={`nav-${item.id}`} className={styles.children} hidden={!expanded[item.id]}>
                  {item.children.map((child) => <li key={child.id}>
                    <a href={`#${child.id}`} className={active === child.id ? styles.active : undefined}
                      aria-current={active === child.id ? 'location' : undefined} onClick={(event) => navigate(event, child.id)}>{child.label}</a>
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
