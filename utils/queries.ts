import axios from "axios";
// const { subtle, getRandomValues } = require("crypto").webcrypto;
import { AES, enc } from "crypto-js";
import { uuid } from "uuidv4";
import { contract, encryptMessage, uploadToIPFS } from "./crypto";

const graphEndpoint =
	process.env.NEXT_PUBLIC_RINKEBY || process.env.NODE_ENV === "development"
		? "https://api.thegraph.com/subgraphs/name/anoushk1234/dakiya-rinkeby"
		: "https://api.thegraph.com/subgraphs/name/anoushk1234/onchain-dakiya";

export const fetchMessages = async (
	account: string,
	limit: number
	// page: number
): Promise<any> => {
	const response = await axios.post(graphEndpoint, {
		query: `{
                messages(first: ${limit}) {
                    id
                    _receiver
					_sender
                    _uri
					_timestamp
                }
        }`,
	});

	return response.data.data.messages;
};

export const getAllUserThreads = async (address: string): Promise<any> => {
	if (!address) return null;

	const response = await axios.post(graphEndpoint, {
		query: `{
                threads(first: ${50}, where: { _receiver: "${address}" }) {
                    id
                    _receiver
					_sender
					_thread_id
					_timestamp
					encrypted
                }
        }`,
	});

	return response.data.data.threads;
};

export const getAllUserSentThreads = async (address: string): Promise<any> => {
	if (!address) return null;

	const response = await axios.post(graphEndpoint, {
		query: `{
                threads(first: ${50}, where: { _sender: "${address}" }) {
                    id
                    _receiver
					_sender
					_thread_id
					_timestamp
					encrypted
                }
        }`,
	});

	return response.data.data.threads;
};
export const getThread = async (threadId: string): Promise<any> => {
	const response = await axios.post(graphEndpoint, {
		query: `{
                threads(where: { _thread_id: "${threadId}" }) {
                    id
                    _receiver
					_sender
					_thread_id
					_timestamp
					_sender_key
					_receiver_key
					encrypted
                }
        }`,
	});

	return response.data.data.threads[0];
};

export const getAllThreadMessages = async (threadId: string): Promise<any> => {
	const response = await axios.post(graphEndpoint, {
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
	});

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
		encrypted: !!receiverPubEncKey,
	});

	const encryptionKey = uuid();
	const encryptedData = !!receiverPubEncKey
		? AES.encrypt(dataToEncrypt, encryptionKey).toString()
		: dataToEncrypt;

	const senderPubKeyEnc = !!receiverPubEncKey
		? await encryptMessage(encryptionKey, senderPubEncKey)
		: "";

	const receiverPubKeyEnc = !!receiverPubEncKey
		? await encryptMessage(encryptionKey, receiverPubEncKey)
		: "";

	const ipfsHash = await uploadToIPFS(encryptedData);

	console.log({
		ipfsHash,
		receiver,
		senderPubEncKey,
		receiverPubEncKey,
		senderPubKeyEnc,
		receiverPubKeyEnc,
		a: receiverPubEncKey,
		encryptedData,
	});

	const response = await contract().sendMessage(
		0,
		ipfsHash,
		receiver,
		senderPubKeyEnc,
		receiverPubKeyEnc,
		!!receiverPubEncKey
	);
	return response;
};

export const threadReply = async (
	receiver: string,
	message: string,
	threadId: string,
	encryptionKey: string,
	senderPubEncKey: string,
	receiverPubEncKey: string,
	encrypt: boolean
) => {
	const dataToEncrypt = JSON.stringify({
		message,
	});
	const encryptedData = encrypt
		? AES.encrypt(dataToEncrypt, encryptionKey).toString()
		: dataToEncrypt;
	const ipfsHash = await uploadToIPFS(encryptedData);

	console.log({
		threadId,
		ipfsHash,
		receiver,
		senderPubEncKey,
		receiverPubEncKey,
	});

	await contract().sendMessage(
		threadId,
		ipfsHash,
		receiver,
		senderPubEncKey,
		receiverPubEncKey,
		encrypt
	);
};

export const getLatestMessage = async (threadId: string): Promise<any> => {
	const response = await axios.post(graphEndpoint, {
		query: `{
					messages(
						where:{ _thread_id: ${threadId} },
						orderBy:_timestamp,
						orderDirection: desc,
						first:1) {
							id
							_receiver
							_uri
							_timestamp
						}
					}

		`,
	});
	return response.data.data.messages[0];
};

/**
 * {
    "ipfsHash": "Qmf54WzpBHrQB7Eisk6GrYveovtfAXswhxSFAr7MWy3KKg",
    "receiver": "0xAD6561E9e306C923512B4ea7af902994BEbd99B8",
    "senderPubKeyEnc": "0x7b2276657273696f6e223a227832353531392d7873616c736132302d706f6c7931333035222c226e6f6e6365223a22507761746175756772764d70436a3363644c5563637a7262666f317333485351222c22657068656d5075626c69634b6579223a224c6a32587759547a777534462b383868737a493572755448444375455944532f4d516b6b69434a323478673d222c2263697068657274657874223a224b314654416e6647774f2b3364564742747a62374e42334467636474795564316a4f2f642f4b5769794937754f416253576f556a41596d4847562f2b706458586c436c4656673d3d227d",
    "receiverPubKeyEnc": "0x7b2276657273696f6e223a227832353531392d7873616c736132302d706f6c7931333035222c226e6f6e6365223a224e3471636d654b68336f656952534a77396f5a4c796e756a52452b336c353976222c22657068656d5075626c69634b6579223a224264526a726f49743469654e695842784d335a6e75545966356e6e4a66497a4c4331736268634b704f56673d222c2263697068657274657874223a22667078766a6144697873644636786a7773353343704a576f4b76354f30324d39626e6a654d417878654631464a3338702f393255334d677261564f6f6536367248622f6958673d3d227d"
}
 */
