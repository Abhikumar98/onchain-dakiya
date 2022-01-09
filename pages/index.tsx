import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../components/Button";
import EmailComponent from "../components/EmailComponent";
import SearchBar from "../components/SearchBar";
import { Email } from "../contracts";
import { useMoralisData } from "../hooks/useMoralisData";
import { minimizeAddress } from "../utils";
import { contract, getPublicEncryptionKey } from "../utils/crypto";
import { getAllUserMessages } from "../utils/queries";

declare let window: any;

const Dashboard: React.FC = () => {
	const { account } = useMoralisData();

	// state to store Email data
	const [emails, setEmails] = React.useState<Email[]>([]);
	// onboarded state
	const [onboarded, setOnboarded] = React.useState<boolean>(false);

	const checkIfOnboarded = async (address: string) => {
		try {
			const response = await contract().checkUserRegistration();
			console.log({ response });
			setOnboarded(!!response);
		} catch (error) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		}
	};

	const onboardUser = async () => {
		try {
			const key = await getPublicEncryptionKey(account);
			await contract().setPubEncKey(key);
			setOnboarded(true);
		} catch (error) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		}
	};

	const queryMails = async () => {
		try {
			console.log(account);

			const response = await getAllUserMessages(account);
			console.log(response);
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
		if (account) {
			queryMails();
			checkIfOnboarded(account);
		}
	}, [account]);

	return (
		<div className="space-y-4 relative">
			{!onboarded && (
				<div className="my-20 flex flex-col items-center space-y-8 text-primaryText">
					<div className="text-3xl">Onboarding wala message</div>
					<Button onClick={onboardUser}>Let's get Started</Button>
				</div>
			)}
			{onboarded && (
				<>
					<SearchBar />
					{emails.map((email) => (
						<EmailComponent key={email.msg_id} email={email} />
					))}
				</>
			)}
			{!!onboarded && !emails.length && (
				<div className="text-primaryText py-20 text-center text-xl">
					No messages
				</div>
			)}
		</div>
	);
};

export default Dashboard;
