'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../utils/supabase/client'

type Profile = {
    username: string;
    firstname: string;
    surname: string;
    age: number;
    gradelevel: number;
    averagemark: number;
    gender: string | null;
    height: number | null;
    relationship: string | null;
    instagram: string | null;
    tiktok: string | null;
    snapchat: string | null;
    school: string | null;
}

const genderLabel: Record<string, string> = {
    female: 'Weiblich',
    male: 'Männlich',
    diverse: 'Divers',
    prefer_not_to_say: 'Keine Angabe',
}

const relationshipLabel: Record<string, string> = {
    single: 'Single',
    relationship: 'In einer Beziehung',
    married: 'Verheiratet',
    complicated: 'Kompliziert',
    prefer_not_to_say: 'Keine Angabe',
}

export default function HomePage () {
    const [profile, setProfile] = useState<Profile | null>(null)
    const router = useRouter()



    useEffect(() => {
        const fetchProfile = async () => {
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) { router.push('/auth/signin'); return }
    
          const { data } = await supabase.from('profiles')
            .select('username, firstname, surname, age, gradelevel, averagemark, gender, height, relationship, instagram, tiktok, snapchat, school')
            .eq('id', session.user.id)
            .single()
    
          if (data) setProfile(data)
          else router.push('/pages/auth')
        }
        fetchProfile()
    }, [])

    

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/pages/auth')
    }



    const handleDeleteAccount = async () => {
        if (!confirm('Permanently delete account?')) return
        const { error } = await supabase.rpc('delete_self')
        if (error) alert(error.message)
        else { await supabase.auth.signOut(); router.push('/pages/auth') }
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
            <p><strong>Geschlecht:</strong> {profile.gender ? (genderLabel[profile.gender] ?? profile.gender) : '—'}</p>
            <p><strong>Größe:</strong> {profile.height != null ? `${profile.height} cm` : '—'}</p>
            <p><strong>Beziehung:</strong> {profile.relationship ? (relationshipLabel[profile.relationship] ?? profile.relationship) : '—'}</p>
            <p><strong>Instagram:</strong> {profile.instagram}</p>
            <p><strong>Tiktok:</strong> {profile.tiktok}</p>
            <p><strong>Snapchat:</strong> {profile.snapchat}</p>
            <p><strong>Schule:</strong> {profile.school}</p>
          </div>
        )}
        <button onClick={() => handleLogout()} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>Logout</button>
        <button onClick={() => handleDeleteAccount()} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>delete account</button>
        <button onClick={() => router.push('/settings/change-password')} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>change password</button>
        <button onClick={() => router.push('/settings/change-data')} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>change data</button>
      </div>
    )
}