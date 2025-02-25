import { UserButton } from '@clerk/nextjs'
import React from 'react'
import Image from 'next/image'

function DashboardHeader() {
    return (
        <div className='p-5 shadow-md flex justify-end'>
            <div className='flex gap-2 items-center mr-auto'>
                <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
                <h2 className="font-bold text-2xl">PrepAI</h2>
            </div>
            <UserButton />
        </div>
    );
}

export default DashboardHeader