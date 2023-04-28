import '@/styles/globals.css'
import { FirebaseAuthContext, useFirebaseAuth } from '@/utils/firebaseFunctions'
import { getUserData, updateUserProfile } from "./editProfile";
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar';
import { Caveat } from 'next/font/google';
import { User } from "../utils/types";

const caveat = Caveat({subsets: ["cyrillic"]});

export default function App({ Component, pageProps }: AppProps) {
  const firebaseAuthState = useFirebaseAuth();
  console.log(getUserData("Muhiim_Ali"));
   const user: User = {
     id: "123",
     email: "johndoe@example.com",
     questions: {
       "What is your name?": "John Doe",
       "What is your favorite color?": "Blue",
       "What is your favorite food?": "Pizza",
     },
    
   };
    console.log(updateUserProfile("Muhiim_Ali", user));
  return (
    <FirebaseAuthContext.Provider value={firebaseAuthState}>
      <Head>
        <title>Cubby</title>
      </Head>
      <div className={"h-screen flex flex-col bg-orange-50 overflow-y-scroll " + caveat.className}>
      <div
        className={"h-screen flex flex-col bg-orange-50 " + caveat.className}
      >
        <Navbar />
        <Component {...pageProps} />
        <ToastContainer />
        
      </div>
    </FirebaseAuthContext.Provider>
  );
}
