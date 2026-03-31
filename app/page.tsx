'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '../utils/supabase/client'

export default function Rootpage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/pages/auth')
        return
      }

      // Check if user has already set up a profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        // Profile exists → go to home
        router.push('/pages/home')
      } else {
        // No profile yet → go to onboarding
        router.push('/pages/auth?step=onboarding')
      }
    }

    checkUser()
  }, [router])

  return null
}