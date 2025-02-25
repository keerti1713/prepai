'use client'
import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import CourseCardItem from './CourseCardItem';
import { Button } from '@/components/ui/button';
import { RefreshCw } from "lucide-react";
import { CourseCount } from '@/app/_context/CourseCount';
import Link from 'next/link';
import { useSubscription } from "@/app/_context/SubscriptionContext";
import { useRouter } from "next/navigation";


function CourseList() {
    const { checkSubscription, createButtonDisabled } = useSubscription();
    const{user}=useUser();
    const router = useRouter();
    const [courseList, setCourseList]=useState([]);
    const [loading, setLoading]=useState(false);
    const {totalCourse, setTotalCourse}=useContext(CourseCount);

    useEffect(()=>{
        user&&GetCourseList();
    }, [user])

    const GetCourseList=async()=>{
        setLoading(true);
        const result=await axios.post('/api/courses',
            {createdBy: user?.primaryEmailAddress?.emailAddress})
            setCourseList(result.data.result)
            setLoading(false);
            setTotalCourse(result.data.result?.length);
    }
  return (
    <div className='mt-10'>
        <div className='flex flex-row'>
            <h2 className='font-bold text-2xl flex justify-between items-center'>Explore Your Courses</h2>
            <div className='gap-2 ml-auto flex flex-row'>
                <Button variant="outline" onClick={GetCourseList} className="border-[#8624bb] w-auto"><RefreshCw /></Button>
                <Button
                    className={`w-full text-[15px] ${totalCourse >= 5 && !createButtonDisabled
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
                    +
                </Button>
            </div>
        </div>
        
        {!courseList || courseList.length === 0 
        ? <p className='m-12 text-gray-200 text-[20px] text-center'>Courses</p>
        : <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-2 gap-5'>
            {loading === false 
                ? courseList.map((course, index) => (
                    <CourseCardItem course={course} key={index} />
                ))
                : [1, 2, 3, 4, 5, 6].map((item, index) => (
                    <div key={index} className='h-56 w-full bg-slate-200 rounded-lg animate-pulse'></div>
                ))
            }
            </div>
        }

    </div>
  )
}

export default CourseList