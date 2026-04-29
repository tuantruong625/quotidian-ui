import { forwardRef, useRef } from 'react';
import { useCheckbox } from 'react-aria';
import { useToggleState } from 'react-stately';
import { cn } from '../../utils/cn';
import styles from './Checkbox.module.css';

export type CheckboxProps = {
  children?: React.ReactNode;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isIndeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (isSelected: boolean) => void;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      children,
      isSelected,
      defaultSelected,
      isDisabled = false,
      isReadOnly = false,
      isIndeterminate = false,
      size = 'md',
      onChange,
    },
    forwardedRef,
  ) => {
    const state = useToggleState({ isSelected, defaultSelected, isReadOnly, isDisabled, onChange });
    const internalRef = useRef<HTMLInputElement>(null);
    const ref = forwardedRef || internalRef;
    const { inputProps } = useCheckbox(
      {
        isDisabled,
        isReadOnly,
        isIndeterminate,
        children: typeof children === 'string' ? children : undefined,
      },
      state,
      ref as React.RefObject<HTMLInputElement>,
    );

    return (
      <label className={cn(styles.root, styles[size], isDisabled && styles.disabled)}>
        <input {...inputProps} ref={ref} className={styles.input} />
        <span aria-hidden="true" className={cn(styles.box, state.isSelected && styles.checked)}>
          {isIndeterminate ? '−' : state.isSelected ? '✓' : ''}
        </span>
        {children && <span className={styles.label}>{children}</span>}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
