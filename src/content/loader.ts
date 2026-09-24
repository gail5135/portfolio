import { getTotalExperience } from '../utils/companyDuration';

import profileDoc from '/content/profile.md';
import companiesData from '/content/companies.yml';
import aiDoc from '/content/ai.md';
import skillsDoc from '/content/skills.md';
import educationDoc from '/content/education.md';
import activitiesDoc from '/content/activities.md';
import linksDoc from '/content/links.md';

import type {
  Company,
  CompanyMeta,
  Doc,
  ExperienceMeta,
  ExperienceNote,
  ProfileMeta,
  Project,
  ProjectMeta,
} from '../types';

/**
 * content/ 의 글을 전부 읽는다.
 * plugins/content.ts 가 이미 파싱해 두었으므로 여기서는 조립만 한다.
 */
const timelineModules = import.meta.glob('/content/timeline/*.md', {
  eager: true,
}) as Record<string, { default: Doc }>;

const experienceModules = import.meta.glob('/content/experience/*.md', {
  eager: true,
}) as Record<string, { default: Doc }>;

const sourceProfile = profileDoc as unknown as Doc<ProfileMeta>;
export const profile: Doc<ProfileMeta> = {
  ...sourceProfile,
  meta: {
    ...sourceProfile.meta,
    totalExperience: sourceProfile.meta.totalExperience === 'auto'
      ? getTotalExperience(parseCompanyMeta())
      : sourceProfile.meta.totalExperience,
  },
};
export const ai = aiDoc;
export const education = educationDoc;
export const activities = activitiesDoc;
export const links = linksDoc;

export const skills = {
  items: ((skillsDoc.meta as { skills?: string[] }).skills ?? []) as string[],
  bodyHtml: skillsDoc.bodyHtml,
};

function parseCompanyMeta(): CompanyMeta[] {
  if (!Array.isArray(companiesData)) {
    console.warn('[content] companies.yml 의 최상위가 목록(-)이 아닙니다');
    return [];
  }
  return companiesData as CompanyMeta[];
}

function parseProjects(): Project[] {
  return Object.entries(timelineModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([path, module]) => {
      const doc = module.default;
      const meta = doc.meta as unknown as ProjectMeta;
      if (!meta.title) {
        console.warn(`[content] ${path} 의 frontmatter 에 title 이 없어 건너뜁니다`);
        return [];
      }
      return [{ ...meta, slug: doc.slug, bodyHtml: doc.bodyHtml }];
    });
}

/** Work Experience 섹션에 들어갈 글. 회사 구분 없이 파일명 순으로 늘어놓는다. */
export function loadExperiences(): ExperienceNote[] {
  return Object.entries(experienceModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([path, module]) => {
      const doc = module.default;
      const meta = doc.meta as unknown as ExperienceMeta;
      if (!meta.title) {
        console.warn(`[content] ${path} 의 frontmatter 에 title 이 없어 건너뜁니다`);
        return [];
      }
      return [{ ...meta, slug: doc.slug, bodyHtml: doc.bodyHtml }];
    });
}

/**
 * 회사 목록에 프로젝트를 붙인다.
 * companies.yml 에 없는 company 값을 쓴 프로젝트도 버리지 않고 별도 그룹으로 살려둔다.
 */
export function loadTimeline(): Company[] {
  const companies: Company[] = parseCompanyMeta().map((meta) => ({ ...meta, projects: [] }));
  const byId = new Map(companies.map((company) => [company.id, company]));

  for (const project of parseProjects()) {
    let company = byId.get(project.company);
    if (!company) {
      console.warn(
        `[content] timeline/${project.slug}: company "${project.company}" 가 companies.yml 에 없습니다`,
      );
      company = { id: project.company, name: project.company, period: '', projects: [] };
      byId.set(company.id, company);
      companies.push(company);
    }
    company.projects.push(project);
  }

  return companies.filter((company) => company.projects.length > 0);
}
