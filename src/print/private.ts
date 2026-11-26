/**
 * content/private.yml 을 읽는다. git 에 올라가지 않는 파일이라 없을 수도 있다.
 * glob 은 파일이 없으면 빈 객체를 돌려주므로, 없어도 빌드가 깨지지 않는다.
 *
 * 이 모듈은 PDF 페이지에서만 import 한다. 사이트 번들에 들어가면 안 된다.
 */
const modules = import.meta.glob('/content/private.yml', { eager: true }) as Record<
  string,
  { default: unknown }
>;

const data = Object.values(modules)[0]?.default;

export const privateInfo: { phone?: string } =
  data && typeof data === 'object' ? (data as { phone?: string }) : {};
