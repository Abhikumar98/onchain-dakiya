import React from "react";
import Button from "../Button";
import { EmptyThread } from "../Icons";

const EmptyThreads = () => {
	return (
		<div className="w-2/5 bg-primaryBackground rounded-md p-4 space-y-4 text-primaryText text-lg break-all m-auto flex justify-center flex-col items-center my-8">
			<EmptyThread />
			<div>
				There is no Dak in the mail ! Send your first Dak by clicking
				Send Dak button.
			</div>
			<div>Click on "Send Dak" to send a new Dak</div>
		</div>
	);
};

export default EmptyThreads;
