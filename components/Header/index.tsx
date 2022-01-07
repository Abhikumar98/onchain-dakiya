import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Account from "../Account";
import Button from "../Button";
import { Logo, Send } from "../Icons";
const ComposeEmail = dynamic(() => import("../ComposeEmail"), {
	ssr: false,
});

declare let window: any;

const Header = () => {
	const [open, setOpen] = React.useState(false);

	const router = useRouter();

	const showComposeEmailSection = () => {
		setOpen(true);
	};

	return (
		<header className="bg-primaryBackground drop-shadow-md">
			<div className="mx-auto px-4 lg:px-40">
				<div className="flex items-center justify-between py-5">
					<div className="flex lg:px-0">
						<div className="flex-shrink-0 flex items-center">
							<Link href="/">
								<div className="flex items-center">
									<Logo />
								</div>
							</Link>
						</div>
					</div>
					<div className="flex space-x-6 items-center">
						<Button
							onClick={showComposeEmailSection}
							icon={<Send />}
						>
							Send Dak
						</Button>
						<Account />
					</div>
				</div>
			</div>
			<ComposeEmail open={open} onClose={() => setOpen(false)} />
		</header>
	);
};

export default Header;
