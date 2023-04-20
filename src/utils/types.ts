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