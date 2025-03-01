'use client'

import { generateContext } from '@/react-utils'
import { StrictPropsWithChildren } from '@/types'
import { useQuerykeyStore } from '@/store/querykeyStore'
import { HomeResponse, QuickStartResponse } from '../../api/type'
import { useGetHomeData, useGetQuickList } from '../../api/queries'

export const [HomeProvider, useHomeContext] = generateContext<HomeResponse>({
  name: 'homeData',
})

export const [QuickStartProvider, useQuickStartContext] =
  generateContext<QuickStartResponse>({
    name: 'quickStartList',
  })

export function HomeFetcher({ children }: StrictPropsWithChildren) {
  const { data } = useGetHomeData()

  return <HomeProvider {...data}>{children}</HomeProvider>
}

export function QuickStartFetcher({ children }: StrictPropsWithChildren) {
  const { keyForFresh } = useQuerykeyStore()
  const { data } = useGetQuickList(keyForFresh)

  return <QuickStartProvider {...data}>{children}</QuickStartProvider>
}
