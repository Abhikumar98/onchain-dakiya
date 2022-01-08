import { ethers } from "ethers";

export const minimizeAddress = (
	address?: string,
	currUser?: string
): string => {
	if (!address) return "";

	if (address.toLowerCase() === currUser?.toLowerCase()) return "you";
	return (
		address.substring(0, 6) + "..." + address.substring(address.length - 4)
	);
};

// export const aesEncrypt = async (
// 	plaintext: string,
// 	key: string,
// 	iv: string
// ) => {
// 	const ec = new TextEncoder();

// 	const ciphertext = await window.crypto.subtle.encrypt(
// 			name: "AES-CBC",
// 			iv,
// 		key,
// 		ec.encode(plaintext)
// 	);

// 	return {
// 		iv,
// 		ciphertext,
// 	};
// };

// export const aesDecrypt = async (
// 	ciphertext: string,
// 	key: string,
// 	iv: string
// ) => {
// 	const dec = new TextDecoder();
// 	const plaintext = await window.crypto.subtle.decrypt(
// 		{
// 			name: "AES-CBC",
// 			iv,
// 		},
// 		key,
// 		ciphertext
// 	);

// 	return dec.decode(plaintext);
// };
