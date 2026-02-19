import { forwardRef, useRef } from 'react';
import type { ElementType, ReactNode } from 'react';
import { useButton } from 'react-aria';
import type { AriaButtonOptions } from 'react-aria';
import type { PolymorphicComponentProps } from '../../utils/polymorphic';
import { cn } from '../../utils/cn';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonOwnProps = {
	variant?: ButtonVariant;
	size?: ButtonSize;
	isLoading?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	isDisabled?: boolean;
	onPress?: AriaButtonOptions<'button'>['onPress'];
};

export type ButtonProps<C extends ElementType = 'button'> =
	PolymorphicComponentProps<C, ButtonOwnProps>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			as,
			variant = 'primary',
			size = 'md',
			isLoading = false,
			isDisabled = false,
			leftIcon,
			rightIcon,
			className,
			children,
			onPress,
			...rest
		},
		forwardedRef,
	) => {
		const internalRef = useRef<HTMLButtonElement>(null);
		const ref = forwardedRef || internalRef;

		const { buttonProps } = useButton(
			{
				onPress,
				isDisabled: isDisabled || isLoading,
				elementType: as || 'button',
			},
			ref as React.RefObject<HTMLButtonElement>,
		);

		const Component = as || 'button';

		return (
			<Component
				{...rest}
				{...buttonProps}
				ref={ref}
				className={cn(
					styles.root,
					styles[variant],
					styles[size],
					isLoading && styles.loading,
					className,
				)}
			>
				{isLoading && <span className={styles.spinner} aria-hidden="true" />}
				{leftIcon && <span className={styles.icon}>{leftIcon}</span>}
				<span>{children}</span>
				{rightIcon && <span className={styles.icon}>{rightIcon}</span>}
			</Component>
		);
	},
);

Button.displayName = 'Button';
