export type QuestionAnswerMap = {
	[key: string]: string;
}

export type User = {
	id?: string;
	email?: string;
	name?: string;
	questions?: QuestionAnswerMap;
	// TODO: add more fields
	// Important: Fields must be the same in the python model too
}

export type Invitation = {
	id?: string;
	group_id?: string;
	similarity_matched?: number;
	status?: string;
	user_id?: string;
}

export type Group = {
	id?: string;
	feature_dist?: number[];
	friend_group?: boolean;
	member_ids?: string[];
}