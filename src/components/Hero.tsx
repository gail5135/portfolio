import type { ProfileMeta } from '../types';

import styles from './Hero.module.scss';

export function Hero({ meta }: { meta: ProfileMeta }) {
  return (
    <header className={styles.hero}>
      <h1 className={styles.name}>{meta.name}</h1>
      <p className={styles.title}>
        {meta.title}
        {meta.totalExperience && <span className={styles.experience}>{meta.totalExperience}</span>}
      </p>
      <div className={styles.contact}>
        {meta.email && <a href={`mailto:${meta.email}`}>{meta.email}</a>}
        {meta.github && (
          <a href={meta.github} target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
        )}
      </div>
    </header>
  );
}
