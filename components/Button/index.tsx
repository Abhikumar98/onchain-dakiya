import React, { FC, ReactNode } from "react";

interface IButton {
	readonly loading?: boolean;
	readonly onClick?: () => void;
	readonly children: React.ReactNode;
	readonly disabled?: boolean;
	readonly className?: string;
	readonly icon?: ReactNode;
}

const Button: FC<IButton> = ({
	children,
	loading,
	onClick,
	disabled,
	className,
	icon,
}) => {
	return (
		<button
			type="button"
			className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
		>
			{icon && <div className="mr-3">{icon}</div>}
			{children}
		</button>
	);
};

export default Button;
