import type { Company } from '../types';

import { ProjectCard } from './ProjectCard';
import styles from './CompanyBlock.module.scss';

export function CompanyBlock({ company }: { company: Company }) {
  const meta = [company.duration, company.employmentType, company.position]
    .filter(Boolean)
    .join(' · ');

  return (
    <section className={styles.company} aria-label={company.name}>
      <div className={styles.head}>
        <h3 className={styles.name}>{company.name}</h3>
        {company.period && <span className={styles.period}>{company.period}</span>}
      </div>
      {meta && <p className={styles.meta}>{meta}</p>}
      <div className={styles.projects}>
        {company.projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
