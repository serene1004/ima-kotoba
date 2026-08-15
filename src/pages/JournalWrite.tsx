import { ArrowLeft } from 'lucide-react';
import type { Emotion } from '../types/journal';

type JournalWriteProps = {
  dateLabel: string;
  emotions: Emotion[];
  selectedEmotion: Emotion;
  japanese: string;
  korean: string;
  showKoreanField: boolean;
  saving: boolean;
  error: string;
  onBack: () => void;
  onSelectEmotion: (emotion: Emotion) => void;
  onJapaneseChange: (value: string) => void;
  onKoreanChange: (value: string) => void;
  onToggleKoreanField: () => void;
  onSave: () => void;
};

function JournalWrite({
  dateLabel,
  emotions,
  selectedEmotion,
  japanese,
  korean,
  showKoreanField,
  saving,
  error,
  onBack,
  onSelectEmotion,
  onJapaneseChange,
  onKoreanChange,
  onToggleKoreanField,
  onSave,
}: JournalWriteProps) {
  return (
    <section className="page write-page">
      <div className="home-hero write-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">{dateLabel}</p>
          <h1>
            지금 이 순간
            <em>어떤 마음인가요?</em>
          </h1>
        </div>
        <button className="write-return" type="button" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          오늘로 돌아가기
        </button>
      </div>
      <fieldset>
        <legend>기분을 골라주세요</legend>
        <div className="emotion-row">
          {emotions.map((item) => (
            <button
              className={selectedEmotion.label === item.label ? 'selected' : ''}
              type="button"
              key={item.label}
              onClick={() => onSelectEmotion(item)}
              aria-label={item.label}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </fieldset>
      <label htmlFor="japanese">
        일본어로 한마디 <b>필수</b>
      </label>
      <textarea
        id="japanese"
        value={japanese}
        onChange={(event) => onJapaneseChange(event.target.value)}
        maxLength={150}
        placeholder="今日はどんな一日でしたか？"
      />
      <button
        className="translation-toggle"
        type="button"
        onClick={onToggleKoreanField}
        aria-expanded={showKoreanField}
        aria-controls="korean-field"
      >
        {showKoreanField ? '한국어 의미 접기' : '뜻도 함께 적기'}
      </button>
      {showKoreanField && (
        <div id="korean-field">
          <label htmlFor="korean">
            한국어 의미 <span>선택</span>
          </label>
          <textarea
            id="korean"
            value={korean}
            onChange={(event) => onKoreanChange(event.target.value)}
            maxLength={150}
            placeholder="오늘은 어떤 하루였나요?"
          />
        </div>
      )}
      {error && <p role="alert">{error}</p>}
      <button
        className="save"
        type="button"
        onClick={onSave}
        disabled={!japanese.trim() || saving}
      >
        {saving ? '저장 중...' : '기록 저장하기'}
      </button>
    </section>
  );
}

export default JournalWrite;
