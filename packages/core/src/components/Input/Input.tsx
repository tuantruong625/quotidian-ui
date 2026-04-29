import { forwardRef, useId, useRef } from 'react';
import { useTextField } from 'react-aria';
import { cn } from '../../utils/cn';
import { FieldWrapper } from '../FieldWrapper';
import styles from './Input.module.css';

export type InputProps = {
  id?: string;
  label?: React.ReactNode;
  type?: 'password' | 'text' | 'email' | 'search';
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
      className,
      startIcon,
      endIcon,
      type = 'text',
      value,
      defaultValue,
      onChange,
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

    const { inputProps } = useTextField(
      {
        inputElementType: 'input',
        label,
        isDisabled: isDisabled || isLoading,
        isRequired,
        isReadOnly,
        validationState: isInvalid ? 'invalid' : 'valid',
      },
      ref as React.RefObject<HTMLInputElement>,
    );

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      inputProps.onChange?.(event);
      onChange?.(event);
    };

    return (
      <FieldWrapper
        id={id}
        label={label}
        helperText={helperText}
        errorMessage={errorMessage}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
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
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
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
