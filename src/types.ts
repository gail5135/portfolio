/** content/companies.yml 의 한 항목 */
export interface CompanyMeta {
  id: string;
  name: string;
  period: string;
  duration?: string;
  employmentType?: string;
  position?: string;
}

/** content/experience/*.md 의 frontmatter */
export interface ProjectMeta {
  company: string;
  title: string;
  period: string;
  role?: string;
  stack?: string[];
}

export interface Project extends ProjectMeta {
  /** 파일명에서 뽑은 식별자. 정렬과 React key 에 쓴다. */
  slug: string;
  /** 마크다운 본문을 변환한 HTML */
  bodyHtml: string;
}

export interface Company extends CompanyMeta {
  projects: Project[];
}

/** frontmatter + 본문으로 이뤄진 일반 문서 */
export interface Doc<TMeta = Record<string, unknown>> {
  slug: string;
  meta: TMeta;
  bodyHtml: string;
}

export interface ProfileMeta {
  name: string;
  title: string;
  totalExperience?: string;
  email?: string;
  github?: string;
}

export interface LinkItem {
  title: string;
  url: string;
  description?: string;
}

/** content/experience/*.md 의 frontmatter — 인사이트/기억 기록 */
export interface ExperienceMeta {
  title: string;
  /** 어떤 프로젝트·상황에서 나온 이야기인지 */
  context?: string;
  period?: string;
  tags?: string[];
}

export interface ExperienceNote extends ExperienceMeta {
  slug: string;
  bodyHtml: string;
}
