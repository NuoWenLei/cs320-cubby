// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc} from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// import firebaseConfig from "../../private/firebaseCreds.json";
// import firebase from 'firebase'
// import 'firebase/firestore'

const firebaseConfig = {
	"apiKey": process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	"authDomain": process.env.NEXT_PUBLIC_AUTH_DOMAIN,
	"projectId": process.env.NEXT_PUBLIC_PROJECT_ID,
	"storageBucket": process.env.NEXT_PUBLIC_STORAGE_BUCKET,
	"messagingSenderId": process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
	"appId": process.env.NEXT_PUBLIC_APP_ID,
	"measurementId": process.env.NEXT_PUBLIC_MEASUREMENT_ID,
	"databaseURL": process.env.NEXT_PUBLIC_DATABASE_URL
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage();
