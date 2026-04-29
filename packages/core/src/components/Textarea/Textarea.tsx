import { forwardRef, useId, useRef } from 'react';
import { useTextField } from 'react-aria';
import { cn } from '../../utils/cn';
import { FieldWrapper } from '../FieldWrapper';
import styles from './Textarea.module.css';

export type TextareaProps = {
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
      rows = 4,
      value,
      defaultValue,
      onChange,
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

    const { inputProps } = useTextField(
      {
        inputElementType: 'textarea',
        label,
        isDisabled,
        isRequired,
        isReadOnly,
        validationState: isInvalid ? 'invalid' : 'valid',
      },
      ref as React.RefObject<HTMLTextAreaElement>,
    );

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
        <textarea
          {...rest}
          {...inputProps}
          id={id}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
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
