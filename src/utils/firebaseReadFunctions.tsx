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
import { Invitation, Group, User } from "./types";
import { firebaseUserToUser } from "./firebaseFunctions";


/*
(Async) Get all invitations of a certain status of a user.

(user_id: string, status: string) => Promise<Invitation[]>
*/
export async function getInvitationsOfUser(
  user_id: string,
  status: string
): Promise<Invitation[]> {
  const q = query(
    collection(firestore, "invitations"),
    where("user_id", "==", user_id),
    where("status", "==", status)
  );

  const snapshots = await getDocs(q);

  let snapshotData: Invitation[] = [];

  snapshots.forEach((invite: QueryDocumentSnapshot<DocumentData>) => {
    let inviteData: Invitation = invite.data();
    inviteData["id"] = invite.id;
    snapshotData.push(inviteData);
  });

  return snapshotData;
}

/*
(Async) Get data of groups that user is in.

(user_id: string) => Promise<Group[]>
*/
export async function getUserGroups(user_id: string): Promise<Group[]> {
  const q = query(
    collection(firestore, "groups"),
    where("member_ids", "array-contains", user_id));
  
  const queryDocs = await getDocs(q);
  let groups: Group[] = [];
  queryDocs.forEach((snap: QueryDocumentSnapshot<DocumentData>) => {
    let g = snap.data();
    g["id"] = snap.id;
    groups.push(g)
  });

  return groups;
}

/*
(Async) Get joint user map from multiple groups.

(groups: Group[]) => Promise<{[key: string]: User}>
*/
export async function getAllUsersFromGroups(groups: Group[]): Promise<{[key: string]: User}> {
  let userMap: {[key: string]: User} = {};
  for (var g of groups) {
    userMap = {...userMap, ...(await getUsersFromGroup(g))}
  }
  return userMap;
}

/*
(Async) Get user map from group.

(g: Group) => Promise<{[key: string]: User}>
*/
export async function getUsersFromGroup(g: Group): Promise<{[key: string]: User}> {
  if (g.member_ids == undefined) {
    return {};
  }

  let users: {[key: string]: User} = {};

  for (var _id of g.member_ids) {
    const docRef = doc(firestore, "users", _id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let u: User = docSnap.data();
      users[docSnap.id] = firebaseUserToUser(u, docSnap.id);
    }
  }
  return users;
}

/*
(Async) Get data of groups given a list of group ids.

(groupIDs: string[]) => Promise<Group[]>
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

/*
(Async) Get all interest group data

() => Promise<Group[]>
*/
export async function getAllInterestGroups(): Promise<Group[]> {
  const q = query(collection(firestore, "groups"), where("friend_group", "==", false));
  const docs = await getDocs(q);

  let interestGroupDocs: Group[] = [];

  docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
    let gp: Group = doc.data();
    gp["id"] = doc.id;
		interestGroupDocs.push(gp);
  });

  return interestGroupDocs;
}


