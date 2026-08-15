import { NotebookPen } from 'lucide-react';
import type { Entry } from '../types/journal';

type JournalHomeProps = {
  displayName: string;
  today: Date;
  entries: Entry[];
  pending: boolean;
  error: string;
  onWrite: () => void;
};

function JournalHome({ displayName, today, entries, pending, error, onWrite }: JournalHomeProps) {
  const dateLabel = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(today);

  return (
    <section className="page home-page">
      <div className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">{dateLabel}</p>
          <h1>
            안녕하세요, {displayName}님
            <em>지금의 마음 상태를 일본어로 한마디 남겨볼까요?</em>
          </h1>
        </div>
        <button
          className="hero-record-button"
          type="button"
          onClick={onWrite}
        >
          <NotebookPen size={18} aria-hidden="true" />
          <span>기록하기</span>
        </button>
      </div>
      <div className="record-count">
        <span>오늘의 기록</span>
        <strong>{entries.length}개</strong>
      </div>
      <section className="timeline" aria-label="오늘의 기록">
        {pending && <p>기록을 불러오는 중입니다.</p>}
        {!pending && !error && entries.length === 0 && <p>오늘의 첫 기록을 남겨보세요.</p>}
        {entries.map((entry) => (
          <article className="entry-card" key={entry.id}>
            <span className="entry-time">{entry.time}</span>
            <span className="emotion">{entry.emotion.icon}</span>
            <div>
              <p lang="ja">{entry.japanese}</p>
              <small>{entry.korean}</small>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}

export default JournalHome;
