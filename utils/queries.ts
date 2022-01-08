import { uuid } from "uuidv4";
import axios from "axios";
import { AES } from "crypto-js";
import {
	contract,
	encryptMessage,
	getPublicEncryptionKey,
	uploadToIPFS,
} from "./crypto";

export const fetchMessages = async (
	account: string,
	limit: number
	// page: number
): Promise<any> => {
	const response = await axios.post(
		"https://api.thegraph.com/subgraphs/name/anoushk1234/onchain-dakiya",
		{
			query: `{
                messages(first: ${limit}) {
                    id
                    _receiver
					_sender
                    _uri
					_timestamp
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

	const encryptionKey = uuid();
	const encryptedData = AES.encrypt(dataToEncrypt, encryptionKey);

	const senderPubKey = await getPublicEncryptionKey(sender);
	const receiverPubKey = await getPublicEncryptionKey(receiver);

	console.log({ encryptionKey, encryptedData });

	const senderPubKeyEnc = await encryptMessage(encryptionKey, senderPubKey);

	console.log({ senderPubKeyEnc });

	const receiverPubKeyEnc = encryptMessage(encryptionKey, receiverPubKey);

	const formattedData = JSON.stringify(encryptedData);

	const ipfsHash = await uploadToIPFS(formattedData);

	const sendContractMessage = {
		_thread_id: 0,
		_uri: ipfsHash,
		_receiver: receiver,
		_sender_key: senderPubKeyEnc,
		_receiver_key: receiverPubKeyEnc,
	};

	console.log({ sendContractMessage });

	// const response = await contract().sendMessage(sendContractMessage);
	return "response";
};
