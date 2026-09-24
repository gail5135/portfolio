import { useEffect } from 'react';
import { Chips } from './components/Chips';
import { CompanyBlock } from './components/CompanyBlock';
import { EmptyNote } from './components/EmptyNote';
import { ExperienceNote } from './components/ExperienceNote';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Nav, type NavItem } from './components/Nav';
import { Prose } from './components/Prose';
import { Section } from './components/Section';
import {
  ai,
  activities,
  education,
  links,
  loadExperiences,
  loadTimeline,
  profile,
  skills,
} from './content/loader';

import styles from './App.module.scss';

const experiences = loadExperiences();
const companies = loadTimeline();
const timelineYears = Array.from(
  companies.flatMap((company) => company.projects).reduce((years, project) => {
    const start = project.period.match(/^(\d{4})\.(\d{1,2})/);
    if (!start) return years;
    const year = Number(start[1]);
    const month = Number(start[2]);
    const current = years.get(year);
    if (!current || month > current.month) {
      years.set(year, { month, slug: project.slug });
    }
    return years;
  }, new Map<number, { month: number; slug: string }>()),
).sort(([a], [b]) => b - a);

const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience', children: experiences.map((note) => ({ id: `experience-${note.slug}`, label: note.navLabel || note.title })) },
  { id: 'ai', label: 'AI' },
  { id: 'timeline', label: 'Timeline', children: timelineYears.map(([year, project]) => ({ id: `timeline-${project.slug}`, label: String(year) })) },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'activities', label: 'Activities' },
  { id: 'projects', label: 'Projects' },
];

export default function App() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        본문 바로가기
      </a>
      <Nav items={NAV_ITEMS} />
      <div className={styles.page}>
        <Hero meta={profile.meta} />
        <main id="main">
          <Section id="about" title="About">
            <Prose html={profile.bodyHtml} />
          </Section>

          <Section id="experience" title="Work Experience">
            {experiences.length > 0 && (
              <nav className={styles.sectionLinks} aria-label="경험 바로가기">
                {experiences.map((note) => (
                  <a key={note.slug} href={`#experience-${note.slug}`}>
                    {note.navLabel || note.title}
                  </a>
                ))}
              </nav>
            )}
            {experiences.length > 0 ? (
              experiences.map((note) => <ExperienceNote key={note.slug} note={note} />)
            ) : (
              <EmptyNote>content/experience/ 에 .md 파일을 만들면 여기에 나옵니다.</EmptyNote>
            )}
          </Section>

          <Section id="ai" title="AI 기능 개발 및 AI 활용 경험">
            <Prose html={ai.bodyHtml} />
          </Section>

          <Section id="timeline" title="Work Timeline">
            <nav className={styles.sectionLinks} aria-label="경력 연도별 바로가기">
              {timelineYears.map(([year, project]) => (
                <a key={year} href={`#timeline-${project.slug}`}>{year}</a>
              ))}
            </nav>
            {companies.map((company) => (
              <CompanyBlock key={company.id} company={company} />
            ))}
          </Section>

          <Section id="skills" title="Skills">
            <div className={styles.skills}>
              <div>
                <h3 className={styles.skillHeading}>개발</h3>
                <Chips items={skills.items} label="개발 기술" />
              </div>
              <div>
                <h3 className={styles.skillHeading}>언어</h3>
                <Prose html={skills.bodyHtml} />
              </div>
            </div>
          </Section>

          <Section id="education" title="Education">
            <Prose html={education.bodyHtml} />
          </Section>

          <Section id="activities" title="Activities">
            <Prose html={activities.bodyHtml} />
          </Section>

          <Section id="projects" title="Personal Projects">
            <Prose html={links.bodyHtml} />
          </Section>
        </main>
        <Footer name={profile.meta.name} />
      </div>
    </>
  );
}
