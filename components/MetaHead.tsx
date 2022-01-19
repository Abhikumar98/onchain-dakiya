import React from "react";
import Head from "next/head";
interface MetaHeadProps {
	title?: string;
	description?: string;
	url?: string;
}
const MetaHead: React.FC<MetaHeadProps> = ({ title, description, url }) => {
	title = title || "Send a message to another user, on chain";
	description =
		description ||
		"Using dakiya you can send messages to anyone with a wallet address, without having to create an account or relying on email servers";
	url = url || "https://dakiya.xyz";
	return (
		<Head>
			<title>Onchain Dakiya</title>
			<meta name="description" content={description} />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1"
			/>
			{/* add og tag */}
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta
				property="og:image"
				content="https://dakiya.xyz/ogimage.png"
			/>
			<meta property="og:url" content={url} />
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content={title} />
			<meta property="og:locale" content="en_US" />
			<meta property="og:locale:alternate" content="en_US" />
			{/* add twitter tag */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@buycryptocoffee" />
			<meta name="twitter:creator" content="@buycryptocoffee" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta
				name="twitter:image"
				content="https://dakiya.xyz/ogimage.png"
			/>
			<meta name="twitter:url" content={url} />
			<link
				rel="apple-touch-icon"
				sizes="60x60"
				href="/apple-touch-icon.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/favicon-16x16.png"
			/>
			<link rel="manifest" href="/site.webmanifest" />
			<link
				rel="mask-icon"
				href="/safari-pinned-tab.svg"
				color="#5bbad5"
			/>
			<link rel="image_src" href="/mstile-150x150.png" />
			<meta name="msapplication-TileColor" content="#da532c" />
			<meta name="theme-color" content="#ffffff"></meta>
		</Head>
	);
};
export default MetaHead;
