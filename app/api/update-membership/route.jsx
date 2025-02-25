import { db } from "@/configs/db"; 
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { email, isMember, subscriptionStartDate, subscriptionEndDate, nextBillingDate, status } = req.body;

    try {
        await db.update(USER_TABLE)
        .set({
            isMember,
            subscriptionStartDate,
            subscriptionEndDate,
            nextBillingDate,
            status
        })
        .where(eq(USER_TABLE.email, email));
        
        return res.status(200).json({ message: "Membership updated successfully!" });

    } catch (error) {
        console.error("Database update error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
