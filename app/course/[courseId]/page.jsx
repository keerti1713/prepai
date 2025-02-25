"use client"

import DashboardHeader from '@/app/dashboard/_components/DashboardHeader';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import CourseIntroCard from './_components/CourseIntroCard.jsx';
import StudyMaterialSection from './_components/StudyMaterialSection.jsx';
import ChapterList from './_components/ChapterList.jsx';


function Course() {
    const {courseId} = useParams();
    const [course, setCourse]=useState(null);
    useEffect(()=>{
        GetCourse();
    },[courseId])
    const GetCourse=async()=>{
        const result = await axios.get(`/api/courses?courseId=${courseId}`);

        if (!result.data) {
            console.error("Error: API response is empty.");
            return;
        }

        if (!result.data.result) {
            console.error("Error: API response does not have 'result' key.", result.data);
            return;
        }
        setCourse(result.data.result)
    }

  return (
    <div>
        <div>
            {/*Course Intro */}
            <CourseIntroCard course={course} />
            {/*Study Material Option */}
            <StudyMaterialSection courseId={courseId} course={course} />
            {/*Chapter List */}
            <ChapterList course={course}/>
        </div>
        
    </div>
  )
}

export default Course
