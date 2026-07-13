import { forwardRef, useRef } from 'react';
import { useSwitch } from 'react-aria';
import { useToggleState } from 'react-stately';
import { cn } from '../../utils/cn';
import styles from './Switch.module.css';

export type SwitchProps = {
  name?: string;
  value?: string;
  label?: React.ReactNode;
  ariaLabel?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onCheckedChange?: (isSelected: boolean) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      name,
      value,
      label,
      ariaLabel,
      checked,
      defaultChecked,
      disabled = false,
      required = false,
      isSelected,
      defaultSelected,
      isDisabled = false,
      size = 'md',
      onChange,
      onCheckedChange,
      onBlur,
    },
    forwardedRef,
  ) => {
    const resolvedIsSelected = checked ?? isSelected;
    const resolvedDefaultSelected = defaultChecked ?? defaultSelected;
    const resolvedIsDisabled = isDisabled || disabled;
    const state = useToggleState({
      isSelected: resolvedIsSelected,
      defaultSelected: resolvedDefaultSelected,
      isDisabled: resolvedIsDisabled,
      onChange: onCheckedChange,
    });
    const internalRef = useRef<HTMLInputElement>(null);
    const ref = forwardedRef || internalRef;
    const { inputProps } = useSwitch(
      {
        name,
        value,
        isDisabled: resolvedIsDisabled,
        children: typeof label === 'string' ? label : undefined,
        'aria-label': ariaLabel,
      },
      state,
      ref as React.RefObject<HTMLInputElement>,
    );

    return (
      <label className={cn(styles.root, styles[size], resolvedIsDisabled && styles.disabled)}>
        <input
          {...inputProps}
          required={required}
          onChange={(event) => {
            inputProps.onChange?.(event);
            onChange?.(event);
          }}
          onBlur={(event) => {
            inputProps.onBlur?.(event);
            onBlur?.(event);
          }}
          ref={ref}
          className={styles.input}
        />
        <span className={cn(styles.track, state.isSelected && styles.on)}>
          <span className={styles.thumb} />
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  },
);

Switch.displayName = 'Switch';
