import React, { FC } from "react";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import { useMoralisData } from "../../hooks/useMoralisData";
import { handleAuth } from "../../utils/crypto";
import Button from "../Button";
import { LandingHero, Logo } from "../Icons";

const AuthWrapper: FC = ({ children }) => {
	const { account, authenticate } = useMoralisData();

	// loading state
	const [loading, setLoading] = React.useState(false);

	const handleConnect = async () => {
		try {
			setLoading(true);
			await handleAuth(authenticate);
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return account ? (
		<>
			{children}
			<ReactTooltip id="tooltip" />
		</>
	) : (
		<div className="flex items-center flex-col justify-between h-screen w-screen bg-landing overflow-hidden">
			<div className="mt-24 flex items-center flex-col">
				<Logo logoClassName="h-14 w-14" hideText />
				<div className="mt-6 font-landing text-lg sm:text-3xl md:text-6xl font-bold flex flex-col items-center text-white">
					<span>Connect with your frens</span>
					<span>on-chain with Dakiya</span>
				</div>
				<div className="w-full md:w-96 mt-12">
					<Button
						loading={loading}
						onClick={handleConnect}
						disabled={loading}
						fullWidth
						className="justify-center"
					>
						Connect your wallet
					</Button>
				</div>
			</div>
			<div className="mt-10 hidden lg:block">
				<LandingHero />
			</div>
		</div>
	);
};

export default AuthWrapper;
