import { Trash2 } from 'lucide-react';
import type { HistoryGroup, WeeklyDay } from '../types/journal';
import EmotionChart from '../components/charts/EmotionChart';
import WeeklyChart from '../components/charts/WeeklyChart';

type EmotionStat = {
  icon: string;
  label: string;
  count: number;
};

type JournalProfileProps = {
  displayName: string;
  todayKey: string;
  groups: HistoryGroup[];
  days: WeeklyDay[];
  total: number;
  emotionStats: EmotionStat[];
  deletingEntryId: string | null;
  onDeleteEntry: (entryId: string) => void;
};

function JournalProfile({
  displayName,
  todayKey,
  groups,
  days,
  total,
  emotionStats,
  deletingEntryId,
  onDeleteEntry,
}: JournalProfileProps) {
  return (
    <section className="page history-page">
      <div className="profile-overview">
        <span className="profile-monogram">{displayName.slice(0, 1)}</span>
        <h1>
          {displayName}님의 <em>마음 기록</em>
        </h1>
      </div>
      <div className="profile-statistics">
        <section className="weekly-summary" aria-labelledby="weekly-summary-title">
          <div className="weekly-summary-header">
            <div>
              <p className="eyebrow">기록 수</p>
              <h2 id="weekly-summary-title">이번 주 {total}개</h2>
            </div>
          </div>
          <WeeklyChart days={days} total={total} todayKey={todayKey} />
        </section>
        <section className="emotion-summary" aria-labelledby="emotion-summary-title">
          <p className="eyebrow">감정 통계</p>
          <h2 id="emotion-summary-title">이번 주 마음</h2>
          <EmotionChart stats={emotionStats} total={total} />
        </section>
      </div>
      <h2 className="history-title">작성한 글</h2>
      <div className="history-list" aria-label="지난 기록 목록">
        {groups.map((group) => (
          <article className="history-group" key={group.dayKey}>
            <h2>
              {group.dayLabel}
              {group.dayKey === todayKey && <small>오늘</small>}
            </h2>
            {group.entries.map((entry) => (
              <div className="history-item" key={entry.id}>
                <time>{entry.time}</time>
                <span>{entry.emotion.icon}</span>
                <p lang="ja">
                  {entry.japanese}
                  <small>{entry.korean}</small>
                </p>
                <button
                  className="history-delete"
                  type="button"
                  onClick={() => onDeleteEntry(entry.id)}
                  disabled={deletingEntryId === entry.id}
                  aria-label={`${entry.japanese} 기록 삭제`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                  {deletingEntryId === entry.id ? '삭제 중' : '삭제'}
                </button>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}

export default JournalProfile;
