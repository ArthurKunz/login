'use client'

import { useState } from 'react'
import { supabase } from '../../utils/supabase/client'

interface SignUpProps {
    onSuccess: (email: string) => void
    onGoToSignIn: () => void
}

export default function SignUp({ onSuccess, onGoToSignIn }: SignUpProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
            console.error('SignUp error:', error)
            alert(error.message)
        } else {
            onSuccess(email)
        }
    }

    const handleGoogleSignUp = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin },
        })
        if (error) {
            console.error('Google signup error:', error)
            alert(error.message)
        } else {
            onSuccess(email)
        }
    }

    return (
        <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
            <h2 className='text-lg font-bold'>Sign Up</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                className="p-2 border"
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                className="p-2 border"
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Sign Up</button>
            <button type="button" onClick={handleGoogleSignUp} className="bg-white border p-2 rounded w-full">Sign up with Google</button>
            <button type="button" onClick={onGoToSignIn} className='text-blue-500 hover:underline text-left'>Already have an account? Sign In</button>
        </form>
    )
}
