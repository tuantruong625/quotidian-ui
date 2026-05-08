import { forwardRef, useRef } from 'react';
import type { AriaSliderProps } from 'react-aria';
import { mergeProps, useNumberFormatter, useSlider, useSliderThumb } from 'react-aria';
import { useSliderState } from 'react-stately';
import { cn } from '../../utils/cn';
import styles from './Slider.module.css';

export type SliderProps = AriaSliderProps<number> & {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SliderInner = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      label,
      size = 'md',
      className,
      defaultValue,
      value,
      onChange,
      minValue = 0,
      maxValue = 100,
      step = 1,
      isDisabled,
      ...rest
    },
    forwardedRef,
  ) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const numberFormatter = useNumberFormatter();

    const state = useSliderState({
      ...rest,
      defaultValue,
      value,
      onChange,
      minValue,
      maxValue,
      step,
      isDisabled,
      numberFormatter,
    });

    const { groupProps, trackProps, labelProps, outputProps } = useSlider(
      { ...rest, label, minValue, maxValue, step, isDisabled },
      state,
      trackRef,
    );

    const { thumbProps, inputProps } = useSliderThumb({ index: 0, trackRef, inputRef }, state);

    return (
      <div
        {...mergeProps(groupProps, { ref: forwardedRef })}
        className={cn(styles.root, styles[size], className)}
      >
        {label ? (
          <label {...labelProps} className={styles.label}>
            {label}
          </label>
        ) : null}
        <div className={styles.row}>
          <div {...trackProps} ref={trackRef} className={styles.track}>
            <div
              className={styles.fill}
              style={{
                width: `${((state.getThumbValue(0) - minValue) / (maxValue - minValue)) * 100}%`,
              }}
              aria-hidden="true"
            />
            <div {...mergeProps(thumbProps, { className: styles.thumb })}>
              <input {...inputProps} ref={inputRef} className={styles.input} />
            </div>
          </div>
          <output {...outputProps} className={styles.output}>
            {state.getThumbValue(0)}
          </output>
        </div>
      </div>
    );
  },
);

SliderInner.displayName = 'SliderInner';

export const Slider = forwardRef<HTMLDivElement, SliderProps>((props, ref) => (
  <SliderInner {...props} ref={ref} />
));

Slider.displayName = 'Slider';
