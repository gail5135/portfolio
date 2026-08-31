import { load } from 'js-yaml';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export interface RawDoc {
  meta: Record<string, unknown>;
  body: string;
}

/**
 * `---` 로 감싼 YAML 머리말과 본문을 분리한다.
 * 머리말이 없으면 전체를 본문으로 본다.
 */
export function splitFrontmatter(raw: string): RawDoc {
  const match = raw.match(FRONTMATTER);
  if (!match) return { meta: {}, body: raw };

  const parsed = load(match[1]);
  const meta =
    parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};

  return { meta, body: raw.slice(match[0].length) };
}

/** `content/experience/01-foo.md` → `01-foo` */
export function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '');
}
