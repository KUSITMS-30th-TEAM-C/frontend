'use client'

import { Button, If } from '@/components/common'
import { HeaderWithBack } from '@/components'
import { useState, useEffect } from 'react'
import { cn } from '@/util'
import { ActivityData, SeletedActivityDone } from '@/types/activityTypes'
import { useActivityStore } from '@/store/activityStore'
import { useIsSuggestLoading } from '@/store/SuggestLodingCheckStore'
import { useRouter } from 'next/navigation'
import ArrowIcon from '@/components/Icons/ArrowIcon'
import ChoiceTime from './components/ChoiceTime'
import ChoiceOnOff from './components/ChoiceOnOff'
import ChoiceLocation from './components/ChoiceLocation'
import ChoiceKeyword from './components/ChoiceKeyword'
import ChoiceSuggestion from './components/ChoiceSuggestions'

export default function SuggestActivity() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState(true)
  const [text, setText] = useState('다음')
  const [selectOnOff, setSeletOnOff] = useState<string[]>([])
  const { isSuggestLoading, setIsSuggestLoading } = useIsSuggestLoading()

  const [selectedActivity, setSeletedActivity] = useState<ActivityData>()
  const [activityLink, setActivityLink] = useState('')
  const [postActivityType, setPostActivityType] = useState('ONLINE')
  const { spareTime, setSpareTime, address, reset } = useActivityStore()
  const router = useRouter()
  const [isQuick, setIsQuick] = useState(false)

  const handleBack = () => {
    if (step === 1) {
      setSpareTime('')
      reset()
      router.push('/home')
      return
    }

    if (isQuick) {
      setIsQuick(false)
      router.push('/home')
    }

    setStep((prevStep) => {
      if (prevStep === 4 && !selectOnOff.includes('오프라인')) {
        return 2
      }

      return Math.max(prevStep - 1, 1)
    })
  }

  const handleNext = () => {
    let nextStep

    switch (step) {
      case 2:
        nextStep = selectOnOff.includes('오프라인') ? 3 : 4
        break
      case 3:
      case 4:
        nextStep = step + 1
        break
      case 5:
        if (selectedActivity) {
          if (typeof window !== 'undefined') {
            window.open(activityLink, '_blank')
          }

          const seletedActivityData: SeletedActivityDone = {
            type: postActivityType,
            spareTime: parseInt(spareTime, 10),
            keyword: {
              category: selectedActivity.keyword.category,
              image: selectedActivity.keyword.image,
            },
            title: selectedActivity.title,
            content: selectedActivity.content,
            ...(address && { location: address }),
          }

          localStorage.setItem(
            'selectedActivity',
            JSON.stringify(seletedActivityData),
          )
          reset()
          router.push('/activity')
        }
        nextStep = step + 1
        break

      default:
        nextStep = step + 1
        break
    }

    setStep(nextStep)
    setError(true)
  }

  const progressBarWidth = `${(step / 4) * 100}%`

  useEffect(() => {
    const quickStartData = localStorage.getItem('quickStart')
    if (quickStartData) {
      const { quickStart } = JSON.parse(quickStartData)

      setIsQuick(true)
      if (quickStart.type === 'ONLINE') {
        setPostActivityType('ONLINE')
        setStep(4)
      } else {
        setStep(3)
        setPostActivityType('OFFLINE')
      }
      setSeletOnOff([quickStart.type === 'ONLINE' ? '온라인' : '오프라인'])
    }
  }, [])

  return (
    <div className="w-full overflow-hidden">
      <HeaderWithBack onBack={handleBack} title="활동 추천받기">
        <div className={cn('relative mt-15 mx-20', step === 5 && 'opacity-0')}>
          <div className="bg-black h-10 w-10 absolute bottom-0" />
          <div className="bg-[#E9E9EA] h-4" />
          <div
            className="bg-black h-4 absolute top-0 transition-all duration-300"
            style={{ width: progressBarWidth }}
          />
        </div>

        <div>
          <If condition={step === 1}>
            <ChoiceTime setError={setError} />
          </If>
          <If condition={step === 2}>
            <ChoiceOnOff setError={setError} setSeletOnOff={setSeletOnOff} />
          </If>
          <If condition={step === 3}>
            <ChoiceLocation setError={setError} />
          </If>
          <If condition={step === 4}>
            <ChoiceKeyword setError={setError} />
          </If>
          <If condition={step === 5}>
            <ChoiceSuggestion
              setError={setError}
              isSuggestLoading={isSuggestLoading}
              setIsSuggestLoading={setIsSuggestLoading}
              setText={setText}
              setSeletedActivity={setSeletedActivity}
              setActivityLink={setActivityLink}
              setPostActivityType={setPostActivityType}
            />
          </If>
        </div>

        {!isSuggestLoading && (
          <div className="absolute bottom-30 w-full py-4 flex justify-center">
            <Button
              className={`w-[90%] mx-auto ${text === '이 활동하기' && 'bg-accent_100 px-16 justify-between'}`}
              disabled={!!error}
              onClick={handleNext}
            >
              {text}
              {text === '이 활동하기' && <ArrowIcon />}
            </Button>
          </div>
        )}
      </HeaderWithBack>
    </div>
  )
}
