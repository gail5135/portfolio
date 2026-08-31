import styles from './EmptyNote.module.scss';

/** 아직 글이 없는 섹션 자리. 화면이 비어 보이는 대신 무엇을 넣어야 하는지 알려준다. */
export function EmptyNote({ children }: { children: string }) {
  return <p className={styles.empty}>{children}</p>;
}
