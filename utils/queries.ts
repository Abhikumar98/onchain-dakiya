import axios from "axios";
// const { subtle, getRandomValues } = require("crypto").webcrypto;
import { AES, enc } from "crypto-js";
import { uuid } from "uuidv4";
import { contract, encryptMessage, uploadToIPFS } from "./crypto";

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

	return response.data.data.messages;
};

export const getAllUserThreads = async (address: string): Promise<any> => {
	if (!address) return null;

	const response = await axios.post(
		"https://api.thegraph.com/subgraphs/name/anoushk1234/onchain-dakiya",
		{
			query: `{
                threads(first: ${50}, where: { _receiver: "${address}" }) {
                    id
                    _receiver
					_sender
					_thread_id
					_timestamp
                }
        }`,
		}
	);

	return response.data.data.threads;
};
export const getThread = async (threadId: string): Promise<any> => {
	const response = await axios.post(
		"https://api.thegraph.com/subgraphs/name/anoushk1234/onchain-dakiya",
		{
			query: `{
                threads(where: { _thread_id: "${threadId}" }) {
                    id
                    _receiver
					_sender
					_thread_id
					_timestamp
					_sender_key
					_receiver_key
                }
        }`,
		}
	);

	return response.data.data.threads[0];
};

export const getAllThreadMessages = async (threadId: string): Promise<any> => {
	const response = await axios.post(
		"https://api.thegraph.com/subgraphs/name/anoushk1234/onchain-dakiya",
		{
			query: `{
                messages(first: ${100}, where: { _thread_id: ${threadId} }) {
                    id
                    _receiver
					_sender
					_thread_id
					_timestamp
					_uri
                }
        }`,
		}
	);

	return response.data.data.messages;
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

export const decryptCipherMessage = (
	message: string,
	encKey: string
): string => {
	return AES.decrypt(message, encKey).toString(enc.Utf8);
};

export const saveMessageOnIPFS = async (
	sender: string,
	receiver: string,
	subject: string,
	message: string
): Promise<any> => {
	const [senderPubEncKey, receiverPubEncKey] = await contract().getPubEncKeys(
		receiver
	);

	const dataToEncrypt = JSON.stringify({
		message,
		subject,
	});

	const encryptionKey = uuid();
	const encryptedData = AES.encrypt(dataToEncrypt, encryptionKey).toString();
	const decryptedData = AES.decrypt(dataToEncrypt, encryptionKey).toString();

	const senderPubKeyEnc = await encryptMessage(
		encryptionKey,
		senderPubEncKey
	);

	const receiverPubKeyEnc = await encryptMessage(
		encryptionKey,
		receiverPubEncKey
	);

	const ipfsHash = await uploadToIPFS(encryptedData);

	const response = await contract().sendMessage(
		0,
		ipfsHash,
		receiver,
		senderPubKeyEnc,
		receiverPubKeyEnc
	);
	return response;
};
