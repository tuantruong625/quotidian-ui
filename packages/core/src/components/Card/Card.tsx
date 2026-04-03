import { forwardRef, useRef } from 'react';
import type { ElementType, ReactNode } from 'react';
import { useButton } from 'react-aria';
import type { AriaButtonOptions } from 'react-aria';
import type { PolymorphicComponentProps } from '../../utils/polymorphic';
import { cn } from '../../utils/cn';
import styles from './Card.module.css';

type CardVariant = 'elevated' | 'outlined' | 'filled';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const PADDING_CLASS: Record<CardPadding, string> = {
  none: styles.paddingNone,
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
};

type InteractiveCardProps = {
  as: ElementType;
  onPress?: AriaButtonOptions<'button'>['onPress'];
  isDisabled?: boolean;
  isInteractive?: boolean;
};

type StaticCardProps = {
  as?: undefined;
  onPress?: never;
  isDisabled?: never;
  isInteractive?: boolean;
};

type CardBaseProps = {
  variant?: CardVariant;
  padding?: CardPadding;
  children?: ReactNode;
};

export type CardOwnProps = CardBaseProps & (InteractiveCardProps | StaticCardProps);

export type CardProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, CardOwnProps>;

export const Card = forwardRef<HTMLElement, CardProps>(
  (
    {
      as,
      variant = 'elevated',
      padding = 'md',
      isInteractive = false,
      isDisabled = false,
      onPress,
      className,
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLElement>(null);
    const ref = (forwardedRef || internalRef) as React.RefObject<HTMLElement>;

    const isSemanticInteractive = !!as && as !== 'div';
    const { buttonProps } = useButton(
      {
        onPress: isSemanticInteractive ? onPress : undefined,
        isDisabled,
        elementType: as || 'div',
      },
      ref as React.RefObject<HTMLButtonElement>,
    );

    const Component = as || 'div';
    const showInteractiveStyle = isInteractive || isSemanticInteractive;

    const props = isSemanticInteractive ? { ...buttonProps } : {};

    return (
      <Component
        {...rest}
        {...props}
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(
          styles.root,
          styles[variant],
          PADDING_CLASS[padding],
          showInteractiveStyle && styles.interactive,
          isDisabled && styles.disabled,
          className,
        )}
      >
        {children}
      </Component>
    );
  },
);

Card.displayName = 'Card';

export type CardHeaderProps = {
  className?: string;
  children?: ReactNode;
};

export function CardHeader({ className, children }: CardHeaderProps) {
  return <div className={cn(styles.header, className)}>{children}</div>;
}

CardHeader.displayName = 'CardHeader';

export type CardBodyProps = {
  className?: string;
  children?: ReactNode;
};

export function CardBody({ className, children }: CardBodyProps) {
  return <div className={cn(styles.body, className)}>{children}</div>;
}

CardBody.displayName = 'CardBody';

export type CardFooterProps = {
  className?: string;
  children?: ReactNode;
};

export function CardFooter({ className, children }: CardFooterProps) {
  return <div className={cn(styles.footer, className)}>{children}</div>;
}

CardFooter.displayName = 'CardFooter';
