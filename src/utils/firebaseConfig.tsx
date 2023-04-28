// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc} from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../private/firebaseCreds.json";
// import firebase from 'firebase'
// import 'firebase/firestore'

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage();
