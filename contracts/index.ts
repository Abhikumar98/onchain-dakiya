export interface EmailThread {
	readonly thread_id: string;
	readonly receiver: string;
	readonly sender: string;
	readonly timestamp: number;
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

export interface Message {
	sender: string;
	receiver: string;
	message: string;
	subject: string;
	timestamp: string;
	txId: string;
	uri: string;
}
