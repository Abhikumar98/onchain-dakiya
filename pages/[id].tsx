import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useChain } from "react-moralis";
import { toast } from "react-toastify";
import Button from "../components/Button";
import { Warning } from "../components/Icons";
import ReplyBar from "../components/ReplyBar";
import SubjectHeader from "../components/SubjectHeader";
import ThreadMessage from "../components/ThreadMessage";
import { Message } from "../contracts";
import { useMoralisData } from "../hooks/useMoralisData";
import { decryptMessage, fetchFromIPFS } from "../utils/crypto";
import {
	decryptCipherMessage,
	getAllThreadMessages,
	getThread,
} from "../utils/queries";

declare let window: any;

export interface ProfileProps {
	profileAddress: string;
	ens?: string;
	avatar?: string;
}

const Profile: React.FC<ProfileProps> = ({}) => {
	const { query } = useRouter();

	const { account } = useMoralisData();

	const threadId = query?.id?.toString();

	const [messages, setMessages] = useState<Message[]>([]);
	const [encryptionKey, setEncryptionKey] = useState<string>("");
	// separate state for sender_key receiver_key
	const [senderKey, setSenderKey] = useState<string>("");
	const [receiverKey, setReceiverKey] = useState<string>("");
	const [encrypted, setEncrypted] = useState<boolean>(false);

	// subject state
	const [subject, setSubject] = useState<string>("");
	const { chainId, switchNetwork } = useChain();

	const requiredChain = chainId === "0x4";

	const decryptEncrytionKey = async (key: string): Promise<string> => {
		try {
			const decryptedKey = await decryptMessage(key);
			return decryptedKey;
		} catch (error) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		}
	};

	const subjectURI = messages?.[0]?.uri;

	const getSubject = async () => {
		try {
			if (!subjectURI) {
				return;
			}
			const ipfsMessage = await fetchFromIPFS(subjectURI);
			const decryptedString = decryptCipherMessage(
				ipfsMessage,
				encryptionKey
			);
			const parsedData = JSON.parse(decryptedString);
			setSubject(parsedData.subject);
		} catch (error) {
			console.trace(error);
		}
	};

	const getMessagesFromThread = async (threadId: string) => {
		try {
			const thread = await getThread(threadId);

			const { _sender_key, _receiver_key, encrypted } = thread;

			setSenderKey(_sender_key);
			setReceiverKey(_receiver_key);

			console.log({
				_sender_key,
				_receiver_key,
			});

			const response = await getAllThreadMessages(threadId);
			const cleanedMessages: Message[] = response
				.map((message: any) => {
					const newMessage: Message = {
						txId: message.id,
						receiver: message._receiver,
						sender: message._sender,
						timestamp: message._timestamp,
						message: "",
						subject: "",
						uri: message._uri,
					};
					return newMessage;
				})
				.sort((a, b) => a.timestamp - b.timestamp);

			if (!encrypted) {
				setEncrypted(false);
				const ipfsMessage = await fetchFromIPFS(
					cleanedMessages[0]?.uri
				);
				const parsedData = JSON.parse(ipfsMessage);
				setSubject(parsedData.subject);
			}

			if (!encryptionKey && encrypted) {
				console.log("Permission to get public encryption key");
				setEncrypted(true);
				if (cleanedMessages[0].sender === account) {
					const decryptedEncKey = await decryptEncrytionKey(
						_sender_key
					);
					setEncryptionKey(decryptedEncKey);
				} else {
					console.log(cleanedMessages[0].receiver);
					const decryptedEncKey = await decryptEncrytionKey(
						_receiver_key
					);
					setEncryptionKey(decryptedEncKey);
				}
			}

			setMessages(cleanedMessages);
		} catch (error) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		}
	};

	const switchETHNetwork = () => {
		process.env.NODE_ENV === "development"
			? switchNetwork("0x4")
			: switchNetwork("0x1");
	};

	useEffect(() => {
		if (threadId) {
			getMessagesFromThread(String(threadId));
		}
	}, [threadId]);

	useEffect(() => {
		if (encrypted) {
			if (encryptionKey) {
				getSubject();
			}
		} else {
			getSubject();
		}
	}, [encryptionKey, messages]);

	const receiver =
		messages?.[0]?.sender === account
			? messages?.[0]?.receiver
			: messages?.[0]?.sender;

	return (
		<>
			{!requiredChain ? (
				<div className="w-96 bg-primaryBackground rounded-md p-4 space-y-4 text-primaryText text-xl break-words m-auto flex justify-center flex-col items-center my-8">
					<Warning />
					<div className="text-center">
						You are not connected to Mainnet
					</div>
					<div className="text-sm text-center text-secondaryText">
						Your wallet is connected to a different network. Please
						switch to the Ethereum Mainnet to continue.
					</div>
					<Button
						onClick={switchETHNetwork}
						fullWidth
						className="flex justify-center"
					>
						Switch Network
					</Button>
				</div>
			) : (
				<>
					<div className="relative">
						<SubjectHeader
							encrypted={encrypted}
							subject={subject}
							sender={messages?.[0]?.sender ?? ""}
						/>
						{messages.map((message) => (
							<ThreadMessage
								encrypted={encrypted}
								encKey={encryptionKey}
								key={message.txId}
								message={message}
							/>
						))}
						<ReplyBar
							receiver={receiver}
							encryptionKey={encryptionKey}
							threadId={threadId}
							senderPubEncKey={senderKey}
							receiverPubEncKey={receiverKey}
							encrypted={encrypted}
						/>
					</div>
				</>
			)}
		</>
	);
};

export default Profile;
