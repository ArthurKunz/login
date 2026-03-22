'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase/client'

export default function OnboardingPage () {
    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('')
    const [surname, setSurname] = useState('')
    const [age, setAge] = useState('')
    const [gradelevel, setGradelevel] = useState('')
    const [averagemark, setAveragemark] = useState('')
    const router = useRouter()


    
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
            if (error.code === '23505') alert('That username is already taken. Please choose another.')
            else alert(error.message)
        } else {
            router.push('/home')
        }
    }



    return (
        <form onSubmit={handleSetUpProfile} className='flex flex-col gap-4'>
            <h2 className='text-lg font-bold'>Set up your profile</h2>
            <input type="text" placeholder="Username" value={username} className="p-2 border" onChange={(e) => setUsername(e.target.value)} required />
            <input type="text" placeholder="Vorname" value={firstname} className="p-2 border" min={1} max={120} onChange={(e) => setFirstname(e.target.value)} required />
            <input type="text" placeholder="Nachname" value={surname} className="p-2 border" onChange={(e) => setSurname(e.target.value)} required />
            <input type="number" placeholder="Alter" value={age} className="p-2 border" min={1} max={120} onChange={(e) => setAge(e.target.value)} required />
            <input type="number" placeholder="Klassenstufe" value={gradelevel} className="p-2 border" onChange={(e) => setGradelevel(e.target.value)} required />
            <input type="number" placeholder="Notendurchschnitt" value={averagemark} className="p-2 border" step="0.1" min={0.8} max={6} onChange={(e) => setAveragemark(e.target.value)} required />
            <button className="bg-blue-500 text-white p-2 rounded">Save & Continue</button>
        </form>
    )
}