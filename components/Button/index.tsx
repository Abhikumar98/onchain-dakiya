import React, { FC, ReactNode } from "react";

interface IButton {
	readonly loading?: boolean;
	readonly onClick?: () => void;
	readonly disabled?: boolean;
	readonly className?: string;
	readonly icon?: ReactNode;
	readonly fullWidth?: boolean;
}

const Button: FC<IButton> = ({
	children,
	loading,
	onClick,
	disabled,
	className,
	icon,
	fullWidth,
}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled || loading}
			type="button"
			className={` ${
				fullWidth ? " w-full " : ""
			} inline-flex items-center ${
				!children ? " p-3 " : "px-6 py-3"
			}  border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-white focus:outline-none ${
				className ?? ""
			}`}
		>
			{loading ? (
				<svg
					className="animate-spin -ml-1 mr-3 h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			) : (
				<>
					{icon && (
						<div className={`${!children ? "" : "mr-3"}`}>
							{icon}
						</div>
					)}
					{children}
				</>
			)}
		</button>
	);
};

export default Button;
