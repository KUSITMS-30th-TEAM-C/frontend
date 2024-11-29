'use client'

import CheckboxWithLabel from '@/components/common/CheckBox'
import { useEffect } from 'react'
import { useActivityStore } from '@/store/activityStore'
import { getQuickStartData, updateQuickStartData } from '@/util/localStorage'

const koreanToEnglish = (option: string) => {
  switch (option) {
    case '온라인':
      return 'ONLINE'
    case '오프라인':
      return 'OFFLINE'
    default:
      return '활동유형을 선택해주세요'
  }
}

export default function ChoiceOnOff({
  setError,
  setSeletOnOff,
}: {
  setError: (error: boolean) => void
  setSeletOnOff: (options: string[]) => void
}) {
  const { activityType, setActivityType } = useActivityStore()

  const handleOptionChange = (option: string) => {
    const currentActivityType = Array.isArray(activityType) ? activityType : []
    const includeOption = currentActivityType.includes(option)

    const updateOptions = includeOption
      ? currentActivityType.filter((item) => item !== option)
      : [...currentActivityType, option]

    setActivityType(updateOptions)

    if (updateOptions.length === 2) {
      updateQuickStartData('type', 'ONLINE_AND_OFFLINE')
    } else if (updateOptions.length === 1) {
      updateQuickStartData('type', koreanToEnglish(updateOptions[0]))
    }
  }

  useEffect(() => {
    const quickStartData = getQuickStartData()

    if (quickStartData && quickStartData.type) {
      switch (quickStartData.type) {
        case 'ONLINE_AND_OFFLINE':
          setActivityType(['온라인', '오프라인'])
          break
        case 'ONLINE':
          setActivityType(['온라인'])
          break
        case 'OFFLINE':
          setActivityType(['오프라인'])
          break
        default:
          setActivityType([])
      }
    }
  }, [])

  useEffect(() => {
    if (activityType.length > 0) {
      setError(false)
    }
    if (activityType.length <= 0) {
      setError(true)
    }

    setSeletOnOff(activityType)
  }, [activityType])

  const getSeletOption = () => {
    const currentActivityType = Array.isArray(activityType) ? activityType : []

    if (currentActivityType.length === 2) {
      return '온라인, 오프라인'
    }

    return currentActivityType.length > 0
      ? currentActivityType.join(', ')
      : '활동유형을 선택해주세요'
  }

  return (
    <div className="w-342 mx-auto mt-50">
      <div>
        <p className="font-semibold text-28 mb-8">저는 지금,</p>
        <p
          className={` ${
            activityType.length > 0
              ? 'font-medium text-32 text-accent_100'
              : 'text-20 font-normal text-primary_foundation-40'
          } mb-8`}
        >
          {getSeletOption()}
        </p>
        <p className="font-semibold text-28">활동을 하고 싶어요!</p>
      </div>

      <div className="flex gap-20 mt-40">
        <CheckboxWithLabel
          id="1"
          isChecked={activityType.includes('온라인')}
          label="온라인"
          onChange={() => handleOptionChange('온라인')}
        />
        <CheckboxWithLabel
          id="2"
          isChecked={activityType.includes('오프라인')}
          label="오프라인"
          onChange={() => handleOptionChange('오프라인')}
        />
      </div>

      <p className="font-medium text-12 text-primary_foundation-50 mt-8">
        복수 선택도 가능해요
      </p>
    </div>
  )
}
