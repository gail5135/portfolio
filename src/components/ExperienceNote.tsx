import type { ExperienceNote as Note } from '../types';

import { Chips } from './Chips';
import { Prose } from './Prose';
import styles from './ExperienceNote.module.scss';

export function ExperienceNote({ note }: { note: Note }) {
  const hasMeta = Boolean(note.context || note.period);

  return (
    <article className={styles.note}>
      <h3 className={styles.title}>{note.title}</h3>
      {hasMeta && (
        <p className={styles.meta}>
          {note.context && <span>{note.context}</span>}
          {note.period && (
            <span className={note.context ? `${styles.period} ${styles.dot}` : styles.period}>
              {note.period}
            </span>
          )}
        </p>
      )}
      {note.tags && note.tags.length > 0 && (
        <div className={styles.tags}>
          <Chips items={note.tags} label={`${note.title} 태그`} />
        </div>
      )}
      <Prose html={note.bodyHtml} className={styles.body} />
    </article>
  );
}
