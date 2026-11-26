import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { CareerChart } from '../components/CareerChart';
import { Chips } from '../components/Chips';
import { ExperienceNote } from '../components/ExperienceNote';
import { Prose } from '../components/Prose';
import {
  activities,
  ai,
  education,
  links,
  loadExperiences,
  loadTimeline,
  profile,
  skills,
  summary,
} from '../content/loader';
import { getCompanyDuration } from '../utils/companyDuration';
import { PrintHeader } from './PrintHeader';

import '../styles/global.scss';
import './print.scss';

const experiences = loadExperiences();
const companies = loadTimeline();
const current = companies.find((company) => company.current)?.name;

function Portfolio() {
  // 연혁 본문 안의 <details>(세부 구현 등)도 종이에서는 전부 펼친다.
  useEffect(() => {
    document.querySelectorAll('details').forEach((el) => {
      el.open = true;
    });
  }, []);

  return (
    <main className="print-doc">
      <PrintHeader doc="포트폴리오" facts={[profile.meta.totalExperience ?? '', current ?? ''].filter(Boolean)}>
        <Prose html={summary.bodyHtml} className="print-summary" />
      </PrintHeader>

      <section className="print-section">
        <h2>경력 한눈에 보기</h2>
        <CareerChart companies={companies} />
      </section>

      {experiences.length > 0 && (
        <section className="print-section">
          <h2>주요 경험</h2>
          {experiences.map((note) => (
            <ExperienceNote key={note.slug} note={note} />
          ))}
        </section>
      )}

      <section className="print-section">
        <h2>AI 기능 개발 및 AI 활용 경험</h2>
        <Prose html={ai.bodyHtml} className="print-ai" />
      </section>

      <section className="print-section">
        <h2>경력 상세</h2>
        {companies.map((company) => {
          const meta = [getCompanyDuration(company), company.employmentType, company.position]
            .filter(Boolean)
            .join(' · ');
          return (
            <div key={company.id} className="print-company">
              <div className="print-row">
                <h3>{company.name}</h3>
                <span className="print-muted">{company.period}</span>
              </div>
              {meta && <p className="print-muted">{meta}</p>}
              {company.projects.map((project) => {
                const role = project.role !== company.position ? project.role : undefined;
                const sub = [role, project.stack?.join(', ')].filter(Boolean).join(' · ');
                return (
                  <div key={project.slug} className="print-project">
                    <div className="print-row">
                      <h4>{project.title}</h4>
                      <span className="print-muted">{project.period}</span>
                    </div>
                    {sub && <p className="print-muted">{sub}</p>}
                    <Prose html={project.bodyHtml} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </section>

      <section className="print-section">
        <h2>기술</h2>
        <Chips items={skills.items} label="개발 기술" />
        <Prose html={skills.bodyHtml} className="print-gap" />
      </section>

      <section className="print-section">
        <h2>학력</h2>
        <Prose html={education.bodyHtml} />
      </section>

      <section className="print-section">
        <h2>활동</h2>
        <Prose html={activities.bodyHtml} />
      </section>

      <section className="print-section print-links">
        <h2>개인 프로젝트</h2>
        <Prose html={links.bodyHtml} />
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Portfolio />
  </StrictMode>,
);
