import { useMutation } from '@tanstack/react-query'
import { patchActivityDone, postSelectedData } from './api'
import { SeletedActivityDone } from '@/types/activityTypes'

export const usePatchActivityDone = () => {
  return useMutation({
    mutationKey: ['activity-edit'],
    mutationFn: (activityId: number) => patchActivityDone(activityId),
  })
}

export const usePostSelectedData = () => {
  return useMutation({
    mutationKey: ['activity-dataPost'],
    mutationFn: (data: SeletedActivityDone) => postSelectedData(data),
  })
}
