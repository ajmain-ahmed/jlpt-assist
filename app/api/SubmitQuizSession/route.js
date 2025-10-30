import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'
import { auth } from "../../auth";
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request) {

    const session = await auth()
    const userID = session.user.userId

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
