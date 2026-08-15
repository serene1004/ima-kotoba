import { useEffect, useRef, useState } from 'react';
import { LogIn, LogOut, UserRound } from 'lucide-react';

type JournalHeaderProps = {
  displayName: string;
  isGuest: boolean;
  onHome: () => void;
  onProfile: () => void;
  onSignOut: () => Promise<void>;
  onExitGuest: () => void;
};

function JournalHeader({
  displayName,
  isGuest,
  onHome,
  onProfile,
  onSignOut,
  onExitGuest,
}: JournalHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [menuOpen]);

  const showProfile = () => {
    setMenuOpen(false);
    onProfile();
  };

  const signOut = async () => {
    setMenuOpen(false);
    await onSignOut();
  };

  const exitGuest = () => {
    setMenuOpen(false);
    onExitGuest();
  };

  return (
    <header className="topbar">
      <button
        className="wordmark"
        type="button"
        onClick={onHome}
        aria-label="홈으로 이동"
      >
        <img className="brand-mark" src="/ima-kotoba-mark.svg" alt="" />
        <span className="brand-copy">
          <strong>いまことば</strong>
        </span>
      </button>
      <div className="account-menu" ref={menuRef}>
        <button
          className="profile"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="계정 메뉴"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <span className="profile-avatar">{displayName.slice(0, 1)}</span>
          <span className="profile-copy">
            <strong>{displayName}님</strong>
          </span>
        </button>
        {menuOpen && (
          <div className="profile-popover" role="menu" aria-label="계정 메뉴">
            <button
              className="profile-menu-item"
              type="button"
              role="menuitem"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={showProfile}
            >
              <UserRound size={16} aria-hidden="true" />
              내 정보로 이동
            </button>
            {isGuest ? (
              <button
                className="profile-menu-item"
                type="button"
                role="menuitem"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={exitGuest}
              >
                <LogIn size={16} aria-hidden="true" />
                로그인 화면으로
              </button>
            ) : (
              <button
                className="profile-menu-item danger"
                type="button"
                role="menuitem"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={signOut}
              >
                <LogOut size={16} aria-hidden="true" />
                로그아웃
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default JournalHeader;
