// components/SignUpForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase/client'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'signup' | 'verify' | 'signin' | 'profile' |'home' | 'changePassword'>('signup')
  const [user, setUser] = useState<any>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profile, setProfile] = useState<{ username: string; age: number } | null>(null)

  const [username, setUsername] = useState('')
  const [age, setAge] = useState('')




  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      alert(error.message) 
    } else {
      setStep('verify') 
    }
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
      setStep('profile')
    }
  }



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



  const handleGoogleSignUpOrSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // sends user back to your app after Google login
      },
    })
    if (error) alert(error.message)
  }



  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert(error.message)
    } else {
      console.log('Logged out successfully!')
      setUser(null)
      setStep('signin')
    }
  }



  const handleDeleteAccount = async () => {
    if (confirm("Permanently delete account?")) {
      const { error } = await supabase.rpc('delete_self')
      if (error) {
        alert(error.message)
      } else {
        handleLogout();
        setStep('signup')
      }
    }
  }



  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Password changed successfully!')
      setStep('home')
    }
  }



  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('Not logged in.')
      return
    }

    const { error } = await supabase.from('profiles').insert({
      id: session.user.id,
      username,
      age: parseInt(age),
    })

    if (error) {
      if (error.code === '23505') {
        alert('That username is already taken. Please choose another.')
      } else {
        alert(error.message)
      }
    } else {
      setUser(session.user)
      await fetchProfile(session.user.id)
      setStep('home')
    }
  }



  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, age')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile(data)
      setStep('home')
    } else {
      setStep('profile')
    }
  }



  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        await fetchProfile(session.user.id)
      }
    }
    checkUser()
  }, [])





  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow-sm mt-20">



        <form onSubmit={handleSignUp} className={`flex-col gap-4 ${step === 'signup' ? 'flex' : 'hidden'}`}>
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
          <button type="button" onClick={handleGoogleSignUpOrSignIn} className="bg-white border p-2 rounded w-full">Sign up with Google</button>
          <span>Already have an account? <span className="text-blue-500 underline cursor-pointer" onClick={() => setStep('signin')}>Sign In</span></span>
        </form>



        <form onSubmit={handleSignIn} className={`flex-col gap-4 ${step === 'signin' ? 'flex' : 'hidden'}`}>
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
          <button type="button" onClick={handleGoogleSignUpOrSignIn} className="bg-white border p-2 rounded w-full">Sign In with Google</button>
          <span>Don't have an account? <span className="text-blue-500 underline cursor-pointer" onClick={() => setStep('signup')}>Sign Up</span></span>
        </form>



        <form onSubmit={handleVerify} className={`flex-col gap-4 ${step === 'verify' ? 'flex' : 'hidden'}`}>
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


      <form onSubmit={handleProfileSetup} className={`flex-col gap-4 ${step === 'profile' ? 'flex' : 'hidden'}`}>
        <h2 className='text-lg font-bold'>Set up your profile</h2>
        <input type="text" placeholder="Username" value={username} className="p-2 border" onChange={(e) => setUsername(e.target.value)} required />
        <input type="number" placeholder="Age" value={age} className="p-2 border" min={1} max={120} onChange={(e) => setAge(e.target.value)} required />
        <button className="bg-blue-500 text-white p-2 rounded">Save & Continue</button>
      </form>
        

        <div className={`w-full h-auto bg-blue-500 flex-col py-10 px-10 gap-5 items-center ${step === 'home' ? 'flex' : 'hidden'}`}>
          <h1 className='text-3xl text-blue-800 font-bold'>Homepage</h1>
          {profile && (
            <div className="bg-white text-black w-full p-3 rounded">
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Age:</strong> {profile.age}</p>
            </div>
          )}
          <button onClick={() => handleLogout()} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>Logout</button>
          <button onClick={() => handleDeleteAccount()} className='cursor-pointer bg-red-500 w-full text-white p-2 rounded'>Delete Account</button>
          <button onClick={() => setStep('changePassword')} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>Change Password</button>
        </div>

        <form onSubmit={handleChangePassword} className={`flex-col gap-4 ${step === 'changePassword' ? 'flex' : 'hidden'}`}>
          <h2 className='text-lg font-bold'>Change Password</h2>
          <input
            type='password'
            placeholder='New Password'
            value={newPassword}
            className='p-2 border'
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Confirm New Password'
            value={confirmPassword}
            className='p-2 border'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className='bg-blue-500 text-white p-2 rounded'>Save New Password</button>
          <span className='text-blue-500 underline cursor-pointer' onClick={() => setStep('home')}>Cancel</span>
        </form>
    </div>
  )
}