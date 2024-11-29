'use client'

import useUserInfo from '@/store/useUserInfo'
import { useActivityStore } from '@/store/activityStore'
import { useEffect, useMemo } from 'react'
import Image from 'next/image'
import { SetErrorProps } from '../types/types'

export default function ChoiceKeyword({ setError }: SetErrorProps) {
  const { userInfo } = useUserInfo()
  const { nickname } = userInfo
  const { activityType, keywords, setKeywords } = useActivityStore()
  const keywordList = [
    'SELF_DEVELOPMENT',
    'HEALTH',
    'CULTURE_ART',
    'ENTERTAINMENT',
    'RELAXATION',
    'SOCIAL',
  ]

  const MAX_KEYWORDS = 5

  useEffect(() => {
    if (keywords.length > 0) {
      setError(false)
    } else {
      setError(true)
    }
  }, [keywords, setError])

  const filteredKeywordList = useMemo(() => {
    if (activityType.includes('오프라인') && !activityType.includes('온라인')) {
      return keywordList.filter((keyword) => keyword !== 'SOCIAL')
    }
    if (activityType.includes('온라인') && !activityType.includes('오프라인')) {
      return keywordList.filter((keyword) => keyword !== 'NATURE')
    }
    return keywordList
  }, [activityType])

  useEffect(() => {
    if (activityType.includes('오프라인') && !activityType.includes('온라인')) {
      const removeSocialInKeywords = keywords.filter((k) => k !== 'SOCIAL')
      if (removeSocialInKeywords.length !== keywords.length) {
        setKeywords(removeSocialInKeywords)
      }
    }
  }, [activityType])

  const toggleKeyword = (keyword: string) => {
    if (keywords.includes(keyword)) {
      const updateKeywords = keywords.filter((k) => k !== keyword)

      setKeywords(updateKeywords)
    } else if (keywords.length < MAX_KEYWORDS) {
      const updateKeywords = [...keywords, keyword]

      setKeywords(updateKeywords)
    }
  }

  const getImageName = (keyword: string) => {
    if (keywords.includes(keyword)) {
      return `${keyword}_selected.png`
    }
    if (keywords.length >= MAX_KEYWORDS) {
      return `${keyword}_disabled.png`
    }
    return `${keyword}.png`
  }

  return (
    <div className="w-342 mx-auto mt-50">
      <section>
        <h3 className="font-semibold text-24">
          {nickname} 님이 선호하는
          <br />
          활동 키워드를 선택해 주세요
        </h3>
        <p className="text-14 text-primary_foundation-50 mt-10">
          키워드는 최대 5개까지 선택 가능해요
        </p>
        {/* <button>
          활동 키워드 알아보기
        </button> */}
      </section>

      <section className="grid grid-cols-3 gap-4 mt-50">
        {filteredKeywordList.map((keyword) => (
          <div
            key={keyword}
            tabIndex={0}
            role="button"
            aria-label={`키워드 ${keyword} 선택`}
            className={`flex flex-col items-center cursor-pointer ${
              keywords.length >= MAX_KEYWORDS && !keywords.includes(keyword)
                ? 'pointer-events-none opacity-50' // 비활성화 상태
                : ''
            }`}
            onClick={() => toggleKeyword(keyword)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') toggleKeyword(keyword)
            }}
          >
            <Image
              src={`/images/${getImageName(keyword)}`}
              alt={keyword}
              width={104}
              height={104}
              className="mb-5"
            />
          </div>
        ))}
      </section>
    </div>
  )
}
