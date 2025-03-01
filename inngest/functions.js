import { inngest } from "@/inngest/client";
import {eq, set} from "drizzle-orm"
import { db} from "@/configs/db";
import { generateNotesAiModel, generateStudyContentAiModel, generateQuizAiModel } from "@/configs/AiModel";
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE, STUDY_TYPE_CONTENT, USER_TABLE } from "@/configs/schema";


export const CreateNewUser = inngest.createFunction(
    {id: "create-user"},
    {event: "user.create"},
    async ({event,step})=> {
        const {user}= event.data;
        //Get event data
        const result= await step.run("Check if user exists and if does not exists create new user in DB", async ()=>{
             //checking if user exists
            const result=await db.select().from(USER_TABLE)
            .where(eq(USER_TABLE.email,user?.primaryEmailAddress?.emailAddress))

            if(result?.length==0){
                const userResp = await db.insert(USER_TABLE).values({
                    name:user?.fullName,
                    email:user?.primaryEmailAddress?.emailAddress
                }).returning({id:USER_TABLE.id})
                return userResp;
            }
            return result;
        })   
        return "Success";
    }
)

export const GenerateNotes = inngest.createFunction(
    { id: "generate-course", concurrency: 5 }, 
    { event: "notes.generate" },
    async ({ event, step }) => {
        const { course } = event.data;

        await db.update(STUDY_MATERIAL_TABLE).set({ status: "Processing" })
            .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));

        const notesResult = await step.run("Generate Chapter Notes", async () => {
            const Chapters = course?.courseLayout?.chapters;
            const chapterPromises = Chapters.map(async (chapter, index) => {
                const PROMPT = "Generate detailed content for each chapter..." + JSON.stringify(chapter);
                const result = await generateNotesAiModel.sendMessage(PROMPT);
                const aiResp = result.response.text();

                await db.insert(CHAPTER_NOTES_TABLE).values({
                    chapterId: index,
                    courseId: course?.courseId,
                    notes: aiResp,
                });
            });

            await Promise.all(chapterPromises);
            return "Completed";
        });

        // Update course status when done
        await db.update(STUDY_MATERIAL_TABLE).set({ status: "Ready" })
            .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));

        return "Success"; 
    }
);

    
// generate the study type content


export const GenerateStudyTypeContent = inngest.createFunction(
    { id: 'Generate Study Type Content' },
    { event: 'studyType.content' },
    async ({ event, step }) => {
        const { studyType, prompt, courseId, recordId } = event.data;

        // Generate AI Content
        const GenerateAiResult = await step.run('Generating flashcard using AI', async () => {
            const result = 
            studyType=='flashcards'?
            await generateStudyContentAiModel.sendMessage(prompt)
            : await generateQuizAiModel.sendMessage(prompt);

            try {
                const AiResult = result.response;
                return AiResult;
            } catch (error) {
                console.error("Error parsing AI response:", error);
                throw new Error("Invalid AI response format");
            }
        });
        // Update result in DB
        await step.run('Save result to DB', async () => {
            return await db.update(STUDY_TYPE_CONTENT)
                .set({ 
                    content: GenerateAiResult,
                    status:'Ready'
                    })
                .where(eq(STUDY_TYPE_CONTENT.id, recordId));
        });

        return { success: true, content: GenerateAiResult };
    }
);
