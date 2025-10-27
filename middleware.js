import { NextResponse } from "next/server";
import { auth } from "./app/auth";
import { redirect } from "next/navigation";

export default async function middlware(request) {
    const sessionObj = await auth()
    const userid = sessionObj?.user?.userId

    if (!userid) {
        redirect('/')
    }
    return NextResponse.next()
}

export const config = {
    matcher:['/profile']
}