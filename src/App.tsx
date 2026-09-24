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

const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'ai', label: 'AI' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'activities', label: 'Activities' },
  { id: 'projects', label: 'Projects' },
];

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

export default function App() {
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
            <nav className={styles.timelineYears} aria-label="경력 연도별 바로가기">
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
              <Chips items={skills.items} label="보유 기술" />
              <Prose html={skills.bodyHtml} />
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
