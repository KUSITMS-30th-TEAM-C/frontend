'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Cookies from 'js-cookie'
import { Button } from '@/components'
import useUserInfo from '@/store/useUserInfo'
import {
  SeletedActivityDone,
  SelectedActivityResponse,
} from '@/types/activityTypes'
import Image from 'next/image'
import { usePatchActivityDone, usePostSelectedData } from './api/queries'

export default function ActivityPage() {
  const router = useRouter()
  const { userInfo } = useUserInfo()
  const { nickname } = userInfo
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [selectedActivityData, setSelectedActivityData] =
    useState<SeletedActivityDone>()
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [activityId, setActivityId] = useState<number>(0)
  const [spareTimeLocal, setSpareTimeLocal] = useState<number>()

  // 타이머 ID를 useRef로 관리하여 리렌더링 방지
  const intervalId = useRef<number | null>(null)
  const timeoutId = useRef<number | null>(null)

  const { mutate: activityPatch } = usePatchActivityDone()
  const { mutate: postSeletData } = usePostSelectedData()

  // const activityDone = async () => {
  //   if (localStorage.getItem('activityCompleted')) {
  //     return
  //   }

  //   try {
  //     const activityDonePatch = await fetch(
  //       `https://cnergy.p-e.kr/v1/activities/${activityId}/finish`,
  //       {
  //         method: 'PATCH',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     )

  //     if (!activityDonePatch.ok) {
  //       throw new Error(`HTTP error! status: ${activityDonePatch.status}`)
  //     }

  //     const toJson = await activityDonePatch.json()
  //     console.log('받은 데이터', toJson)

  //     localStorage.setItem('activityCompleted', 'true')
  //   } catch (error) {
  //     console.error('Error sending POST request:', error)
  //   }
  // }

  const calculateSavedTime = (spareTime: number, elapsedMinutes: number) => {
    let savedTime: number = 0
    if (spareTime < elapsedMinutes) {
      savedTime = spareTime
    } else {
      savedTime = elapsedMinutes
    }
    return savedTime
  }

  const updateRemainingTime = (startTimeValue: number, spareTimeMs: number) => {
    const currentTime = Date.now()
    const elapsedRm = currentTime - startTimeValue
    const remainingTimeMsRm = spareTimeMs - elapsedRm

    const elapsedMinutesInUpdateFn = Math.floor(elapsedRm / 60000)

    const cappedElapsedTime = calculateSavedTime(
      spareTimeMs,
      elapsedMinutesInUpdateFn,
    )
    setElapsedTime(cappedElapsedTime)

    if (remainingTimeMsRm <= 0) {
      setIsTimeUp(true)
      activityPatch(activityId)

      if (intervalId.current !== null) {
        clearInterval(intervalId.current)
        intervalId.current = null
      }
    }
    // else {
    //   // 남은 시간 로그 (디버깅 용도)
    //   const remainingSeconds = Math.ceil(remainingTimeMsRm / 1000)
    //   console.log(`남은 시간: ${remainingSeconds}초`)
    // }
  }

  useEffect(() => {
    const getActivityData = localStorage.getItem('selectedActivity')
    if (!getActivityData) {
      alert('선택한 활동이 없습니다.')
      router.push('/home')
      return () => {}
    }

    const selectedActivityLocal: SeletedActivityDone =
      JSON.parse(getActivityData)
    const spareTimeInUseEffect = selectedActivityLocal.spareTime
    const spareTimeMs = spareTimeInUseEffect * 60 * 1000
    let startTime = localStorage.getItem('startTime')
    const now = Date.now()
    const remainActivityId = localStorage.getItem('activityId')

    setSpareTimeLocal(spareTimeInUseEffect)

    // const postSelectData = async () => {
    //   try {
    //     const response = await fetch('https://cnergy.p-e.kr/v1/activities', {
    //       method: 'POST',
    //       body: JSON.stringify(selectedActivityLocal),
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`)
    //     }

    //     const { data } = await response.json()
    //     const responseData: SelectedActivityResponse = data
    //     console.log('받은 데이터', responseData)

    //     localStorage.setItem('activityId', responseData.id.toString())

    //     setActivityId(responseData.id)
    //   } catch (error) {
    //     console.error('Error sending POST request:', error)
    //   }
    // }

    if (!remainActivityId) {
      postSeletData(selectedActivityLocal, {
        onSuccess: (data) => {
          const response = data.data
          localStorage.setItem('activityId', response.id.toString())
          setActivityId(response.id)
        },
      })
    } else {
      setActivityId(parseInt(remainActivityId, 10))
    }

    if (!startTime) {
      startTime = now.toString()
      localStorage.setItem('startTime', startTime)
    }

    const startTimeValue = parseInt(startTime, 10)
    const elapsed = now - startTimeValue
    const remainingTimeMs = spareTimeMs - elapsed

    const elapsedMinutesInuseEffect = Math.ceil(elapsed / 60000)

    const calSavedTime = calculateSavedTime(
      spareTimeInUseEffect,
      elapsedMinutesInuseEffect,
    )

    setElapsedTime(calSavedTime)

    if (elapsed >= spareTimeMs) {
      // 시간이 이미 지난 경우
      setIsTimeUp(true)
      activityPatch(activityId)
    } else {
      timeoutId.current = window.setTimeout(() => {
        setIsTimeUp(true)
        activityPatch(activityId)
      }, remainingTimeMs)
      updateRemainingTime(startTimeValue, spareTimeMs)

      intervalId.current = window.setInterval(() => {
        updateRemainingTime(startTimeValue, spareTimeMs)
      }, 1000)
    }

    setSelectedActivityData(selectedActivityLocal)

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current)
        intervalId.current = null
      }
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }
    }
  }, [])

  const handleFinishActivity = () => {
    if (!isTimeUp) {
      const confirmFinish = window.confirm(
        '활동을 종료하시겠습니까? 지금까지의 시간이 저장됩니다.',
      )
      if (!confirmFinish) return

      // 경과 시간 계산
      const startTime = localStorage.getItem('startTime')
      const now = Date.now()
      if (startTime) {
        const calculateElapsed = now - parseInt(startTime, 10)
        const elapsedMinutes = Math.round(calculateElapsed / 60000)

        if (spareTimeLocal) {
          const calSavedTimeClickDone = calculateSavedTime(
            spareTimeLocal,
            elapsedMinutes,
          )
          setElapsedTime(calSavedTimeClickDone)
        }
      } else {
        setElapsedTime(0)
      }

      activityPatch(activityId)
    }

    // 활동 종료 처리
    localStorage.removeItem('startTime')
    localStorage.removeItem('selectedActivity')
    localStorage.removeItem('activityId')
    localStorage.removeItem('activityCompleted')
    setIsTimeUp(true)

    // 타이머 정리
    if (intervalId.current !== null) {
      clearInterval(intervalId.current)
      intervalId.current = null
    }
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current)
      timeoutId.current = null
    }
  }

  const clickBackHome = () => {
    localStorage.removeItem('startTime')
    localStorage.removeItem('selectedActivity')
    localStorage.removeItem('activityId')
    localStorage.removeItem('activityCompleted')
    router.push('/home')
  }

  return (
    <>
      {isTimeUp ? (
        <div className="w-full h-full">
          <header className="relative font-semibold flex justify-center items-center py-4 min-h-52 mt-10">
            <span>활동 종료</span>
          </header>
          <article>
            <h3 className="font-semibold text-24 mt-70 mx-20">
              {nickname}님 오늘도
              <br />
              {elapsedTime}분의 시간 조각을 모았어요!
            </h3>

            <Image
              src={
                selectedActivityData?.keyword.image ||
                '/images/NATURE_result.png'
              }
              alt="NATURE"
              width={256}
              height={256}
              className="mx-auto mt-40"
            />

            <div className="absolute bottom-125 w-full z-10">
              <div className="w-351 h-104 bg-white flex justify-between mx-auto px-20 rounded-12">
                <div className="w-200 h-70 my-auto items-center">
                  <p className="text-12 text-primary_foundation-50 line-clamp-1">
                    {selectedActivityData?.content}
                  </p>
                  <p className="font-medium text-16 text-primary_foundation-100 mt-5 line-clamp-2">
                    {selectedActivityData?.title}
                  </p>
                </div>

                <p className="font-semibold text-24 text-accent_100 my-auto">
                  +{elapsedTime}분
                </p>
              </div>
            </div>

            <div className="absolute bottom-50 w-full py-4 flex flex-col items-center">
              <Button
                className="w-[90%] mx-auto font-semibold text-16 text-white bg-accent_100 z-10"
                onClick={clickBackHome}
              >
                홈 화면으로 돌아가기
              </Button>
            </div>
            <Image
              src="/images/bg-activity_fine.png"
              alt="bg-activity_fine"
              width={390}
              height={844}
              className="absolute bottom-0 transform -translate-x-1/2 z-0"
            />
          </article>
        </div>
      ) : (
        <article className="w-full h-screen bg-primary_foundation-100 pt-100">
          <div className="w-267 mx-auto text-center">
            <p className="font-medium text-14 text-primary_foundation-40">
              지금 {nickname}님은
            </p>
            <h3 className="w-250 font-medium text-20 text-white text-center items-center mt-8">
              {selectedActivityData?.title}를 하고 있어요.
            </h3>
          </div>
          <Image
            src={`/gif/${selectedActivityData?.keyword.category}_ing.gif`}
            alt={selectedActivityData?.title || '활동 이미지'}
            width={390}
            height={390}
            unoptimized
            priority
            className="mt-60"
          />

          <div className="absolute bottom-50 w-full py-4 flex flex-col items-center">
            <Button
              className="w-[90%] mx-auto font-semibold text-16 text-accent_100 bg-accent_100 bg-opacity-20"
              onClick={handleFinishActivity}
            >
              활동 종료하기
            </Button>
          </div>
        </article>
      )}
    </>
  )
}
