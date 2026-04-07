'use client'

import { useState } from 'react'
import { supabase } from '../../utils/supabase/client'
import Combobox from '../components/Combobox'

interface OnboardingProps {
    onSuccess: () => void
}

const MAX_HOBBIES = 5

const POPULAR_HOBBIES = [
    { label: '🎮 Gaming' },
    { label: '💻 Technik' },
    { label: '🚗 Autos' },
    { label: '🎉 Events' },
    { label: '👗 Mode' },
    { label: '🍔 Essen & Trinken' },
    { label: '💪 Fitness' },
    { label: '⚽ Sport' },
    { label: '🎵 Musik' },
    { label: '✈️ Reisen' },
    { label: '🐶 Haustiere' },
    { label: '🎬 Filme & Serien' },
    { label: '📚 Lesen' },
    { label: '🎨 Kunst' },
    { label: '📷 Fotografie' },
    { label: '🌿 Natur & Outdoor' },
    { label: '🧘 Wellness' },
    { label: '🎲 Brettspiele' },
    { label: '🛹 Skaten & BMX' },
    { label: '🌱 Nachhaltigkeit' },
] as const

const SCHOOLS = [
    {
        "id": 1,
        "name": "125. Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 2,
        "name": "16. Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 3,
        "name": "205. Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 4,
        "name": "35. Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 5,
        "name": "56. Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 6,
        "name": "56. Schule - Oberschule der Stadt Leipzig - Schulteil Martin-Herrmann-Straße",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 7,
        "name": "94. Schule - Oberschule im Schulzentrum Grünau der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": true
    },
    {
        "id": 8,
        "name": "Aktive Schule Leipzig - Freie Oberschule",
        "type": "Freie Oberschule",
        "isPrivate": true
    },
    {
        "id": 9,
        "name": "Apollonia-von-Wiedebach-Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 10,
        "name": "Bischöfliches Maria-Montessori-Schulzentrum Leipzig Oberschule",
        "type": "Oberschule",
        "isPrivate": true
    },
    {
        "id": 11,
        "name": "Carl-Friedrich-Goerdeler-Oberschule Leipzig",
        "type": "Oberschule",
        "isPrivate": true
    },
    {
        "id": 12,
        "name": "Caroline-Neuber-Schule, Oberschule im Deutsch-Französischen Bildungszentrum der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 13,
        "name": "Christian-Gottlob-Frege-Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 14,
        "name": "Denis-Diderot-Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 15,
        "name": "Evangelisches Schulzentrum Leipzig Oberschule",
        "type": "Oberschule",
        "isPrivate": true
    },
    {
        "id": 16,
        "name": "Freie Oberschule Gohlis - Schulen für gemeinschaftliches Lernen e.V.",
        "type": "Freie Oberschule",
        "isPrivate": true
    },
    {
        "id": 17,
        "name": "Freie Schule Leipzig e.V.",
        "type": "Freie Schule",
        "isPrivate": true
    },
    {
        "id": 18,
        "name": "Freie Waldorfschule Leipzig",
        "type": "Waldorfschule",
        "isPrivate": true
    },
    {
        "id": 19,
        "name": "Geschwister-Scholl-Schule Liebertwolkwitz - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 20,
        "name": "Heinrich-Pestalozzi-Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 21,
        "name": "Helmholtzschule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 22,
        "name": "Karl Schubert Schule Leipzig - Freie Waldorfschule",
        "type": "Waldorfschule",
        "isPrivate": true
    },
    {
        "id": 23,
        "name": "Klaus-Gottschalk-Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 24,
        "name": "Lene-Voigt-Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 25,
        "name": "Paul-Robeson-Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 26,
        "name": "Petrischule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 27,
        "name": "Rahn Education Freie Oberschule Leipzig",
        "type": "Freie Oberschule",
        "isPrivate": true
    },
    {
        "id": 28,
        "name": "Rahn Education Freie Oberschule Leipzig - Schulteil Südvorstadt",
        "type": "Freie Oberschule",
        "isPrivate": true
    },
    {
        "id": 29,
        "name": "Rosa-Parks-Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 30,
        "name": "Rudi-Glöckner-Schule - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 31,
        "name": "Schule am Adler - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 32,
        "name": "Schule am Barnet-Licht-Platz - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 33,
        "name": "Schule am Weißeplatz - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 34,
        "name": "Schule Georg-Schwarz-Str. - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 35,
        "name": "Schule Hainbuchenstraße - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 36,
        "name": "Schule Höltystraße - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 37,
        "name": "Schule Ihmelsstraße - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 38,
        "name": "Schule Mölkau - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 39,
        "name": "Schule Paunsdorf - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 40,
        "name": "Schule Ratzelstraße - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 41,
        "name": "Schule Wiederitzsch - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 42,
        "name": "Sportoberschule Leipzig - Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },
    {
        "id": 43,
        "name": "Nachbarschaftsschule - Grund- und Oberschule der Stadt Leipzig",
        "type": "Oberschule",
        "isPrivate": false
    },  
    {
        "id": 44,
        "name": "BIP-Kreativitätsgymnasium Leipzig",
        "type": "Gymnasium",
        "isPrivate": true
    },
    {
        "id": 45,
        "name": "Bischöfliches Maria-Montessori-Schulzentrum Gymnasium",
        "type": "Gymnasium",
        "isPrivate": true
    },
    {
        "id": 46,
        "name": "Evangelisches Schulzentrum Leipzig Gymnasium",
        "type": "Gymnasium",
        "isPrivate": true
    },
    {
        "id": 47,
        "name": "Freie Waldorfschule Leipzig",
        "type": "Waldorfschule",
        "isPrivate": true
    },
    {
        "id": 48,
        "name": "Friedrich-Arnold-Brockhaus-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 49,
        "name": "Friedrich-Schiller-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 50,
        "name": "Georg-Christoph-Lichtenberg-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 51,
        "name": "Gerda-Taro-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 52,
        "name": "Goethe-Gymnasium Leipzig",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 53,
        "name": "Gustav-Hertz-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 54,
        "name": "Gymnasium Engelsdorf",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 55,
        "name": "Humboldt-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 56,
        "name": "Immanuel-Kant-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 57,
        "name": "Johanna-Moosdorf-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 58,
        "name": "Johannes-Kepler-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 59,
        "name": "Karl Schubert Schule Leipzig - Freie Waldorfschule",
        "type": "Waldorfschule",
        "isPrivate": true
    },
    {
        "id": 60,
        "name": "Leibnizschule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 61,
        "name": "Louise-Otto-Peters-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 62,
        "name": "Marie-Curie-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 63,
        "name": "Max-Klinger-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 64,
        "name": "Neue Nikolaischule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 65,
        "name": "Rahn Education Musikalisch-Sportliches Gymnasium",
        "type": "Gymnasium",
        "isPrivate": true
    },
    {
        "id": 66,
        "name": "Robert-Schumann-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 67,
        "name": "Sächsisches Landesgymnasium für Sport Leipzig",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 68,
        "name": "Schule am Palmengarten",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 69,
        "name": "Schule Hauptbahnhof-Westseite",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 70,
        "name": "Schule Ihmelsstraße",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 71,
        "name": "Schule Schraderhaus",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 72,
        "name": "Thomasschule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 73,
        "name": "Werner-Heisenberg-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 74,
        "name": "Wilhelm-Ostwald-Schule",
        "type": "Gymnasium",
        "isPrivate": false
    },
    {
        "id": 75,
        "name": "Leipzig International School",
        "type": "Gymnasium",
        "isPrivate": true
    },
    {
        "id": 76,
        "name": "Leipziger Modellschule Gemeinschaftsschule",
        "type": "Gemeinschaftsschule",
        "isPrivate": true
    },
    {
        "id": 77,
        "name": "Schule am Dösner Weg - Gemeinschaftsschule der Stadt Leipzig",
        "type": "Gemeinschaftsschule",
        "isPrivate": false
    }
];

export default function Onboarding({ onSuccess }: OnboardingProps) {
    const [firstname, setFirstname] = useState('')
    const [surname, setSurname] = useState('')
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [gradelevel, setGradelevel] = useState('')
    const [averagemark, setAveragemark] = useState('')
    const [gender, setGender] = useState('')
    const [height, setHeight] = useState('')
    const [relationship, setRelationship] = useState('')
    const [instagram, setInstagram] = useState('')
    const [tiktok, setTiktok] = useState('')
    const [snapchat, setSnapchat] = useState('')
    const [school, setSchool] = useState('')
    const [hobbies, setHobbies] = useState<string[]>([])
    const [customHobbyInput, setCustomHobbyInput] = useState('')
    const birthday = `${year}-${month}-${day}`

    const [step, setStep] = useState<'personal' | 'socials' | 'hobbies' | 'school'>('personal')

    const togglePopularHobby = (label: string) => {
        setHobbies((prev) => {
            if (prev.includes(label)) return prev.filter((h) => h !== label)
            if (prev.length >= MAX_HOBBIES) return prev
            return [...prev, label]
        })
    }

    const removeHobby = (label: string) => {
        setHobbies((prev) => prev.filter((h) => h !== label))
    }

    const addCustomHobby = () => {
        const trimmed = customHobbyInput.trim()
        if (!trimmed) return
        const exists = hobbies.some((h) => h.toLowerCase() === trimmed.toLowerCase())
        if (exists) {
            setCustomHobbyInput('')
            return
        }
        if (hobbies.length >= MAX_HOBBIES) return
        setHobbies((prev) => [...prev, trimmed])
        setCustomHobbyInput('')
    }

    const handleCustomHobbyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addCustomHobby()
        }
    }

    const handleSetUpProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            alert('Not logged in.')
            return
        }
        const { error } = await supabase.from('profiles').insert({
            id: session.user.id,
            firstname,
            surname,
            birthday,
            gradelevel: parseInt(gradelevel),
            averagemark: parseFloat(averagemark),
            gender,
            height: parseInt(height),
            relationship,
            instagram,
            tiktok,
            snapchat,
            school,
            hobbies,
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
        <form onSubmit={handleSetUpProfile} className='w-full flex flex-col gap-4'>
            {step === 'personal' && (
                <div className='flex flex-col gap-4'>
                    <h2 className='text-lg font-bold'>Set up your profile</h2>
                    <input type="text" placeholder="Vorname" value={firstname} className="p-2 border" onChange={(e) => setFirstname(e.target.value)} required />
                    <input type="text" placeholder="Nachname" value={surname} className="p-2 border" onChange={(e) => setSurname(e.target.value)} required />

                    <select value={day} className='p-2 border bg-white' onChange={(e) => setDay(e.target.value)}>
                        <option value='' disabled>Tag</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map (d => (
                            <option key={d} value={String(d).padStart(2, '0')}>{d}</option>
                        ))}
                    </select>

                    <select value={month} className='p-2 border bg-white' onChange={(e) => setMonth(e.target.value)}>
                        <option value='' disabled>Monat</option>
                        {['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'].map((m, i) => (
                            <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
                        ))}
                    </select>

                    <select value={year} className='p-2 border bg-white' onChange={(e) => setYear(e.target.value)}>
                        <option value='' disabled>Jahr</option>
                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                            <option key={y} value={String(y)}>{y}</option>
                        ))}
                    </select>

                    <select value={gender} className="p-2 border bg-white" onChange={(e) => setGender(e.target.value)} required>
                        <option value="" disabled>Geschlecht wählen</option>
                        <option value="female">Weiblich</option>
                        <option value="male">Männlich</option>
                        <option value="diverse">Divers</option>
                        <option value="prefer_not_to_say">Keine Angabe</option>
                    </select>
                    <input type="number" placeholder="Größe (cm)" value={height} className="p-2 border" min={50} max={250} onChange={(e) => setHeight(e.target.value)} required />
                    <select value={relationship} className="p-2 border bg-white" onChange={(e) => setRelationship(e.target.value)}>
                        <option value="" disabled>Beziehungsstatus</option>
                        <option value="single">Single</option>
                        <option value="relationship">Vergeben</option>
                        <option value="prefer_not_to_say">Keine Angabe</option>
                    </select>
                    <button className="bg-blue-500 text-white p-2 rounded" onClick={() => setStep('hobbies')}>Save & Continue</button>
                </div>
            )}



            {step === 'hobbies' && (
                <div className="flex flex-col gap-3 pt-2 border-t mt-2">
                    <div>
                        <h3 className="text-md font-semibold">Wofür interessierst du dich am meisten?</h3>
                        <p className="text-sm text-gray-500">Wähle bis zu {MAX_HOBBIES} Kategorien</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {POPULAR_HOBBIES.map(({ label }) => {
                            const selected = hobbies.includes(label)
                            return (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => (selected ? removeHobby(label) : togglePopularHobby(label))}
                                    className={
                                        selected
                                            ? 'inline-flex items-center gap-1.5 rounded-full border border-blue-700 bg-blue-700 px-3 py-1.5 text-sm text-white'
                                            : 'inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm'
                                    }
                                >
                                    <span>{label}</span>
                                    {selected && (
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs" aria-hidden>
                                            ×
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                        <input
                            type="text"
                            placeholder="Eigene Interessen hinzufügen …"
                            value={customHobbyInput}
                            className="p-2 border flex-1"
                            maxLength={80}
                            onChange={(e) => setCustomHobbyInput(e.target.value)}
                            onKeyDown={handleCustomHobbyKeyDown}
                            disabled={hobbies.length >= MAX_HOBBIES}
                        />
                        <button
                            type="button"
                            onClick={addCustomHobby}
                            disabled={hobbies.length >= MAX_HOBBIES || !customHobbyInput.trim()}
                            className="rounded bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 disabled:opacity-50"
                        >
                            Hinzufügen
                        </button>
                    </div>
                    {hobbies.some((h) => !POPULAR_HOBBIES.some((p) => p.label === h)) && (
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-gray-500 w-full">Deine eigenen:</span>
                            {hobbies
                                .filter((h) => !POPULAR_HOBBIES.some((p) => p.label === h))
                                .map((label) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => removeHobby(label)}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-blue-700 bg-blue-700 px-3 py-1.5 text-sm text-white"
                                    >
                                        <span>{label}</span>
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs" aria-hidden>
                                            ×
                                        </span>
                                    </button>
                                ))}
                        </div>
                    )}
                    <p className="text-xs text-gray-500">{hobbies.length} / {MAX_HOBBIES} ausgewählt</p>
                    <button className="bg-blue-500 text-white p-2 rounded" onClick={() => setStep('socials')}>Save & Continue</button>
                    <button className="bg-blue-500 text-white p-2 rounded" onClick={() => setStep('personal')}>back</button>
                </div>
            )}




            {step === 'socials' && (
                <div className='flex flex-col gap-4'>
                    <input type="text" placeholder="Instagram" value={instagram} className="p-2 border" step="0.1" onChange={(e) => setInstagram(e.target.value)}/>
                    <input type="text" placeholder="Tiktok" value={tiktok} className="p-2 border" step="0.1" onChange={(e) => setTiktok(e.target.value)}/>
                    <input type="text" placeholder="Snapchat" value={snapchat} className="p-2 border" step="0.1" onChange={(e) => setSnapchat(e.target.value)}/>
                    <button className="bg-blue-500 text-white p-2 rounded" onClick={() => setStep('school')}>Save & Continue</button>
                    <button className="bg-blue-500 text-white p-2 rounded" onClick={() => setStep('hobbies')}>back</button>
                </div>
            )}



            {step === 'school' && (
                <div className='flex flex-col gap-4 overflow-visible'>
                    <input type="number" placeholder="Klassenstufe" value={gradelevel} className="p-2 border" onChange={(e) => setGradelevel(e.target.value)} required />
                    <input type="number" placeholder="Notendurchschnitt" value={averagemark} className="p-2 border" step="0.1" min={0.8} max={6} onChange={(e) => setAveragemark(e.target.value)} required />
                    <Combobox value={school} onChange={setSchool} topic={SCHOOLS}/>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save & Continue</button>
                    <button className="bg-blue-500 text-white p-2 rounded" onClick={() => setStep('socials')}>back</button>
                </div>
            )}
        </form>
    )
}
