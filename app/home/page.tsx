'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../utils/supabase/client'

type Profile = {
    username: string;
    firstname: string;
    surname: string;
    age: number;
    gradelevel: number;
    averagemark: number
}

export default function HomePage () {
    const [profile, setProfile] = useState<Profile | null>(null)
    const router = useRouter()



    useEffect(() => {
        const fetchProfile = async () => {
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) { router.push('/auth/signin'); return }
    
          const { data } = await supabase.from('profiles')
            .select('username, firstname, surname, age, gradelevel, averagemark')
            .eq('id', session.user.id)
            .single()
    
          if (data) setProfile(data)
          else router.push('/onboarding')
        }
        fetchProfile()
    }, [])

    

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/auth/signin')
    }



    const handleDeleteAccount = async () => {
        if (!confirm('Permanently delete account?')) return
        const { error } = await supabase.rpc('delete_self')
        if (error) alert(error.message)
        else { await supabase.auth.signOut(); router.push('/auth/signup') }
    }



    return  (
        <div className='w-full h-auto bg-blue-500 flex flex-col py-10 px-10 gap-5 items-center'>
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
        <button onClick={() => handleDeleteAccount()} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>delete account</button>
        <button onClick={() => router.push('/settings/change-password')} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>change password</button>
        <button onClick={() => router.push('/settings/change-data')} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>change data</button>
      </div>
    )
}