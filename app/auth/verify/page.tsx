'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../utils/supabase/client'

export default function VerifyPage () {
    const [code, setCode] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email') ?? ''



    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.auth.verifyOtp({
            email: email,
            token: code,
            type: 'signup',
        })
    
        if (error) alert('Wrong code! ' + error.message) 
        else router.push('/onboarding')
    }



    return (
        <form onSubmit={handleVerify} className='flex flex-col gap-4'>
            <input
            type="text"
            placeholder="8-digit code"
            value={code}
            className="p-2 border"
            onChange={(e) => setCode(e.target.value)}
            required
            />
            <button className="bg-green-500 text-white p-2 rounded">Verify</button>
        </form>
    )
}