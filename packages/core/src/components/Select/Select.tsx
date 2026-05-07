import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import { FieldWrapper } from '../FieldWrapper';
import styles from './Select.module.css';

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectProps = Omit<React.ComponentPropsWithoutRef<'select'>, 'size'> & {
  id?: string;
  label?: React.ReactNode;
  helperText?: string;
  errorMessage?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id: idProp,
      label,
      helperText,
      errorMessage,
      placeholder = 'Select an option',
      options,
      value,
      defaultValue,
      onChange,
      onBlur,
      name,
      isDisabled = false,
      isRequired = false,
      isInvalid = false,
      disabled = false,
      required = false,
      size = 'md',
      className,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const describedBy = isInvalid && errorMessage ? errorId : helperText ? helperId : undefined;

    const resolvedIsDisabled = isDisabled || disabled;
    const resolvedIsRequired = isRequired || required;

    return (
      <FieldWrapper
        id={id}
        label={label}
        helperText={helperText}
        errorMessage={errorMessage}
        isRequired={resolvedIsRequired}
        isDisabled={resolvedIsDisabled}
        isInvalid={isInvalid}
        size={size}
      >
        <select
          {...rest}
          id={id}
          ref={ref}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          disabled={resolvedIsDisabled}
          required={resolvedIsRequired}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          className={cn(styles.root, styles[size], className)}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  },
);

Select.displayName = 'Select';
