import { cn } from '../../utils/cn';
import styles from './FieldWrapper.module.css';

export type FieldWrapperProps = {
  id?: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorMessage?: React.ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
};

export function FieldWrapper({
  id,
  label,
  helperText,
  errorMessage,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  size = 'md',
  className,
  children,
}: FieldWrapperProps) {
  const helperId = id ? `${id}-helper` : undefined;
  const errorId = id ? `${id}-error` : undefined;
  const hasError = Boolean(isInvalid && errorMessage);
  const describedBy = hasError ? errorId : helperText ? helperId : undefined;

  return (
    <div
      className={cn(styles.root, styles[size], isDisabled && styles.disabled, className)}
      data-readonly={isReadOnly}
      data-invalid={isInvalid}
      data-disabled={isDisabled}
      data-describedby={describedBy}
    >
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
          {isRequired && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {hasError ? (
        <p id={errorId} className={cn(styles.message, styles.error)} role="alert">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className={styles.message}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

FieldWrapper.displayName = 'FieldWrapper';
