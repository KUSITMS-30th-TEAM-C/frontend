'use client'

import { useRouter } from 'next/navigation'
import { KeywordsDataForTreemap } from './types'
import {
  calculateKeywordsTwo,
  calculateKeywordsThree,
  calculateKeywordsFour,
  calculateKeywordsFive,
  calculateKeywordsSix,
} from './utils/treemap'

export const transKeyword = (keyword: string) => {
  switch (keyword) {
    case 'ENTERTAINMENT':
      return '엔터테인먼트'
    case 'CULTURE_ART':
      return '문화/예술'
    case 'HEALTH':
      return '건강'
    case 'RELAXATION':
      return '휴식'
    case 'SELF_DEVELOPMENT':
      return '자기개발'
    case 'SOCIAL':
      return '소셜'
    default:
      return '자연'
  }
}

export default function TreemapChart({
  monthlySavedTimeAndActivityCount,
  activitiesByKeywordSummary,
  joinedYear,
  joinedMonth,
}: KeywordsDataForTreemap) {
  const router = useRouter()

  const CONTAINER_WIDTH = 340
  const CONTAINER_HEIGHT = 340
  const PADDING = 2
  const MIN_HEIGHT = 70
  const MIN_WIDTH = 90
  const totalActivity =
    monthlySavedTimeAndActivityCount.monthlyTotalActivityCount

  const layouts = (() => {
    const sortedKeywords = activitiesByKeywordSummary.sort(
      (a, b) => b.activityCount - a.activityCount,
    )
    const totalKeywords = sortedKeywords.length

    switch (totalKeywords) {
      case 1:
        return [
          {
            width: CONTAINER_WIDTH,
            height: CONTAINER_HEIGHT,
            item: sortedKeywords[0],
          },
        ]
      case 2:
        return calculateKeywordsTwo(
          CONTAINER_WIDTH,
          CONTAINER_HEIGHT,
          MIN_HEIGHT,
          sortedKeywords,
          totalActivity,
        )
      case 3:
        return calculateKeywordsThree(
          CONTAINER_HEIGHT,
          CONTAINER_WIDTH,
          MIN_HEIGHT,
          MIN_WIDTH,
          PADDING,
          sortedKeywords,
          totalActivity,
        )
      case 4:
        return calculateKeywordsFour(
          CONTAINER_HEIGHT,
          CONTAINER_WIDTH,
          MIN_HEIGHT,
          MIN_WIDTH,
          PADDING,
          sortedKeywords,
          totalActivity,
        )
      case 5:
        return calculateKeywordsFive(
          CONTAINER_HEIGHT,
          CONTAINER_WIDTH,
          MIN_HEIGHT,
          MIN_WIDTH,
          PADDING,
          sortedKeywords,
          totalActivity,
        )
      case 6:
        return calculateKeywordsSix(
          CONTAINER_HEIGHT,
          CONTAINER_WIDTH,
          MIN_HEIGHT,
          MIN_WIDTH,
          PADDING,
          sortedKeywords,
          totalActivity,
        )
      default:
        return []
    }
  })()

  const handleKeywordClick = async (keyword: string) => {
    router.push(
      `/archive/keyword-detail?year=${joinedYear}&month=${joinedMonth}&keyword=${keyword}`,
    )
  }

  return (
    <div className="w-345 h-345 mx-auto flex flex-wrap gap-4 rounded-12 mt-20 mb-350">
      {layouts.map(({ width, height, item }) => (
        <button
          key={item.keyword.category}
          type="button"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundImage: `url(${item.keyword.image || 'images/NATURE_result.png'})`,
          }}
          className="flex items-center justify-center font-bold bg-primary_foundation-100 rounded-12 bg-contain bg-center bg-no-repeat overflow-hidden"
          onClick={() => handleKeywordClick(item.keyword.category)}
        >
          <span className="font-pretendard font-semibold text-white text-20">
            {transKeyword(item.keyword.category)}
          </span>
        </button>
      ))}
    </div>
  )
}
