import { useChain } from "react-moralis";

const useAppChain = (): {
	readonly requiredChain: boolean;
	readonly switchETHNetwork: () => void;
} => {
	const { chainId, switchNetwork } = useChain();

	const switchETHNetwork = () => {
		process.env.NODE_ENV === "development"
			? switchNetwork("0x4")
			: switchNetwork("0x1");
	};

	const requiredChain =
		process.env.NODE_ENV === "development"
			? chainId === "0x4"
			: chainId === "0x1";

	return { requiredChain, switchETHNetwork };
};

export default useAppChain;
