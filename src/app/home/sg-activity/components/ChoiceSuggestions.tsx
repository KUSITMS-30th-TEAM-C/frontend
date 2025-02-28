'use client'

import { useEffect, useState } from 'react'
import useUserInfo from '@/store/useUserInfo'
import { useActivityStore } from '@/store/activityStore'

import Image from 'next/image'

import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'

import { ActivityData } from '@/types/activityTypes'

import { ActivityRecommendRequest, ChoiceSuggestionProps } from '../types/types'
import '../styles/choicesuggestion.css'
import SuggestionWait from './SuggestionWait'
import { usePostActivity } from '../api/queries'

const getActiveType = (typeArr: string[]) => {
  if (typeArr.length >= 2) {
    return 'ONLINE_AND_OFFLINE'
  }
  if (typeArr.includes('온라인')) {
    return 'ONLINE'
  }
  if (typeArr.includes('오프라인')) {
    return 'OFFLINE'
  }
  return ''
}

export default function ChoiceSuggestion({
  setError,
  setText,
  setSeletedActivity,
  setActivityLink,
  setPostActivityType,
  isSuggestLoading,
  setIsSuggestLoading,
}: ChoiceSuggestionProps) {
  const { userInfo } = useUserInfo()
  const { nickname } = userInfo
  const { spareTime, activityType, keywords, address } = useActivityStore()
  const [responseData, setResponseData] = useState<ActivityData[]>()
  const activeType = getActiveType(activityType)
  const postData: ActivityRecommendRequest = {
    spareTime: parseInt(spareTime, 10),
    activityType: activeType,
    keywords,
    ...(address && { location: address }),
  }
  const { mutate: postActivity } = usePostActivity()

  useEffect(() => {
    setError(false)
    setText('이 활동하기')

    if (localStorage.getItem('quickStart')) {
      const { quickStart } = JSON.parse(
        localStorage.getItem('quickStart') || '',
      )
      postData.activityType = quickStart.type
      postData.spareTime = quickStart.spareTime
    }

    // const fetchData = async () => {
    //   // console.log('보내는 데이터 확인', postData)
    //   try {
    //     setIsSuggestLoading(true)

    //     const accessToken = Cookies.get('accessToken')

    //     const response = await fetch(
    //       'https://cnergy.p-e.kr/v1/recommendations',
    //       {
    //         method: 'POST',
    //         body: JSON.stringify(postData),
    //         headers: {
    //           'Content-Type': 'application/json',
    //           Authorization: `Bearer ${accessToken}`,
    //         },
    //       },
    //     )

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`)
    //     }

    //     const toJson: ActivityResponse = await response.json()
    //     // console.log('받은 데이터', toJson)
    //     const mergeArr = [
    //       ...toJson.data.offlineRecommendations,
    //       ...toJson.data.onlineRecommendations,
    //     ]
    //     // console.log('데이터', mergeArr)
    //     setResponseData(mergeArr)
    //   } catch (error) {
    //     console.error('Error sending POST request:', error)
    //   } finally {
    //     setIsSuggestLoading(false)
    //   }
    // }

    setIsSuggestLoading(true)

    postActivity(postData, {
      onSuccess: (data) => {
        const response = data.data

        const mergeArr = [
          ...response.offlineRecommendations,
          ...response.onlineRecommendations,
        ]

        setResponseData(mergeArr)
        setIsSuggestLoading(false)
      },
    })

    return () => {
      setIsSuggestLoading(false)
      setText('다음')
    }
  }, [])

  const handleSlide = (swiper: SwiperClass) => {
    if (responseData) {
      const pointSlideData = responseData[swiper.activeIndex]

      setSeletedActivity(pointSlideData)
      if (pointSlideData.url) setActivityLink(pointSlideData.url)
      if (pointSlideData.placeUrl) setActivityLink(pointSlideData.placeUrl)
      setPostActivityType(activeType)
    }
  }

  return (
    <div>
      {isSuggestLoading ? (
        <SuggestionWait nickname={nickname} keywords={keywords} />
      ) : (
        <>
          <div className="max-w-390">
            <section className="w-342 mx-auto mt-50 text-center">
              <h1 className="font-semibold text-20">
                조각조각이 {nickname} 님에게
                <br />딱 맞는 활동을 가져왔어요!
              </h1>
              <p className="text-14 text-primary_foundation-60 mt-8">
                이 중 원하는 활동을 하나 선택해 보세요.
              </p>
            </section>

            <section className="w-full mt-40">
              <Swiper
                onSwiper={handleSlide}
                onSlideChange={handleSlide}
                modules={[Pagination]}
                pagination={{
                  clickable: true,
                  el: '.custom-pagination',
                }}
                slidesPerView={1.2}
                centeredSlides
              >
                {responseData &&
                  responseData.map((cardData) => (
                    <SwiperSlide key={cardData.title}>
                      <div className="bg-primary_foundation-100 w-320 h-320 rounded-16 flex flex-col items-center">
                        <Image
                          src={`${cardData.keyword.image}`}
                          alt={cardData.keyword.category}
                          width={170}
                          height={170}
                          className="mt-10"
                        />
                        <div className="w-270 mx-auto">
                          <p className="text-16 text-primary_foundation-30 line-clamp-1">
                            {cardData.content}
                          </p>
                          <h3 className="font-semibold text-24 text-primary_foundation-5 w-260 line-clamp-2">
                            {cardData.title}
                          </h3>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>

              <div className="custom-pagination relative flex justify-center z-10 mt-30" />
            </section>
          </div>
          <img
            src="/images/choiceSuggestion_bg.png"
            alt="suggest-bg"
            className="absolute bottom-0 left-0 w-full"
          />
        </>
      )}
    </div>
  )
}
