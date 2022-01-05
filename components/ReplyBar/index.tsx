import React from "react";
import Button from "../Button";
import { Send } from "../Icons";

const ReplyBar = () => {
	return (
		<div className="mt-1 shadow-sm flex items-center space-x-4 bg-secondaryBackground">
			<input
				type="text"
				name="text"
				id="text"
				className="block w-full sm:text-sm border-transparent rounded-md bg-primaryBackground"
				placeholder="Search your emails"
			/>
			<Button icon={<Send />} />
		</div>
	);
};

export default ReplyBar;
