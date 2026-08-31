/// <reference types="vite/client" />

/**
 * content/ 의 파일은 plugins/content.ts 가 빌드 타임에 파싱해
 * 아래 모양의 JS 모듈로 바꿔준다.
 */
declare module '*.md' {
  const doc: { slug: string; meta: Record<string, unknown>; bodyHtml: string };
  export default doc;
}

declare module '*.yml' {
  const data: unknown;
  export default data;
}
