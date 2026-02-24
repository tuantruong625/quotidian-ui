import { ElementType, forwardRef, useRef } from 'react';
import { PolymorphicComponentProps } from '../../utils/polymorphic';
import { useTextField } from 'react-aria';

export type InputOwnProps = {
	label: string;
	placeholder?: string;
	description?: string;
	errorMessage?: string;
	size: 'sm' | 'md' | 'lg';
	isLoading: boolean;
	isDisabled: boolean;
	isRequired: boolean;
	value: string;
	onChange: () => {};
	defaultValue: string;
};

export type InputProps<C extends ElementType = 'input'> =
	PolymorphicComponentProps<C, InputOwnProps>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			size = 'md',
			placeholder,
			description,
			isLoading = false,
			isDisabled = false,
			isRequired = false,
			className,
			...rest
		},
		forwardedRef,
	) => {
		const internalRef = useRef<HTMLInputElement>(null);
		const ref = forwardedRef || internalRef;

		const { inputProps } = useTextField(
			{ isDisabled: isDisabled || isLoading },
			ref as React.RefObject<HTMLInputElement>,
		);

		return <input {...rest} {...inputProps} />;
	},
);

Input.displayName = 'Input';
