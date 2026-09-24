import type { CompanyMeta } from '../types';

export function formatExperienceMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  return [years ? `${years}년` : '', remainder || !years ? `${remainder}개월` : '']
    .filter(Boolean).join(' ');
}

/** 재직 중이면 시작 월과 현재 한국 월의 차이, 퇴사한 회사는 확정 개월 수. */
export function getCompanyMonths(company: CompanyMeta, now = new Date()): number | undefined {
  if (!company.current) {
    const months = company.durationMonths;
    return typeof months === 'number' && Number.isInteger(months) && months >= 0 ? months : undefined;
  }
  const start = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(company.startMonth ?? '');
  if (!start) return undefined;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric',
  }).formatToParts(now);
  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  const months = (year - Number(start[1])) * 12 + month - Number(start[2]);
  return months >= 0 ? months : undefined;
}

export function getCompanyDuration(company: CompanyMeta, now = new Date()): string | undefined {
  const months = getCompanyMonths(company, now);
  return months === undefined ? company.duration : formatExperienceMonths(months);
}

export function getTotalExperience(companies: CompanyMeta[], now = new Date()): string | undefined {
  if (!companies.length) return undefined;
  const months = companies.map((company) => getCompanyMonths(company, now));
  // 누락된 회사 정보를 0개월로 간주해 총 경력을 축소하지 않는다.
  if (months.some((value) => value === undefined)) return undefined;
  return `경력 ${formatExperienceMonths(months.reduce<number>((sum, value) => sum + value!, 0))}`;
}
