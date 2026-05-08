import { forwardRef } from 'react';
import type { AriaProgressBarProps } from 'react-aria';
import { mergeProps, useProgressBar } from 'react-aria';
import { cn } from '../../utils/cn';
import styles from './Progress.module.css';

export type ProgressProps = AriaProgressBarProps & {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      size = 'md',
      className,
      label,
      value,
      minValue = 0,
      maxValue = 100,
      isIndeterminate,
      ...rest
    },
    ref,
  ) => {
    const { progressBarProps, labelProps } = useProgressBar({
      ...rest,
      label,
      value,
      minValue,
      maxValue,
      isIndeterminate,
    });

    const pct =
      value != null && !isIndeterminate
        ? Math.round(((value - minValue) / (maxValue - minValue)) * 100)
        : undefined;

    return (
      <div
        {...mergeProps(progressBarProps, { ref })}
        className={cn(styles.root, styles[size], className)}
      >
        {label ? (
          <span {...labelProps} className={styles.label}>
            {label}
          </span>
        ) : null}
        <div className={styles.track} aria-hidden="true">
          <div
            className={cn(styles.fill, isIndeterminate && styles.indeterminate)}
            style={pct != null ? { width: `${pct}%` } : undefined}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = 'Progress';
