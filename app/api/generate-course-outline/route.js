import { NextResponse } from "next/server";
import { courseOutlineAIModel } from "@/configs/AiModel";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { db } from "@/configs/db";
import { inngest } from "@/inngest/client";

export async function POST(req) {
    try {
        const { courseId, topic, courseType, difficultyLevel, createdBy } = await req.json();

        const PROMPT = `Generate a study material for ${topic} for ${courseType} with ${difficultyLevel} level. Include course summary, list of chapters with summaries, maximum 10 chapters, and topics for each chapter in JSON format.`;

        if (!courseOutlineAIModel || typeof courseOutlineAIModel.sendMessage !== "function") {
            console.error("AI Model is not initialized correctly.");
            return NextResponse.json({ error: "AI model initialization failed" }, { status: 500 });
        }

        let aiResp;
        try {
            aiResp = await courseOutlineAIModel.sendMessage(PROMPT);

        } catch (aiError) {
            console.error("AI Response Error:", aiError);
            return NextResponse.json({ error: "Failed to generate content from AI" }, { status: 500 });
        }

        let aiText;
        try {
            aiText = await aiResp.response.text();
            aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

        } catch (textError) {
            console.error("Error getting text response:", textError);
            return NextResponse.json({ error: "Failed to retrieve AI response text" }, { status: 500 });
        }

        let aiResult;
        try {
            aiResult = JSON.parse(aiText);

        } catch (jsonError) {
            console.error("Failed to parse AI response:", jsonError);
            return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
        }

        try {
            const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values({
                courseId,
                courseType,
                difficultyLevel,
                createdBy,
                topic,
                courseLayout: aiResult,
            }).returning({ resp: STUDY_MATERIAL_TABLE });

            const courseData = dbResult[0].resp;

            // Trigger Inngest functions to generate additional content
            const noteResult = await inngest.send({
                name: 'notes.generate',
                data: { course: courseData }
            });

            const flashcardResult = await inngest.send({
                name: 'flashcards.generate',
                data: { course: courseData }
            });

            const quizResult = await inngest.send({
                name: 'quiz.generate',
                data: { course: courseData }
            });
            
            return NextResponse.json({ result: courseData });
        } catch (dbError) {
            console.error("Database Error:", dbError);
            return NextResponse.json({ error: "Database insert failed" }, { status: 500 });
        }
    } catch (error) {
        console.error("General Error:", error);
        return NextResponse.json({ error: "An error occurred while generating the course outline" }, { status: 500 });
    }
}
