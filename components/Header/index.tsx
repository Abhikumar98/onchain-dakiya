import Link from "next/link";
import React from "react";
import Account from "../Account";
import Button from "../Button";
import { Logo, Send } from "../Icons";

const Header = () => {
	return (
		<header className="bg-primaryBackground drop-shadow-md">
			<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
				<div className="flex items-center justify-between py-5">
					<div className="flex px-2 lg:px-0">
						<div className="flex-shrink-0 flex items-center">
							<Link href="/">
								<div className="flex items-center">
									<Logo /> Dakiya
								</div>
							</Link>
						</div>
					</div>
					<div className="flex space-x-6 items-center">
						<Button icon={<Send />}>Send Dak</Button>
						<Account />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
