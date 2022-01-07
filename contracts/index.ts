export interface Email {
	readonly msg_id: string;
	readonly receiver: string;
	readonly sender: string;
	readonly timestamp: number;
	readonly uri: string;
}

export class CreateEmail {
	sender: string;
	receiver: string;
	subject: string;
	message: string;
	constructor({
		sender,
		receiver,
		subject,
		message,
	}: {
		sender: string;
		receiver: string;
		subject: string;
		message: string;
	}) {
		this.sender = sender;
		this.receiver = receiver;
		this.subject = subject;
		this.message = message;
	}

	encrypt() {
		// encrypt data
	}
}
