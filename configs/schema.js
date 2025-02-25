import { timestamp,pgTable, json, serial,varchar,boolean,text } from "drizzle-orm/pg-core";

export const USER_TABLE= pgTable('users', {
    id:serial().primaryKey(),
    email:varchar().notNull().unique(),
    isMember:boolean().default(false),
    subscriptionStartDate: timestamp("subscription_start_date").defaultNow(), 
    subscriptionEndDate: timestamp("subscription_end_date"), 
    nextBillingDate: timestamp("next_billing_date"), 
    status: varchar().default("inactive")
})

export const STUDY_MATERIAL_TABLE=pgTable('studyMaterial',{
    id:serial().primaryKey(),
    courseId: varchar().notNull(),
    courseType: varchar().notNull(),
    topic:varchar().notNull(),
    difficultyLevel: varchar().notNull(),
    courseLayout:json(),
    createdBy:varchar().notNull(),
    status:varchar().default('Generating')
})

export const CHAPTER_NOTES_TABLE= pgTable('chapterNotes', {
    id:serial().primaryKey(),
    courseId:varchar().notNull(),
    chapterId:varchar().notNull(),
    notes:text()
})
export const STUDY_TYPE_CONTENT=pgTable('studyTypeContent',{
    id:serial().primaryKey(),
    courseId: varchar().notNull(),
    content:json(),
    type:varchar().notNull(),
    status:varchar().default("Generating")
})