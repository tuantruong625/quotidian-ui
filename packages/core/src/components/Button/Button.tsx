import type { ReactNode } from 'react';

export interface ButtonProps {
	children: ReactNode;
	variant?: 'primary' | 'secondary';
}

export const Button = ({ children, variant = 'primary' }: ButtonProps) => {
	return <button data-variant={variant}>{children}</button>;
};
