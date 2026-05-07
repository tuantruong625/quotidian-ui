import { forwardRef, useRef } from 'react';
import { useCheckbox } from 'react-aria';
import { useToggleState } from 'react-stately';
import { cn } from '../../utils/cn';
import styles from './Checkbox.module.css';

export type CheckboxProps = {
  name?: string;
  value?: string;
  children?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isIndeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onCheckedChange?: (isSelected: boolean) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      children,
      name,
      value,
      checked,
      defaultChecked,
      disabled = false,
      readOnly = false,
      required = false,
      isSelected,
      defaultSelected,
      isDisabled = false,
      isReadOnly = false,
      isIndeterminate = false,
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
    const resolvedIsReadOnly = isReadOnly || readOnly;

    const state = useToggleState({
      isSelected: resolvedIsSelected,
      defaultSelected: resolvedDefaultSelected,
      isReadOnly: resolvedIsReadOnly,
      isDisabled: resolvedIsDisabled,
      onChange: onCheckedChange,
    });
    const internalRef = useRef<HTMLInputElement>(null);
    const ref = forwardedRef || internalRef;
    const { inputProps } = useCheckbox(
      {
        name,
        value,
        isDisabled: resolvedIsDisabled,
        isReadOnly: resolvedIsReadOnly,
        isRequired: required,
        isIndeterminate,
        children: typeof children === 'string' ? children : undefined,
      },
      state,
      ref as React.RefObject<HTMLInputElement>,
    );

    return (
      <label className={cn(styles.root, styles[size], resolvedIsDisabled && styles.disabled)}>
        <input
          {...inputProps}
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
        <span aria-hidden="true" className={cn(styles.box, state.isSelected && styles.checked)}>
          {isIndeterminate ? '−' : state.isSelected ? '✓' : ''}
        </span>
        {children && <span className={styles.label}>{children}</span>}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
