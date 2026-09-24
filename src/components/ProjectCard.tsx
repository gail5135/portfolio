import type { Project } from '../types';

import { Chips } from './Chips';
import { Prose } from './Prose';
import styles from './ProjectCard.module.scss';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article id={`timeline-${project.slug}`} className={styles.project} tabIndex={-1}>
      <div className={styles.head}>
        <h4 className={styles.title}>{project.title}</h4>
        <span className={styles.period}>{project.period}</span>
      </div>
      {project.role && <p className={styles.role}>{project.role}</p>}
      {project.stack && project.stack.length > 0 && (
        <div className={styles.stack}>
          <Chips items={project.stack} label={`${project.title} 사용 기술`} />
        </div>
      )}
      <Prose html={project.bodyHtml} className={styles.body} />
    </article>
  );
}
