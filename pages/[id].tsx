import React, { useEffect } from "react";
import ReplyBar from "../components/ReplyBar";
import SubjectHeader from "../components/SubjectHeader";
import ThreadMessage from "../components/ThreadMessage";
import { useMoralisData } from "../hooks/useMoralisData";
import { getPublicEncryptionKey } from "../utils/crypto";

declare let window: any;

export interface ProfileProps {
	profileAddress: string;
	ens?: string;
	avatar?: string;
}

const Profile: React.FC<ProfileProps> = ({}) => {
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
