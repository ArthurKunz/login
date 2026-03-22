'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../utils/supabase/client'

export default function SignInPage () {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()



    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithPassword ({
          email,
          password
        })
        if (error) alert(error.message)
        else {
            router.push('/home')
        }
    }

    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        })
        if (error) alert(error.message)
    }



    return (
        <form onSubmit={handleSignIn} className='flex flex-col gap-4'>
        <h2 className='text-lg font-bold'>login</h2>
        <input
          key="signin-email"
          type='email'
          placeholder='Email'
          value={email}
          className='p-2 border'
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          key="signin-password"
          type='password'
          placeholder='Password'
          value={password}
          className='p-2 border'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className='bg-blue-500 text-white p-2 rounded'>Sign In</button>
        <button type="button" onClick={handleGoogleSignIn} className="bg-white border p-2 rounded w-full">Sign In with Google</button>
        <span>Dont have an account? {' '}
          <Link href='/auth/signup' className='text-blue-500 hover:underline'>Sign Up</Link>
        </span>
      </form>
    )
}