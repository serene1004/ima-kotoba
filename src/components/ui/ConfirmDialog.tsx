import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ConfirmDialogProps = {
  open: boolean;
  pending: boolean;
  errorMessage: string;
  onCancel: () => void;
  onConfirm: () => void;
};

function ConfirmDialog({
  open,
  pending,
  errorMessage,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    cancelButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !pending) onCancel();

      if (event.key !== 'Tab') return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, open, pending]);

  if (!open) return null;

  const dialog = (
    <div className="confirm-backdrop">
      <section
        ref={dialogRef}
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <p className="eyebrow">삭제 확인</p>
        <h2 id="delete-dialog-title">이 기록을 삭제할까요?</h2>
        <p className="confirm-description" id="delete-dialog-description">
          삭제한 기록은 되돌릴 수 없습니다.
        </p>
        {errorMessage && <p className="confirm-error" role="alert">{errorMessage}</p>}
        <div className="confirm-actions">
          <button
            ref={cancelButtonRef}
            className="confirm-cancel"
            type="button"
            onClick={onCancel}
            disabled={pending}
          >
            취소
          </button>
          <button
            className="confirm-delete"
            type="button"
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? '삭제 중...' : '삭제하기'}
          </button>
        </div>
      </section>
    </div>
  );

  return createPortal(dialog, document.body);
}

export default ConfirmDialog;
