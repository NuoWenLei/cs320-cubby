import { firestore } from "./firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { User } from "./types";
import { firebaseUserToUser } from "./firebaseFunctions";


export async function getUserData(userId: string): Promise<User | null> {
  try {
    const docRef = doc(firestore, "users", userId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      console.log("user not found");
      return null;
    }
    const userSnapshot = snapshot.data();

    /** Converts user snapshot from Firebase to User type. */
    userSnapshot["id"] = userId;
    console.log(userSnapshot);
    return userSnapshot;
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return null;
  }
}


/**
 * Updates the current user's data in Firestore.
 */
export async function updateUserProfile(userId: string, newUserData: User): Promise<void> {
  const docRef = doc(firestore, "users", userId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    console.log("User info not found");
    return;
  } else {
    console.log("User info found, updating profile");
    await setDoc(docRef, newUserData, { merge: true });
  }
}










