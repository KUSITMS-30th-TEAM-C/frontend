import { Dispatch, SetStateAction } from 'react'
import { ActivityData } from '@/types/activityTypes'

export interface SetErrorProps {
  setError: Dispatch<SetStateAction<boolean>>
}

export interface ChoiceSuggestionProps {
  isSuggestLoading: boolean
  setIsSuggestLoading: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<boolean>>
  setText: Dispatch<SetStateAction<string>>
  setSeletedActivity: Dispatch<SetStateAction<ActivityData | undefined>>
  setActivityLink: Dispatch<SetStateAction<string>>
  setPostActivityType: Dispatch<SetStateAction<string>>
}

export interface ActivityResponse {
  success: boolean
  timestamp: string
  data: ActivityData[]
}

export interface LocationDataType {
  address_name: string
  category_group_code?: string
  category_group_name?: string
  category_name: string
  distance?: string
  id: string
  phone: string
  place_name: string
  place_url: string
  road_address_name: string
  x: string
  y: string
}

export interface ActivityRecommendRequest {
  spareTime: number
  activityType: 'OFFLINE' | 'ONLINE' | 'ONLINE_AND_OFFLINE' | ''
  keywords: string[]
  location?: string
}

export interface ActivityStartRequest {
  spareTime: number
  type: 'OFFLINE' | 'ONLINE' | 'ONLINE_AND_OFFLINE' | ''
  keywords: string[]
  location?: string
}
