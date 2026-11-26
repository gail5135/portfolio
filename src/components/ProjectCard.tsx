import type { Project } from '../types';

import { Prose } from './Prose';
import styles from './ProjectCard.module.scss';

/**
 * 연혁 한 줄. 기본은 접혀 있고 제목을 누르면 세부 내용이 펼쳐진다.
 * PDF(yarn pdf)에서는 전부 펼친 별도 레이아웃을 쓴다 (src/print/portfolio.tsx).
 */
export function ProjectCard({
  project,
  companyPosition,
}: {
  project: Project;
  /** 회사 직급과 같은 역할은 줄마다 반복하지 않는다 */
  companyPosition?: string;
}) {
  const role = project.role && project.role !== companyPosition ? project.role : undefined;
  const sub = [role, project.stack?.join(', ')].filter(Boolean).join(' · ');

  return (
    <details id={`timeline-${project.slug}`} className={styles.project} tabIndex={-1}>
      <summary className={styles.summary}>
        <h4 className={styles.title}>{project.title}</h4>
        <span className={styles.period}>{project.period}</span>
        {sub && <span className={styles.sub}>{sub}</span>}
      </summary>
      <Prose html={project.bodyHtml} className={styles.body} />
    </details>
  );
}
