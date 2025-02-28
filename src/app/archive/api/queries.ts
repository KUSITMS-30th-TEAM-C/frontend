import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getCalendarData, getKeywordsData } from '.'
import { getMonthData } from './api'

export const useGetCalendarData = (year: number, month: number) =>
  useSuspenseQuery({
    queryKey: ['calendar', year, month],
    queryFn: () => getCalendarData(year, month),
    select: (data) => data.data,
  })

export const useGetKeywordsData = (year: number, month: number) =>
  useSuspenseQuery({
    queryKey: ['Keywords', year, month],
    queryFn: () => getKeywordsData(year, month),
    select: (data) => data.data,
  })

export const useGetKeywordMonthData = (
  year: number,
  month: number,
  keyword: string,
) => {
  return useQuery({
    queryKey: ['keywords-month', year, month, keyword],
    queryFn: () => getMonthData(year, month, keyword),
    enabled: !!year && !!month && !!keyword,
  })
}
