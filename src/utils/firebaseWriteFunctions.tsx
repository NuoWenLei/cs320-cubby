import { addDoc, collection } from "firebase/firestore";
import { User } from "./types";
import { firestore } from "./firebaseConfig";

/*
TODO:
- change invitation status to "accepted" ((invitation_id: string) => void)
- add user_id to the "member_ids" field of the group ((group_id: string, user_id: string) => void)
- create new user
*/

export async function createNewUser(user_object: User): Promise<boolean> {
	try {
		await addDoc(collection(firestore, "users"), user_object);
		return true;
	} catch (_) {
		return false;
	}
}