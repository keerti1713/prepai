import React from 'react'

function ChapterList({ course }) {
    const Chapters = course?.courseLayout?.chapters || []; 

    return (
        <div className='mt-5'>
            <h2 className='font-medium text-xl'>Chapters</h2>
            <div className='m-5'>
                {Chapters.map((chapter, index) => (
                    <div key={index} className='flex gap-5 items-center p-4 border shadow-md mb-2 rounded-lg cursor-pointer'>
                        <h2 className='text-2xl font-bold'>{index + 1}</h2>
                        <div>
                            <h2 className="font-medium text-[#8716b4]">{chapter?.chapterTitle}</h2>
                            <p className="text-gray-600 text-sm">{chapter?.chapterSummary}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChapterList;
