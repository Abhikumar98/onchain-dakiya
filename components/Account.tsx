import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { AuthenticateOptions } from "react-moralis/lib/hooks/core/useMoralis/_useMoralisAuth";
import { toast } from "react-toastify";
import { getEllipsisTxt } from "../helpers/formatters";
import { getExplorer } from "../helpers/networks";
import { useMoralisData } from "../hooks/useMoralisData";
import { contract, getPublicEncryptionKey } from "../utils/crypto";
import { useEnsAddress } from "../utils/useEnsAddress";
import Blockie from "./Blockie";
import Loader from "./Loader";

function Account() {
	const {
		authenticate,
		account: walletAddress,
		user,
		chainId,
		logout,
	} = useMoralisData();

	const [loading, setLoading] = useState(false);

	const queriedAddress = user?.get("ethAddress");
	const account = walletAddress ?? queriedAddress;

	const { name: ensAddress, avatar } = useEnsAddress(account);

	const handleAuth = async () => {
		try {
			setLoading(true);
			const options: AuthenticateOptions = {
				signingMessage: `
					Get your audience support with crypto!\n
					With BuyMeACryptoCoffee your audience can support you with cryptocurrency.\n
					How does it work?\n
					- Supporter connects their Wallet on Crypto Coffee
					- They enter their favorite creator’s wallet address and donate crypto.
					- Creators can create their own crypto coffee page and share with their audience too
				`,
				chainId: process.env.NODE_ENV === "development" ? 4 : 1,
			};

			if (!(window as any).ethereum) {
				options.provider = "walletconnect";
			}

			await authenticate(options);
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const checkForRegistration = async (address: string) => {
		try {
			const response = await contract().checkUserRegistration();
			if (response === false) {
				console.log({ address });
				const key = await getPublicEncryptionKey(address);
				await contract().setPubEncKey(key);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (account) {
			checkForRegistration(account);
		}
	}, [account]);

	if (loading) {
		return (
			<div className=" bg-gray-200 rounded-lg px-2 py-3 w-48 flex justify-center">
				<Loader />
			</div>
		);
	}

	if (!account) {
		return (
			<button
				type="button"
				onClick={handleAuth}
				className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cryptopurple hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cryptopurple"
			>
				Connect Wallet
			</button>
		);
	}

	return (
		<>
			<Menu as="div" className="relative inline-block text-left z-40">
				<div>
					<div className=" cursor-default inline-flex justify-center items-center space-x-2 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-transparent text-primaryText text-sm font-medium">
						{!!avatar && (
							<img src={avatar} className="h-6 w-6 rounded-lg" />
						)}
						{!avatar && <Blockie currentWallet scale={3} />}
						<p className="hidden md:block">
							{ensAddress || getEllipsisTxt(account, 6)}
						</p>
						<div onClick={logout}>SIGN OUT</div>
					</div>
				</div>

				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
						<div className="py-1 z-20"></div>
					</Menu.Items>
				</Transition>
			</Menu>
		</>
	);
}

export default Account;
