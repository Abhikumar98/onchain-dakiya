import React, { useEffect } from "react";
import EmailComponent from "../components/EmailComponent";
import SearchBar from "../components/SearchBar";
import { Email } from "../contracts";
import { useMoralisData } from "../hooks/useMoralisData";
import { minimizeAddress } from "../utils";
import { fetchMessages, getAllUserMessages } from "../utils/queries";

declare let window: any;

const Dashboard: React.FC = () => {
	const { account } = useMoralisData();

	// state to store Email data
	const [emails, setEmails] = React.useState<Email[]>([]);

	const queryMails = async () => {
		try {
			console.log(account);

			const response = await fetchMessages(account, 10);
			console.log({ response });
			const cleanedEmails = response
				?.map((email: any) => {
					const { msg_id, receiver, sender, timestamp, uri } = email;

					const newEmail: Email = {
						msg_id: msg_id.toString(),
						receiver: receiver.toString(),
						sender: minimizeAddress(sender.toString()),
						timestamp: Number(timestamp.toString()) * 1000,
						uri: uri.toString(),
					};

					return newEmail;
				})
				?.sort((a, b) => b.timestamp - a.timestamp);

			setEmails(cleanedEmails);

			console.log({ cleanedEmails });
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (account) queryMails();
	}, [account]);

	return (
		<div className="space-y-4 relative">
			<SearchBar />
			{emails.map((email) => (
				<EmailComponent key={email.msg_id} email={email} />
			))}
		</div>
	);
};

export default Dashboard;
