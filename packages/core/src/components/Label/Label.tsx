import { cn } from '../../utils/cn';
import styles from './Label.module.css';

export type LabelProps = {
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Label({
  htmlFor,
  required = false,
  disabled = false,
  className,
  children,
}: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={cn(styles.root, disabled && styles.disabled, className)}>
      {children}
      {required && (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

Label.displayName = 'Label';
