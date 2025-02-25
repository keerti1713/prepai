import { db} from "@/configs/db";
import { STUDY_TYPE_CONTENT } from "@/configs/schema";
import { NextResponse } from 'next/server';
import { inngest } from "@/inngest/client";
import { eq, and } from "drizzle-orm";


export async function POST(req) {
    try {
        const bodyText = await req.text(); 

        if (!bodyText) {
            return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
        }
        const { chapters, courseId, type } = JSON.parse(bodyText); 
        if (!chapters || !courseId || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const PROMPT = type =='flashcards'
        ?`Generate the Flashcard on topic: ${chapters} in JSON format with front back content, Maximum 15`
        :`Generate Quiz on topic: ${chapters} with Question and Options along with correct answer in JSON format, maximum 10 and each option should be within five words`;
        
        // Insert record to DB
        const result = await db.insert(STUDY_TYPE_CONTENT)
            .values({
                courseId: courseId,
                type: type
            }).returning({ id: STUDY_TYPE_CONTENT.id });
            
        if (!result.length) {
            return NextResponse.json({ error: "Failed to insert record" }, { status: 500 });
        }
        
        // Trigger inngest function
        await inngest.send({
            name: 'studyType.content',
            data: {
                studyType: type,
                prompt: PROMPT,
                courseId: courseId,
                recordId: result[0].id
            }
        });

        return NextResponse.json({ id: result[0].id });
    } catch (error) {
        console.error("Error in API:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        const type = searchParams.get("type");

        if (!courseId || !type) {
            return NextResponse.json({ error: "Missing query parameters" }, { status: 400 });
        }

        //Check in the database if flashcards exist for the given courseId
        const dataExist = await db
            .select()
            .from(STUDY_TYPE_CONTENT)
            .where(and(eq(STUDY_TYPE_CONTENT.courseId, courseId)), (eq(STUDY_TYPE_CONTENT.type, type)))
            .limit(1);
        
        const isReady = dataExist.length > 0;  

        return NextResponse.json({ ready: isReady });
    } catch (error) {
        console.error("Error checking content status:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
