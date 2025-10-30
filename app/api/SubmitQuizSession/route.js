import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'
import { auth } from "../../auth";
import { v4 as uuidv4 } from 'uuid';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv()

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(30, "60 s"),
    timeout: 10000,
    analytics: true
})

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request) {

    const session = await auth()
    const userID = session.user.userId

    if (!userID) {
        return NextResponse.json({ message: 'Not an authenticated user' }, { status: 429 })
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

    // DEALING WITH REQUEST
    const body = await request.json()

    const quizID = uuidv4()
    const nLevel = body.nLevel
    const quizType = body.quizType
    const random = body.random
    const correct = body.correct
    const incorrect = body.incorrect

    if (session) {

        // attempting to submit test session metadata
        const { error } = await supabase
            .from("quiz_sessions")
            .insert({
                quiz_id: quizID,
                user_id: userID,
                n_level: nLevel,
                quiz_type: quizType,
                random: random,
                correct: correct,
                incorrect: incorrect
            })

        if (error) {
            return NextResponse.json({ message: `metadata submission error: ${error}` }, { status: 422 })
        }

        else {
            return NextResponse.json({ message: 'Quiz metadata and results saved!', status: 200 })
        }

    }

    else {
        return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })
    }

}
