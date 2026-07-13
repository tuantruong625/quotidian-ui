import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Pressable, useToast, useToastRegion } from 'react-aria';
import { ToastQueue, useToastQueue } from 'react-stately';
import type { QueuedToast, ToastOptions, ToastState } from 'react-stately';
import { cn } from '../../utils/cn';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import styles from './Toast.module.css';

export type ToastContent = {
  title: ReactNode;
  description?: ReactNode;
  variant?: 'neutral' | 'success' | 'error';
};

const ToastQueueContext = createContext<ToastQueue<ToastContent> | null>(null);

/** Shared queue for apps that call `defaultToastQueue.add(...)`. */
export const defaultToastQueue = new ToastQueue<ToastContent>({ maxVisibleToasts: 5 });

export type ToastProviderProps = {
  children: ReactNode;
  /** When omitted, `defaultToastQueue` is used. */
  queue?: ToastQueue<ToastContent>;
};

export function ToastProvider({ children, queue = defaultToastQueue }: ToastProviderProps) {
  return <ToastQueueContext.Provider value={queue}>{children}</ToastQueueContext.Provider>;
}

ToastProvider.displayName = 'ToastProvider';

function useToastQueueFromContext(queueProp?: ToastQueue<ToastContent>): ToastQueue<ToastContent> {
  const fromContext = useContext(ToastQueueContext);
  const resolved = queueProp ?? fromContext;
  if (!resolved) {
    throw new Error('ToastRegion must be used inside ToastProvider or receive a `queue` prop.');
  }
  return resolved;
}

/** Must match the `toastOut` keyframe duration in Toast.module.css. */
const EXIT_ANIMATION_MS = 180;

type ToastEntry = {
  toast: QueuedToast<ToastContent>;
  isExiting: boolean;
};

/**
 * react-stately removes a toast from `visibleToasts` the instant it closes, which would
 * otherwise unmount it before an exit animation can play. This keeps a removed toast
 * around, flagged as exiting, for one animation cycle before dropping it for real.
 */
function useAnimatedToasts(
  visibleToasts: QueuedToast<ToastContent>[],
  skipExitAnimation: boolean,
): ToastEntry[] {
  const [entries, setEntries] = useState<ToastEntry[]>(() =>
    visibleToasts.map((toast) => ({ toast, isExiting: false })),
  );
  const timeoutsRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    const visibleKeys = new Set(visibleToasts.map((toast) => toast.key));

    setEntries((prev) => {
      const prevKeys = new Set(prev.map((entry) => entry.toast.key));
      const next: ToastEntry[] = [];

      for (const entry of prev) {
        if (visibleKeys.has(entry.toast.key) || entry.isExiting) {
          next.push(
            visibleKeys.has(entry.toast.key) ? { toast: entry.toast, isExiting: false } : entry,
          );
          continue;
        }
        if (skipExitAnimation) {
          continue;
        }
        next.push({ toast: entry.toast, isExiting: true });
        const key = entry.toast.key;
        timeouts.set(
          key,
          setTimeout(() => {
            setEntries((current) => current.filter((e) => e.toast.key !== key));
            timeouts.delete(key);
          }, EXIT_ANIMATION_MS),
        );
      }

      for (const toast of visibleToasts) {
        if (!prevKeys.has(toast.key)) {
          next.push({ toast, isExiting: false });
        }
      }

      return next;
    });
  }, [visibleToasts, skipExitAnimation]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(clearTimeout);
      timeouts.clear();
    };
  }, []);

  return entries;
}

export type ToastRegionProps = {
  queue?: ToastQueue<ToastContent>;
  'aria-label'?: string;
  className?: string;
};

export function ToastRegion({ queue: queueProp, className, ...ariaProps }: ToastRegionProps) {
  const queue = useToastQueueFromContext(queueProp);
  const state = useToastQueue(queue);
  const ref = useRef<HTMLDivElement>(null);
  const { regionProps } = useToastRegion(ariaProps, state, ref);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const entries = useAnimatedToasts(state.visibleToasts, prefersReducedMotion);

  return (
    <div {...regionProps} ref={ref} className={cn(styles.region, className)}>
      {entries.map(({ toast, isExiting }) => (
        <ToastItem key={toast.key} toast={toast} state={state} isExiting={isExiting} />
      ))}
    </div>
  );
}

ToastRegion.displayName = 'ToastRegion';

type ToastItemProps = {
  toast: QueuedToast<ToastContent>;
  state: ToastState<ToastContent>;
  isExiting: boolean;
};

const VARIANT_CLASS: Record<NonNullable<ToastContent['variant']>, string> = {
  neutral: styles.variantNeutral,
  success: styles.variantSuccess,
  error: styles.variantError,
};

function ToastItem({ toast, state, isExiting }: ToastItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { toastProps, contentProps, titleProps, descriptionProps, closeButtonProps } = useToast(
    { toast },
    state,
    ref,
  );
  const { title, description, variant = 'neutral' } = toast.content;
  const variantClass = VARIANT_CLASS[variant];

  return (
    <div className={styles.itemRow} data-exiting={isExiting || undefined}>
      <div className={styles.itemRowInner}>
        <div
          {...toastProps}
          ref={ref}
          className={cn(styles.toast, variantClass)}
          data-exiting={isExiting || undefined}
        >
          <div {...contentProps} className={styles.body}>
            <p {...titleProps} className={styles.title}>
              {title}
            </p>
            {description ? (
              <p {...descriptionProps} className={styles.description}>
                {description}
              </p>
            ) : null}
          </div>
          <Pressable {...closeButtonProps}>
            <button type="button" className={styles.close}>
              <X size={16} strokeWidth={2} aria-hidden />
            </button>
          </Pressable>
        </div>
      </div>
    </div>
  );
}

export type { ToastOptions };

/** Convenience for the default queue; prefer `queue.add` when using a custom queue. */
export function pushToast(content: ToastContent, options?: ToastOptions): string {
  return defaultToastQueue.add(content, options);
}
