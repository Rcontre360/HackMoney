import Link from 'next/link';
import * as React from 'react';
import { Typography } from '../typography';
import { Spinner } from '../spinner/spinner';
import Styles from './styles.module.scss';
import clsx from 'clsx';

export interface ButtonProps {
	label?: string;
	disabled?: boolean;
	onClick?: () => void;
	href?: string;
	loading?: boolean;
	className?: string;
	labelProps?: string;
}

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<
	ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({
	label,
	disabled,
	loading,
	onClick,
	className,
	labelProps,
	children,
	href = null,
	...props
}) => {
	// const refButtom = React.useRef<any>(null);
	return (
		<>
			{href ? (
				<Link href={href}>
					<a>
						<button
							// ref={refButtom}
							type="button"
							disabled={disabled}
							onClick={onClick}
							className={clsx(
								className,
								'rounded-md focus:outline-none lh-16',
								{ 'bg-primary text-white': !disabled },
								{
									'bg-white text-primary border-1 border-solid border-primary':
										disabled,
								},
								Styles.button
							)}
							{...props}
						>
							{label ? (
								<Typography type="smallTitle">
									<div className="flex items-center">
										{loading && <Spinner type="loadingButton" />}
										<span className={clsx(labelProps, Styles.typography)}>
											{label}
										</span>
									</div>
								</Typography>
							) : (
								children
							)}
						</button>
					</a>
				</Link>
			) : (
				<button
					// ref={refButtom}
					type="button"
					disabled={disabled}
					onClick={onClick}
					className={clsx(
						className,
						'text-base rounded-md focus:outline-none lh-16',
						'bg-primary text-white',
						{
							'cursor-not-allowed': disabled,
						},
						Styles.button
					)}
					{...props}
				>
					{label ? (
						<Typography type="smallTitle">
							<div className="flex items-center">
								{loading && <Spinner type="loadingButton" />}
								<span className={clsx(labelProps, Styles.typography)}>
									{label}
								</span>
							</div>
						</Typography>
					) : (
						children
					)}
				</button>
			)}
		</>
	);
};

export const ButtonContent: React.FC<
	ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ label, disabled, onClick, href, children, ...props }) => {
	return (
		<>
			{href ? (
				<Button label={label} disabled={disabled} href={href} {...props} />
			) : (
				<Button
					label={label}
					disabled={disabled}
					onClick={onClick}
					href={href}
					{...props}
				>
					{children}
				</Button>
			)}
		</>
	);
};
