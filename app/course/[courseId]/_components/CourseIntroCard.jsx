import React from 'react'
import Image from 'next/image'


function CourseIntroCard({course}) {
  return (
    <div className='flex gap-5 items-center p-10 border shadow-md rounded-lg'>
        <Image src={'/courseAi.png'} alt='other' width={70} height={70} />
        <div>
            <h2 className='capitalize font-bold text-2xl line-clamp-2'>{course?.topic}</h2>
            
            <p className="text-sm">
                {course?.courseLayout?.courseSummary}
            </p>
            <div className='mt-3 flex items-center'>
                <h2 className='text-gray-600'>Total Chapters: {course?.courseLayout?.chapters?.length}</h2>
            </div>
            
        </div>
    </div>
  )
}

export default CourseIntroCard