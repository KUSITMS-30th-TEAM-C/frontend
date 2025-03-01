import { AsyncBoundaryWithQuery } from '@/react-utils'
import { StrictPropsWithChildren } from '@/types'
import type { Metadata } from 'next'
import Loading from '@/components/ui/Loading'
import { QuickStartFetcher } from './components/Fetcher'

export const metadata: Metadata = {
  title: '나의 시간조각을 모아, 조각조각',
  description: '자투리 시간 앱',
}

export default function QuickStartLayout({
  children,
}: StrictPropsWithChildren) {
  return (
    <AsyncBoundaryWithQuery
      pendingFallback={<Loading />}
      errorFallback={<>error..</>}
    >
      <QuickStartFetcher>{children}</QuickStartFetcher>
    </AsyncBoundaryWithQuery>
  )
}
