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

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {

    const session = await auth()
    const username = session?.user?.username
    const userid = session?.user?.userId

    if (!username) {
        return NextResponse.json({ message: 'Not an authenticated user' }, { status: 429 })
    }

    const identifier = userid;
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(identifier);

    // if rate limit has been hit
    if (!success) {
        console.log("limit", limit)
        console.log("reset", reset)
        console.log("remaining", remaining)
        return NextResponse.json({ message: 'Rate limited' }, { status: 429 })
    }

    const { data, error } = await supabase
        .from('user_vocab')
        .select('word_id')
        .eq('user_id', userid)

    return NextResponse.json({ message: data }, { status: 200 })

}