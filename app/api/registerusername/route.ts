import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'
import { auth } from "../../auth";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv()

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(3, "30 s"),
    timeout: 10000,
    analytics: true
})

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {

    try {

        const body = await request.json()
        const userUsername = body.username

        if (!userUsername) {
            return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }

        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ message: "User is not authenticated" }, { status: 401 });
        }

        // RATE LIMITING
        const identifier = session?.user?.email
        const { success, pending, limit, reset, remaining } = await ratelimit.limit(identifier);

        if (!success) {
            console.log("limit", limit)
            console.log("reset", reset)
            console.log("remaining", remaining)
            return NextResponse.json({ message: 'Rate limited' }, { status: 429 })
        }

        const userGmail = session?.user?.email

        const { error } = await supabase
            .from("users")
            .insert({ email: userGmail, username: userUsername });

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        else {
            return NextResponse.json({ message: 'User successfully registered' }, { status: 200 });
        }

    }

    catch (err) {
        return NextResponse.json({ message: 'Something went wrong on our side...' }, { status: 500 })
    }

}