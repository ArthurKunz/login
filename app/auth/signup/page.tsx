'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../utils/supabase/client'



export default function SignUpPage () {
    const [email, setEmail] = useState ('')
    const [password, setPassword] = useState('')
    const router = useRouter();



    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) alert(error.message) 
        else router.push(`/auth/verify?email=${email}`)
    }



    const handleGoogleSignup = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        })
        if (error) alert(error.message)
    }



    return (
        <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
        <h2 className='text-lg font-bold'>Sign Up</h2>
        <input 
          key="signup-email"
          type="email" 
          placeholder="Email"
          value={email}
          className="p-2 border" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          key="signup-password"
          type="password" 
          placeholder="Password" 
          value={password}
          className="p-2 border" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button className="bg-blue-500 text-white p-2 rounded">Sign Up</button>
        <button type="button" onClick={handleGoogleSignup} className="bg-white border p-2 rounded w-full">Sign up with Google</button>
        <Link href='/auth/signin' className='text-blue-500 hover:underline'>Sign In</Link>
      </form>
    )
}