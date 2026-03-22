'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SignIn from '../../components/signin'
import SignUp from '../../components/signup'
import Verify from '../../components/verify'
import Onboarding from '../../components/onboarding'


export default function AuthPage() {
    const router = useRouter()
    const [step, setStep] = useState<'signup' | 'signin' | 'verify' | 'onboarding'>('signup')
    const [signupEmail, setSignupEmail] = useState('')

    return (
        <div className='w-screen h-screen flex justify-between bg-white py-2.5'>
            <div className='w-3/5 h-full bg-sky-500 rounded-3xl ml-2.5'>

            </div>
            <div className='w-2/5 h-full px-20 py-20'>

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

            </div>
        </div>
    )
}