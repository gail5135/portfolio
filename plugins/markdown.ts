import { Marked } from 'marked';

/**
 * 마크다운 본문의 헤딩을 페이지 위계 아래로 밀어 넣는다.
 *
 * 본문이 어디에 들어가느냐에 따라 시작 레벨이 다르다.
 * - Work Experience: 글 제목이 h3 이므로 본문의 `##` 은 h4
 * - Work Timeline:   프로젝트 제목이 h4 이므로 본문의 `##` 은 h5
 *
 * offset 은 `##`(depth 2) 이 몇 번째 헤딩이 될지를 정한다. 2 면 h4, 3 이면 h5.
 */
const instances = new Map<number, Marked>();

function markedFor(offset: number): Marked {
  const cached = instances.get(offset);
  if (cached) return cached;

  const marked = new Marked({
    gfm: true,
    breaks: false,
    renderer: {
      heading(token) {
        const level = Math.min(token.depth + offset, 6);
        const text = this.parser.parseInline(token.tokens);
        return `<h${level}>${text}</h${level}>\n`;
      },
    },
  });
  instances.set(offset, marked);
  return marked;
}

export function renderMarkdown(source: string, headingOffset = 2): string {
  return markedFor(headingOffset).parse(source) as string;
}
