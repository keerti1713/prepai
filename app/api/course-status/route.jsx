import { db } from '@/configs/db';
import { STUDY_MATERIAL_TABLE } from '@/configs/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req) {
    try {
        const { courseId } = await req.json();

        if (!courseId) {
            return Response.json({ error: 'Missing courseId' }, { status: 400 });
        }

        const result = await db
            .select()
            .from(STUDY_MATERIAL_TABLE)
            .where(
                and(
                    eq(STUDY_MATERIAL_TABLE.status, 'Ready'),
                    eq(STUDY_MATERIAL_TABLE.courseId, courseId)
                )
            );

        if (result.length > 0) {
            return Response.json({ status: 'Ready' }, { status: 200 });
        }

        return Response.json({ status: 'Generating' }, { status: 200 });
    } catch (error) {
        console.error("Error fetching course status:", error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
