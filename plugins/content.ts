import type { Plugin } from 'vite';
import { load } from 'js-yaml';

import { slugFromPath, splitFrontmatter } from './frontmatter.js';
import { renderMarkdown } from './markdown.js';

/**
 * content/ 의 .md 와 .yml 을 빌드 타임에 파싱해 JS 모듈로 바꾼다.
 *
 * 이렇게 하면 마크다운 파서(marked)와 YAML 파서(js-yaml)가 브라우저로 가지 않는다.
 * 정적 사이트라 파싱 결과가 빌드 시점에 고정되므로 런타임에 다시 할 이유가 없다.
 */
export function contentPlugin(): Plugin {
  return {
    name: 'portfolio-content',
    enforce: 'pre',

    transform(code, id) {
      const file = id.split('?')[0];

      if (file.endsWith('.md')) {
        const slug = slugFromPath(file);
        // Timeline 은 프로젝트 제목이 h4 라서 본문 헤딩을 한 단계 더 내린다.
        const headingOffset = file.includes('/content/timeline/') ? 3 : 2;
        try {
          const { meta, body } = splitFrontmatter(code);
          const doc = { slug, meta, bodyHtml: renderMarkdown(body, headingOffset) };
          return { code: `export default ${JSON.stringify(doc)};`, map: null };
        } catch (error) {
          // 파일 하나의 오류로 빌드 전체를 세우지 않는다. 경고를 남기고 빈 문서로 둔다.
          this.warn(`${file} 를 읽지 못했습니다: ${String(error)}`);
          return {
            code: `export default ${JSON.stringify({ slug, meta: {}, bodyHtml: '' })};`,
            map: null,
          };
        }
      }

      if (file.endsWith('.yml') || file.endsWith('.yaml')) {
        try {
          return { code: `export default ${JSON.stringify(load(code) ?? null)};`, map: null };
        } catch (error) {
          this.warn(`${file} 를 읽지 못했습니다: ${String(error)}`);
          return { code: 'export default null;', map: null };
        }
      }

      return null;
    },
  };
}
