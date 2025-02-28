import { AsyncBoundaryWithQuery } from '@/react-utils'
import { StrictPropsWithChildren } from '@/types'
import type { Metadata } from 'next'
import { HomeFetcher } from './fast/components/Fetcher'
import Loading from '@/components/ui/Loading'

export const metadata: Metadata = {
  title: '나의 시간조각을 모아, 조각조각',
  description: '자투리 시간 앱',
}

export default function HomeLayout({ children }: StrictPropsWithChildren) {
  return (
    // TODO: fallback 구현
    <AsyncBoundaryWithQuery
      pendingFallback={<Loading />}
      errorFallback={<>error..</>}
    >
      <HomeFetcher>{children}</HomeFetcher>
    </AsyncBoundaryWithQuery>
  )
}
