'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SignIn from '../../components/signin'
import SignUp from '../../components/signup'
import Verify from '../../components/verify'
import Onboarding from '../../components/onboarding'
import ChangePasswordPage from '../../settings/change-password/page'
import { supabase } from '../../../utils/supabase/client'

export default function AuthPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [step, setStep] = useState<'signup' | 'signin' | 'verify' | 'onboarding' | 'reset-password'>('signup')
    const [signupEmail, setSignupEmail] = useState('')



    useEffect(() => { 
        const stepParam = searchParams.get('step')
        if (stepParam === 'onboarding') {
            setStep('onboarding')
        }
        if (stepParam === 'reset-password') {
            setStep('reset-password')  // add this to your union type
        }
    }, [searchParams])



    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setStep('reset-password')
            }
        })

        return () => subscription.unsubscribe()
    }, [])



    return (
        <div className='w-screen h-screen flex justify-between bg-[#121212] py-2.5'>
            <div className='w-3/5 h-full bg-sky-500 rounded-3xl ml-2.5'>

            </div>
            <div className='w-2/5 h-full px-20 py-20 flex items-center justify-center'>
                {step === 'signup' && (
                    <SignUp
                        onSuccess={(email) => {
                            setSignupEmail(email)
                            setStep('verify')
                        }}
                        onGoToSignIn={() => setStep('signin')}
                    />
                )}

                {step === 'verify' && (
                    <Verify
                        email={signupEmail}
                        onSuccess={() => setStep('onboarding')}
                    />
                )}

                {step === 'onboarding' && (
                    <Onboarding
                        onSuccess={() => router.push('/pages/home')}
                    />
                )}

                {step === 'signin' && (
                    <SignIn
                        onSuccess={() => router.push('/pages/home')}
                        onGoToSignUp={() => setStep('signup')}
                    />
                )}
                {step === 'reset-password' && (
                    <ChangePasswordPage onSuccess={() => router.push('/pages/home')}/>
                )}
            </div>
        </div>
    )
}
