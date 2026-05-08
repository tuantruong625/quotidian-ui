import { useRef, type ReactNode } from 'react';
import type { AriaDialogProps } from 'react-aria';
import {
  FocusScope,
  Overlay,
  mergeProps,
  useDialog,
  useModalOverlay,
  usePreventScroll,
} from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import { Button } from '../Button';
import { cn } from '../../utils/cn';
import styles from './Dialog.module.css';

export type DialogProps = AriaDialogProps & {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  title?: ReactNode;
  isDismissable?: boolean;
  children: ReactNode;
  className?: string;
};

function useDialogOpenState(props: Pick<DialogProps, 'isOpen' | 'defaultOpen' | 'onOpenChange'>) {
  const { isOpen, defaultOpen, onOpenChange } = props;
  return useOverlayTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  });
}

export function Dialog({
  isOpen,
  defaultOpen,
  onOpenChange,
  title,
  isDismissable = true,
  children,
  className,
  ...rest
}: DialogProps) {
  const state = useDialogOpenState({ isOpen, defaultOpen, onOpenChange });
  usePreventScroll({ isDisabled: !state.isOpen });

  if (!state.isOpen) {
    return null;
  }

  return (
    <Overlay>
      <DialogModal
        {...rest}
        state={state}
        title={title}
        isDismissable={isDismissable}
        className={className}
      >
        {children}
      </DialogModal>
    </Overlay>
  );
}

Dialog.displayName = 'Dialog';

type DialogModalProps = AriaDialogProps & {
  state: ReturnType<typeof useOverlayTriggerState>;
  title?: ReactNode;
  isDismissable: boolean;
  children: ReactNode;
  className?: string;
};

function DialogModal({
  state,
  title,
  isDismissable,
  children,
  className,
  ...rest
}: DialogModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { modalProps, underlayProps } = useModalOverlay({ isDismissable }, state, panelRef);
  const { dialogProps, titleProps } = useDialog(rest, panelRef);

  return (
    <div className={styles.layer}>
      <div {...underlayProps} className={styles.underlay} />
      <div className={styles.center}>
        <FocusScope contain restoreFocus autoFocus>
          <div
            {...mergeProps(modalProps, dialogProps)}
            ref={panelRef}
            className={cn(styles.panel, className)}
          >
            <div className={styles.header}>
              {title ? (
                <h2 {...titleProps} className={styles.title}>
                  {title}
                </h2>
              ) : (
                <span className={styles.titleSpacer} />
              )}
              <Button
                variant="ghost"
                size="sm"
                onPress={() => state.close()}
                aria-label="Close dialog"
              >
                Close
              </Button>
            </div>
            <div className={styles.body}>{children}</div>
          </div>
        </FocusScope>
      </div>
    </div>
  );
}
