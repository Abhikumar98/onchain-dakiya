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
			disabled={disabled}
			type="button"
			className={` ${
				fullWidth ? " w-full " : ""
			} inline-flex items-center ${
				!children ? " p-3 " : "px-6 py-3"
			}  border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-white focus:outline-none ${
				className ?? ""
			}`}
		>
			{icon && <div className={`${!children ? "" : "mr-3"}`}>{icon}</div>}
			{children}
		</button>
	);
};

export default Button;
