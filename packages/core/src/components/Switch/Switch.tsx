import { forwardRef, useRef } from 'react';
import { useSwitch } from 'react-aria';
import { useToggleState } from 'react-stately';
import { cn } from '../../utils/cn';
import styles from './Switch.module.css';

export type SwitchProps = {
  label?: React.ReactNode;
  ariaLabel?: string;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (isSelected: boolean) => void;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    { label, ariaLabel, isSelected, defaultSelected, isDisabled = false, size = 'md', onChange },
    forwardedRef,
  ) => {
    const state = useToggleState({ isSelected, defaultSelected, isDisabled, onChange });
    const internalRef = useRef<HTMLInputElement>(null);
    const ref = forwardedRef || internalRef;
    const { inputProps } = useSwitch(
      {
        isDisabled,
        children: typeof label === 'string' ? label : undefined,
        'aria-label': ariaLabel,
      },
      state,
      ref as React.RefObject<HTMLInputElement>,
    );

    return (
      <label className={cn(styles.root, styles[size], isDisabled && styles.disabled)}>
        <input {...inputProps} ref={ref} className={styles.input} />
        <span className={cn(styles.track, state.isSelected && styles.on)}>
          <span className={styles.thumb} />
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  },
);

Switch.displayName = 'Switch';
