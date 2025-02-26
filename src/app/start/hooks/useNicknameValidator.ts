import { useState, useRef, useEffect } from 'react'
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
  const inputTimeout = useRef<NodeJS.Timeout | null>(null)

  const validateName = (name: string) => {
    const regex = /^[가-힣a-zA-Z0-9]{0,6}$/
    return regex.test(name)
  }

  const checkNickname = async (name: string) => {
    try {
      const response = await getNicknamePossible(name)
      if (response.data === false) {
        setErrorMessage('이미 사용 중인 닉네임입니다.')
        setError(true)
      } else {
        setErrorMessage('')
        setError(false)
      }
    } catch (error) {
      setErrorMessage('닉네임 확인 중 오류가 발생했습니다.')
      setError(true)
    }
  }

  const handleNicknameChange = (newNickname: string) => {
    if (newNickname === '') {
      setError(true)
    }
    if (!validateName(newNickname)) {
      setErrorMessage('닉네임은 한글/영문/숫자를 포함한 6자 이내만 가능해요.')
      setError(true)
    } else {
      setNickname(newNickname)
      setErrorMessage('')
      setError(false)

      if (inputTimeout.current) {
        clearTimeout(inputTimeout.current)
      }

      inputTimeout.current = setTimeout(() => {
        if (newNickname.trim() !== '') {
          checkNickname(newNickname)
        }
      }, 500)
    }
  }

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (inputTimeout.current) {
        clearTimeout(inputTimeout.current)
      }
    }
  }, [])

  return {
    nickname,
    errorMessage,
    handleNicknameChange,
  }
}
