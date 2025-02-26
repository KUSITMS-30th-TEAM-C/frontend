'use client'

import { Button, Input } from '@/components/common'
import CheckboxWithLabel from '@/components/common/CheckBox'
import useUserInfo, { GenderType } from '@/store/useUserInfo'
import { ChangeEvent, useEffect, useState } from 'react'

interface StepProps {
  setStep: (step: number) => void
}

export default function Step2({ setStep }: StepProps) {
  const { userInfo, setUserInfo } = useUserInfo()
  const { nickname, birthYear, gender } = userInfo

  const [error, setError] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [userAge, setUserAge] = useState<string>(birthYear || '')

  const handleGenderChange = (data: GenderType) => {
    setUserInfo({ ...userInfo, gender: data })

    if (!errorMessage) {
      setError(false)
    }
  }
  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setUserAge(value)

    if (/^\d+$/.test(value) || value === '') {
      const regex = /^[0-9]{4}$/

      if (regex.test(value)) {
        setUserInfo({
          ...userInfo,
          birthYear: value || '',
        })
        setErrorMessage('')
        if (gender) {
          setError(false)
        }
      } else {
        setError(true)
        setErrorMessage('4자리 숫자로 입력해주세요.')
      }
    }
  }

  useEffect(() => {
    setError(!userAge || !!errorMessage)
  }, [])

  return (
    <>
      <div className="px-20">
        <h1 className="title">
          {nickname} 님의 나이와 성별을 <br />
          알려주세요.
        </h1>

        <h2 className="subtitle">출생년도</h2>
        <Input
          value={userAge}
          placeholder="출생년도를 적어주세요. (예시: 2001)."
          onChange={handleAgeChange}
          error={errorMessage}
        />

        <h2 className="subtitle">성별</h2>
        <div className="flex justify-between mt-10 gap-20">
          <CheckboxWithLabel
            id="1"
            isChecked={gender === 'FEMALE'}
            label="여성"
            onChange={() => handleGenderChange('FEMALE')}
          />

          <CheckboxWithLabel
            id="2"
            isChecked={gender === 'MALE'}
            label="남성"
            onChange={() => handleGenderChange('MALE')}
          />
          <CheckboxWithLabel
            id="3"
            isChecked={gender === 'NONE'}
            label="미선택"
            onChange={() => handleGenderChange('NONE')}
          />
        </div>
      </div>
      <div className="w-full flex justify-center absolute bottom-10">
        <Button
          className="w-[90%] mx-auto"
          disabled={!!error}
          onClick={() => setStep(3)}
        >
          다음
        </Button>
      </div>
    </>
  )
}
