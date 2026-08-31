/**
 * content/ 의 마크다운을 변환한 HTML 을 그린다.
 * 내용은 저장소 안의 파일에서만 오므로 외부 입력이 아니다.
 */
export function Prose({ html, className }: { html: string; className?: string }) {
  if (!html.trim()) return null;
  return (
    <div
      className={className ? `prose ${className}` : 'prose'}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
