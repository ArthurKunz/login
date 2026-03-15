// components/SignUpForm.tsx
'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabase/client'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'signup' | 'verify' | 'signin'>('signin')

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

  //verify the code sent to the user's email
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


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword ({
      email,
      password
    })
    if (error) alert(error.message)
      else alert('Sign in successful! Welcome back!')
  }



  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow-sm mt-20">



        <form onSubmit={handleSignUp} className={`flex-col gap-4 ${step === 'signup' ? 'flex' : 'hidden'}`}>
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



        <form onSubmit={handleSignIn} className={`flex-col gap-4 ${step === 'signin' ? 'flex' : 'hidden'}`}>
          <h2 className='text-lg font-bold'>login</h2>
          <input
            type='email'
            placeholder='Email'
            className='p-2 border'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Password'
            className='p-2 border'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="bg-blue-500 text-white p-2 rounded">Sign In</button>
        </form>



        <form onSubmit={handleVerify} className={`flex-col gap-4 ${step === 'verify' ? 'flex' : 'hidden'}`}>
          <input
            type="text"
            placeholder="6-digit code"
            className="p-2 border"
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button className="bg-green-500 text-white p-2 rounded">Verify</button>
        </form>



    </div>
  )
}
