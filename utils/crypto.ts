import { encrypt } from "@metamask/eth-sig-util";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import { AuthenticateOptions } from "react-moralis/lib/hooks/core/useMoralis/_useMoralisAuth";
import abi from "./abi.json";

declare let window: any;

export const handleAuth = async (authenticate) => {
	const options: AuthenticateOptions = {
		signingMessage: `Connect with Dakiya`,
		chainId: process.env.NODE_ENV === "development" ? 4 : 1,
	};

	if (!(window as any).ethereum) {
		options.provider = "walletconnect";
	}

	await authenticate(options);
};

export interface ENSResponse {
	address?: string | null;
	name?: string | null;
	avatar?: string | null;
	error?: string | null;
}
export const validateAndResolveAddress = async (
	userAddress: string,
	provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
): Promise<ENSResponse | undefined> => {
	try {
		let address, name, avatar;

		if (userAddress.includes(".")) {
			const ensResolver = await provider.resolveName(userAddress);

			if (!ensResolver) {
				// toast.error("This address is not valid");
				// throw new Error("This address is not valid");
				console.warn("No ens resolver found for this address");
				return;
			}

			address = ensResolver;
			name = userAddress;
		}

		if (!userAddress.includes(".")) {
			ethers.utils.getAddress(userAddress);

			name = await provider.lookupAddress(userAddress);

			address = userAddress;
		}

		if (name) {
			avatar = await provider.getAvatar(name);
		}

		return { address, name, avatar };
	} catch (error) {
		console.error(error);
		return {};
	}
};

const contractABI = abi;

export const getContractDetails = (
	chainId: string
): {
	contractAddress: string;
	contractABI: any;
	subgraphURL: string;
} => {
	if (!chainId) {
		throw new Error("No chainId provided");
	}

	let contractAddress: string = "";
	let subgraphURL: string = "";

	const rinkebyContract = "0x355039B35222ea3E5eCbddfa0400BfC78E1ACEEf";
	const polygonContract = "0x4995ff34079d59a0dfd345dc95145f0159fd6c1e";
	const ethereumContract = "0x0761e0a5795be98fe806fa741a88f94ebec76c2b";

	if (chainId === "0x4") {
		contractAddress = rinkebyContract;
		subgraphURL =
			"https://api.thegraph.com/subgraphs/name/anoushk1234/dakiya-rinkeby";
	} else if (chainId === "0x89") {
		contractAddress = polygonContract;
		subgraphURL =
			"https://api.thegraph.com/subgraphs/name/anoushk1234/dakiya-polygon";
		console.log({ subgraphURL });
	} else if (chainId === "0x1") {
		contractAddress = ethereumContract;
		subgraphURL =
			"https://api.thegraph.com/subgraphs/name/anoushk1234/onchain-dakiya";
	}

	return {
		contractAddress,
		contractABI,
		subgraphURL,
	};
};

export const listenEvents = (chainId: string) => {
	const { contractABI, contractAddress } = getContractDetails(chainId);
	const provider = new ethers.providers.Web3Provider(window.ethereum);

	const { ethereum } = window;
	if (ethereum) {
		const contractReader = new ethers.Contract(
			contractAddress,
			contractABI,
			provider
		);
		return contractReader;
	}
};

export const contract = (chainId: string) => {
	console.log(
		"🚀 ~ file: crypto.ts ~ line 126 ~ contract ~ chainId",
		chainId
	);
	const { contractABI, contractAddress } = getContractDetails(chainId);
	console.log({ contractAddress, chainId });
	const provider = new ethers.providers.Web3Provider(window.ethereum);

	const { ethereum } = window;
	if (ethereum) {
		const signer = provider.getSigner();
		const contractReader = new ethers.Contract(
			contractAddress,
			contractABI,
			signer
		);
		return contractReader;
	}
};

export const getPublicEncryptionKey = async (
	account: string
): Promise<string | null> => {
	const { ethereum } = window;

	if (ethereum) {
		const pubEncryptionKey = await ethereum.request({
			method: "eth_getEncryptionPublicKey",
			params: [account],
		});

		return pubEncryptionKey;
	}

	return null;
};

export const encryptMessage = async (
	message: string,
	publicKey: string
): Promise<string> => {
	const encryptedData = encrypt({
		publicKey,
		data: message,
		version: "x25519-xsalsa20-poly1305",
	});
	const hexValue = ethers.utils.hexlify(
		Buffer.from(JSON.stringify(encryptedData))
	);
	return hexValue;
};

export const decryptMessage = async (cipherText: string): Promise<string> => {
	const { ethereum } = window;

	if (ethereum) {
		const decryptedData = await ethereum.request({
			method: "eth_decrypt",
			params: [cipherText, ethereum.selectedAddress],
		});
		return decryptedData;
	}
};

export const ipfs = create({
	host: "ipfs.infura.io",
	port: 5001,
	protocol: "https",
});

export const uploadToIPFS = async (message: string): Promise<string> => {
	const buffer = Buffer.from(message);
	console.log({ buffer });
	const result = await ipfs.add(buffer);
	const ipfsHash = result.cid.toString();
	return ipfsHash;
};

export const fetchFromIPFS = async (uri: string): Promise<string> => {
	const result = await fetch(`https://ipfs.io/ipfs/${uri}`);
	const text = await result.text();
	return text;
};
