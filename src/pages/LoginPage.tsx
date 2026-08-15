import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '../components/ui/GoogleIcon';

type AuthAction = () => Promise<string | null>;
type LoginPageProps = { onStartGuest: () => void; onGoogleLogin: AuthAction };

function LoginPage({ onStartGuest, onGoogleLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  const handleGoogleLogin = async () => {
    setPending(true);
    setMessage('');
    const authError = await onGoogleLogin();
    if (authError) {
      setPending(false);
      setMessage(authError);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand-lockup">
          <img className="login-mark" src="/ima-kotoba-mark.svg" alt="" />
          <div className="brand-copy">
            <h1 className="login-brand-title" id="login-title" lang="ja">
              いまことば
            </h1>
          </div>
        </div>
        <p className="login-copy">지금의 마음을 일본어로 기록해요.</p>
        <div className="auth-options">
          <section className="auth-option" aria-labelledby="guest-option-title">
            <div className="auth-option-copy">
              <p className="auth-option-kicker">가볍게 시작하기</p>
              <h2 id="guest-option-title">먼저 써보고 싶어요</h2>
              <p>가입 없이 기능을 둘러보세요.<br />기록은 이 브라우저에만 저장됩니다.</p>
            </div>
            <button className="guest-login" type="button" onClick={() => { onStartGuest(); navigate('/', { replace: true }); }}>로그인 없이 써보기</button>
          </section>
          <section className="auth-option" aria-labelledby="google-option-title">
            <div className="auth-option-copy">
              <p className="auth-option-kicker">내 기록 보관하기</p>
              <h2 id="google-option-title">계속 기록하고 싶어요</h2>
              <p>Google 계정으로 로그인하면<br />기록을 안전하게 보관할 수 있어요.</p>
            </div>
            <button className="google-login" type="button" onClick={handleGoogleLogin} disabled={pending}><GoogleIcon />{pending ? 'Google로 이동 중...' : 'Google로 계속하기'}</button>
          </section>
        </div>
        {message && <p className="login-note" role="status">{message}</p>}
      </section>
    </main>
  );
}

export default LoginPage;
