import React, { useState } from 'react'
import Image from 'next/image'

function SelectOption({selectedStudyType}) {
    const Options=[
        {
            name:'Exam',
            icon:'/exam.png'
        },
        {
            name:'Job Interview',
            icon:'/job.png'
        },
        {
            name:'Practice',
            icon:'/content.png'
        },
        {
            name:'Coding Prepare',
            icon:'/coding.png'
        },
        {
            name:'Other',
            icon:'/edu.png'
        },
    ]

    const [selectedOption, setSelectedOption]=new useState("");

    return (
        <div>
            <h2 className='text-center mb-2 text-lg'>What Would You Like to Learn Today?</h2>
            <div className='mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
                {Options.map((option,index)=>(
                    <div key={index} className={`flex flex-col items-center justify-center border rounded-xl hover:border-[#AD49E1] cursor-pointer ${option?.name==selectedOption&&'border-[#AD49E1]'}`}
                    onClick={()=>{
                        setSelectedOption(option.name);
                        selectedStudyType(option.name);
                    }}>
                        <Image src={option.icon} alt={option.name} width={50} height={50} />
                        <h2 className='text-sm mt-2'>{option.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SelectOption