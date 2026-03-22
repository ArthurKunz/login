'use client'

import { useState } from 'react'
import { supabase } from '../../utils/supabase/client'

interface VerifyProps {
    email: string
    onSuccess: () => void
}

export default function Verify({ email, onSuccess }: VerifyProps) {
    const [code, setCode] = useState('')

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: 'signup',
        })
        if (error) {
            console.error('Verify error:', error)
            alert('Wrong code! ' + error.message)
        } else {
            onSuccess()
        }
    }

    return (
        <form onSubmit={handleVerify} className='flex flex-col gap-4'>
            <h2 className='text-lg font-bold'>Check your email</h2>
            <p className='text-sm text-gray-500'>We sent a code to <strong>{email}</strong></p>
            <input
                type="text"
                placeholder="6-digit code"
                value={code}
                className="p-2 border"
                onChange={(e) => setCode(e.target.value)}
                required
            />
            <button type="submit" className="bg-green-500 text-white p-2 rounded">Verify</button>
        </form>
    )
}
