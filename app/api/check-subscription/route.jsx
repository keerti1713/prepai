import { db } from "@/configs/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { USER_TABLE } from "@/configs/schema";


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Fetch user subscription data
        const user = await db
            .select()
            .from(USER_TABLE)
            .where(eq(USER_TABLE.email, email))
            .limit(1);

        if (!user.length) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { isMember, subscriptionEndDate, nextBillingDate, status } = user[0];
        const now = new Date(); 

        // Check if subscription has expired
        if (nextBillingDate && new Date(nextBillingDate) < now) {
            // Update status to "inactive"
            await db.update(USER_TABLE)
                .set({ isMember: false, status: "inactive" })
                .where(eq(USER_TABLE.email, email));

            return NextResponse.json({
                isMember: false,
                status: "inactive",
                message: "Subscription expired. User status updated to inactive.",
            }, { status: 200 });
        }

        return NextResponse.json({
            isMember,
            status,
            message: "Subscription is valid.",
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching subscription:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

