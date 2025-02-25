'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';

function ViewNotes() {
    const {courseId}=useParams()
    const[notes,setNotes]=useState(null)
    const [stepCount, setStepCount]=useState(0)
    const router=useRouter()

    useEffect(()=>{
        GetNotes();
    },[])
    const GetNotes=async ()=>{
        const result = await axios.post('/api/study-type',{
            courseId: courseId,
            studyType: 'notes'
        })

        setNotes(result?.data)
    }
  return notes&&(
    <div>
        <div className='flex gap-5 items-center'>
            {stepCount!=0&&<Button className='hover:bg-[#DAD2FF]' variant='outline' size='sm' onClick={()=>setStepCount(stepCount-1)}>Previous</Button>}
            {notes?.map((item,index)=>(
                <div key={index} className={`w-full h-2 rounded-full
                ${index<stepCount?'bg-[#9D44C0]':'bg-gray-300'}`}>
                </div>
            ))}
            <Button className='hover:bg-[#DAD2FF]' variant='outline' size='sm' onClick={()=>setStepCount(stepCount+1)}>Next</Button>
        </div>
        <div className='m-10'>
            <div dangerouslySetInnerHTML={{__html:(notes[stepCount]?.notes)?.replace('```html', ' ')
                .replace('```', ' ')
                .replace(/<h2>.*?<\/h2>/, '')}} />

            {notes?.length==stepCount && <div className='flex items-center gap-10 flex-col justify-center'>
                <h2>Great Job! Notes Completed.</h2>
                <Button onClick={()=>router.back()}>Back to Course Overview</Button>
            </div>}
        </div>
    </div>
  )
}

export default ViewNotes