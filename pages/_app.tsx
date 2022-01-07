import "antd/dist/antd.css";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import React from "react";
import { MoralisProvider } from "react-moralis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import "tailwindcss/tailwind.css";
import Header from "../components/Header";
import MetaHead from "../components/MetaHead";
import "./globals.css";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	// const client = new ApolloClient({
	// 	uri: "https://api.thegraph.com/subgraphs/name/anoushk1234/onchain-dakiya",
	// 	cache: new InMemoryCache(),
	// });

	return (
		<MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
			<NextNProgress height={7} color="#9366F9" />
			<MetaHead />
			<Head key="main-head">
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<Header />
			<div className="app-container">
				<Component {...pageProps} />
			</div>
			<ToastContainer />
			<ReactTooltip effect="solid" />
		</MoralisProvider>
	);
}

export default MyApp;
