'use client'

import { If } from '@/components/common'
import { useState } from 'react'
import { cn } from '@/util'
import { HeaderWithBack } from '@/components'
import { Step1, Step2, Step3, Step4 } from './components'

export default function Start() {
  const [step, setStep] = useState(1)

  const handleBack = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1))
  }

  const progressBarWidth = `${(step / 3) * 100}%`

  return (
    <div className="h-full relative">
      <HeaderWithBack
        onBack={handleBack}
        title="조각조각 시작하기"
        mainClassName="overflow-hidden"
      >
        <div className={cn('relative mt-15 mx-20', step === 4 && 'opacity-0')}>
          <div className="bg-black h-10 w-10 absolute bottom-0" />
          <div className="bg-[#E9E9EA] h-4" />
          <div
            className="bg-black h-4 absolute top-0 transition-all duration-300"
            style={{ width: progressBarWidth }}
          />
        </div>

        <div className="h-full">
          <If condition={step === 1}>
            <Step1 setStep={setStep} />
          </If>
          <If condition={step === 2}>
            <Step2 setStep={setStep} />
          </If>
          <If condition={step === 3}>
            <Step3 setStep={setStep} />
          </If>
          <If condition={step === 4}>
            <Step4 />
          </If>
        </div>
      </HeaderWithBack>
    </div>
  )
}
