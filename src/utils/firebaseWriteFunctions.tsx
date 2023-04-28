import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { User } from "./types";
import { firestore } from "./firebaseConfig";

/*
TODO:
- change invitation status to "accepted" ((invitation_id: string) => Promise<boolean>)
- add user_id to the "member_ids" field of the group ((group_id: string, user_id: string) => Promise<boolean>)
- create new user ((user_object: User) => Promise<boolean>)
*/

export async function createNewUser(user_object: User): Promise<boolean> {
	try {
		await addDoc(collection(firestore, "users"), user_object);
		return true;
	} catch (_) {
		return false;
	}
}

export async function addUserToGroup(group_id: string, user_id: string): Promise<boolean> {
	const groupRef = doc(firestore, "groups", group_id);
	try {
		await updateDoc(groupRef, {
			member_ids: arrayUnion(user_id)
		});
		return true;
	} catch (_) {
		return false;
	}
}

export async function changeInvitationStatus(invitation_id: string, status: string): Promise<boolean> {
	const invitationRef = doc(firestore, "invitations", invitation_id);
	try {
		await updateDoc(invitationRef, {
			status: status
		});
		return true;
	} catch (_) {
		return false;
	}
}