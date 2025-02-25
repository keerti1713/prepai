import React , {useState, useEffect} from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { RefreshCw } from "lucide-react";
import Link from 'next/link';
import toast from 'sonner';
import axios from 'axios';

function CourseCardItem({course}) {
  const [courseStatus, setCourseStatus] = useState(course?.status || 'Generating');

  useEffect(() => {
      if (!course?.courseId) return;

      const intervalId = setInterval(async () => {
        try {
          const { data } = await axios.post('/api/course-status', { courseId: course.courseId });

          if (data?.status === 'Ready') {
              setCourseStatus('Ready');
              clearInterval(intervalId); //Stop polling once status is 'Ready'
          }
          } catch (error) {
              console.error("Error fetching course status:", error.message);
          }
        }, 5000); 

        return () => clearInterval(intervalId); 
    }, [course?.courseId]);     


  return (
    <div className='border rounded-lg shadow-md p-5'>
        <div>
            <div className='flex justify-between items-center'>
                <Image src={'/course.png'} alt="laptop" width={50} height={50} />
            </div>
            <h2 className='mt-3 font-medium text-lg line-clamp-1'>{course?.topic}</h2>
            <p className='text-xs line-clamp-2 text-gray-500'>{course?.courseLayout?.courseSummary}</p>
        </div>
        <div className='mt-3'>
        </div>
        <div className='mt-3 justify-end'>
            {courseStatus=='Generating'?
            <h2 className='text-sm w-auto p-1 px-2 flex gap-2 items-center rounded-full bg-gray-400 text-white'><RefreshCw className='h-5 w-5' />Generating...</h2>
            :<Link href={`/course/${course?.courseId}`}>
            <Button>View</Button>
            </Link>}
        </div>
    </div>
  )
}

export default CourseCardItem