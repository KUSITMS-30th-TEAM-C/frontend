import { http } from '@/api'
import {
  SelectedActivityResponse,
  SeletedActivityDone,
} from '@/types/activityTypes'

export const postSelectedData = (data: SeletedActivityDone) => {
  return http.post<SelectedActivityResponse>({
    url: '/activities',
    data,
  })
}

export const patchActivityDone = (activityId: number) => {
  return http.patch({
    url: `/activities/${activityId}/finish`,
  })
}
