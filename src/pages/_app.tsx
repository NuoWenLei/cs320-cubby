import '@/styles/globals.css'
import { FirebaseAuthContext, useFirebaseAuth } from '@/utils/firebaseFunctions'
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar'

export default function App({ Component, pageProps }: AppProps) {
  const firebaseAuthState = useFirebaseAuth();
  return (
    <FirebaseAuthContext.Provider value={firebaseAuthState}>
      <Head>
        <title>Cubby</title>
      </Head>
      <div className="h-screen flex flex-col bg-orange-50">
        <Navbar />
        <Component {...pageProps} />
        <ToastContainer />
      </div>
    </FirebaseAuthContext.Provider>
  )
}
