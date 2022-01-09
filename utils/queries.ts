import { uuid } from "uuidv4";
import axios from "axios";
// const { subtle, getRandomValues } = require("crypto").webcrypto;

import { AES, enc } from "crypto-js";
import {
	contract,
	decryptMessage,
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

async function generateAesKey() {
	const key = await window.crypto.subtle.generateKey(
		{
			name: "AES-CBC",
			length: 128,
		},
		true,
		["encrypt", "decrypt"]
	);

	const iv = window.crypto.getRandomValues(new Uint8Array(16));

	return { key, iv };
}

export const saveMessageOnIPFS = async (
	sender: string,
	receiver: string,
	subject: string,
	message: string
): Promise<any> => {
	console.log({ sender, receiver });
	const [senderPubEncKey, receiverPubEncKey] = await contract().getPubEncKeys(
		receiver
	);

	const dataToEncrypt = JSON.stringify({
		message,
		subject,
	});

	const encryptionKey = uuid();
	const encryptedData = AES.encrypt(dataToEncrypt, encryptionKey).toString();

	const senderPubKeyEnc = await encryptMessage(
		encryptionKey,
		senderPubEncKey
	);

	const receiverPubKeyEnc = await encryptMessage(
		encryptionKey,
		receiverPubEncKey
	);

	const formattedData = JSON.stringify(encryptedData);

	const ipfsHash = await uploadToIPFS(formattedData);

	const response = await contract().sendMessage(
		0,
		ipfsHash,
		receiver,
		senderPubKeyEnc,
		receiverPubKeyEnc
	);
	return response;
};
