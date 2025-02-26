'use client'

import { Button, Input } from '@/components/common'
import useUserInfo from '@/store/useUserInfo'
import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { useNicknameValidator } from '../hooks'

interface StepProps {
  setStep: (step: number) => void
}

export default function Step1({ setStep }: StepProps) {
  const [error, setError] = useState(true)

  const { userInfo, setUserInfo } = useUserInfo()
  const { nickname, errorMessage, handleNicknameChange } = useNicknameValidator(
    {
      initialNickname: userInfo.nickname,
      setError,
    },
  )
  const updateUserInfo = debounce((newName: string) => {
    setUserInfo({ ...userInfo, nickname: newName })
  }, 300)

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    handleNicknameChange(newName)
    updateUserInfo(newName)
  }

  useEffect(() => {
    setError(!nickname || !!errorMessage)
  }, [])

  return (
    <>
      <div className="px-20">
        <h1 className="title">
          안녕하세요, 조각조각이에요 :)
          <br />
          어떻게 불러드릴까요?
        </h1>

        <Input
          success="멋진 이름이에요!"
          label="6자 이내의 한글/영문/숫자를 입력해주세요."
          value={nickname}
          placeholder="닉네임을 적어주세요."
          error={errorMessage}
          onChange={handleChangeName}
        />
      </div>
      <div className="w-full flex justify-center absolute bottom-10">
        <Button
          className="w-[90%] mx-auto"
          disabled={!!error}
          onClick={() => setStep(2)}
        >
          다음
        </Button>
      </div>
    </>
  )
}
