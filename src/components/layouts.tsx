import Navbar from "./Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <ToastContainer />
    </>
  )
}