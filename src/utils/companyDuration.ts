import type { CompanyMeta } from '../types';

/** 시작 월과 현재 월의 차이. 입사 월은 0개월로 계산한다. */
export function getCompanyDuration(company: CompanyMeta, now = new Date()): string | undefined {
  if (!company.current) return company.duration;
  const start = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(company.startMonth ?? '');
  if (!start) return company.duration;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric',
  }).formatToParts(now);
  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  const months = (year - Number(start[1])) * 12 + month - Number(start[2]);
  if (months < 0) return company.duration;

  const years = Math.floor(months / 12);
  const remainder = months % 12;
  return [years ? `${years}년` : '', remainder || !years ? `${remainder}개월` : '']
    .filter(Boolean).join(' ');
}
