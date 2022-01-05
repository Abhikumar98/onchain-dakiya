/* This example requires Tailwind CSS v2.0+ */
import { FC, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Button from "../Button";
import { Send } from "../Icons";

interface IComposeEmail {
	readonly open: boolean;
	readonly onClose: () => void;
}

const ComposeEmail: FC<IComposeEmail> = ({ open, onClose }) => {
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="fixed z-10 inset-0 overflow-y-auto"
				onClose={onClose}
			>
				<div className="flex items-end justify-end min-h-screen pt-4 px-4 pb-4 text-center sm:block sm:p-0">
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
					<span
						className="hidden sm:inline-block sm:align-middle sm:h-screen"
						aria-hidden="true"
					>
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
						<div className="modal-dimensions w-2/5 inline-block align-bottom bg-primaryBackground rounded-lg p-6 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
							<div className="mb-4 sm:mt-5">
								<Dialog.Title
									as="h3"
									className="text-xl font-medium text-primaryText"
								>
									Compose mail
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
										type="text"
										name="to"
										id="to"
										className="block w-full pl-12 sm:pl-14 sm:text-sm border-transparent bg-messageHover rounded-md"
										placeholder="Address or ens"
									/>
								</div>
								<div className="mt-1 relative rounded-md shadow-sm">
									<input
										type="text"
										name="to"
										id="to"
										className="block w-full sm:text-sm border-transparent bg-messageHover rounded-md"
										placeholder="Subject"
									/>
								</div>
								<div className="mt-1 relative rounded-md shadow-sm">
									<textarea
										rows={12}
										name="comment"
										id="comment"
										className="shadow-sm block w-full sm:text-sm border-transparent bg-messageHover rounded-md"
										defaultValue={""}
										placeholder="Add message"
									/>
								</div>
								<Button
									fullWidth
									className="justify-center"
									icon={<Send />}
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
