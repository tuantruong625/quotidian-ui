import { createContext, useContext, useRef } from 'react';
import { useRadio, useRadioGroup } from 'react-aria';
import { useRadioGroupState } from 'react-stately';
import { cn } from '../../utils/cn';
import styles from './Radio.module.css';

type RadioGroupContextValue = {
  state: ReturnType<typeof useRadioGroupState>;
  name?: string;
  isDisabled?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export type RadioGroupProps = {
  label?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  children: React.ReactNode;
};

export function RadioGroup({
  label,
  value,
  defaultValue,
  onChange,
  isDisabled,
  children,
}: RadioGroupProps) {
  const state = useRadioGroupState({ label, value, defaultValue, onChange, isDisabled });
  const { radioGroupProps, labelProps } = useRadioGroup({ label, isDisabled }, state);

  return (
    <div {...radioGroupProps} className={styles.group}>
      {label && (
        <span {...labelProps} className={styles.groupLabel}>
          {label}
        </span>
      )}
      <RadioGroupContext.Provider value={{ state, isDisabled }}>
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
}

export type RadioProps = {
  value: string;
  children: React.ReactNode;
  isDisabled?: boolean;
};

export function Radio({ value, children, isDisabled }: RadioProps) {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('Radio must be used inside RadioGroup.');
  }
  const ref = useRef<HTMLInputElement>(null);
  const { inputProps } = useRadio(
    { value, isDisabled: isDisabled || context.isDisabled, children: String(children) },
    context.state,
    ref,
  );

  return (
    <label className={cn(styles.root, (isDisabled || context.isDisabled) && styles.disabled)}>
      <input {...inputProps} ref={ref} className={styles.input} />
      <span className={cn(styles.dot, inputProps.checked && styles.checked)} aria-hidden="true" />
      <span>{children}</span>
    </label>
  );
}

RadioGroup.displayName = 'RadioGroup';
Radio.displayName = 'Radio';
