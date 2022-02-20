import React, { useEffect, useState } from "react";
import { EmailThread } from "../../contracts";
import useAppChain from "../../hooks/useAppChain";
import { useMoralisData } from "../../hooks/useMoralisData";
import { minimizeAddress } from "../../utils";
import { getAllUserSentThreads } from "../../utils/queries";
import EmptyThreads from "../EmptyThreads";
import SearchBar from "../SearchBar";
import ThreadComponent from "../ThreadComponent";

const SentThreads = () => {
	const { account } = useMoralisData();
	const [emails, setEmails] = useState<EmailThread[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const { chainId } = useAppChain();

	const queryMails = async () => {
		try {
			setLoading(true);
			const response = await getAllUserSentThreads(account, chainId);

			const cleanedEmails = response
				?.map((email: any) => {
					const {
						_receiver,
						_sender,
						_thread_id,
						_timestamp,
						encrypted,
					} = email;

					const newEmail: EmailThread = {
						thread_id: _thread_id.toString(),
						receiver: _receiver.toString(),
						sender: _sender.toString(),
						timestamp: Number(_timestamp.toString()) * 1000,
						encrypted: encrypted,
					};

					return newEmail;
				})
				?.sort((a, b) => b.timestamp - a.timestamp);

			setEmails(cleanedEmails);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		queryMails();
	}, []);

	return (
		<>
			<SearchBar />
			{loading ? (
				<div className="w-full flex justify-center my-12">
					<svg
						className="animate-spin -ml-1 mr-3 h-12 w-12 text-primaryText"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				</div>
			) : (
				<>
					{!emails.length && <EmptyThreads />}
					{emails.map((email) => (
						<ThreadComponent
							receiverPin
							key={email.thread_id}
							email={email}
						/>
					))}
				</>
			)}
		</>
	);
};

export default SentThreads;
