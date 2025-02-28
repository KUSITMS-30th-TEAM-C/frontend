'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { format, getMonth, getYear, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import Cookies from 'js-cookie'
import { IconLeft, Clock } from '@/components'
import useUserInfo from '@/store/useUserInfo'
import { useMonthTotalCount } from '@/store/monthCount'
import { KeywordMonthDataResponse, MonthActivity } from './types/type'
import { transKeyword } from '../components/Treemap/Treemap'
import OverviewHeaderForDetail from '../components/OverviewHeaderForDetail'
import { useGetKeywordMonthData } from '../api/queries'

export default function KeywordDetailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { nickname } = useUserInfo().userInfo
  const { setMonthCount } = useMonthTotalCount()

  // const [accessToken, setAccessToken] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [keyword, setKeyword] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

  const [keywordData, setKeywordData] = useState<KeywordMonthDataResponse>()
  const [sortedDates, setSortedDates] = useState<string[]>()
  const [activitiesByDate, setActivitiesByDate] =
    useState<Record<string, MonthActivity[] | undefined>>()

  const [year, setYear] = useState<number>(0)
  const [month, setMonth] = useState<number>(0)

  const { data, isError } = useGetKeywordMonthData(year, month, keyword)

  useEffect(() => {
    // const token = Cookies.get('accessToken')

    // if (token) {
    //   setAccessToken(token)
    // }

    const queryYear = searchParams.get('year')
    const queryMonth = searchParams.get('month')
    const querytKeyword = searchParams.get('keyword')
    if (queryYear && queryMonth && querytKeyword) {
      const transYear = parseInt(queryYear, 10)
      const transMonth = parseInt(queryMonth, 10)
      const initialDate = new Date(transYear, transMonth - 1)

      setCurrentDate(initialDate)
      setKeyword(querytKeyword)

      setIsInitialized(true)
    }
  }, [])

  // const getMonthData = async (
  //   reqyear: number,
  //   reqmonth: number,
  //   reqkeyword: string,
  // ) => {
  //   try {
  //     const response = await fetch(
  //       `https://cnergy.p-e.kr/v1/activities?year=${reqyear}&month=${reqmonth}&keywordCategory=${reqkeyword}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     )

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`)
  //     }

  //     const { data } = await response.json()

  //     setMonthCount(data.totalActivityCountByKeywordInMonth)
  //     setKeywordData(data)
  //   } catch (error) {
  //     console.error('Error sending POST request:', error)
  //   }
  // }

  useEffect(() => {
    if (isInitialized) {
      const nowYear = getYear(currentDate)
      const nowMonth = getMonth(currentDate) + 1

      setYear(nowYear)
      setMonth(nowMonth)

      if (data && !isError) {
        setMonthCount(data.data.totalActivityCountByKeywordInMonth)
        setKeywordData(data.data)
      }
    }
  }, [keyword, currentDate])

  useEffect(() => {
    const monthlyActivities = keywordData?.activities

    const activitiesByDateSort =
      monthlyActivities?.reduce(
        (acc, activity) => {
          const dateKey = format(
            parseISO(activity.dateOfActivity),
            'yyyy-MM-dd',
          )
          if (!acc[dateKey]) {
            acc[dateKey] = []
          }
          acc[dateKey].push(activity)
          return acc
        },
        {} as Record<string, typeof monthlyActivities>,
      ) ?? {}

    const sortedDatesKeys = Object.keys(activitiesByDateSort)
    setActivitiesByDate(activitiesByDateSort)
    setSortedDates(sortedDatesKeys)
  }, [keywordData])

  const onBack = () => {
    router.back()
  }

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  return (
    <div className="w-full">
      <header className="relative font-semibold flex justify-center items-center py-4 min-h-52">
        <IconLeft className="absolute left-20" onClick={onBack} />
        <span>조각 별 상세정보</span>
      </header>

      <section>
        <div className="flex flex-col mt-26 mb-10 w-350 mx-auto">
          <p className="text-primary_foundation-60 text-14">
            {nickname}님의 모은 시간
          </p>
          <div className="flex flex-col text-24 font-[500]">
            <p className="flex items-center">
              이달에
              <span className="ml-12 mr-4 flex gap-4 items-center text-accent_100 text-28 font-[600] leading-34">
                <Clock color="#FF4F38" />
                {keywordData?.totalSavedTimeByKeywordInMonth}분
              </span>
              의
            </p>
            <p>
              {keywordData && transKeyword(keywordData.keyword.category)}의
              조각을 모았어요
            </p>
          </div>
        </div>

        <div className="w-390">
          <Image
            src={keywordData?.keyword.image || ''}
            alt="keyword Image"
            width={228}
            height={228}
            className="mx-auto"
          />
        </div>
      </section>

      <OverviewHeaderForDetail
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
      />

      <div className="p-16 bg-primary_foundation-5 mt-20">
        {sortedDates?.map((date) => (
          <div key={date} className="mb-20">
            <h3 className="text-16 font-[500] mb-8 flex items-center">
              {format(parseISO(date), 'MM월 dd일')}
              <span className="ml-8 text-primary_foundation-60 text-12">
                {format(parseISO(date), 'E', { locale: ko })}
              </span>
            </h3>

            <div className="flex flex-col gap-8 relative rounded-12">
              {activitiesByDate &&
                activitiesByDate[date]?.map((activity) => (
                  <div key={activity.title} className="flex flex-col gap-8">
                    <div className="flex flex-col relative w-full rounded-12 p-12 bg-white">
                      <span className="text-12 w-fit px-10 py-2 rounded-12 bg-primary_foundation-10">
                        {transKeyword(keyword)}의 조각
                      </span>
                      <span className="mt-8 text-14">{activity.title}</span>
                      <span className="text-14 font-[500] text-white bg-black absolute top-0 right-0 p-8 rounded-tr-12 rounded-bl-12 w-56 text-center whitespace-nowrap">
                        +{activity.savedTime}분
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
