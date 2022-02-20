import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../components/Button";
import ChainWrapper from "../components/ChainWrapper";
import { Lock } from "../components/Icons";
import InboxThreads from "../components/InboxThreads";
import SentThreads from "../components/SentThreads";
import useAppChain from "../hooks/useAppChain";
import { useMoralisData } from "../hooks/useMoralisData";
import { contract, getPublicEncryptionKey } from "../utils/crypto";

declare let window: any;

const Dashboard: React.FC = () => {
	const { account, enableWeb3 } = useMoralisData();

	const [tab, setTab] = useState<"inbox" | "sent">("inbox");
	const [onboarding, setOnboarding] = React.useState<boolean>(false);
	const [onboarded, setOnboarded] = React.useState<boolean>(false);

	const { requiredChain, chainId } = useAppChain();

	const checkIfOnboarded = async (address: string) => {
		try {
			if (!requiredChain) {
				return;
			}

			setOnboarding(true);

			const response = await contract(chainId).checkUserRegistration();

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

			await contract(chainId).setPubEncKey(key);
			setOnboarded(true);
		} catch (error) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		} finally {
			setOnboarding(false);
		}
	};

	useEffect(() => {
		enableWeb3();
		if (account) {
			checkIfOnboarded(account);
		}
	}, [account, requiredChain]);

	return (
		<div className="space-y-4 relative w-full">
			<ChainWrapper>
				<>
					{onboarding ? (
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
								<div className="w-2/5 bg-primaryBackground rounded-md p-4 space-y-4 text-primaryText text-xl break-words m-auto flex justify-center flex-col items-center my-8">
									<Lock />
									<div>
										Hurray 🎉, You have successfully made
										it! Now we just need password encryption
										key to get you started.
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
							{!!onboarded && (
								<>
									<div className="flex space-x-8 w-full">
										<div
											className={`text-primaryText text-lg border-b-4 pb-1 px-8 cursor-pointer ${
												tab === "inbox"
													? " border-primary "
													: " border-transparent "
											}`}
											onClick={() => setTab("inbox")}
										>
											Inbox
										</div>
										<div
											className={`text-primaryText text-lg border-b-4 pb-1 px-8 cursor-pointer ${
												tab === "sent"
													? " border-primary "
													: " border-transparent "
											}`}
											onClick={() => setTab("sent")}
										>
											Sent
										</div>
									</div>
									{tab === "inbox" ? (
										<InboxThreads />
									) : (
										<SentThreads />
									)}
								</>
							)}
							{/* {!!onboarded && !onboarding && <EmptyThreads />} */}
						</>
					)}
				</>
			</ChainWrapper>
		</div>
	);
};

export default Dashboard;
