import { http } from '@/api'
import { ActivityResponseData } from '@/types/activityTypes'
import { ActivityRecommendRequest } from '../types/types'

export const postSuggestData = (data: ActivityRecommendRequest) => {
  return http.post<ActivityResponseData>({
    url: 'recommendations',
    data,
  })
}

