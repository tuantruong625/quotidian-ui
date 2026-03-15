import { ElementType, forwardRef, useRef } from 'react';
import { PolymorphicComponentProps } from '../../utils/polymorphic';
import { useTextField } from 'react-aria';
import { cn } from '../../utils/cn';
import styles from './Input.module.css';

export type InputOwnProps = {
  label: string;
  type: 'password' | 'text';
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  size: 'sm' | 'md' | 'lg';
  isLoading: boolean;
  isDisabled: boolean;
  isRequired: boolean;
  value: string;
  onChange: () => {};
  defaultValue: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  helperText?: string;
};

export type InputProps<C extends ElementType = 'input'> = PolymorphicComponentProps<
  C,
  InputOwnProps
>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      size = 'md',
      placeholder,
      description,
      isLoading = false,
      isDisabled = false,
      isRequired = false,
      className,
      startIcon,
      endIcon,
      type,
      helperText,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const ref = forwardedRef || internalRef;

    const { inputProps, labelProps } = useTextField(
      { isDisabled: isDisabled || isLoading, type },
      ref as React.RefObject<HTMLInputElement>,
    );

    return (
      <label {...labelProps} className={cn(styles.label)}>
        <span className={cn(styles.labelText)}>
          {label}
          {isRequired && <span className={cn(styles.isRequired)}>*</span>}
        </span>

        <div className={styles.field}>
          {startIcon && <span className={styles.iconStart}>{startIcon}</span>}

          <input
            {...rest}
            {...inputProps}
            placeholder={placeholder}
            ref={ref}
            className={cn(
              styles.root,
              styles[size],
              startIcon && styles.hasStartIcon,
              endIcon && styles.hasEndIcon,
              isLoading && styles.loading,
              className,
            )}
          />

          {isLoading ? (
            <span className={cn(styles.iconEnd, styles.spinner)} aria-hidden="true" />
          ) : (
            endIcon && <span className={styles.iconEnd}>{endIcon}</span>
          )}
        </div>
        <p className={cn(styles.helperText)}>{helperText}</p>
      </label>
    );
  },
);

Input.displayName = 'Input';
