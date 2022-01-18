import { useChain } from "react-moralis";

const useAppChain = (): {
	readonly requiredChain: boolean;
	readonly switchETHNetwork: () => void;
} => {
	const { chainId, switchNetwork } = useChain();

	const rinkebyCheck =
		process.env.NODE_ENV === "development" ||
		process.env.NEXT_PUBLIC_RINKEBY;

	const switchETHNetwork = () => {
		rinkebyCheck ? switchNetwork("0x4") : switchNetwork("0x1");
	};

	const requiredChain = rinkebyCheck ? chainId === "0x4" : chainId === "0x1";

	return { requiredChain, switchETHNetwork };
};

export default useAppChain;
