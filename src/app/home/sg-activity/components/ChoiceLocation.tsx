'use client'

import Xcircle from '@/components/Icons/XcircleIcon'
import useUserInfo from '@/store/useUserInfo'
import { useActivityStore } from '@/store/activityStore'
import { cn } from '@/util'
import { useEffect, useState } from 'react'
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'
import { SetErrorProps, LocationDataType } from '../types/types'

export default function ChoiceLocation({ setError }: SetErrorProps) {
  const { userInfo } = useUserInfo()
  const { nickname } = userInfo
  const [isSearch, setIsSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchlist, setSearchlist] = useState<string[]>([])
  const { address, setAddress } = useActivityStore()

  const [location, setLocation] = useState({
    center: {
      lat: 33.450701,
      lng: 126.570667,
    },
    errMsg: '',
    isLoading: true,
  })

  const [kakaoLoaded, kakaoerror] = useKakaoLoader({
    appkey: 'eacc39192beeb6795003897bf2fc9471',
  })

  // 위치 정보를 가져오는 로직
  const getAddress = async (latitude: number, longitude: number) => {
    try {
      const addressResponse = await fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'KakaoAK 7e66401593bee45d18ef1de61a6c7c2f',
          },
        },
      )

      if (!addressResponse.ok) {
        console.log(`api error, ${addressResponse.status}`)
      }

      const addressData = await addressResponse.json()

      if (addressData.documents && addressData.documents.length > 0) {
        setAddress(
          `${addressData.documents[0].address.region_1depth_name} ${addressData.documents[0].address.region_2depth_name} ${addressData.documents[0].address.region_3depth_name}`,
        )
      }
    } catch (error) {
      console.error(`Error getting location:, ${error}`)
    }
  }

  useEffect(() => {
    setError(false)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          setLocation((prev) => ({
            ...prev,
            center: {
              lat: latitude,
              lng: longitude,
            },
            isLoading: false,
          }))

          getAddress(latitude, longitude)
        },
        (err) => {
          setLocation((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }))
        },
      )
    } else {
      setLocation((prev) => ({
        ...prev,
        errMsg: '위치 정보 제공을 허용해주세요',
        isLoading: false,
      }))
    }
  }, [])

  // 위치 검색 데이터를 가져와 state에 넣는 로직
  const filterAddress = (data: LocationDataType[]) => {
    const filterData = data
      .map((item) => {
        const match = item.address_name.match(/.+(구|군|시)\s.+?(동|리)/)
        return match ? match[0] : null
      })
      .filter((addressone) => addressone !== null)
      .filter(
        (addressResult, index, self) => self.indexOf(addressResult) === index,
      )

    return filterData
  }

  const searchAddress = async (query: string) => {
    setSearchQuery(query)

    if (query.length > 5) {
      try {
        const searchResult = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}`,
          {
            method: 'GET',
            headers: {
              Authorization: 'KakaoAK 7e66401593bee45d18ef1de61a6c7c2f',
            },
          },
        )

        if (!searchResult.ok) {
          console.log('api error', searchResult.status)
        }

        const resultData = await searchResult.json()
        const filterData: string[] = filterAddress(resultData.documents)

        setSearchlist(filterData)
      } catch (error_search) {
        console.error('Error getting location:', error_search)
      }
    }
  }

  // 검색 후 선택한 위치에 대한 경도 위도 값을 Map location으로 전달
  const locationTransGPS = async (addressOrigin: string) => {
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${addressOrigin}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'KakaoAK 7e66401593bee45d18ef1de61a6c7c2f',
          },
        },
      )

      if (!response.ok) {
        console.log('api error', response.status)
      }

      const data = await response.json()

      // console.log('받아온 데이터', data)

      if (data.documents && data.documents.length > 0) {
        const { x, y } = data.documents[0]
        setLocation((prev) => ({
          ...prev,
          center: {
            lat: parseFloat(y),
            lng: parseFloat(x),
          },
        }))
      }
    } catch (error_trans) {
      console.error('Error getting location:', error_trans)
    }
  }

  // 검색 초기화
  const clearSearchQuery = () => {
    setSearchQuery('')
    setSearchlist([])
  }

  if (kakaoLoaded) return <div className="w-full h-500 bg-white" />
  if (kakaoerror) return <div>Error</div>

  return (
    <div className="w-full">
      <Map
        center={location.center}
        style={{
          width: '100%',
          height: '352px',
        }}
        level={6}
        className="mt-36"
      >
        {!location.isLoading && (
          <MapMarker
            position={location.center}
            image={{
              src: '/images/map_marker.png',
              size: {
                width: 44,
                height: 44,
              },
            }}
          />
        )}
      </Map>
      <section className="w-342 mx-auto">
        <h1 className="font-semibold text-24 mt-32">
          {nickname} 님의 현재 위치가
          <br />
          이곳이 맞나요?
        </h1>
        <div className="w-342 h-50 border border-gray-300 rounded-lg mt-20 px-16 flex items-center justify-between">
          <p className="font-medium text-16 text-black truncate">{address}</p>
          <button
            tabIndex={0}
            type="button"
            className="text-14 text-primary_foundation-50 underline ml-4"
            onClick={() => {
              setIsSearch(true)
            }}
          >
            직접 입력하기
          </button>
        </div>
      </section>

      {isSearch && (
        <>
          <div
            role="button" // 버튼 역할을 명시
            tabIndex={0}
            className=" absolute inset-0 bg-black bg-opacity-60 z-20"
            onClick={() => setIsSearch(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsSearch(false) // Enter 키로도 동작하게 설정
              }
            }}
          />

          <section
            className={cn(
              'absolute bottom-0 bg-white w-full h-3/5 z-30 transition-transform duration-300 rounded-t-16',
              isSearch ? 'translate-y-0' : 'translate-y-full',
            )}
          >
            <div className="w-40 h-4 bg-[#D9D9D9] mt-8 mx-auto"> </div>

            <div className="w-342 mx-auto mt-10">
              <h3 className="font-semibold text-20">주소 직접 입력하기</h3>
              <div
                className={`w-342 mt-16 border-b-1 flex justify-between
                ${searchQuery ? 'border-black' : 'border-primary_foundation-20'}
                `}
              >
                <input
                  className="text-16 font-medium text-primary_foundation_90 placeholder:text-primary_foundation-40 pb-8 outline-none no-underline"
                  placeholder="주소를 입력해주세요"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    searchAddress(e.target.value)
                  }}
                  value={searchQuery}
                />
                {searchQuery && (
                  <Xcircle
                    width={17}
                    height={17}
                    className="mr-8"
                    onClick={clearSearchQuery}
                  />
                )}
              </div>

              <div className="overflow-auto max-h-390">
                {searchlist &&
                  searchlist.map((addressResultOne) => {
                    return (
                      <div
                        key={addressResultOne}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setAddress(addressResultOne)
                          locationTransGPS(addressResultOne)
                          setIsSearch(false)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setAddress(addressResultOne)
                            locationTransGPS(addressResultOne)
                            setIsSearch(false)
                          }
                        }}
                        className="font-medium text-14 text-primary_foundation_90 w-342 h-46 px-8 py-12 "
                      >
                        {addressResultOne}
                      </div>
                    )
                  })}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
