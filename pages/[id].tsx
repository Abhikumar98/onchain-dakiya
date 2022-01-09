import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReplyBar from "../components/ReplyBar";
import SubjectHeader from "../components/SubjectHeader";
import ThreadMessage from "../components/ThreadMessage";
import { Message } from "../contracts";
import { useMoralisData } from "../hooks/useMoralisData";
import { decryptMessage, getPublicEncryptionKey } from "../utils/crypto";
import { getAllThreadMessages, getThread } from "../utils/queries";

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

	const decryptEncrytionKey = async (key: string): Promise<string> => {
		try {
			const decryptedKey = await decryptMessage(key);
			return decryptedKey;
		} catch (error) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		}
	};

	const getMessagesFromThread = async (threadId: string) => {
		try {
			const thread = await getThread(threadId);

			const { _sender_key, _receiver_key } = thread;

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
			if (!encryptionKey) {
				if (cleanedMessages[0].sender === account) {
					const decryptedEncKey = await decryptEncrytionKey(
						_sender_key
					);
					setEncryptionKey(decryptedEncKey);
				} else {
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

	return (
		<>
			<div className="relative">
				<SubjectHeader />
				{messages.map((message) => (
					<ThreadMessage
						encKey={encryptionKey}
						key={encryptionKey}
						message={message}
					/>
				))}
				<ReplyBar />
			</div>
		</>
	);
};

export default Profile;
