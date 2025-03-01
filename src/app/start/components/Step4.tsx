import useUserInfo from '@/store/useUserInfo'
import Image from 'next/image'
import { Button } from '@/components'
import { useRouter } from 'next/navigation'
import { usePostOnboard } from '../api/api'

export default function Step4() {
  const { userInfo } = useUserInfo()
  const { mutate } = usePostOnboard()
  const { push } = useRouter()

  const handleNext = () => {
    mutate({
      nickname: userInfo.nickname,
      birthYear: userInfo.birthYear,
      gender: userInfo.gender,
      profileImage: userInfo.profileImage,
    })
    push('/home')
  }

  return (
    <>
      <div className="h-full">
        <div className="absolute w-full h-full bg-gradient-to-b from-white via-[#fffbfb] to-[#ffa89c]" />
        <div className="absolute flex flex-col items-center mt-30 w-full h-320 white-gradient z-10">
          <h2 className="text-primary_foundation_60 relative">
            환영해요, {userInfo.nickname}님!
          </h2>
          <h1 className="relative title !mt-0">
            조각조각이 {userInfo.nickname}님의 흩어진 <br />
            <span className="text-accent_100">시간 조각</span>들을 찾아줄게요.
          </h1>
        </div>
        <Image
          alt="bg"
          src="/image/home-img.svg"
          layout="fill"
          objectFit="over"
          className="absolute bottom-0 z-1 px-20"
        />
      </div>
      <div className="w-full flex justify-center absolute bottom-10">
        <Button className="w-[90%] mx-auto" onClick={() => handleNext()}>
          시작하기
        </Button>
      </div>
    </>
  )
}
