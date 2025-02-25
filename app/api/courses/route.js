import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import {eq, desc} from "drizzle-orm"
import { NextResponse } from "next/server";

export async function POST(req) {
    const {createdBy}= await req.json();
    const result= await db.select().from(STUDY_MATERIAL_TABLE)
    .where(eq(STUDY_MATERIAL_TABLE.createdBy,createdBy))
    .orderBy(desc(STUDY_MATERIAL_TABLE.id));

    return NextResponse.json({result:result});
}
export async function GET(req) {

    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('courseId');

        if (!courseId) {
            return NextResponse.json({ error: 'Missing courseId parameter' }, { status: 400 });
        }

        // Fetch course data
        const course = await db.select()
            .from(STUDY_MATERIAL_TABLE)
            .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

        if (!course || course.length === 0) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({ result: course[0] });
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}