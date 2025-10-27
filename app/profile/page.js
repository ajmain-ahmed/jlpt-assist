'use client'
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import ProfileComponent from "../components/Profile";


export default function Profile() {
    return (
        <SessionProvider>
            <Navbar />
            <ProfileComponent />
        </SessionProvider>
    )
}