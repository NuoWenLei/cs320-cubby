export type QuestionAnswerMap = {
	[key: string]: string;
}

export type User = {
	id?: string;
	email?: string;
	questions?: QuestionAnswerMap;
	// TODO: add more fields
	// Important: Fields must be the same in the python model too
}

export type Invitation = {
	group_id?: string;
	similarity_matched?: number;
	status?: string;
	user_id?: string;
}