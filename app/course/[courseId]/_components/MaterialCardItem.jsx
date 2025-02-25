import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import Link from 'next/link'
import { RefreshCcw } from 'lucide-react'

function MaterialCardItem({ item, studyTypeContent, course, refreshData }) {
  const [loading, setLoading] = useState(false);
  const isContentAvailable = studyTypeContent?.[item.type]?.length > 0;

  const GenerateContent = async () => {
    setLoading(true);

    if (!course || !course.courseLayout || !course.courseLayout.chapters) {
      console.error("Course data is missing");
      setLoading(false);
      return;
    }

    let chapters = course.courseLayout.chapters.map(chapter => chapter.chapterTitle);

    try {
      
      await axios.post('/api/generate-study-content', {
        courseId: course?.courseId,
        type: item.type,
        chapters
      }, {
        headers: { 'Content-Type': 'application/json' }
    });

      setTimeout(() => {
        refreshData(true);  
        setLoading(false);
        toast('Generating... Please wait!');
      }, 2000);

    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  return (
    <Link 
      href={isContentAvailable ? `/course/${course?.courseId}/${item.path}` : '#'} 
      onClick={(e) => {
        if (!isContentAvailable) {
          e.preventDefault();
        }
      }}
    >
      <div className={`border shadow-md rounded-lg p-5 flex flex-col items-center h-full
      ${!isContentAvailable && 'grayscale'}`}>

        <h2 className={`p-1 px-2 rounded-full text-black text-[13px] mb-2 
          ${isContentAvailable ? 'bg-[#DAD2FF]' : 'bg-gray-400'}`}>
          {isContentAvailable ? 'Ready' : 'Generate to View'}
        </h2>
        
        <Image src={item.icon} alt={item.name} width={50} height={50} />
        <h2 className='font-medium mt-2'>{item.name}</h2>
        <p className='text-gray-600 text-sm text-center mb-1'>{item.desc}</p>

        {!isContentAvailable 
          ? <Button className='mt-auto w-full' 
              variant="outline" 
              onClick={GenerateContent} 
              disabled={loading} >
              {loading && <RefreshCcw className='animate-spin' />}
              Generate
            </Button>
          : <Button className='mt-auto w-full' variant="outline">View</Button>
        }
      </div>
    </Link>
  );
}

export default MaterialCardItem;
