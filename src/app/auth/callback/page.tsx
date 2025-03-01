'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import useUserInfo from '@/store/useUserInfo'
import { SendData } from './type'

function LoginCheck() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setUserInfo } = useUserInfo()

  const code = searchParams.get('code')
  const scope = searchParams.get('scope')
  const state = searchParams.get('state')

  const sendUserHomeOrStart = (userState: string) => {
    if (userState === 'GUEST') router.push('/start')
    if (userState === 'MEMBER') router.push('/home')
  }

  const getUserData = async (socialType: string, sendDataArr: SendData[]) => {
    let url: string = `https://cnergy.p-e.kr/v1/oauth/login/${socialType}?`
    for (let i = 0; i < sendDataArr.length; i += 1) {
      if (i === 0) {
        url += `${sendDataArr[i].name}=${sendDataArr[i].value}`
      }

      if (i !== 0) {
        url += `&${sendDataArr[i].name}=${sendDataArr[i].value}`
      }
    }

    try {
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setUserInfo({
        ...data.data,
        profileImage:
          data.data.profileImage ||
          'https://kr.object.ncloudstorage.com/cnergy-bucket/front_image/profile/profile1.svg',
      })

      // role에 따라 페이지 이동 차이
      sendUserHomeOrStart(data.data.role)
    } catch (error) {
      console.log('Error fetching user data', error)
    }
  }

  useEffect(() => {
    const sendDataArr: SendData[] = []

    if (code) {
      if (state) {
        sendDataArr.push({ name: 'code', value: code })
        sendDataArr.push({ name: 'state', value: state })
        getUserData('naver', sendDataArr)
        return
      }
      if (scope) {
        sendDataArr.push({ name: 'code', value: code })
        getUserData('google', sendDataArr)
        return
      }
      sendDataArr.push({ name: 'code', value: code })
      getUserData('kakao', sendDataArr)
    }
  }, [code, state, scope])

  return <div>로그인 정보를 확인중입니다...</div>
}

export default function WrappedLoginCheck() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <LoginCheck />
    </Suspense>
  )
}
