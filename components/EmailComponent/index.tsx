import React from "react";
import Image from "next/image";
import sample from "../../assets/cryptocoffee.png";
import { useRouter } from "next/router";
const EmailComponent = () => {
	const router = useRouter();

	const handleRoute = () => {
		router.push("/123");
	};

	return (
		<div
			onClick={handleRoute}
			className="p-4 rounded-r-md bg-primaryBackground hover:bg-messageHover cursor-pointer transition-all ease-in-out my-4 flex"
		>
			<div className="mr-4">
				<div className="bg-blue-500 rounded-full h-12 w-12 m-auto"></div>
			</div>
			<div className="">
				<div className="title space-x-4 flex items-center">
					<div className=" text-primaryText text-xl font-semibold">
						Bhaisaab.eth
					</div>
					<div className=" text-secondaryText">Just now</div>
				</div>
				<div className=" text-primaryText font-semibold text-lg mt-3">
					Hey bro whats up with the BYAC NFT?
				</div>
				<div className=" text-secondaryText text-base mt-1">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Volutpat odio habitant in tempor tortor massa. Mattis varius
					quam sodales sit et at nibh arcu.
				</div>
			</div>
		</div>
	);
};

export default EmailComponent;
