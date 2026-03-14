// components/SignUpForm.tsx
'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabase/client'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'signup' | 'verify'>('signup')

  // Step 1: Send the email/password to Supabase
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) alert(error.message)
    else setStep('verify')
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow-sm mt-20">
      {step === 'signup' ? (
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="p-2 border" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="p-2 border" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button className="bg-blue-500 text-white p-2 rounded">Sign Up</button>
        </form>
      ) : (
        <div className='flex flex-col items-center h-200 w-full bg-blue-300'> 
          <span>{ email }</span>
          <span>{ password }</span>
        </div>
      )}
    </div>
  )
}
