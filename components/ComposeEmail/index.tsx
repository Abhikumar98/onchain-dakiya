/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import { useChain } from "react-moralis";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import useAppChain from "../../hooks/useAppChain";
import { useMoralisData } from "../../hooks/useMoralisData";
import { listenEvents } from "../../utils/crypto";
import { saveMessageOnIPFS } from "../../utils/queries";
import Button from "../Button";
import { Eth, Polygon, Send, Shield } from "../Icons";

interface IComposeEmail {
	readonly open: boolean;
	readonly onClose: () => void;
}

const ComposeEmail: FC<IComposeEmail> = ({ open, onClose }) => {
	const { account } = useMoralisData();
	const toastId = useRef(null);

	const [to, setTo] = useState("");
	const [subject, setSubject] = useState("");
	const [body, setBody] = useState("");
	const [loading, setLoading] = useState<boolean>(false);
	const { chainId } = useAppChain();
	const { switchNetwork } = useChain();

	const handleClose = () => {
		setTo("");
		setSubject("");
		setBody("");
		onClose();
	};
	const handleSendEmail = async () => {
		try {
			setLoading(true);
			await saveMessageOnIPFS(account, to, subject, body, chainId);
			handleClose();
			toastId.current = toast.loading("Sending message", {
				position: "bottom-left",
			});
			listenEvents(chainId).on("MessageSent", (...params) => {
				toast.update(toastId.current, {
					type: toast.TYPE.SUCCESS,
					render: "Email sent successfully",
					autoClose: 5000,
					isLoading: false,
					draggable: true,
				});
			});
		} catch (error) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	toast.update("e4jstyb3t", {
		type: "success",
	});

	useEffect(() => {
		ReactTooltip.rebuild();
	}, [open]);

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="fixed z-10 inset-0 overflow-y-auto"
				onClose={handleClose}
			>
				<div className="flex items-end justify-end min-h-screen pt-4 px-4 pb-4 text-center">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:h-screen" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="modal-dimensions w-full md:w-3/5 lg:w-1/2 xl:w-2/5 inline-block bg-primaryBackground rounded-lg p-6 text-left overflow-hidden shadow-xl transform transition-all">
							<div className="mb-4 sm:mt-5">
								<Dialog.Title
									as="h3"
									className="text-xl font-medium text-primaryText flex items-center justify-between"
								>
									Compose mail
									<div className="flex items-center space-x-4">
										<div
											className="text-sm p-2 rounded-lg hover:bg-white bg-none transition-all ease-in-out hover:text-black cursor-pointer border-white border"
											onClick={() =>
												switchNetwork(
													chainId === "0x1"
														? "0x89"
														: "0x1"
												)
											}
										>
											Switch to{" "}
											{chainId === "0x89"
												? "ETH"
												: "Polygon"}
										</div>
										{chainId === "0x1" ? (
											<Eth />
										) : (
											<Polygon />
										)}
									</div>
								</Dialog.Title>
							</div>
							<div className="mt-5 sm:mt-6 space-y-4 text-primaryText">
								<div className="mt-1 relative rounded-md shadow-sm">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<span className="text-gray-500 sm:text-sm">
											To:
										</span>
									</div>
									<input
										value={to}
										onChange={(e) => setTo(e.target.value)}
										type="text"
										name="to"
										id="to"
										className="block w-full pl-12 sm:pl-14 sm:text-sm border-transparent bg-messageHover rounded-md"
										placeholder="Address or ens"
									/>
									{/* <div
										className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
										data-tip="Unsecure"
									>
										<Shield />
									</div> */}
								</div>
								<div className="mt-1 relative rounded-md shadow-sm">
									<input
										value={subject}
										onChange={(e) =>
											setSubject(e.target.value)
										}
										type="text"
										name="to"
										id="to"
										className="block w-full sm:text-sm border-transparent bg-messageHover rounded-md"
										placeholder="Subject"
									/>
								</div>
								<div className="mt-1 relative rounded-md shadow-sm">
									<textarea
										value={body}
										onChange={(e) =>
											setBody(e.target.value)
										}
										rows={12}
										name="comment"
										id="comment"
										className="shadow-sm block w-full sm:text-sm border-transparent bg-messageHover rounded-md"
										placeholder="Add message"
									/>
								</div>
								<Button
									loading={loading}
									fullWidth
									className="justify-center"
									icon={<Send />}
									onClick={handleSendEmail}
								>
									Send Dak
								</Button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default ComposeEmail;
