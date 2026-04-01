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
    const [gender, setGender] = useState('')
    const [height, setHeight] = useState('')
    const [relationship, setRelationship] = useState('')

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
            gender,
            height: parseInt(height),
            relationship,
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
            <select value={gender} className="p-2 border bg-white" onChange={(e) => setGender(e.target.value)} required>
                <option value="" disabled>Geschlecht wählen</option>
                <option value="female">Weiblich</option>
                <option value="male">Männlich</option>
                <option value="diverse">Divers</option>
                <option value="prefer_not_to_say">Keine Angabe</option>
            </select>
            <input type="number" placeholder="Größe (cm)" value={height} className="p-2 border" min={50} max={250} onChange={(e) => setHeight(e.target.value)} required />
            <select value={relationship} className="p-2 border bg-white" onChange={(e) => setRelationship(e.target.value)} required>
                <option value="" disabled>Beziehungsstatus</option>
                <option value="single">Single</option>
                <option value="relationship">In einer Beziehung</option>
                <option value="prefer_not_to_say">Keine Angabe</option>
            </select>

            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save & Continue</button>
        </form>
    )
}
