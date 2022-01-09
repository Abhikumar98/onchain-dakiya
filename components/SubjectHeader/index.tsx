import { ArrowSmLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import React from "react";
import { minimizeAddress } from "../../utils";
import { useEnsAddress } from "../../utils/useEnsAddress";

const SubjectHeader = ({
	subject,
	sender,
}: {
	subject: string;
	sender: string;
}) => {
	const { name, avatar } = useEnsAddress(sender);
	const router = useRouter();

	const handleGoBack = () => {
		router.back();
	};

	return (
		<div className="bg-secondaryBackground sticky -top-4 -mt-4 py-4">
			<div className="p-4 rounded-md bg-messageHover transition-all ease-in-out flex md:items-center justify-between">
				<ArrowSmLeftIcon
					onClick={handleGoBack}
					className="h-8 w-8 text-primaryText mr-4 cursor-pointer"
				/>
				<div className="flex flex-col md:flex-row w-full justify-between">
					<div className=" text-primaryText text-base md:text-xl font-semibold">
						{subject}
					</div>
					<div className="mr-4 mt-2 md:mt-0 text-primaryText flex items-center space-x-2 md:space-x-2 text-xs md:text-base">
						{avatar && (
							<img
								src={avatar}
								className="rounded-full h-6 w-6 md:h-8 md:w-8 "
							/>
						)}
						<div>{name ?? minimizeAddress(sender)}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SubjectHeader;
