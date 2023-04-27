import { DocumentData, QueryDocumentSnapshot, collection, doc, getDocs, query, where } from "firebase/firestore";
import { firestore } from "./firebaseConfig";
import { Invitation } from "./types";

export async function getInvitationsOfUser(user_id: string): Promise<Invitation[]> {
	const q = query(
		collection(firestore, "invitations"),
		where("user_id", "==", user_id),
		where("status", "==", "accepted"));

	const snapshots = await getDocs(q);

	let snapshotData: Invitation[] = [];

	snapshots.forEach((invite: QueryDocumentSnapshot<DocumentData>) => {
		let inviteData: Invitation = invite.data();
		inviteData["id"] = invite.id;
		snapshotData.push();
	})

	return snapshotData;
}

/*
TODO:
- get data of groups ()given a list of group ids (string[])
*/