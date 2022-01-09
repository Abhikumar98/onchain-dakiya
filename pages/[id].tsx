import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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

	// subject state
	const [subject, setSubject] = useState<string>("");

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

			const { _sender_key, _receiver_key } = thread;

			setSenderKey(_sender_key);
			setReceiverKey(_receiver_key);

			console.log({
				_sender_key,
				_receiver_key,
			});

			const response = await getAllThreadMessages(threadId);
			const cleanedMessages: Message[] = response.map((message: any) => {
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
			});
			console.log(cleanedMessages[0]);
			if (!encryptionKey) {
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

	useEffect(() => {
		if (threadId) {
			getMessagesFromThread(String(threadId));
		}
	}, [threadId]);

	useEffect(() => {
		if (encryptionKey) {
			getSubject();
		}
	}, [encryptionKey, messages]);

	const receiver =
		messages?.[0]?.sender === account
			? messages?.[0]?.receiver
			: messages?.[0]?.sender;

	return (
		<>
			<div className="relative">
				<SubjectHeader
					subject={subject}
					sender={messages?.[0]?.sender ?? ""}
				/>
				{messages.map((message) => (
					<ThreadMessage
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
				/>
			</div>
		</>
	);
};

export default Profile;
