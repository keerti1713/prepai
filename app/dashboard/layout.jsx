"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import SideBar from "./_components/SideBar";
import DashboardHeader from "./_components/DashboardHeader";
import { CourseCountProvider } from "../_context/CourseCount";
import { SubscriptionProvider } from "../_context/SubscriptionContext";

function DashboardLayout({ children }) {
    const { user } = useUser();  
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        if (user) {
            setUserEmail(user.emailAddresses[0]?.emailAddress || "No Email Found");
        }
    }, [user]);

    return (
        <SubscriptionProvider>
            <CourseCountProvider>
                <div>
                    <div className="md:w-64 hidden md:block fixed">
                        <SideBar />
                    </div>
                    <div className="md:ml-64">
                        <DashboardHeader userEmail={userEmail} />
                        <div className="p-10">{children}</div>
                    </div>
                </div>
            </CourseCountProvider>
        </SubscriptionProvider>
    );
}

export default DashboardLayout;
