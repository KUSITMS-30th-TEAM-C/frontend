import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks'
import { getNicknamePossible } from '../api/api'

interface UseNicknameValidatorProps {
  initialNickname: string
  setError: (error: boolean) => void
}

export const useNicknameValidator = ({
  initialNickname,
  setError,
}: UseNicknameValidatorProps) => {
  const [nickname, setNickname] = useState(initialNickname)
  const [errorMessage, setErrorMessage] = useState<string>()

  const validateName = (name: string) => {
    const regex = /^[가-힣a-zA-Z0-9]{1,6}$/
    return regex.test(name)
  }

  const checkNickname = async (name: string) => {
    if (name === initialNickname) return

    try {
      const response = await getNicknamePossible(name)
      if (!response.data) {
        setErrorMessage('이미 사용 중인 닉네임입니다.')
        setError(true)
        return
      }
      setErrorMessage('')
      setError(false)
    } catch (error) {
      setErrorMessage('닉네임 확인 중 오류가 발생했습니다.')
      setError(true)
    }
  }

  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname)

    if (!validateName(newNickname)) {
      setErrorMessage('닉네임은 한글/영문/숫자를 포함한 6자 이내만 가능해요.')
      setError(true)
    }
  }

  const debouncedNickname = useDebounce(nickname)

  useEffect(() => {
    if (debouncedNickname) {
      checkNickname(debouncedNickname)
    }
  }, [debouncedNickname])

  return {
    nickname,
    errorMessage,
    handleNicknameChange,
  }
}
