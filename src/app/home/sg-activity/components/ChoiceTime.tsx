'use client'

import { useEffect, useState } from 'react'
import { useActivityStore } from '@/store/activityStore'
import { Caution } from '@/components'
import { getQuickStartData, updateQuickStartData } from '@/util/localStorage'
import { SetErrorProps } from '../types/types'

export default function ChoiceTime({ setError }: SetErrorProps) {
  const [state, setState] = useState(
    '시간은 최소 10분부터 최대 300분까지 입력할 수 있어요.',
  )

  const [isValid, setIsValid] = useState(false)

  const { spareTime, setSpareTime } = useActivityStore()

  console.log('자투리 시간', spareTime)

  const [isInitialized, setIsInitialized] = useState(false)

  const validateTime = (inputTime: string) => {
    const timetoNum: number = parseInt(inputTime, 10)

    if (inputTime === '') {
      setState('시간은 최소 10분부터 최대 300분까지 입력할 수 있어요.')
      return false
    }

    if (Number.isNaN(timetoNum)) {
      setState('숫자만 입력할 수 있어요.')
      return false
    }
    if (timetoNum < 10) {
      setState('시간은 최소 10분부터 입력할 수 있어요.')
      return false
    }
    if (timetoNum > 300) {
      setState('시간은 300분 까지만 입력할 수 있어요.')
      return false
    }

    setState('시간은 최소 10분부터 최대 300분까지 입력할 수 있어요.')
    return true
  }

  const handleChangeTime = (inputTime: string) => {
    setSpareTime(inputTime)
    const validate = validateTime(inputTime)
    setIsValid(validate)
    setError(!validate)
    updateQuickStartData('spareTime', inputTime)
  }

  useEffect(() => {
    if (!isInitialized) {
      const quickStartData = getQuickStartData()
      if (quickStartData) {
        setSpareTime(quickStartData.spareTime.toString())
        setIsInitialized(true)
      }
    }
  }, [])

  useEffect(() => {
    if (isInitialized) {
      handleChangeTime(spareTime)
    }
  }, [isInitialized])

  return (
    <div className="w-342 mx-auto mt-50">
      <div>
        <p className="font-semibold text-28">저는 지금,</p>
        <div className="flex">
          <input
            value={spareTime.toString()}
            placeholder="분 단위로 입력해주세요"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeTime(e.target.value)
            }
            style={{
              width:
                spareTime === ''
                  ? '200px'
                  : `${Math.max((spareTime.length - 1) * 10 + 60, 60)}px`,
              transition: 'width 0.3s ease-in-out',
            }}
            className="outline-none caret-black font-normal text-40 placeholder:text-20"
          />
          <span className="font-medium text-28 my-auto">분</span>
        </div>
        <p className="font-semibold text-28">의 시간이 남아요.</p>
      </div>
      {(spareTime === '' || !isValid) && (
        <p
          className={`flex font-medium text-12 gap-5 mt-8 ${spareTime === '' ? 'text-primary_foundation-50' : 'text-system_red'}`}
        >
          {spareTime !== '' && !isValid && <Caution className="my-auto" />}
          {state}
        </p>
      )}
    </div>
  )
}
