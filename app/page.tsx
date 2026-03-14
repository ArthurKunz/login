// components/SignUpForm.tsx
'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabase/client'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: 'signup',
    })

    if (error) {
      alert('Wrong code! ' + error.message) 
    } else {
      alert('Verification succesful! You are now a real user!')
    }
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
        <form onSubmit={handleVerify} className='flex flex-col gap-4'>
          <input
            type="text"
            placeholder="6-digit code"
            className="p-2 border"
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button className="bg-green-500 text-white p-2 rounded">Verify</button>
        </form>
      )}
    </div>
  )
}
