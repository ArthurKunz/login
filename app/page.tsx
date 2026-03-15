// components/SignUpForm.tsx
'use client'

import { useState} from 'react'
import { supabase } from '../utils/supabase/client'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'signup' | 'verify' | 'signin' | 'home'>('signin')



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
      console.log('Verification succesful! You are now a real user!')
      setStep('home')
    }
  }

  // Step 2: Sign in the user with email/password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword ({
      email,
      password
    })
    if (error) alert(error.message)
      else {
        console.log('Sign in successful! Welcome back!')
        setStep('home')
      }
  }


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert(error.message)
    } else {
      console.log('Logged out successfully!')
      setStep('signin')
    }
  }




  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow-sm mt-20">



        <form onSubmit={handleSignUp} className={`flex-col gap-4 ${step === 'signup' ? 'flex' : 'hidden'}`}>
          <h2 className='text-lg font-bold'>Sign Up</h2>
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
          <span>Already have an account? <span className="text-blue-500 underline cursor-pointer" onClick={() => setStep('signin')}>Sign In</span></span>
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
          <button className='bg-blue-500 text-white p-2 rounded'>Sign In</button>
          <span>Don't have an account? <span className="text-blue-500 underline cursor-pointer" onClick={() => setStep('signup')}>Sign Up</span></span>
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



        <div className={`w-full h-auto bg-blue-500 flex-col py-10 px-10 gap-5 items-center ${step === 'home' ? 'flex' : 'hidden'}`}>
          <h1 className='text-3xl text-blue-800 font-bold'>Homepage</h1>
          <button onClick={() => handleLogout()} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>Logout</button>
          <button className='bg-blue-200 w-full text-white p-2 rounded'>Delete Account</button>
        </div>



    </div>
  )
}