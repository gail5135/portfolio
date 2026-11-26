import type { ReactNode } from 'react';

import { profile } from '../content/loader';
import { privateInfo } from './private';

/** PDF 첫머리. 이름, 문서 이름, 연락처. */
export function PrintHeader({ doc, facts, children }: { doc: string; facts?: string[]; children?: ReactNode }) {
  const { name, hanjaName, englishName, title, email, github } = profile.meta;
  const contacts = [privateInfo.phone, email, github?.replace(/^https?:\/\//, '')].filter(Boolean);

  return (
    <header className="print-header">
      <div className="print-header__top">
        <div>
          <p className="print-header__doc">{doc}</p>
          <h1 className="print-header__name">
            {name}
            {hanjaName && (
              <span className="print-header__alt" lang="ko-Hani">
                {hanjaName}
              </span>
            )}
            {englishName && (
              <span className="print-header__alt" lang="en">
                {englishName}
              </span>
            )}
          </h1>
          <p className="print-header__title">{[title, ...(facts ?? [])].filter(Boolean).join(' · ')}</p>
        </div>
        <ul className="print-header__contact">
          {contacts.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      {children}
    </header>
  );
}
