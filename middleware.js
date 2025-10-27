import { NextResponse } from "next/server";
import { auth } from "./app/auth";

export default async function middlware(request) {
    const sessionObj = await auth()
    const userid = sessionObj?.user?.userId

    if (!userid) {
        return NextResponse.redirect(
            new URL('/', request.url)
        )
    }
    return NextResponse.next()
}

export const config = {
    matcher:['/profile']
}