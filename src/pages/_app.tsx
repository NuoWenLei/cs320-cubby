import '@/styles/globals.css'
import { FirebaseAuthContext, useFirebaseAuth } from '@/utils/firebaseFunctions'
import { getUserData, updateUserProfile } from "../utils/editProfile";
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar';
import { Caveat } from 'next/font/google';
import { User } from "../utils/types";
import { useRouter } from 'next/router';

const caveat = Caveat({subsets: ["cyrillic"]});

export default function App({ Component, pageProps }: AppProps) {

  const firebaseAuthState = useFirebaseAuth();
  const router = useRouter();

  return (
    <FirebaseAuthContext.Provider value={firebaseAuthState}>
      <Head>
        <title>Cubby</title>
      </Head>
      <div className={"h-screen flex flex-col bg-orange-50 overflow-y-scroll "
       + caveat.className
        + (router.pathname == "/groups" ? " divide-y-2 divide-orange-800" : "")}>
        <Navbar />
        <Component {...pageProps} />
        <ToastContainer />
        
      </div>
    </FirebaseAuthContext.Provider>
  );
}
