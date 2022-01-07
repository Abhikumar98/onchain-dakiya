import { useRouter } from "next/router";
import React from "react";
import { Email } from "../../contracts";
import { useEnsAddress } from "../../utils/useEnsAddress";
import Blockie from "../Blockie";
import human from "human-time";
import moment from "moment";
import { minimizeAddress } from "../../utils";

const EmailComponent = ({ email }: { email: Email }) => {
	const router = useRouter();
	const { name, address, avatar } = useEnsAddress(email.sender);

	const handleRoute = () => {
		router.push("/123");
	};

	return (
		<div
			onClick={handleRoute}
			className="p-4 rounded-r-md bg-primaryBackground hover:bg-messageHover cursor-pointer transition-all ease-in-out my-4 flex"
		>
			<div className="mr-4">
				{avatar ? (
					<img
						src={avatar}
						className="rounded-full h-12 w-12 m-auto"
					/>
				) : (
					<Blockie address={address} />
				)}
			</div>
			<div className="">
				<div className="title space-x-4 flex items-center">
					<div className=" text-primaryText text-xl font-semibold">
						{name ?? minimizeAddress(address ?? email.sender)}
					</div>
					<div className=" text-secondaryText">
						{human(moment(email.timestamp).toDate())}
					</div>
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
