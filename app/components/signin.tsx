'use client'

import { useState } from 'react'
import { supabase } from '../../utils/supabase/client'

interface SignInProps {
    onSuccess: () => void
    onGoToSignUp: () => void
}

export default function SignIn({ onSuccess, onGoToSignUp }: SignInProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            console.error('SignIn error:', error)
            alert(error.message)
        } else {
            onSuccess()
        }
    }

    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin },
        })
        if (error) {
            console.error('Google signin error:', error)
            alert(error.message)
        }
    }

    return (
        <form onSubmit={handleSignIn} className='flex flex-col gap-4'>
            <h2 className='text-lg font-bold'>Sign In</h2>
            <input
                type='email'
                placeholder='Email'
                value={email}
                className='p-2 border'
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type='password'
                placeholder='Password'
                value={password}
                className='p-2 border'
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" className='bg-blue-500 text-white p-2 rounded'>Sign In</button>
            <button type="button" onClick={handleGoogleSignIn} className="bg-white border p-2 rounded w-full">
                Sign In with Google
            </button>
            <button type="button" onClick={onGoToSignUp} className='text-blue-500 hover:underline text-left'>
                Don't have an account? Sign Up
            </button>
        </form>
    )
}
