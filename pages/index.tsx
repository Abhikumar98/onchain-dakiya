import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../components/Button";
import ThreadComponent from "../components/ThreadComponent";
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

	const [emails, setEmails] = React.useState<EmailThread[]>([]);
	const [onboarding, setOnboarding] = React.useState<boolean>(false);
	const [onboarded, setOnboarded] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);

	const checkIfOnboarded = async (address: string) => {
		try {
			setOnboarding(true);

			const response = await contract().checkUserRegistration();

			setOnboarded(!!response);
		} catch (error) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		} finally {
			setOnboarding(false);
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
			setLoading(true);
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
		} finally {
			setLoading(false);
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
			{loading || onboarding ? (
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
					{!onboarded && (
						<div className="w-2/5 bg-primaryBackground rounded-md p-4 space-y-4 text-primaryText text-xl break-all m-auto flex justify-center flex-col items-center my-8">
							<Lock />
							<div>
								Hurray 🎉, You have successfully made it! Now we
								just need password encryption key to get you
								started.
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
								<ThreadComponent
									key={email.thread_id}
									email={email}
								/>
							))}
						</>
					)}
					{!!onboarded && !onboarding && !emails.length && (
						<EmptyThreads />
					)}
				</>
			)}
		</div>
	);
};

export default Dashboard;
