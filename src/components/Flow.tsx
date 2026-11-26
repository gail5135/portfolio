import type { FlowStep } from '../types';

import styles from './Flow.module.scss';

/**
 * 단계를 화살표로 이은 흐름도.
 * 넓은 화면에서는 가로로, 좁은 화면에서는 세로로 쌓인다.
 * 순서가 의미이므로 목록(ol)으로 둔다. 화살표는 장식이라 CSS 로만 그린다.
 */
export function Flow({ steps, label }: { steps: FlowStep[]; label: string }) {
  return (
    <ol className={styles.flow} aria-label={label}>
      {steps.map((step, index) => (
        <li key={`${index}-${step.label}`} className={styles.step}>
          <span className={styles.index} aria-hidden="true">
            {index + 1}
          </span>
          <span className={styles.label}>{step.label}</span>
          {step.note && <span className={styles.note}>{step.note}</span>}
        </li>
      ))}
    </ol>
  );
}
