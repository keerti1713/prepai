'use client'
import React from 'react'
import Image from 'next/image'
import {useUser} from '@clerk/nextjs'
import Link from 'next/link'

function WelcomeBanner() {
    const {user} =useUser()
  return (
    <div className='flex flex-col'>
      <div className='p-5 bg-[#562C7C] w-full text-white rounded-lg flex items-center gap-6'>
        <Image src={'/laptop.png'} alt="laptop" width={100} height={100} />
        <div>
            <h2 className='font-bold text-3xl'>Welcome, {user?.fullName}</h2>
            <p>Let's Start Your Learning Journey!</p>
        </div>
      </div>
        <div className='ml-auto'>
          <Link href={'/dashboard/upgrade'} className='text-[#71239b] text-xs mt-3'>
              Upgrade to Create more!
          </Link>
      </div>
    </div>
  )
}

export default WelcomeBanner