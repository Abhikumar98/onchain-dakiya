import Blockies from "react-blockies";
import { useMoralis } from "react-moralis";
import { useMoralisData } from "../hooks/useMoralisData";

/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

function Blockie(props) {
	const { account, user } = useMoralisData();

	if (!props.address && !account)
		return <span className="h-12 w-12 bg-gray-500 inline-block"></span>;

	return (
		<Blockies
			size={props.size ?? 12}
			seed={
				props.currentWallet
					? account.toLowerCase()
					: props.address?.toLowerCase()
			}
			className="rounded-full"
		/>
	);
}

export default Blockie;
