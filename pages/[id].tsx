import React from "react";
import ReplyBar from "../components/ReplyBar";
import SubjectHeader from "../components/SubjectHeader";
import ThreadMessage from "../components/ThreadMessage";
import { Group, Transaction } from "../contracts";

declare let window: any;

export interface ProfileProps {
	transactions: Transaction[];
	profileAddress: string;
	ens?: string;
	avatar?: string;
	group?: Group;
}

const Profile: React.FC<ProfileProps> = ({
	transactions: allTransactions,
	profileAddress,
	ens,
	avatar: defaultAvatar,
	group,
}) => {
	return (
		<>
			<div className="relative">
				<SubjectHeader />
				<ThreadMessage />
				<ThreadMessage />
				<ThreadMessage />
				<ThreadMessage />
				<ThreadMessage />
				<ThreadMessage />
				<ThreadMessage />
				<ThreadMessage />
				<ThreadMessage />
				<ThreadMessage />
				<ReplyBar />
			</div>
		</>
	);
};

export default Profile;
