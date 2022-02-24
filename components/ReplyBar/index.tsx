import React, { useEffect, useRef, useState } from "react";
import { useChain } from "react-moralis";
import { toast } from "react-toastify";
import useAppChain from "../../hooks/useAppChain";
import { useMoralisData } from "../../hooks/useMoralisData";
import {
	contract,
	getPublicEncryptionKey,
	listenEvents,
} from "../../utils/crypto";
import { threadReply } from "../../utils/queries";
import Button from "../Button";
import { Send } from "../Icons";

const ReplyBar = ({
	receiver,
	encryptionKey,
	threadId,
	senderPubEncKey,
	receiverPubEncKey,
	encrypted,
	network,
}: {
	receiver: string;
	encryptionKey: string;
	threadId: string;
	senderPubEncKey: string;
	receiverPubEncKey: string;
	encrypted: boolean;
	network: string;
}) => {
	const toastId = useRef(null);
	const [message, setMessage] = React.useState<string>("");
	const [loading, setLoading] = React.useState<boolean>(false);
	const { chainId, switchNetwork } = useChain();
	const { enableWeb3 } = useMoralisData();
	const { account } = useMoralisData();

	const checkIfOnboarded = async (chainId: string) => {
		const isOnboared = await contract(chainId).checkUserRegistration();
		if (!isOnboared) {
			const key = await getPublicEncryptionKey(account);
			await contract(chainId).setPubEncKey(key);
		}
	};

	const handleSend = async () => {
		try {
			if (chainId !== network) {
				console.log("switching networks");
				await switchNetwork(network);
				console.log("switched networks");
				await checkIfOnboarded(network);
				console.log("checked On boarding");
			}

			setLoading(true);
			await threadReply(
				receiver,
				message,
				threadId,
				encryptionKey,
				senderPubEncKey,
				receiverPubEncKey,
				encrypted,
				network
			);
			toastId.current = toast.loading("Sending message", {
				position: "bottom-left",
			});
			setMessage("");
			listenEvents(network).on("MessageSent", (...params) => {
				toast.update(toastId.current, {
					type: toast.TYPE.SUCCESS,
					render: "Email sent successfully",
					autoClose: 5000,
					isLoading: false,
					draggable: true,
				});
			});
		} catch (error) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		enableWeb3();
	}, []);

	return (
		<div className=" sticky -bottom-4 -mb-4 py-4 shadow-sm flex items-start space-x-4 bg-secondaryBackground">
			<textarea
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				rows={1}
				name="reply"
				id="reply"
				className="shadow-sm block w-full sm:text-sm border-transparent bg-messageHover rounded-md text-primaryText"
				placeholder="Reply to thread"
			/>
			<Button loading={loading} onClick={handleSend} icon={<Send />} />
		</div>
	);
};

export default ReplyBar;
