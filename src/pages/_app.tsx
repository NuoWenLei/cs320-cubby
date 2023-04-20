import Layout from '@/components/layouts'
import '@/styles/globals.css'
import { FirebaseAuthContext, useFirebaseAuth } from '@/utils/firebaseFunctions'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const firebaseAuthState = useFirebaseAuth();
  return (
    <FirebaseAuthContext.Provider value={firebaseAuthState}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FirebaseAuthContext.Provider>
  )
}
