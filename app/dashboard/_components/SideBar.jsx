"use client";
import { useState, useContext } from "react";
import Image from "next/image";
import { LayoutDashboard, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CourseCount } from "@/app/_context/CourseCount";
import { useSubscription } from "@/app/_context/SubscriptionContext";
import { useRouter } from "next/navigation";


function SideBar() {

    const context = useContext(CourseCount);
    const { checkSubscription, createButtonDisabled } = useSubscription();
    const router = useRouter();

    if (!context) {
        console.error("CourseCount is undefined.");
        return null; 
    }

    const { totalCourse, setTotalCourse } = context;

    const path= usePathname();

    return (
        <div className='h-screen shadow-md p-5'>
            <div className='m-3 border-1 rounded-2xl border-black bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center h-[10vh] sm:h-[15vh] md:h-[20vh] lg:h-[25vh] p-5'>
                <p className=" text-xl text-white italic w-full h-full flex items-center justify-center">Smart Study with AI, Quiz & Flashcards!</p>
            </div>
            <div className='mt-5'>
                <Button
                    className={`w-full ${totalCourse >= 5 && !createButtonDisabled
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
                        : "bg-[#8624bb] hover:bg-purple-600 text-white"}`}
                    onClick={async (e) => {
                        e.preventDefault(); 
                        const isSubscribed = await checkSubscription();

                        //Allow navigation if the user is subscribed or has less than 5 courses
                        if (isSubscribed || totalCourse < 5) {  
                            router.push("/create"); 
                        }
                    }}
                    disabled={totalCourse >= 5 && !createButtonDisabled} 
                >
                    Create New
                </Button>
                <div className='mt-5'>
                    <Link href={'/dashboard'}>
                    <div className={`flex gap-5 items-center p-3 hover:bg-slate-200 rounded-lg cursor-pointer mt-3
                    ${path=='/dashboard'&&'bg-slate-200'}`}>
                        <LayoutDashboard />
                        <h2 className='text-center font-semibold'>Dashboard</h2>
                    </div>
                    </Link>
                    <Link href={'/dashboard/upgrade'}>
                    <div className={`flex gap-5 items-center p-3 hover:bg-slate-200 rounded-lg cursor-pointer mt-3
                    ${path=='/dashboard/upgrade'&&'bg-slate-200'}`}>
                        <Shield />
                        <h2 className='text-center font-semibold'>Upgrade</h2>
                    </div>
                    </Link>
                </div>
                
            </div>
            {totalCourse>5
            ?<div> </div>
            :<div className='border p-3 bg-slate-100 rounded-lg absolute bottom-10 w-[85%]'>
                <h2 className='text-lg'>Available Credits : {(5-totalCourse)}</h2>
                <Progress value={(totalCourse/5)*100} />
                <h2 className='text-sm'>{totalCourse} Out of 5 Credits Used</h2>
            </div>
            }
        </div>
    )
}

export default SideBar
