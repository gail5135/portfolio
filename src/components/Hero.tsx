import type { ProfileMeta } from '../types';

import styles from './Hero.module.scss';

export function Hero({ meta }: { meta: ProfileMeta }) {
  return (
    <header className={styles.hero}>
      <h1 className={styles.name}>
        <span>{meta.name}</span>{' '}
        {meta.englishName && <span className={styles.englishName} lang="en">{meta.englishName}</span>}
      </h1>
      <p className={styles.title}>
        {meta.title}
        {meta.totalExperience && <span className={styles.experience}>{meta.totalExperience}</span>}
      </p>
      <div className={styles.contact}>
        {meta.email && (
          <a href={`mailto:${meta.email}`}>
            <span aria-hidden="true">✉️</span> {meta.email}
          </a>
        )}
        {meta.github && (
          <a href={meta.github} target="_blank" rel="noreferrer noopener">
            <span aria-hidden="true">🧑🏻‍💻</span> GitHub
          </a>
        )}
      </div>
    </header>
  );
}
