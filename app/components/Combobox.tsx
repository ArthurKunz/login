// components/SchoolCombobox.tsx
'use client'

import { useState, useRef, useEffect } from 'react'


interface Props {
    topic: string[]
    value: string
    onChange: (val: string) => void
}

export default function Combobox({ topic, value, onChange }: Props) {
    const [query, setQuery] = useState(value)
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const filtered = topic.filter(s =>
        s.toLowerCase().includes(query.toLowerCase())
    )

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={ref} className="relative">
            <input
                type="text"
                placeholder="Schule suchen …"
                value={query}
                className="p-2 border w-full"
                onChange={(e) => {
                    setQuery(e.target.value)
                    onChange('') // clear selection while typing
                    setOpen(true)
                }}
                onFocus={() => setOpen(true)}
            />
            {open && filtered.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow max-h-48 overflow-y-auto">
                    {filtered.map(school => (
                        <li
                            key={school}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                            onMouseDown={() => {
                                onChange(school)
                                setQuery(school)
                                setOpen(false)
                            }}
                        >
                            {school}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}