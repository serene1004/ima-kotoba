import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useLocation, useNavigate } from 'react-router-dom';
import emotions from '../../data/emotions';
import supabase from '../../lib/supabase';
import type { Entry, HistoryGroup } from '../../types/journal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';
import JournalHeader from '../../components/journal/JournalHeader';
import JournalHome from '../../pages/JournalHome';
import JournalProfile from '../../pages/JournalProfile';
import JournalWrite from '../../pages/JournalWrite';

type StoredEntry = {
  id: string;
  emotion_label: string;
  japanese: string;
  korean: string | null;
  created_at: string;
};
type JournalAppProps = {
  session: Session | null;
  onExitGuest: () => void;
  onSignOut: () => Promise<void>;
};

const guestEntriesKey = 'ima-kotoba:guest-entries';
const guestNameKey = 'ima-kotoba:guest-name';
const guestNames = ['하루', '나츠', '아키', '후유'];
function toEntry(entry: StoredEntry): Entry {
  const createdAt = new Date(entry.created_at);

  return {
    id: entry.id,
    time: new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(createdAt),
    dayKey: `${createdAt.getFullYear()}-${createdAt.getMonth()}-${createdAt.getDate()}`,
    dayLabel: new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
    }).format(createdAt),
    emotion: emotions.find((item) => item.label === entry.emotion_label) ?? emotions[2],
    japanese: entry.japanese,
    korean: entry.korean ?? '',
  };
}

function getGuestEntries(): StoredEntry[] {
  try {
    return JSON.parse(localStorage.getItem(guestEntriesKey) ?? '[]') as StoredEntry[];
  } catch {
    return [];
  }
}

function getGuestName(): string {
  const storedName = sessionStorage.getItem(guestNameKey);
  if (storedName && guestNames.includes(storedName)) return storedName;

  const name = guestNames[Math.floor(Math.random() * guestNames.length)];
  sessionStorage.setItem(guestNameKey, name);
  return name;
}

function JournalApp({ session, onExitGuest, onSignOut }: JournalAppProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [emotion, setEmotion] = useState(emotions[1]);
  const [japanese, setJapanese] = useState('');
  const [korean, setKorean] = useState('');
  const [showKoreanField, setShowKoreanField] = useState(false);
  const [pending, setPending] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [entryPendingDeletion, setEntryPendingDeletion] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');

  const isGuest = !session;
  const [guestName] = useState(() => (isGuest ? getGuestName() : null));
  const displayName = isGuest
    ? guestName ?? '하루'
    : session.user.user_metadata.full_name ?? session.user.email?.split('@')[0] ?? '나';
  const today = new Date();
  const dateLabel = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(today);
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const todayEntries = entries.filter((entry) => entry.dayKey === todayKey);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const weeklyDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return {
      key: dayKey,
      label: new Intl.DateTimeFormat('ko-KR', { weekday: 'narrow' }).format(date),
      count: entries.filter((entry) => entry.dayKey === dayKey).length,
    };
  });
  const weeklyTotal = weeklyDays.reduce((total, day) => total + day.count, 0);
  const weeklyDayKeys = new Set(weeklyDays.map((day) => day.key));
  const emotionStats = emotions
    .map((item) => ({
      ...item,
      count: entries.filter(
        (entry) => weeklyDayKeys.has(entry.dayKey) && entry.emotion.label === item.label,
      ).length,
    }))
    .filter((item) => item.count > 0)
    .sort((first, second) => second.count - first.count);
  const historyGroups = entries.reduce<HistoryGroup[]>((groups, entry) => {
    const group = groups.find((item) => item.dayKey === entry.dayKey);
    if (group) group.entries.push(entry);
    else groups.push({ dayKey: entry.dayKey, dayLabel: entry.dayLabel, entries: [entry] });
    return groups;
  }, []);

  const loadEntries = async () => {
    setPending(true);
    setError('');

    if (isGuest) {
      setEntries(getGuestEntries().map(toEntry));
      setPending(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from('journal_entries')
      .select('id, emotion_label, japanese, korean, created_at')
      .order('created_at', { ascending: false });

    if (queryError) {
      setError('기록을 불러오지 못했습니다. Supabase 테이블 설정을 확인해주세요.');
    } else {
      setEntries(data.map(toEntry));
    }
    setPending(false);
  };

  useEffect(() => {
    loadEntries().catch(() => setError('기록을 불러오지 못했습니다.'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveEntry = async () => {
    if (!japanese.trim()) return;

    setSaving(true);
    setError('');
    const newEntry: StoredEntry = {
      id: crypto.randomUUID(),
      emotion_label: emotion.label,
      japanese: japanese.trim(),
      korean: korean.trim() || null,
      created_at: new Date().toISOString(),
    };

    if (isGuest) {
      localStorage.setItem(guestEntriesKey, JSON.stringify([newEntry, ...getGuestEntries()]));
    } else {
      const { error: insertError } = await supabase.from('journal_entries').insert({
        user_id: session.user.id,
        emotion_label: newEntry.emotion_label,
        japanese: newEntry.japanese,
        korean: newEntry.korean,
      });

      if (insertError) {
        setSaving(false);
        setError('기록을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
    }

    setSaving(false);
    setJapanese('');
    setKorean('');
    setShowKoreanField(false);
    await loadEntries();
    navigate('/');
  };

  const handleSignOut = async () => {
    await onSignOut();
    navigate('/login', { replace: true });
  };

  const deleteEntry = async () => {
    if (!entryPendingDeletion) return;

    const entryId = entryPendingDeletion;
    setDeletingEntryId(entryId);
    setDeleteError('');
    setError('');

    if (isGuest) {
      const remainingEntries = getGuestEntries().filter((entry) => entry.id !== entryId);
      localStorage.setItem(guestEntriesKey, JSON.stringify(remainingEntries));
      setEntries(remainingEntries.map(toEntry));
      setDeletingEntryId(null);
      setEntryPendingDeletion(null);
      setToastMessage('기록을 삭제했어요.');
      return;
    }

    const { error: deleteRequestError } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (deleteRequestError) {
      setDeleteError('기록을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.');
      setDeletingEntryId(null);
      return;
    }

    setEntries((currentEntries) => currentEntries.filter((entry) => entry.id !== entryId));
    setDeletingEntryId(null);
    setEntryPendingDeletion(null);
    setToastMessage('기록을 삭제했어요.');
  };

  return (
    <main className="app-shell">
      <JournalHeader
        displayName={displayName}
        isGuest={isGuest}
        onHome={() => navigate('/')}
        onProfile={() => navigate('/profile')}
        onSignOut={handleSignOut}
        onExitGuest={() => {
          onExitGuest();
          navigate('/login', { replace: true });
        }}
      />

      {pathname === '/' && (
        <JournalHome
          displayName={displayName}
          today={today}
          entries={todayEntries}
          pending={pending}
          error={error}
          onWrite={() => navigate('/write')}
        />
      )}

      {pathname === '/write' && (
        <JournalWrite
          dateLabel={dateLabel}
          emotions={emotions}
          selectedEmotion={emotion}
          japanese={japanese}
          korean={korean}
          showKoreanField={showKoreanField}
          saving={saving}
          error={error}
          onBack={() => navigate('/')}
          onSelectEmotion={setEmotion}
          onJapaneseChange={setJapanese}
          onKoreanChange={setKorean}
          onToggleKoreanField={() => setShowKoreanField((show) => !show)}
          onSave={saveEntry}
        />
      )}

      {pathname === '/profile' && (
        <JournalProfile
          displayName={displayName}
          todayKey={todayKey}
          groups={historyGroups}
          days={weeklyDays}
          total={weeklyTotal}
          emotionStats={emotionStats}
          deletingEntryId={deletingEntryId}
          onDeleteEntry={(entryId) => {
            setDeleteError('');
            setEntryPendingDeletion(entryId);
          }}
        />
      )}
      <ConfirmDialog
        open={entryPendingDeletion !== null}
        pending={deletingEntryId !== null}
        errorMessage={deleteError}
        onCancel={() => {
          setDeleteError('');
          setEntryPendingDeletion(null);
        }}
        onConfirm={deleteEntry}
      />
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
    </main>
  );
}

export default JournalApp;
