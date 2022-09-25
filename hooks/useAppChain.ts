import { useChain } from "react-moralis";

const useAppChain = (): {
	readonly requiredChain: boolean;
	readonly switchETHNetwork: () => void;
	readonly chainId: string;
} => {
	const { chainId, switchNetwork } = useChain();

	const rinkebyCheck =
		process.env.NODE_ENV === "development"
			? true
			: process.env.NEXT_PUBLIC_RINKEBY;

	const switchETHNetwork = () => {
		rinkebyCheck ? switchNetwork("0x4") : switchNetwork("0x89");
	};

	const requiredChain = rinkebyCheck
		? true
		: ["0x1", "0x89"].includes(chainId);

	return { requiredChain, switchETHNetwork, chainId };
};

export default useAppChain;
