'use client'

import { useNicknameValidator, useProfileSelector } from '@/app/start/hooks'
import { Button, HeaderWithBack, Input, Left } from '@/components'
import useUserInfo from '@/store/useUserInfo'
import { cn } from '@/util'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import { usePatchMyPage } from '../api/queries'

export default function MyPageEdit() {
  const { push } = useRouter()
  const { userInfo, setUserInfo } = useUserInfo()
  const { mutate } = usePatchMyPage()
  const [error, setError] = useState<boolean>(true)
  const { nickname, errorMessage, handleNicknameChange } = useNicknameValidator(
    {
      initialNickname: userInfo.nickname,
      setError,
    },
  )
  const {
    profiles,
    profileUrl,
    selectedProfileID,
    handleProfileSelect,
    isProfileChanged,
  } = useProfileSelector()

  const handleSaveClick = () => {
    mutate(
      {
        nickname,
        profileImage: selectedProfileID,
      },
      {
        onSuccess: () => {
          setUserInfo({
            ...userInfo,
            nickname,
            profileImage: profileUrl,
          })
          push('/mypage')
        },
      },
    )
  }

  return (
    <HeaderWithBack title="프로필 수정하기" onBack={() => push('/mypage')}>
      <div className="p-24">
        <h2 className="text-lg font-semibold leading-relaxed">
          닉네임 수정하기
        </h2>
        <Input
          label="6자 이내의 한글/영문/숫자를 입력해주세요."
          value={nickname}
          placeholder="닉네임을 적어주세요."
          error={errorMessage}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleNicknameChange(e.target.value)
          }
        />

        <h2 className="text-lg font-semibold leading-relaxed mt-44">
          프로필 이미지 수정하기
        </h2>

        <div className="grid grid-cols-4 gap-y-22 gap-x-10 w-full justify-items-stretch mt-16">
          {profiles.map((id) => (
            <button
              type="button"
              key={id}
              onClick={() => handleProfileSelect(id)}
              className={cn(
                'relative w-full aspect-square border rounded-full overflow-hidden p-20',
                selectedProfileID === id && 'border-accent-50 bg-accent-10',
              )}
              tabIndex={0}
            >
              {selectedProfileID === id && (
                <div className="absolute -top-18">
                  <Left />
                </div>
              )}

              <Image
                alt="profile image"
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/profile/profile${id}.svg`}
                layout="fill"
                objectFit="cover"
                className="p-5"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="absolute bottom-50 w-full py-4 flex justify-center">
        <Button
          className="w-[90%] mx-auto font-semibold"
          disabled={error && !isProfileChanged}
          onClick={handleSaveClick}
          type="button"
        >
          변경사항 저장하기
        </Button>
      </div>
    </HeaderWithBack>
  )
}
