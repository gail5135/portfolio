/**
 * 'YYYY.MM' 형식의 월을 다룬다. 경력 막대 차트의 위치 계산용.
 * 재직 기간(N년 N개월) 계산은 src/utils/companyDuration.ts 가 맡는다.
 */

export interface YearMonth {
  year: number;
  month: number;
}

const YEAR_MONTH = /(\d{4})\.(\d{1,2})/g;

export function currentYearMonth(now = new Date()): YearMonth {
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

/** 1970.01 을 0 으로 하는 월 번호. 막대 위치 계산에 쓴다. */
export function toIndex({ year, month }: YearMonth): number {
  return (year - 1970) * 12 + (month - 1);
}

export function formatYearMonth({ year, month }: YearMonth): string {
  return `${year}.${String(month).padStart(2, '0')}`;
}

/**
 * '2026.05 – 2026.07' 같은 기간 문자열에서 시작과 끝을 뽑는다.
 * - '2026.09' 처럼 한 달만 있으면 그 달 하나로 본다
 * - '2021.05 – 재직중' 처럼 끝이 비어 있으면 이번 달까지로 본다
 */
export function parsePeriod(period: string, now = currentYearMonth()): {
  start: YearMonth;
  end: YearMonth;
} | null {
  const found = [...period.matchAll(YEAR_MONTH)].map((m) => ({
    year: Number(m[1]),
    month: Number(m[2]),
  }));
  if (found.length === 0) return null;
  const isRange = /[–~-]/.test(period.replace(YEAR_MONTH, ''));
  return { start: found[0], end: found[1] ?? (isRange ? now : found[0]) };
}
