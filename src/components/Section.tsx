import type { ReactNode } from 'react';

import styles from './Section.module.scss';

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section tabIndex={-1} id={id} className={styles.section} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className={styles.heading}>
        {title}
      </h2>
      {children}
    </section>
  );
}
