/*
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase/client'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'signup' | 'verify' | 'signin' | 'profile' | 'changeData' | 'home' | 'changePassword'>('signup')
  const [user, setUser] = useState<any>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [profile, setProfile] = useState<{ username: string; firstname: string; surname: string; age: number; gradelevel: number; averagemark: number;} | null>(null)
  const [username, setUsername] = useState('')
  const [firstname, setFirstname] = useState('')
  const [surname, setSurname] = useState('')
  const [age, setAge] = useState('')
  const [gradelevel, setGradelevel] = useState('')
  const [averagemark, setAveragemark] = useState('')




  
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
        redirectTo: window.location.origin,
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
      firstname,
      surname,
      age: parseInt(age),
      gradelevel: parseInt(gradelevel),
      averagemark: parseFloat(averagemark),
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



  const handleChangeData = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert ('not loged in')
      return
    }

    const { error } = await supabase.from('profiles')
    .update({
      username: username,
      firstname: firstname,
      surname: surname,
      age: age,
      gradelevel: gradelevel,
      averagemark: averagemark,
    })
    .eq('id', session.user.id)

    if (error) {
      alert(error.message)
    } else {
      setUser(session.user)
      await fetchProfile(session.user.id)
      setStep('home')
    }
  }



  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, firstname, surname, age, gradelevel, averagemark')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile(data)
      setUsername(data.username)
      setFirstname(data.firstname)
      setSurname(data.surname)
      setAge(String(data.age))
      setGradelevel(String(data.gradelevel))
      setAveragemark(String(data.averagemark))
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
    <div className='w-screen flex justify-center'>
      <div className="w-150 mx-auto p-6 border rounded shadow-sm mt-20">

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
          <span className='text-blue-500 underline cursor-pointer' onClick={() => setStep('signup')}>back</span>
        </form>


        <form onSubmit={handleProfileSetup} className={`flex-col gap-4 ${step === 'profile' ? 'flex' : 'hidden'}`}>
          <h2 className='text-lg font-bold'>Set up your profile</h2>
          <input type="text" placeholder="Username" value={username} className="p-2 border" onChange={(e) => setUsername(e.target.value)} required />
          <input type="text" placeholder="Vorname" value={firstname} className="p-2 border" min={1} max={120} onChange={(e) => setFirstname(e.target.value)} required />
          <input type="text" placeholder="Nachname" value={surname} className="p-2 border" onChange={(e) => setSurname(e.target.value)} required />
          <input type="number" placeholder="Alter" value={age} className="p-2 border" min={1} max={120} onChange={(e) => setAge(e.target.value)} required />
          <input type="number" placeholder="Klassenstufe" value={gradelevel} className="p-2 border" onChange={(e) => setGradelevel(e.target.value)} required />
          <input type="number" placeholder="Notendurchschnitt" value={averagemark} className="p-2 border" step="0.1" min={0.8} max={6} onChange={(e) => setAveragemark(e.target.value)} required />
          <button className="bg-blue-500 text-white p-2 rounded">Save & Continue</button>
        </form>


        <form onSubmit={handleChangeData} className={`flex-col gap-4 ${step === 'changeData' ? 'flex' : 'hidden'}`}>
          <h2 className='text-lg font-bold'>Set up your profile</h2>
          <input type="text" placeholder="Username" value={username} className="p-2 border" onChange={(e) => setUsername(e.target.value)} required />
          <input type="text" placeholder="Vorname" value={firstname} className="p-2 border" min={1} max={120} onChange={(e) => setFirstname(e.target.value)} required />
          <input type="text" placeholder="Nachname" value={surname} className="p-2 border" onChange={(e) => setSurname(e.target.value)} required />
          <input type="number" placeholder="Alter" value={age} className="p-2 border" min={1} max={120} onChange={(e) => setAge(e.target.value)} required />
          <input type="number" placeholder="Klassenstufe" value={gradelevel} className="p-2 border" onChange={(e) => setGradelevel(e.target.value)} required />
          <input type="number" placeholder="Notendurchschnitt" value={averagemark} className="p-2 border" step="0.1" min={0.8} max={6} onChange={(e) => setAveragemark(e.target.value)} required />
          <button className="bg-blue-500 text-white p-2 rounded">Save & Continue</button>
          <span className='text-blue-500 underline cursor-pointer' onClick={() => setStep('home')}>Cancel</span>
        </form>
        

        <div className={`w-full h-auto bg-blue-500 flex-col py-10 px-10 gap-5 items-center ${step === 'home' ? 'flex' : 'hidden'}`}>
          <h1 className='text-3xl text-blue-800 font-bold'>Homepage</h1>
          {profile && (
            <div className="bg-white text-black w-full p-3 rounded">
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Vorname</strong> {profile.firstname}</p>
              <p><strong>Nachname:</strong> {profile.surname}</p>
              <p><strong>Age:</strong> {profile.age}</p>
              <p><strong>Gradelevel:</strong> {profile.gradelevel}</p>
              <p><strong>Averagemark:</strong> {profile.averagemark}</p>
            </div>
          )}
          <button onClick={() => handleLogout()} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>Logout</button>
          <button onClick={() => handleDeleteAccount()} className='cursor-pointer bg-red-500 w-full text-white p-2 rounded'>Delete Account</button>
          <button onClick={() => setStep('changePassword')} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>Change Password</button>
          <button onClick={() => setStep('changeData')} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>Change Data</button>
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
    </div>
  )
}





'use client'

import { useState } from 'react'
import { supabase } from '../../../utils/supabase/client'

interface ChangePasswordFormProps {
  onSuccess: () => void
}

export default function ChangePasswordPage({ onSuccess }: ChangePasswordFormProps) {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
    
        if (newPassword !== confirmPassword) {
          alert('Passwords do not match!')
          return
        }
    
        const { error } = await supabase.auth.updateUser({ password: newPassword })
    
        if (error) {
          alert(error.message)
        } else {
            onSuccess()
            alert('Password changed successfully!')
        }
      }


    return (
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">Change Password</h2>
            <input type="password" placeholder="New Password" value={newPassword}
            className="p-2 border" onChange={(e) => setNewPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm New Password" value={confirmPassword}
            className="p-2 border" onChange={(e) => setConfirmPassword(e.target.value)} required />
            <button className="bg-blue-500 text-white p-2 rounded">Save New Password</button>
        </form>
    )
}




















'use client'

import { useState } from 'react'
import { supabase } from '../../utils/supabase/client'

interface OnboardingProps {
    onSuccess: () => void
}


export default function Onboarding({ onSuccess }: OnboardingProps) {
    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('')
    const [surname, setSurname] = useState('')
    const [age, setAge] = useState('')
    const [gradelevel, setGradelevel] = useState('')
    const [averagemark, setAveragemark] = useState('')

    const handleSetUpProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            alert('Not logged in.')
            return
        }
        const { error } = await supabase.from('profiles').insert({
            id: session.user.id,
            username,
            firstname,
            surname,
            age: parseInt(age),
            gradelevel: parseInt(gradelevel),
            averagemark: parseFloat(averagemark),
        })
        if (error) {
            console.error('Onboarding error:', error)
            if (error.code === '23505') alert('That username is already taken. Please choose another.')
            else alert(error.message)
        } else {
            onSuccess()
        }
    }

    return (
        <form onSubmit={handleSetUpProfile} className='flex flex-col gap-4'>
            <h2 className='text-lg font-bold'>Set up your profile</h2>
            <input type="text" placeholder="Username" value={username} className="p-2 border" onChange={(e) => setUsername(e.target.value)} required />
            <input type="text" placeholder="Vorname" value={firstname} className="p-2 border" onChange={(e) => setFirstname(e.target.value)} required />
            <input type="text" placeholder="Nachname" value={surname} className="p-2 border" onChange={(e) => setSurname(e.target.value)} required />
            <input type="number" placeholder="Alter" value={age} className="p-2 border" min={1} max={120} onChange={(e) => setAge(e.target.value)} required />
            <input type="number" placeholder="Klassenstufe" value={gradelevel} className="p-2 border" onChange={(e) => setGradelevel(e.target.value)} required />
            <input type="number" placeholder="Notendurchschnitt" value={averagemark} className="p-2 border" step="0.1" min={0.8} max={6} onChange={(e) => setAveragemark(e.target.value)} required />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save & Continue</button>
        </form>
    )
}

*/