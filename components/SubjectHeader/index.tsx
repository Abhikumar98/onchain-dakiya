import { ArrowSmLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import React from "react";

const SubjectHeader = () => {
	const router = useRouter();

	const handleGoBack = () => {
		router.back();
	};

	return (
		<div className="p-4 rounded-md bg-messageHover transition-all ease-in-out mb-4 flex items-center justify-between">
			<div className="flex items-center">
				<ArrowSmLeftIcon
					onClick={handleGoBack}
					className="h-8 w-8 text-primaryText mr-4 cursor-pointer"
				/>
				<div className=" text-primaryText text-xl font-semibold">
					Hey bro whats up with the BYAC NFT?
				</div>
			</div>
			<div className="mr-4 text-primaryText flex items-center space-x-4">
				<div className="bg-blue-500 rounded-full h-8 w-8 m-auto"></div>
				<div>Bhaisaab.eth</div>
			</div>
		</div>
	);
};

export default SubjectHeader;
