import { useMutation } from '@tanstack/react-query'
import { postSuggestData } from './api'
import { ActivityRecommendRequest } from '../types/types'

export const usePostActivity = () => {
  return useMutation({
    mutationKey: ['activity-recommend'],
    mutationFn: (data: ActivityRecommendRequest) => postSuggestData(data),
  })
}
