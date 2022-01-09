import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../components/Button";
import EmailComponent from "../components/EmailComponent";
import EmptyThreads from "../components/EmptyThreads";
import { Lock } from "../components/Icons";
import SearchBar from "../components/SearchBar";
import { EmailThread } from "../contracts";
import { useMoralisData } from "../hooks/useMoralisData";
import { minimizeAddress } from "../utils";
import { contract, getPublicEncryptionKey } from "../utils/crypto";
import { getAllUserThreads } from "../utils/queries";

declare let window: any;

const Dashboard: React.FC = () => {
	const { account } = useMoralisData();

	// state to store Email data
	const [emails, setEmails] = React.useState<EmailThread[]>([]);
	// onboarding state
	const [onboarding, setOnboarding] = React.useState<boolean>(false);
	// onboarded state
	const [onboarded, setOnboarded] = React.useState<boolean>(false);

	const checkIfOnboarded = async (address: string) => {
		try {
			const response = await contract().checkUserRegistration();

			setOnboarded(!!response);
		} catch (error) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		}
	};

	const onboardUser = async () => {
		try {
			setOnboarding(true);
			const key = await getPublicEncryptionKey(account);
			await contract().setPubEncKey(key);
			setOnboarded(true);
		} catch (error) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		} finally {
			setOnboarding(false);
		}
	};

	const queryMails = async () => {
		try {
			const response = await getAllUserThreads(account);

			const cleanedEmails = response
				?.map((email: any) => {
					const { _receiver, _sender, _thread_id, _timestamp } =
						email;

					const newEmail: EmailThread = {
						thread_id: _thread_id.toString(),
						receiver: _receiver.toString(),
						sender: minimizeAddress(_sender.toString()),
						timestamp: Number(_timestamp.toString()) * 1000,
					};

					return newEmail;
				})
				?.sort((a, b) => b.timestamp - a.timestamp);

			setEmails(cleanedEmails);
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
		<div className="space-y-4 relative w-full">
			{!onboarded && (
				<div className="w-2/5 bg-primaryBackground rounded-md p-4 space-y-4 text-primaryText text-xl break-all m-auto flex justify-center flex-col items-center my-8">
					<Lock />
					<div>
						Hurray 🎉, You have successfully made it! Now we just
						need password encryption key to get you started.
					</div>
					<Button
						loading={onboarding}
						onClick={onboardUser}
						className="justify-center"
						fullWidth
					>
						Let's get started
					</Button>
				</div>
			)}
			{onboarded && (
				<>
					<SearchBar />
					{emails.map((email) => (
						<EmailComponent key={email.thread_id} email={email} />
					))}
				</>
			)}
			{!!onboarded && !onboarding && !emails.length && <EmptyThreads />}
		</div>
	);
};

export default Dashboard;
