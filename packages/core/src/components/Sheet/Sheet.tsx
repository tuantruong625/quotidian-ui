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
import styles from './Sheet.module.css';

export type SheetSide = 'left' | 'right' | 'top' | 'bottom';

export type SheetProps = AriaDialogProps & {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  title?: ReactNode;
  isDismissable?: boolean;
  side?: SheetSide;
  children: ReactNode;
  className?: string;
};

export function Sheet({
  isOpen,
  defaultOpen,
  onOpenChange,
  title,
  isDismissable = true,
  side = 'right',
  children,
  className,
  ...rest
}: SheetProps) {
  const state = useOverlayTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  });
  usePreventScroll({ isDisabled: !state.isOpen });

  if (!state.isOpen) {
    return null;
  }

  return (
    <Overlay>
      <SheetModal
        {...rest}
        state={state}
        title={title}
        isDismissable={isDismissable}
        side={side}
        className={className}
      >
        {children}
      </SheetModal>
    </Overlay>
  );
}

Sheet.displayName = 'Sheet';

type SheetModalProps = AriaDialogProps & {
  state: ReturnType<typeof useOverlayTriggerState>;
  title?: ReactNode;
  isDismissable: boolean;
  side: SheetSide;
  children: ReactNode;
  className?: string;
};

function SheetModal({
  state,
  title,
  isDismissable,
  side,
  children,
  className,
  ...rest
}: SheetModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { modalProps, underlayProps } = useModalOverlay({ isDismissable }, state, panelRef);
  const { dialogProps, titleProps } = useDialog(rest, panelRef);

  return (
    <div className={styles.layer}>
      <div {...underlayProps} className={styles.underlay} />
      <div className={cn(styles.positioner, styles[`positioner--${side}`])}>
        <FocusScope contain restoreFocus autoFocus>
          <div
            {...mergeProps(modalProps, dialogProps)}
            ref={panelRef}
            className={cn(styles.panel, styles[`panel--${side}`], className)}
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
                aria-label="Close sheet"
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
