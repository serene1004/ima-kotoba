import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { createPortal } from 'react-dom';

type ToastProps = {
  message: string;
  onDismiss: () => void;
};

function Toast({ message, onDismiss }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!message) return undefined;

    setIsLeaving(false);
    const leaveTimeoutId = window.setTimeout(() => setIsLeaving(true), 2400);
    const dismissTimeoutId = window.setTimeout(onDismiss, 2640);

    return () => {
      window.clearTimeout(leaveTimeoutId);
      window.clearTimeout(dismissTimeoutId);
    };
  }, [message, onDismiss]);

  if (!message) return null;

  return createPortal(
    <div className={`toast${isLeaving ? ' is-leaving' : ''}`} role="status" aria-live="polite">
      <Check size={16} aria-hidden="true" />
      <span>{message}</span>
    </div>,
    document.body,
  );
}

export default Toast;
