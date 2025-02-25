"use client"
import React, { useEffect } from 'react'
import {useUser} from "@clerk/nextjs"
import axios from 'axios';

function Provider({children}) {
    const {user}= useUser();
    useEffect(()=>{
        user&&CheckIsNewUser();
    },[user])

    const CheckIsNewUser=async ()=>{
        
        const resp= await axios.post("/api/create-user",{user:user});
    }

    return (
        <div>
            {children}
        </div>
    )

}

export default Provider;