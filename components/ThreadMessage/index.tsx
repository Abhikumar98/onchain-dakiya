import React from "react";

const ThreadMessage = () => {
	return (
		<div className="p-4 rounded-md bg-primaryBackground hover:bg-messageHover transition-all ease-in-out my-4">
			<div className="title space-x-4 flex items-center">
				<div className=" text-primaryText text-xl font-semibold">
					Bhaisaab.eth
				</div>
				<div className=" text-secondaryText">Just now</div>
			</div>
			<div className=" text-secondaryText text-base mt-1">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Volutpat odio habitant in tempor tortor massa. Mattis varius
				quam sodales sit et at nibh arcu. Lorem ipsum dolor sit amet,
				consectetur adipiscing elit. Volutpat odio habitant in tempor
				tortor massa. Mattis varius quam sodales sit et at nibh arcu.
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Volutpat odio habitant in tempor tortor massa. Mattis varius
				quam sodales sit et at nibh arcu.
			</div>
		</div>
	);
};

export default ThreadMessage;
