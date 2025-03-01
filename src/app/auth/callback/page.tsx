'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import useUserInfo from '@/store/useUserInfo'
import Loading from '@/components/ui/Loading'
import { getLogin } from '@/app/home/api/api'
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
    let url: string = `/oauth/login/${socialType}?`
    for (let i = 0; i < sendDataArr.length; i += 1) {
      if (i === 0) {
        url += `${sendDataArr[i].name}=${sendDataArr[i].value}`
      }

      if (i !== 0) {
        url += `&${sendDataArr[i].name}=${sendDataArr[i].value}`
      }
    }

    try {
      const { data } = await getLogin(url)

      setUserInfo({
        ...data,
        profileImage: '/profile/profile3.svg',
      })

      // role에 따라 페이지 이동 차이
      sendUserHomeOrStart(data.role)
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

  return <Loading />
}

export default function WrappedLoginCheck() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginCheck />
    </Suspense>
  )
}
