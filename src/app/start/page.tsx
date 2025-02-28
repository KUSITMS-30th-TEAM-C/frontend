'use client'

import { useState } from 'react'
import { HeaderWithBack } from '@/components'
import { Step1, Step2, Step3, Step4 } from './components'
import { cn } from '@/util'

export default function Start() {
  const [step, setStep] = useState(1)

  return (
    <div className="h-full relative">
      <HeaderWithBack
        onBack={() => setStep((prev) => Math.max(prev - 1, 1))}
        title="조각조각 시작하기"
      >
        <div className="relative w-full h-full">
          {[Step1, Step2, Step3, Step4].map((StepComponent, index) => (
            <div
              key={index}
              className={cn('none', step === index + 1 && 'block')}
            >
              <StepComponent setStep={setStep} />
            </div>
          ))}
        </div>
      </HeaderWithBack>
    </div>
  )
}
