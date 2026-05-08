import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './Skeleton.module.css';

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  width?: string;
  height?: string;
  isBusy?: boolean;
  shape?: 'line' | 'block' | 'circle';
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    { width = '100%', height = '1rem', isBusy, shape = 'block', className, style, ...rest },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        {...rest}
        aria-busy={isBusy || undefined}
        aria-live={isBusy ? 'polite' : undefined}
        className={cn(styles.root, styles[shape], className)}
        style={{ ...style, width, height }}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';
