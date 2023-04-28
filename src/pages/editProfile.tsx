import { firestore } from "../utils/firebaseConfig";
import {
  query,
  collection,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { User } from "../utils/types";


export async function getUserData(userId: string): Promise<User | null> {
  try {
    const userDocRef = query(
      collection(firestore, "users"),
      where("name", "==", userId)
    );
    const querySnapshot = await getDocs(userDocRef);
    if (querySnapshot.empty) {
      return null;
    }
    let userData: User | null = null;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());

      userData = doc.data() as User;
    });
    console.log("userData: " + userData);
    return userData;
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return null;
  }
}


/**
 * Updates the current user's data in Firestore.
 */
export async function updateUserProfile(userId: string, newUserData: User): Promise<void> {
  const userDocRef= query(collection(firestore, "users"), where("name", "==", userId));
  const querySnapshot = await getDocs(userDocRef);

  if (querySnapshot.empty) {
    console.log("User info not found");
    return;
  } else {
    console.log("User info found, updating profile");
    await setDoc(querySnapshot.docs[0].ref, newUserData, { merge: true });
  }
}










