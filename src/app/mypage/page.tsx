'use client'

import { Button, HeaderWithBack, IconRight, Pencil, Switch } from '@/components'
import useUserInfo from '@/store/useUserInfo'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { IMAGE_URL } from '@/constants'
import { useMyPageContext } from './components/fetcher'
import { usePatchAlarm } from './api/queries'
import { useLogout } from '../auth/auth'

export default function MyPage() {
  const { nickname, profileImage } = useUserInfo().userInfo
  const { push } = useRouter()

  const { isEmailNotificationEnabled, email } = useMyPageContext()
  const { mutate } = usePatchAlarm()
  const { logout } = useLogout()

  const [isEmailAlert, setIsEmailAlert] = useState(isEmailNotificationEnabled)

  const handleAlarmSwitch = () => {
    setIsEmailAlert(!isEmailAlert)
    mutate(undefined, {
      onError: () => {
        setIsEmailAlert(isEmailAlert)
        alert('알림 설정을 변경하는 데 실패했습니다. 다시 시도해 주세요.')
      },
    })
  }

  return (
    <HeaderWithBack onBack={() => push('/home')} title="마이페이지">
      <div className="min-h-screen">
        <div className="flex flex-col items-center bg-white py-20  border-b-6 border-primary_foundation-5 px-24">
          <div className="w-full mb-16">
            <div className="flex justify-between w-full">
              <div className="text-primary_foundation-60 flex items-center">
                <strong className="text-24 text-primary_foundation-100 font-[500]">
                  {nickname}
                </strong>
                <span className="ml-5">님의 프로필</span>
              </div>
              <Button
                leftIcon={<Pencil />}
                onClick={() => push('/mypage/edit')}
                className="bg-primary_foundation-5 text-12 p-8 h-fit"
              >
                프로필 수정하기
              </Button>
            </div>
            <span className="text-primary_foundation-40 text-14">{email}</span>
          </div>

          <div className="relative w-140 h-140 rounded-full overflow-hidden border-2 bg-accent-10 border-accent-30 flex items-center justify-center">
            <Image
              src={IMAGE_URL + profileImage}
              alt="프로필 이미지"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
        </div>
        <div className="bg-primary_foundation-5 h-6 w-ful px-24" />

        <div className="bg-white mt-8 rounded-lg">
          <h2 className="text-16 weight-[400] px-20 py-16 text-primary_foundation-50">
            환경 설정
          </h2>
          <div className="text-16">
            <div className="flex justify-between items-center px-20 py-16 text-16">
              <span className="text-16 text-primary_foundation-100">
                이메일 알림
              </span>
              <Switch
                isOn={isEmailAlert}
                onSwitch={() => handleAlarmSwitch()}
              />
            </div>

            <button
              type="button"
              className="flex w-full justify-between items-center px-20 py-16"
              onClick={() => push('/mypage')}
            >
              <span className="text-primary_foundation-100">공지사항</span>
              <IconRight />
            </button>

            <button
              type="submit"
              className="px-20 py-16"
              onClick={() => {
                logout()
              }}
            >
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </HeaderWithBack>
  )
}
