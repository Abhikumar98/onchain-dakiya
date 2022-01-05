import React from "react";
import Button from "../Button";
import { Send } from "../Icons";

const ReplyBar = () => {
	return (
		<div className="mt-1 shadow-sm flex items-start space-x-4 bg-secondaryBackground">
			<textarea
				rows={1}
				name="reply"
				id="reply"
				className="shadow-sm block w-full sm:text-sm border-transparent bg-messageHover rounded-md text-primaryText"
				defaultValue={""}
				placeholder="Add message"
			/>
			<Button icon={<Send />} />
		</div>
	);
};

export default ReplyBar;
