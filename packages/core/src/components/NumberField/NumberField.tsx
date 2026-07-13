import { forwardRef, useId, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { Minus, Plus } from 'lucide-react';
import { mergeProps, Pressable, useLocale, useNumberField } from 'react-aria';
import { useNumberFieldState } from 'react-stately';
import { cn } from '../../utils/cn';
import { FieldWrapper } from '../FieldWrapper';
import styles from './NumberField.module.css';

export type NumberFieldProps = {
  id?: string;
  label?: ReactNode;
  name?: string;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isWheelDisabled?: boolean;
  hideStepper?: boolean;
  /** When set, merges with `formatOptions` as a currency field (`style: 'currency'`, `currency`). */
  currency?: string;
  formatOptions?: Intl.NumberFormatOptions;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  minValue?: number;
  maxValue?: number;
  step?: number;
  placeholder?: string;
  decrementAriaLabel?: string;
  incrementAriaLabel?: string;
  className?: string;
};

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      id: idProp,
      label,
      name,
      helperText,
      errorMessage,
      size = 'md',
      isLoading = false,
      isDisabled = false,
      isRequired = false,
      isReadOnly = false,
      isInvalid = false,
      isWheelDisabled,
      hideStepper = false,
      currency,
      formatOptions: formatOptionsProp,
      value,
      defaultValue,
      onChange,
      onBlur,
      minValue,
      maxValue,
      step,
      placeholder,
      decrementAriaLabel,
      incrementAriaLabel,
      className,
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const id = idProp || generatedId;

    const { locale } = useLocale();

    const formatOptions = useMemo(() => {
      if (!currency) {
        return formatOptionsProp;
      }
      return {
        style: 'currency' as const,
        currency,
        ...formatOptionsProp,
      };
    }, [currency, formatOptionsProp]);

    const state = useNumberFieldState({
      locale,
      label,
      formatOptions,
      value,
      defaultValue,
      onChange,
      minValue,
      maxValue,
      step,
      isDisabled: isDisabled || isLoading,
      isReadOnly,
      isRequired,
    });

    const internalRef = useRef<HTMLInputElement>(null);
    const ref = (forwardedRef || internalRef) as React.RefObject<HTMLInputElement>;

    const { groupProps, labelProps, inputProps, incrementButtonProps, decrementButtonProps } =
      useNumberField(
        {
          id,
          label,
          isDisabled: isDisabled || isLoading,
          isReadOnly,
          isRequired,
          isInvalid,
          formatOptions,
          minValue,
          maxValue,
          step,
          placeholder,
          decrementAriaLabel,
          incrementAriaLabel,
          isWheelDisabled,
        },
        state,
        ref,
      );

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
      onBlur?.(event);
    };

    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const fieldDescribedBy =
      isInvalid && errorMessage ? errorId : helperText ? helperId : undefined;
    const ariaDescribedByFromInput = inputProps['aria-describedby'];
    const mergedDescribedBy = [ariaDescribedByFromInput, fieldDescribedBy]
      .filter(Boolean)
      .join(' ')
      .trim();

    const inputClassName = cn(styles.input, styles[size]);

    return (
      <FieldWrapper
        id={id}
        label={label}
        labelProps={label != null ? labelProps : undefined}
        helperText={helperText}
        errorMessage={errorMessage}
        isRequired={isRequired}
        isDisabled={isDisabled || isLoading}
        isReadOnly={isReadOnly}
        isInvalid={isInvalid}
        size={size}
        className={className}
      >
        <div
          {...groupProps}
          className={cn(styles.field, styles[size], isLoading && styles.loading)}
          data-size={size}
        >
          {!hideStepper ? (
            <Pressable {...decrementButtonProps}>
              <button type="button" className={styles.step}>
                <Minus size={16} strokeWidth={2} aria-hidden />
              </button>
            </Pressable>
          ) : null}

          <div className={styles.fieldWrap}>
            <input
              {...mergeProps(inputProps, {
                name,
                onBlur: handleBlur,
                'aria-invalid': isInvalid || undefined,
                'aria-describedby': mergedDescribedBy || undefined,
              })}
              ref={ref}
              placeholder={placeholder}
              className={inputClassName}
            />
            {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : null}
          </div>

          {!hideStepper ? (
            <Pressable {...incrementButtonProps}>
              <button type="button" className={styles.step}>
                <Plus size={16} strokeWidth={2} aria-hidden />
              </button>
            </Pressable>
          ) : null}
        </div>
      </FieldWrapper>
    );
  },
);

NumberField.displayName = 'NumberField';
