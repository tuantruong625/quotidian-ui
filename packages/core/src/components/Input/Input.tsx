import { forwardRef, useId, useRef } from 'react';
import { useTextField } from 'react-aria';
import { cn } from '../../utils/cn';
import { FieldWrapper } from '../FieldWrapper';
import styles from './Input.module.css';

export type InputProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> & {
  id?: string;
  label?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  defaultValue?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: idProp,
      label,
      size = 'md',
      placeholder,
      helperText,
      errorMessage,
      isLoading = false,
      isDisabled = false,
      isRequired = false,
      isReadOnly = false,
      isInvalid = false,
      disabled = false,
      required = false,
      readOnly = false,
      className,
      startIcon,
      endIcon,
      type = 'text',
      value,
      defaultValue,
      onChange,
      onBlur,
      name,
      ...rest
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const id = idProp || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const describedBy = isInvalid && errorMessage ? errorId : helperText ? helperId : undefined;

    const internalRef = useRef<HTMLInputElement>(null);
    const ref = forwardedRef || internalRef;

    const resolvedIsDisabled = isDisabled || disabled;
    const resolvedIsRequired = isRequired || required;
    const resolvedIsReadOnly = isReadOnly || readOnly;

    const { inputProps } = useTextField(
      {
        inputElementType: 'input',
        label,
        isDisabled: resolvedIsDisabled || isLoading,
        isRequired: resolvedIsRequired,
        isReadOnly: resolvedIsReadOnly,
        validationState: isInvalid ? 'invalid' : 'valid',
      },
      ref as React.RefObject<HTMLInputElement>,
    );

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      inputProps.onChange?.(event);
      onChange?.(event);
    };
    const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
      inputProps.onBlur?.(event);
      onBlur?.(event);
    };

    return (
      <FieldWrapper
        id={id}
        label={label}
        helperText={helperText}
        errorMessage={errorMessage}
        isRequired={resolvedIsRequired}
        isDisabled={resolvedIsDisabled}
        isReadOnly={resolvedIsReadOnly}
        isInvalid={isInvalid}
        size={size}
      >
        <div className={styles.field}>
          {startIcon && <span className={styles.iconStart}>{startIcon}</span>}

          <input
            {...rest}
            {...inputProps}
            id={id}
            type={type}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy}
            placeholder={placeholder}
            ref={ref}
            className={cn(
              styles.root,
              styles[size],
              !!startIcon && styles.hasStartIcon,
              !!endIcon && styles.hasEndIcon,
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
      </FieldWrapper>
    );
  },
);

Input.displayName = 'Input';
