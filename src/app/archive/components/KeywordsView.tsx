'use client'

import { useRouter } from 'next/navigation'
import { getYear, getMonth } from 'date-fns'
import { Button, Right, FooterButtons } from '@/components'
import TreemapChart from './Treemap/Treemap'
import { useKeywordsContext } from '../api/fetcher'

const transMonth = (payloadMonth: string) => {
  switch (payloadMonth) {
    case 'JANUARY':
      return 1
    case 'FEBRUARY':
      return 2
    case 'MARCH':
      return 3
    case 'APRIL':
      return 4
    case 'MAY':
      return 5
    case 'JUNE':
      return 6
    case 'JULY':
      return 7
    case 'AUGUST':
      return 8
    case 'SEPTEMBER':
      return 9
    case 'OCTOBER':
      return 10
    case 'NOVEMBER':
      return 11
    case 'DECEMBER':
      return 12
    default:
      return 0
  }
}

export default function KeywordView({ currentDate }: { currentDate: Date }) {
  const { data } = useKeywordsContext()

  const router = useRouter()
  const currentYear = getYear(currentDate)
  const currentMonth = getMonth(currentDate) + 1

  return (
    <div>
      {data.monthlySavedTimeAndActivityCount.monthlyTotalActivityCount === 0 ? (
        <div className="w-342 h-342 rounded-12 bg-primary_foundation-5 flex items-center justify-center p-24 mx-auto mt-20 mb-350">
          <div className="mt-35 mb-20 flex flex-col items-center gap-8">
            <h2 className="text-18">아직 모은 시간 조각이 없어요!</h2>
            {currentYear === data.joinedYear &&
              currentMonth === transMonth(data.joinedMonth) && (
                <Button
                  onClick={() => router.push('/')}
                  className="bg-accent-100 px-20"
                  rightIcon={<Right />}
                >
                  시간 조각 바로 모으러가기
                </Button>
              )}
          </div>
        </div>
      ) : (
        <TreemapChart
          joinedYear={data.joinedYear}
          joinedMonth={transMonth(data.joinedMonth)}
          activitiesByKeywordSummary={data.activitiesByKeywordSummary}
          monthlySavedTimeAndActivityCount={
            data.monthlySavedTimeAndActivityCount
          }
        />
      )}
      <FooterButtons />
    </div>
  )
}
