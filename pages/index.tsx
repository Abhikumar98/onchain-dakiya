import React from "react";
import EmailComponent from "../components/EmailComponent";
import SearchBar from "../components/SearchBard";

declare let window: any;

const Dashboard: React.FC = () => {
	return (
		<div className="space-y-4">
			<SearchBar />
			<div className="text-primaryText">Today</div>
			<EmailComponent />
			<div className="text-primaryText">Yesterday</div>
			<EmailComponent />
			<EmailComponent />
			<EmailComponent />
			<EmailComponent />
			<div className="text-primaryText">21 Dec, 2021</div>
			<EmailComponent />
		</div>
	);
};

export default Dashboard;
