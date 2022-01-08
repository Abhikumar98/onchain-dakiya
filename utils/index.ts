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
