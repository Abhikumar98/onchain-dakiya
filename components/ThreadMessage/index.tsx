import moment from "moment";
import React, { useEffect } from "react";
import { Message } from "../../contracts";
import { minimizeAddress } from "../../utils";
import human from "human-time";
import { toast } from "react-toastify";
import { decryptCipherMessage } from "../../utils/queries";
import { fetchFromIPFS } from "../../utils/crypto";

const ThreadMessage = ({
	message,
	encKey,
}: {
	message: Message;
	encKey: string;
}) => {
	// decrypted message state
	const [decryptedMessage, setDecryptedMessage] = React.useState<string>("");

	const decryptMessage = async () => {
		try {
			const ipfsMessage = await fetchFromIPFS(message.uri);
			const decryptedString = decryptCipherMessage(ipfsMessage, encKey);
			const parsedData = JSON.parse(decryptedString);
			setDecryptedMessage(parsedData.message);
		} catch (error) {
			console.error(error);
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
					{minimizeAddress(message.sender)}
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
