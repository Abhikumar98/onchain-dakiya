import React from "react";
import useAppChain from "../../hooks/useAppChain";
import Button from "../Button";
import { Warning } from "../Icons";

const ChainWrapper: React.FC = ({ children }) => {
	const { requiredChain, switchETHNetwork } = useAppChain();

	return requiredChain ? (
		<>{children}</>
	) : (
		<div className="w-96 bg-primaryBackground rounded-md p-4 space-y-4 text-primaryText text-xl break-words m-auto flex justify-center flex-col items-center my-8">
			<Warning />
			<div className="text-center">You are not connected to Mainnet</div>
			<div className="text-sm text-center text-secondaryText">
				Your wallet is connected to a different network. Please switch
				to the Ethereum Mainnet to continue.
			</div>
			<Button
				onClick={switchETHNetwork}
				fullWidth
				className="flex justify-center"
			>
				Switch Network
			</Button>
		</div>
	);
};

export default ChainWrapper;
