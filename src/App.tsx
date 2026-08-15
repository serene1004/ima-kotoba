import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import JournalApp from './features/journal/JournalApp';
import supabase from './lib/supabase';
import LoginPage from './pages/LoginPage';

const guestModeKey = 'ima-kotoba:guest-mode';
type AuthAction = () => Promise<string | null>;

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(() => sessionStorage.getItem(guestModeKey) === 'true');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        sessionStorage.removeItem(guestModeKey);
        setGuestMode(false);
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  const startGoogleLogin: AuthAction = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    return error ? 'Google 로그인을 시작하지 못했습니다. 인증 설정을 확인해주세요.' : null;
  };

  const startGuestMode = () => {
    sessionStorage.setItem(guestModeKey, 'true');
    setGuestMode(true);
  };

  const exitGuestMode = () => {
    sessionStorage.removeItem(guestModeKey);
    setGuestMode(false);
  };

  if (loading) return <main className="login-shell">불러오는 중...</main>;

  return (
    <BrowserRouter>
      <div className="site-canvas">
        <Routes>
          <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage onStartGuest={startGuestMode} onGoogleLogin={startGoogleLogin} />} />
          <Route
            path="*"
            element={session || guestMode ? (
              <JournalApp
                session={session}
                onExitGuest={exitGuestMode}
                onSignOut={async () => {
                  await supabase.auth.signOut();
                }}
              />
            ) : (
              <Navigate to="/login" replace />
            )}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
