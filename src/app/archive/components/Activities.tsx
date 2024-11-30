'use client'

import { useEffect, useState } from 'react'
import { format, parseISO, getYear, getMonth } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button, If, Right } from '@/components'
import { useRouter } from 'next/navigation'
import { useCalendarContext } from '../api/fetcher'
import { categoryLabels } from '../api/types'

export default function Activities({
  selectedDate,
  currentDate,
}: {
  selectedDate?: Date
  currentDate: Date
}) {
  const { push } = useRouter()
  const { monthlyActivities } = useCalendarContext()
  const [currentYear, setCurrentYear] = useState<number>()
  const [currentMonth, setCurrentMonth] = useState<number>()
  const [focusYear, setFocusYear] = useState<number>()
  const [focusMonth, setFocusMonth] = useState<number>()

  useEffect(() => {
    const now = Date.now()
    const currentYearCal = getYear(now)
    const currentMonthCal = getMonth(now) + 1
    const focusYearCal = getYear(currentDate)
    const focusMonthCal = getMonth(currentDate) + 1

    console.log(currentYearCal, currentMonthCal, focusYearCal, focusMonthCal)

    setCurrentYear(currentYearCal)
    setCurrentMonth(currentMonthCal)
    setFocusYear(focusYearCal)
    setFocusMonth(focusMonthCal)
  }, [monthlyActivities])

  const filteredActivities = selectedDate
    ? monthlyActivities?.filter(
        (activity) =>
          format(parseISO(activity.activityCreatedAt), 'yyyy-MM-dd') ===
          format(selectedDate, 'yyyy-MM-dd'),
      )
    : monthlyActivities

  const activitiesByDate =
    filteredActivities?.reduce(
      (acc, activity) => {
        const dateKey = format(
          parseISO(activity.activityCreatedAt),
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

  const sortedDates = Object.keys(activitiesByDate)

  return (
    <>
      <If condition={filteredActivities.length === 0}>
        <div className="bg-primary_foundation-5 flex items-center justify-center p-24">
          <div className="mt-35 mb-20 flex flex-col items-center gap-8">
            <h2 className="text-18">아직 모은 시간 조각이 없어요!</h2>
            {currentYear === focusYear && currentMonth === focusMonth && (
              <Button
                onClick={() => push('/home/sg-activity')}
                className="bg-accent-100 px-20"
                rightIcon={<Right />}
              >
                시간 조각 바로 모으러가기
              </Button>
            )}
          </div>
        </div>
      </If>

      <If condition={!!filteredActivities}>
        <div className="p-16 bg-primary_foundation-5">
          {sortedDates?.map((date) => (
            <div key={date} className="mb-20">
              <h3 className="text-16 font-[500] mb-8 flex items-center">
                {format(parseISO(date), 'MM월 dd일')}
                <span className="ml-8 text-primary_foundation-60 text-12">
                  {format(parseISO(date), 'E', { locale: ko })}
                </span>
              </h3>

              <div className="flex flex-col gap-8 relative rounded-12">
                {activitiesByDate[date].map((activity) => (
                  <div key={activity.title} className="flex flex-col gap-8">
                    <div className="flex flex-col relative w-full rounded-12 p-12 bg-white">
                      <span className="text-12 w-fit px-10 py-2 rounded-12 bg-primary_foundation-10">
                        {categoryLabels[activity.category]}의 조각
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
      </If>
    </>
  )
}
