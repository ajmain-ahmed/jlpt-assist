import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'
import { auth } from "../../auth";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv()

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(15, "60 s"),
    timeout: 10000,
    analytics: true
})

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

export async function POST(request) {

    const requestMsg = await request.json()

    const sessionObj = await auth()
    const userid = sessionObj?.user?.userId

    if (!userid) {
        return NextResponse.json({ message: 'Not an authenticated user' }, { status: 429 })
    }

    // RATE LIMITING
    const identifier = userid;
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(identifier);

    if (!success) {
        console.log("limit", limit)
        console.log("reset", reset)
        console.log("remaining", remaining)
        return NextResponse.json({ message: 'Rate limited' }, { status: 429 })
    }

    // DEALING WITH REQUEST
    if (requestMsg.RequestType === 'meta') {

        const { data, error } = await supabase
            .from('quiz_sessions')
            .select('quiz_id, n_level, quiz_type, random, correct, incorrect, created_at')
            .eq('user_id', userid)

        if (data) {
            return NextResponse.json({ message: data, status: '200' })
        }
        else {
            return NextResponse.json({ message: `error pulling test metadata: ${error}`, status: '404' })
        }

    }

    else {
        return NextResponse.json({ message: 'not data nor meta', status: '200' })
    }
}
