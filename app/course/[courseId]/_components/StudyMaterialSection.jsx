import React, { useState } from 'react'
import MaterialCardItem from './MaterialCardItem'
import { db } from '@/configs/db'
import axios from 'axios'
import { useEffect } from 'react'

function StudyMaterialSection({courseId,course}) {

    const [studyTypeContent, setStudyContent]=useState(null);

    const MaterialList=[
        {
            name:'Chapters',
            desc:'Key points and summaries to help you grasp the essentials.',
            icon:'/notes.png',
            path:'/notes',
            type:'notes'
        },
        {
            name:'FlashCard',
            desc:'Quick, interactive way to test your memory and boost retention.',
            icon:'/flashcard.png',
            path:'/flashcards',
            type:'flashcards'
        },
        {
            name:'Quiz',
            desc:'Multiple-choice questions to challenge your knowledge and track your progress.',
            icon:'/quiz.png',
            path:'/quiz',
            type:'quiz'
        }
    ]

    useEffect(()=>{
        if (courseId) {
            GetStudyMaterial();
        }
    },[courseId]);

    const GetStudyMaterial = async () => {
        try {
            if (!courseId) {
                console.error("Error: courseId is undefined");
                return;
            }
    
            const result = await axios.post('/api/study-type', {
                courseId: courseId,
                studyType: 'ALL'
            });
    
            setStudyContent(result.data);
            } catch (error) {
                console.error("Axios Error:", error.response?.data || error.message);
            }
    };
    

  return (
    <div className='mt-5'>
        <h2 className='font-medium text-2xl'>Course Material</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mt-3'>
            {MaterialList.map((item,index)=>(
                <MaterialCardItem key={index} item={item} studyTypeContent={studyTypeContent} course={course} refreshData={GetStudyMaterial} />
            ))}
        </div>
    </div>
  )
}

export default StudyMaterialSection