import { AsyncBoundaryWithQuery } from '@/react-utils'
import { StrictPropsWithChildren } from '@/types'
import type { Metadata } from 'next'
import Loading from '@/components/ui/Loading'
import { MyPageFetcher } from './components/fetcher'

export const metadata: Metadata = {
  title: '나의 시간조각을 모아, 조각조각',
  description: '자투리 시간 앱',
}

export default function MyPageLayout({ children }: StrictPropsWithChildren) {
  return (
    <AsyncBoundaryWithQuery
      pendingFallback={<Loading />}
      errorFallback={<>error..</>}
    >
      <MyPageFetcher>{children}</MyPageFetcher>
    </AsyncBoundaryWithQuery>
  )
}
