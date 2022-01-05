import React from "react";
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
			<div>
				<SubjectHeader />
				<ThreadMessage />
				<ThreadMessage />
				<ThreadMessage />
				<ThreadMessage />
				<ThreadMessage />
			</div>
		</>
	);
};

export default Profile;
