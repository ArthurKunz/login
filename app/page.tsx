'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase/client'

export default function Rootpage() {
  const router = useRouter()



  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) router.push('/home')
      else router.push('/auth/signin')
    }
    checkUser()
  }, [])
  return null
}