import { forwardRef, useId, useRef } from 'react';
import { useTextField } from 'react-aria';
import { cn } from '../../utils/cn';
import { FieldWrapper } from '../FieldWrapper';
import styles from './Textarea.module.css';

export type TextareaProps = Omit<React.ComponentPropsWithoutRef<'textarea'>, 'size'> & {
  id?: string;
  label?: React.ReactNode;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  rows?: number;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  className?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id: idProp,
      label,
      placeholder,
      helperText,
      errorMessage,
      size = 'md',
      isDisabled = false,
      isRequired = false,
      isReadOnly = false,
      isInvalid = false,
      disabled = false,
      required = false,
      readOnly = false,
      rows = 4,
      value,
      defaultValue,
      onChange,
      onBlur,
      name,
      className,
      ...rest
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const id = idProp || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const describedBy = isInvalid && errorMessage ? errorId : helperText ? helperId : undefined;

    const internalRef = useRef<HTMLTextAreaElement>(null);
    const ref = forwardedRef || internalRef;

    const resolvedIsDisabled = isDisabled || disabled;
    const resolvedIsRequired = isRequired || required;
    const resolvedIsReadOnly = isReadOnly || readOnly;

    const { inputProps } = useTextField(
      {
        inputElementType: 'textarea',
        label,
        isDisabled: resolvedIsDisabled,
        isRequired: resolvedIsRequired,
        isReadOnly: resolvedIsReadOnly,
        validationState: isInvalid ? 'invalid' : 'valid',
      },
      ref as React.RefObject<HTMLTextAreaElement>,
    );

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
      inputProps.onChange?.(event);
      onChange?.(event);
    };
    const handleBlur: React.FocusEventHandler<HTMLTextAreaElement> = (event) => {
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
        <textarea
          {...rest}
          {...inputProps}
          id={id}
          rows={rows}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          ref={ref}
          className={cn(styles.root, styles[size], className)}
        />
      </FieldWrapper>
    );
  },
);

Textarea.displayName = 'Textarea';
