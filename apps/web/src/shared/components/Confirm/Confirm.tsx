import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { Button } from '@/shared/components/Button';
import styles from './Confirm.module.css';

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Renders the confirm action with the destructive (red) variant. */
  destructive?: boolean;
};

type Resolve = (value: boolean) => void;
type Pending = { options: ConfirmOptions; resolve: Resolve };

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState<Pending | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      setPending((prev) => {
        // If something is already pending, resolve it as cancelled — only
        // one confirm dialog can be on-screen at a time.
        prev?.resolve(false);
        return { options, resolve };
      });
    });
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (pending && !dialog.open) dialog.showModal();
    else if (!pending && dialog.open) dialog.close();
  }, [pending]);

  const settle = (value: boolean) => {
    pending?.resolve(value);
    setPending(null);
  };

  // Backdrop click cancels — the click event bubbles from the backdrop
  // to the dialog itself when the user clicks outside the inner content.
  const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) settle(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClick={handleClick}
        onClose={() => {
          if (pending) settle(false);
        }}
      >
        {pending ? (
          <ConfirmBody
            {...pending.options}
            onCancel={() => settle(false)}
            onConfirm={() => settle(true)}
          />
        ) : null}
      </dialog>
    </ConfirmContext.Provider>
  );
};

type ConfirmBodyProps = ConfirmOptions & {
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmBody = ({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive,
  onCancel,
  onConfirm,
}: ConfirmBodyProps) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  // Safer default for destructive actions: focus Cancel so an
  // accidental Enter doesn't delete the user's data.
  useEffect(() => {
    const target = destructive ? cancelBtnRef.current : confirmBtnRef.current;
    target?.focus();
  }, [destructive]);

  return (
    <div className={styles.body}>
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
      <div className={styles.actions}>
        <Button
          ref={cancelBtnRef}
          variant="secondary"
          size="md"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          ref={confirmBtnRef}
          variant={destructive ? 'destructive' : 'primary'}
          size="md"
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
};

/**
 * Returns a function that opens a confirm dialog and resolves with
 * `true` on confirm, `false` on cancel/Esc/backdrop click.
 *
 * Optional `defaults` are merged with per-call options so the call
 * site can provide just the `title`:
 *
 * ```ts
 * const confirm = useConfirm({ destructive: true, confirmLabel: 'Delete' });
 * const ok = await confirm({ title: 'Delete this letter?' });
 * ```
 */
export const useConfirm = (defaults?: Partial<ConfirmOptions>): ConfirmFn => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used inside <ConfirmProvider>');
  }
  return useMemo<ConfirmFn>(() => {
    if (!defaults) return ctx;
    return (options) => ctx({ ...defaults, ...options });
    // Defaults are usually a literal object that changes on every render;
    // depend on its contents not its identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ctx,
    defaults?.title,
    defaults?.description,
    defaults?.confirmLabel,
    defaults?.cancelLabel,
    defaults?.destructive,
  ]);
};
