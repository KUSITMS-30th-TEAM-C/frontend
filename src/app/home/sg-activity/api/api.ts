import { http } from '@/api'
import { ActivityRecommendRequest } from '../types/types'
import { ActivityResponseData } from '@/types/activityTypes'

export const postSuggestData = (data: ActivityRecommendRequest) => {
  return http.post<ActivityResponseData>({
    url: 'recommendations',
    data,
  })
}
