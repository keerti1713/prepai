import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT } from "@/configs/schema";
import { db } from "@/configs/db";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { courseId, studyType } = await req.json();

        let notes = null;
        let result = null;

        if (studyType === 'ALL') {
            notes = await db
                .select()
                .from(CHAPTER_NOTES_TABLE)
                .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

            const contentList = await db
                .select()
                .from(STUDY_TYPE_CONTENT)
                .where(eq(STUDY_TYPE_CONTENT.courseId, courseId));

            result = {
                notes: notes,
                flashcards: contentList?.filter(item => item.type.toLowerCase() === 'flashcards'),
                quiz: contentList?.filter(item => item.type.toLowerCase() === 'quiz')
            };

            return NextResponse.json(result);
        } 
        else if (studyType === 'notes') {
            notes = await db
                .select()
                .from(CHAPTER_NOTES_TABLE)
                .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

            return NextResponse.json(notes);
        } 
        else {
            result = await db
                .select()
                .from(STUDY_TYPE_CONTENT)
                .where(
                    and(
                        eq(STUDY_TYPE_CONTENT.courseId, courseId),
                        eq(STUDY_TYPE_CONTENT.type, studyType.toLowerCase()) 
                    )
                );

            if (!result || result.length === 0) {
                console.error("No data found for this courseId and studyType.");
                return NextResponse.json({ error: "No content found" }, { status: 404 });
            }

            const serializedResult = result.map(item => ({
                id: item.id ? String(item.id) : undefined,
                courseId: item.courseId,
                type: item.type,
                content: typeof item.content === 'string' ? JSON.parse(item.content) : item.content
            }));
            return NextResponse.json({ content: serializedResult });
        }
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
