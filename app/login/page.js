import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <SessionProvider>
        <Navbar />
      </SessionProvider>
    </>
  );
}
