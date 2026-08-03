import { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type Emotion = { icon: string; label: string };
type Entry = { time: string; emotion: Emotion; japanese: string; korean: string };

const emotions: Emotion[] = [
  { icon: '😀', label: '기쁨' },
  { icon: '🙂', label: '평온' },
  { icon: '😐', label: '보통' },
  { icon: '😫', label: '피곤' },
  { icon: '😢', label: '슬픔' },
  { icon: '😭', label: '눈물' },
];

const initialEntries: Entry[] = [
  { time: '09:12', emotion: emotions[1], japanese: '今日は少し眠い。', korean: '오늘은 조금 졸리다.' },
  { time: '15:36', emotion: emotions[3], japanese: '仕事が多くて、ちょっと疲れた。', korean: '일이 많아서 조금 피곤했다.' },
];

function JournalApp() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const screen = pathname === '/write' ? 'write' : 'home';
  const isHome = pathname === '/';
  const isProfile = pathname === '/profile';
  const [entries, setEntries] = useState(initialEntries);
  const [emotion, setEmotion] = useState(emotions[1]);
  const [japanese, setJapanese] = useState('');
  const [korean, setKorean] = useState('');
  const [showKoreanField, setShowKoreanField] = useState(false);

  const saveEntry = () => {
    if (!japanese.trim()) return;
    const time = new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
    setEntries([...entries, { time, emotion, japanese, korean }]);
    setJapanese('');
    setKorean('');
    setShowKoreanField(false);
    navigate('/');
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="wordmark" type="button" onClick={() => navigate('/')} aria-label="홈으로 이동">
          <img className="brand-mark" src="/ima-kotoba-mark.svg" alt="" />
          <span className="brand-copy">
            <strong>いまことば</strong>
            <small>Ima Kotoba</small>
          </span>
        </button>
        <button className="profile" type="button" onClick={() => navigate('/profile')} aria-label="내 정보">
          <span className="profile-avatar">하</span>
          <span className="profile-copy">
            <strong>하루님</strong>
            <small>내 정보 · 3개의 기록</small>
          </span>
        </button>
      </header>

      {isHome && (
        <section className="page home-page">
          <p className="eyebrow">2026년 8월 3일, 월요일</p>
          <h1>안녕하세요, 하루님<br /><em>오늘의 마음을 남겨볼까요?</em></h1>
          <article className="prompt-card">
            <div className="prompt-copy">
              <span className="spark">✦</span>
              <p>지금의 기분을 일본어로 한마디 남겨보세요.</p>
            </div>
            <button type="button" onClick={() => navigate('/write')}>
              기록하기 <ArrowRight size={16} aria-hidden="true" />
            </button>
          </article>
          <div className="record-count">
            <span>오늘의 기록</span>
            <strong>{entries.length}개</strong>
          </div>
          <section className="timeline" aria-label="오늘의 기록">
            {entries.map((entry) => (
              <article className="entry-card" key={`${entry.time}-${entry.japanese}`}>
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
      )}

      {screen === 'write' && (
        <section className="page write-page">
          <button className="back" type="button" onClick={() => navigate('/')}>
            <ArrowLeft size={16} aria-hidden="true" />오늘로 돌아가기
          </button>
          <p className="eyebrow">지금 이 순간</p>
          <h1>어떤 마음인가요?</h1>
          <fieldset>
            <legend>기분을 골라주세요</legend>
            <div className="emotion-row">
              {emotions.map((item) => (
                <button
                  className={emotion.label === item.label ? 'selected' : ''}
                  type="button"
                  key={item.label}
                  onClick={() => setEmotion(item)}
                  aria-label={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </fieldset>
          <label htmlFor="japanese">일본어로 한마디 <b>필수</b></label>
          <textarea
            id="japanese"
            value={japanese}
            onChange={(event) => setJapanese(event.target.value)}
            maxLength={150}
            placeholder="今日はどんな一日でしたか？"
          />
          <button
            className="translation-toggle"
            type="button"
            onClick={() => setShowKoreanField(!showKoreanField)}
            aria-expanded={showKoreanField}
            aria-controls="korean-field"
          >
            {showKoreanField ? '한국어 의미 접기' : '뜻도 함께 적기'}
          </button>
          {showKoreanField && (
            <div id="korean-field">
              <label htmlFor="korean">한국어 의미 <span>선택</span></label>
              <textarea
                id="korean"
                value={korean}
                onChange={(event) => setKorean(event.target.value)}
                maxLength={150}
                placeholder="오늘은 어떤 하루였나요?"
              />
            </div>
          )}
          <button className="save" type="button" onClick={saveEntry} disabled={!japanese.trim()}>
            기록 저장하기
          </button>
        </section>
      )}

      {isProfile && (
        <section className="page history-page">
          <div className="profile-overview">
            <span className="profile-monogram">하</span>
            <div>
              <p className="eyebrow">내 정보</p>
              <h1>하루님의<br /><em>마음 기록</em></h1>
            </div>
          </div>
          <div className="history-list" aria-label="지난 기록 목록">
            <article className="history-group">
              <h2>8월 3일 <small>오늘</small></h2>
              {entries.map((entry) => (
                <div className="history-item" key={`history-${entry.time}-${entry.japanese}`}>
                  <time>{entry.time}</time>
                  <span>{entry.emotion.icon}</span>
                  <p lang="ja">{entry.japanese}<small>{entry.korean}</small></p>
                </div>
              ))}
            </article>
            <article className="history-group faded">
              <h2>8월 2일</h2>
              <div className="history-item">
                <time>21:02</time>
                <span>🙂</span>
                <p lang="ja">今日は天気がよかった。<small>오늘은 날씨가 좋았다.</small></p>
              </div>
            </article>
          </div>
        </section>
      )}
    </main>
  );
}

function LoginPage() {
  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand-lockup">
          <img className="login-mark" src="/ima-kotoba-mark.svg" alt="" />
          <div className="brand-copy">
            <h1 className="login-brand-title" id="login-title" lang="ja">いまことば</h1>
            <small>Ima Kotoba</small>
          </div>
        </div>
        <p className="login-copy">지금의 마음을 일본어로 기록해요.</p>
        <form onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="email">이메일</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
          <label htmlFor="password">비밀번호</label>
          <input id="password" name="password" type="password" placeholder="비밀번호를 입력하세요" autoComplete="current-password" />
          <button className="login-submit" type="submit">로그인</button>
        </form>
        <p className="login-note">로그인 기능은 곧 연결됩니다.</p>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="site-canvas">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<JournalApp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
