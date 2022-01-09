import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Email } from "../../contracts";
import { useEnsAddress } from "../../utils/useEnsAddress";
import Blockie from "../Blockie";
import human from "human-time";
import moment from "moment";
import { minimizeAddress } from "../../utils";
import { fetchFromIPFS } from "../../utils/crypto";
import { toast } from "react-toastify";

const EmailComponent = ({ email }: { email: Email }) => {
	const router = useRouter();
	const { name, address, avatar } = useEnsAddress(email.sender);

	const [loading, setLoading] = React.useState(false);
	const [message, setMessage] = React.useState<string>("");
	const [subject, setSubject] = React.useState<string>("");

	const handleRoute = () => {
		router.push("/123");
	};

	const resolveIPFS = async () => {
		try {
			setLoading(true);
			const result = await fetchFromIPFS(email.uri);
			const parsedResult = JSON.parse(result);
			const data = JSON.parse(parsedResult.data);
			console.log({ ...data });
			setMessage(data.message);
			setSubject(data.subject);
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

	return (
		<div
			onClick={handleRoute}
			className="p-4 rounded-md bg-primaryBackground hover:bg-messageHover cursor-pointer transition-all ease-in-out my-4 flex"
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
				<div className="flex flex-col  md:flex-row md:space-x-4 md:items-center">
					<div className=" text-primaryText text-base sm:text-lg md:text-xl font-semibold">
						{name ?? minimizeAddress(address ?? email.sender)}
					</div>
					<div className="text-xs sm:text-sm md:text-base text-secondaryText">
						{human(moment(email.timestamp).toDate())}
					</div>
				</div>
				<div className=" text-primaryText font-semibold text-sm sm:text-base md:text-lg mt-3">
					{loading
						? "loading..."
						: subject ?? "Prolly invalid subject"}
				</div>
				<div className=" text-secondaryText text-xs sm:text-sm md:text-base mt-1">
					{loading
						? "loading..."
						: message ?? "Prolly invalid message"}
				</div>
			</div>
		</div>
	);
};

export default EmailComponent;
