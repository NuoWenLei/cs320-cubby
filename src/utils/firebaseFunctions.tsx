
import { app, firestore } from "./firebaseConfig";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as signOutFirebase,
} from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react";
import { query, collection, where, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { User } from "./types";


export interface AuthState {
  /** Indicates if the current user is logged in. */
  isAuthenticated: boolean;
  /** Indicates whether the auth session is currently being loaded. */
  isLoading: boolean;
  /** The current user, if logged in. */
  user?: User;
  /** Signs the current user out, if logged in. */
  signOut: () => void;
  /** Signs a user in with Google. */
  signInWithGoogle: () => Promise<User | boolean>;
}

const auth = getAuth(app);

/** Converts user snapshot from Firebase to User type. */
export function firebaseUserToUser(userSnapshot: User, userId: string): User {
  userSnapshot["id"] = userId;
  return userSnapshot;
}

function signOut() {
  signOutFirebase(auth);
}

/** Opens a Google sign-in popup and authenticates the user. */
/** Should have 3 possible results:
 * 1. Authenticated and logged in -> returns User with snapshot data
 * 2. Unauthenticated due to not completing or failing authentication -> returns false
 * 3. Authenticated by Google but no account -> returns true
 */
async function signInWithGoogle(): Promise<User | boolean> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({'hd': 'brown.edu'});
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result)
    const email = result.user.email;
    if (email == null) {
      return false;
    }
    const userSnapshot: QueryDocumentSnapshot<DocumentData> | null = await checkRegisterWithSnapshot(email);
    if (!(userSnapshot instanceof QueryDocumentSnapshot<DocumentData>)) {
      return true;
    }
    return firebaseUserToUser(userSnapshot.data(), userSnapshot.id);
  } catch (e) {
    return false;
  }
}

/** Creates an auth state object */
function createAuthState(isAuthenticated = false, isLoading = true, user: User | undefined = undefined): AuthState {
  return { isAuthenticated, isLoading, user, signOut, signInWithGoogle };
}

/** The initial authentication state */
export const defaultAuthState: AuthState = createAuthState();

export const FirebaseAuthContext = createContext<AuthState>(defaultAuthState);
// export const FirebaseAuthProvider = FirebaseAuthContext.Provider;

/** Hook that provides a session listener and various session methods */
export function useFirebaseAuth() {
  const [authState, setAuthState] = useState(defaultAuthState);

  useEffect(() => {
    // create authentication state listener
    onAuthStateChanged(auth, async (user) => {
      console.log("Changed auth")
      if (user != null) {
        if (user.email != null) {
          checkRegisterWithSnapshot(user.email).then(async (userSnapshot: QueryDocumentSnapshot<DocumentData> | null) => {
            if (userSnapshot instanceof QueryDocumentSnapshot<DocumentData>) {
              // User is signed in and authenticated
              // setAuthState(createAuthState(true, false, firebaseUserToUser(userSnapshot.data(), userSnapshot.id), docs));
              const newAuth: AuthState = createAuthState(true, false, firebaseUserToUser(userSnapshot.data(), userSnapshot.id));
              setAuthState(newAuth);
            } else {
              // User is google authenticated but not authenticated by us
              setAuthState(createAuthState(false, false));
            }
          })
        } else {
          setAuthState(createAuthState(false, false));
        }
      } else {
        // User is signed out.
        setAuthState(createAuthState(false, false));
      }
    })
  }, []);

  return authState;
}

/** Hook for reading and interacting with the app's current Firebase auth session */
export function useAuth() {
  return useContext(FirebaseAuthContext);
}

export function isLoggedIn() {
  if (auth.currentUser?.email != null && auth.currentUser?.displayName != null) {
    return checkRegisterWithSnapshot(auth.currentUser?.email).then((r: QueryDocumentSnapshot<DocumentData> | null) => {
      if (r instanceof QueryDocumentSnapshot<DocumentData>) { return true } else { return false }
    }).catch((_: any) => {
      return false
    })
  }
  return false
}

export async function checkRegisterWithSnapshot(email: string): Promise<QueryDocumentSnapshot<DocumentData> | null>{
    const q = query(collection(firestore, "users"), where("email", "==", email));
    const snapshot = await getDocs(q)
    if (snapshot.empty) {
      console.log("Need to register")
      return null
    } else {
      console.log("You are registered")
      return snapshot.docs[0]
    }
  }