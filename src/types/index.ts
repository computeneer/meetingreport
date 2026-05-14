export interface User {
	id: string;
	name: string;
}

export interface Meeting {
	id: string;
	title: string;
	date: string;
	notes: string[];
}

export interface Task {
	id: string;
	meetingId: string;
	assignee: string;
	description: string;
	completed: boolean;
}
