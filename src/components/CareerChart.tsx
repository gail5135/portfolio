import type { Company } from '../types';
import { currentYearMonth, parsePeriod, toIndex, type YearMonth } from '../content/period';

import styles from './CareerChart.module.scss';

interface Bar {
  key: string;
  title: string;
  start: number;
  end: number;
  /** 본문에 경험 글 링크(#experience-…, #ai)가 있으면 그 주소 */
  story?: string;
}

/** 연혁 본문에서 경험 글로 가는 첫 링크를 찾는다. 콘텐츠에 따로 표시하지 않아도 된다. */
function findStoryLink(html: string): string | undefined {
  return /href="(#(?:experience-[^"]+|ai))"/.exec(html)?.[1];
}

/** 겹치는 프로젝트가 같은 줄에 포개지지 않도록 줄을 나눈다. */
function assignLanes(bars: Bar[]): Bar[][] {
  const lanes: Bar[][] = [];
  for (const bar of [...bars].sort((a, b) => a.start - b.start)) {
    const lane = lanes.find((items) => items[items.length - 1].end < bar.start);
    if (lane) lane.push(bar);
    else lanes.push([bar]);
  }
  return lanes;
}

/**
 * 회사별 재직 기간과 그 안의 프로젝트를 가로 막대로 그린다.
 * 같은 정보가 아래 연혁에 글로 있으므로, 이 그림은 한눈에 보는 요약이다.
 */
export function CareerChart({ companies }: { companies: Company[] }) {
  const now = currentYearMonth();

  const rows = companies.flatMap((company) => {
    const range = parsePeriod(company.period, now);
    if (!range) return [];

    const bars: Bar[] = company.projects.flatMap((project) => {
      const period = parsePeriod(project.period, now);
      if (!period) return [];
      return [
        {
          key: project.slug,
          title: `${project.title} (${project.period})`,
          start: toIndex(period.start),
          end: toIndex(period.end),
          story: findStoryLink(project.bodyHtml),
        },
      ];
    });

    return [{ company, range, lanes: assignLanes(bars) }];
  });

  if (rows.length === 0) return null;

  // 축은 가장 이른 해의 1월부터 올해 12월까지
  const first: YearMonth = { year: Math.min(...rows.map((r) => r.range.start.year)), month: 1 };
  const last: YearMonth = { year: now.year, month: 12 };
  const min = toIndex(first);
  const span = toIndex(last) - min + 1;
  const pos = (index: number) => `${((index - min) / span) * 100}%`;
  const width = (from: number, to: number) => `${((to - from + 1) / span) * 100}%`;
  const years = Array.from({ length: last.year - first.year + 1 }, (_, i) => first.year + i);

  return (
    <figure className={styles.chart}>
      <figcaption className={styles.legend}>
        <span>
          <i className={`${styles.swatch} ${styles.swatchTenure}`} /> 재직
        </span>
        <span>
          <i className={`${styles.swatch} ${styles.swatchProject}`} /> 프로젝트
        </span>
        <span>
          <i className={`${styles.swatch} ${styles.swatchFeatured}`} /> 경험 글로 소개한 프로젝트
        </span>
      </figcaption>

      <div className={styles.plot}>
        <div className={styles.grid} aria-hidden="true">
          {years.map((year) => (
            <span key={year} className={styles.gridLine} style={{ left: pos(toIndex({ year, month: 1 })) }} />
          ))}
        </div>

        {rows.map(({ company, range, lanes }) => {
          const s = toIndex(range.start);
          const e = toIndex(range.end);
          return (
            <div key={company.id} className={styles.row}>
              <p className={styles.rowLabel}>
                <span className={styles.company}>{company.name}</span>
                <span className={styles.range}>{company.period}</span>
              </p>
              <div className={styles.track}>
                <span className={styles.tenure} style={{ left: pos(s), width: width(s, e) }} />
              </div>
              {lanes.map((lane, laneIndex) => (
                <div key={laneIndex} className={`${styles.track} ${styles.lane}`}>
                  {lane.map((bar) => (
                    <a
                      key={bar.key}
                      href={bar.story ?? `#timeline-${bar.key}`}
                      className={bar.story ? `${styles.bar} ${styles.featured}` : styles.bar}
                      style={{ left: pos(bar.start), width: width(bar.start, bar.end) }}
                      title={bar.title}
                      aria-label={bar.title}
                    />
                  ))}
                </div>
              ))}
            </div>
          );
        })}

        <div className={styles.axis} aria-hidden="true">
          {years.map((year) => (
            <span key={year} className={styles.tick} style={{ left: pos(toIndex({ year, month: 1 })) }}>
              {year}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}
