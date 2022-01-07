import axios from "axios";
// import { create } from "ipfs-http-client";
import { contract, getPublicEncryptionKey } from "./crypto";

// export const ipfsI = create({
// 	host: "ipfs.infura.io",
// 	port: 5001,
// 	protocol: "https",
// });

export const fetchMessages = async (
	limit: number,
	page: number
): Promise<any> => {
	const response = await axios.post(
		"https://api.thegraph.com/subgraphs/name/anoushk1234/onchain-dakiya",
		{
			query: `{
                messages(first: ${limit}, ) {
                    id
                    messageCount
                    msg_id
                    _receiver
                    _uri
                }
        }`,
		}
	);

	console.log(response.data);

	return response.data.data.messages;
};

export const getAllUserMessages = async (address: string): Promise<any> => {
	console.log({ address });

	if (!address) return null;

	const response = await contract().allMessages(address);
	return response;
};

export const saveMessageOnIPFS = async (
	sender: string,
	receiver: string,
	subject: string,
	message: string
): Promise<any> => {
	const dataToEncrypt = JSON.stringify({
		message,
		subject,
	});

	await getPublicEncryptionKey(sender);

	const encryptionKey = ""; // generate a encryption key

	const encryptedData = dataToEncrypt; // encrypt dataToEncrypt
	const senderPubKeyEnc = ""; // encrypt senderPubKey
	const receiverPubKeyEnc = ""; // encrypt receiverPubKey

	const formattedData = JSON.stringify({
		senderKey: senderPubKeyEnc,
		receiverKey: receiverPubKeyEnc,
		data: encryptedData,
	});

	// const buffer = Buffer.from("hello");

	// console.log({ buffer });

	// const result = await ipfsI.add(buffer);

	// const ipfsIHash = result.cid.toString();

	// const res = await ipfsI.get(`/${}`);
	// console.log({ res, ipfsIHash });

	const response = await contract().sendMessage("ipfsIHash", receiver);
	return response;
};
