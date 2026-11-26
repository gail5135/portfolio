/**
 * 포트폴리오와 자기소개서를 PDF 로 뽑는다.  yarn pdf
 *
 * Vite 개발 서버를 잠깐 띄우고, 설치된 Chrome 의 headless 인쇄로 PDF 를 만든다.
 * 결과는 pdf/ 에 쌓이며 git 에 올라가지 않는다. 사이트 배포와도 관계없다.
 *
 * Chrome 위치가 기본값과 다르면 CHROME_PATH 환경 변수로 알려준다.
 */
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { createServer } from 'vite';

const run = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const outDir = resolve(root, 'pdf');

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  const found = candidates.find((path) => existsSync(path));
  if (!found) {
    throw new Error('Chrome 을 찾지 못했습니다. CHROME_PATH=/경로/chrome yarn pdf 로 지정하세요.');
  }
  return found;
}

async function printToPdf(chrome, url, file) {
  await run(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    // React 가 그릴 시간을 준다
    '--virtual-time-budget=5000',
    `--print-to-pdf=${file}`,
    url,
  ]);
  console.log(`  ✓ ${file.replace(root + '/', '')}`);
}

const chrome = findChrome();
if (!existsSync(resolve(root, 'content/private.yml'))) {
  console.warn('  ! content/private.yml 이 없어 전화번호 없이 만듭니다. (private.example.yml 참고)');
}

const server = await createServer({ root, logLevel: 'error', server: { port: 0 } });
await server.listen();
const base = server.resolvedUrls.local[0]; // 예: http://localhost:5173/portfolio/

try {
  await mkdir(outDir, { recursive: true });

  await printToPdf(chrome, `${base}print/portfolio.html`, resolve(outDir, '포트폴리오.pdf'));

  const letters = (await readdir(resolve(root, 'content/cover-letter')))
    .filter((name) => name.endsWith('.md') && !name.startsWith('_'))
    .map((name) => name.replace(/\.md$/, ''));

  for (const slug of letters) {
    const name = slug === 'default' ? '자기소개서.pdf' : `자기소개서-${slug}.pdf`;
    await printToPdf(chrome, `${base}print/cover-letter.html?letter=${encodeURIComponent(slug)}`, resolve(outDir, name));
  }
} finally {
  await server.close();
}
