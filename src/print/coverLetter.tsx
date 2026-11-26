import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Prose } from '../components/Prose';
import { loadCoverLetters } from '../content/loader';
import { PrintHeader } from './PrintHeader';

import '../styles/global.scss';
import './print.scss';

/** ?letter=파일명 으로 어떤 자기소개서를 그릴지 고른다. 기본은 default. */
const slug = new URLSearchParams(location.search).get('letter') ?? 'default';
const letter = loadCoverLetters().find((item) => item.slug === slug);

function CoverLetter() {
  if (!letter) {
    return <p>content/cover-letter/{slug}.md 를 찾지 못했습니다.</p>;
  }
  const target = [letter.company, letter.position].filter(Boolean).join(' · ');

  return (
    <main className="print-doc print-letter">
      <PrintHeader doc={letter.title ?? '자기소개서'} facts={target ? [`지원: ${target}`] : undefined} />
      <Prose html={letter.bodyHtml} />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CoverLetter />
  </StrictMode>,
);
