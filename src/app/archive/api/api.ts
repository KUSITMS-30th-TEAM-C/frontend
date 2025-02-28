import { http } from '@/api'
import { KeywordMonthDataResponse } from '../keyword-detail/types/type'

export const getMonthData = (
  reqyear: number,
  reqmonth: number,
  reqkeyword: string,
) => {
  return http.get<KeywordMonthDataResponse>({
    url: `/activities?year=${reqyear}&month=${reqmonth}&keywordCategory=${reqkeyword}`,
  })
}
