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
            <span className="text-blue-500 underline cursor-pointer" onClick={onSuccess}>Cancel</span>
        </form>
    )
}