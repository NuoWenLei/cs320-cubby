import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "./firebaseConfig";
import { Invitation, Group } from "./types";

export async function getInvitationsOfUser(
  user_id: string
): Promise<Invitation[]> {
  const q = query(
    collection(firestore, "invitations"),
    where("user_id", "==", user_id),
    where("status", "==", "accepted")
  );

  const snapshots = await getDocs(q);

  let snapshotData: Invitation[] = [];

  snapshots.forEach((invite: QueryDocumentSnapshot<DocumentData>) => {
    let inviteData: Invitation = invite.data();
    inviteData["id"] = invite.id;
    snapshotData.push();
  });

  return snapshotData;
}

/*
TODO:
- get data of groups ()given a list of group ids (string[])
*/

export async function getGroupsfromGID(groupIDs: string[]): Promise<Group[]> {
  let idSet = new Set<string>();
  let groups: Group[] = [];

  for (var _id of groupIDs) {
    idSet.add(_id);
  }
  for (var groupID of Array.from(idSet)) {

	let docRef = doc(firestore, "groups", groupID);

	//getDoc minimize get the set of group id first and iterate through that then
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let gp: Group = docSnap.data();
        gp["id"] = groupID
		groups.push(gp);
		
      }
    } catch (error) {
      console.log(error);
    }
  }
  return groups; 
  }


