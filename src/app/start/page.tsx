'use client'

import { useState } from 'react'
import { HeaderWithBack } from '@/components'
import { cn } from '@/util'
import { Step1, Step2, Step3, Step4 } from './components'

const steps = [
  { id: '닉네임', component: Step1 },
  { id: '나이성별', component: Step2 },
  { id: '프로필', component: Step3 },
  { id: 'success', component: Step4 },
]

export default function Start() {
  const [step, setStep] = useState(1)

  return (
    <div className="h-full relative">
      <HeaderWithBack
        onBack={() => setStep((prev) => Math.max(prev - 1, 1))}
        title="조각조각 시작하기"
      >
        <div className="relative w-full h-full">
          {steps.map(({ id, component: StepComponent }, index) => (
            <div
              key={id}
              className={cn('hidden', step === index + 1 && 'block')}
            >
              <StepComponent setStep={setStep} />
            </div>
          ))}
        </div>
      </HeaderWithBack>
    </div>
  )
}
