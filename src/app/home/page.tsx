'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, HomeHeader, Div, Right, FooterButtons } from '@/components'
import useUserInfo from '@/store/useUserInfo'
import { useHomeContext } from './fast/components/Fetcher'
import { QuickBox } from './components/QuickBox'
import NoQuickBox from './components/NoQuickBox'
import NoTimePiece from './components/NoTimePiece'
import TimePiece from './components/TimePiece'

export default function Home() {
  const { quickStart, totalSavedTime, activities } = useHomeContext()
  const { userInfo } = useUserInfo()
  const { push } = useRouter()

  useEffect(() => {
    localStorage.removeItem('quickStart')
    const activityIng = localStorage.getItem('selectedActivity')
    if (activityIng) {
      push('/activity')
    }
  }, [])

  return (
    <HomeHeader title="홈">
      <div className="bg-[#F3F3F4]">
        <Div className="red-gradient flex flex-col gap-20 rounded-t-0">
          <h1 className="text-24 mt-10 font-semibold">
            {userInfo.nickname}님, <br /> 지금 시간 조각을 모아볼까요?
          </h1>
          <Button
            type="button"
            className="bg-accent_100 text-white flex justify-between px-20 py-18 rounded-main"
            rightIcon={<Right />}
            onClick={() => push('/home/sg-activity')}
          >
            시간 조각 모으러 가기
          </Button>
          <Div className="bg-white">
            {quickStart ? <QuickBox /> : <NoQuickBox />}
          </Div>
        </Div>

        <Div className="my-12 pb-50">
          <div>
            <p className="text-primary_foundation_60">오늘 모은 시간 조각</p>
            <h2 className="text-20">
              오늘은{' '}
              <span className="text-accent_100 font-bold">
                {totalSavedTime}분
              </span>
              의 시간조각을 모았어요!
            </h2>
          </div>

          {activities.length ? <TimePiece /> : <NoTimePiece />}
        </Div>

        <FooterButtons />
      </div>
    </HomeHeader>
  )
}
