import moment from "moment";
import React, { useEffect } from "react";
import { Message } from "../../contracts";
import { minimizeAddress } from "../../utils";
import human from "human-time";
import { toast } from "react-toastify";
import { decryptCipherMessage } from "../../utils/queries";
import { fetchFromIPFS } from "../../utils/crypto";
import { useEnsAddress } from "../../utils/useEnsAddress";

const ThreadMessage = ({
	message,
	encKey,
	encrypted,
}: {
	message: Message;
	encKey: string;
	encrypted: boolean;
}) => {
	const { name, address, avatar } = useEnsAddress(message.sender);
	const [decryptedMessage, setDecryptedMessage] = React.useState<string>("");

	const decryptMessage = async () => {
		try {
			const ipfsMessage = await fetchFromIPFS(message.uri);
			const decryptedString = encrypted
				? decryptCipherMessage(ipfsMessage, encKey)
				: ipfsMessage;

			const parsedData = JSON.parse(decryptedString);
			setDecryptedMessage(parsedData.message);
		} catch (error) {
			console.trace(error);
			toast.error(error.message ?? "Something went wrong");
		}
	};

	useEffect(() => {
		decryptMessage();
	}, []);

	return (
		<div className="p-4 rounded-md bg-primaryBackground hover:bg-messageHover transition-all ease-in-out my-4">
			<div className="title space-x-4 flex items-center">
				<div className=" text-primaryText text-base md:text-xl font-semibold">
					{name ?? minimizeAddress(message.sender)}
				</div>
				<div className=" text-secondaryText text-xs md:text-sm ml-4 flex items-center">
					<span className=" font-bold mr-4">&bull;</span>
					{human(moment(Number(message.timestamp) * 1000).toDate())}
				</div>
			</div>
			<div className=" text-secondaryText text-sm md:text-base mt-1">
				{decryptedMessage}
			</div>
		</div>
	);
};

export default ThreadMessage;
