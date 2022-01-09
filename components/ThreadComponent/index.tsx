import human from "human-time";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { EmailThread } from "../../contracts";
import { minimizeAddress } from "../../utils";
import { getLatestMessage } from "../../utils/queries";
import { useEnsAddress } from "../../utils/useEnsAddress";
import Blockie from "../Blockie";

const ThreadComponent = ({
	email,
	receiverPin,
}: {
	email: EmailThread;
	receiverPin?: boolean;
}) => {
	const router = useRouter();
	const { name, address, avatar } = useEnsAddress(email.sender);
	const { name: receiverName, avatar: receiverAvatar } = useEnsAddress(
		email.receiver
	);

	const [loading, setLoading] = React.useState(false);
	const [timestamp, setTimestamp] = React.useState<number | null>(null);

	const handleRoute = () => {
		router.push(`/${email.thread_id}`);
	};

	const resolveIPFS = async () => {
		try {
			setLoading(true);
			const response = await getLatestMessage(email.thread_id);
			setTimestamp(Number(response._timestamp) * 1000);
		} catch (error) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		resolveIPFS();
	}, []);

	const sender = name ?? minimizeAddress(address ?? email.sender);
	const receiver = receiverName ?? minimizeAddress(email.receiver);
	const imageAvatar = receiverPin ? receiverAvatar : avatar;

	return (
		<div
			onClick={handleRoute}
			className="p-4 rounded-md bg-primaryBackground hover:bg-messageHover cursor-pointer transition-all ease-in-out my-4 flex"
		>
			<div className="mr-4">
				{avatar || receiverAvatar ? (
					<img
						src={imageAvatar}
						className="rounded-full h-12 w-12 m-auto"
					/>
				) : (
					<Blockie address={address} />
				)}
			</div>
			<div className="">
				<div className="flex flex-col  md:flex-row md:space-x-4 md:items-center">
					<div className=" text-primaryText text-base sm:text-lg md:text-xl font-semibold">
						{receiverPin ? receiver : sender}
					</div>
					<div className="text-xs sm:text-sm md:text-base text-secondaryText">
						{human(moment(timestamp ?? email.timestamp).toDate())}
					</div>
				</div>
				<div className=" text-primaryText font-semibold text-sm sm:text-base md:text-lg mt-3">
					{/* {loading
						? "loading..."
						: subject ?? "Prolly invalid subject"} */}
				</div>
				<div className=" text-secondaryText text-xs sm:text-sm md:text-base mt-1">
					{/* {loading
						? "loading..."
						: message ?? "Prolly invalid message"} */}
				</div>
			</div>
		</div>
	);
};

export default ThreadComponent;
