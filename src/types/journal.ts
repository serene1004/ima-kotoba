export type Emotion = { icon: string; label: string };
export type Entry = {
  id: string;
  time: string;
  dayKey: string;
  dayLabel: string;
  emotion: Emotion;
  japanese: string;
  korean: string;
};
export type HistoryGroup = { dayKey: string; dayLabel: string; entries: Entry[] };
export type WeeklyDay = { key: string; label: string; count: number };
