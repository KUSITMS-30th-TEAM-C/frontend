'use client'

import { Button, HeaderWithBack, Div, Plus } from '@/components'
import { useRouter } from 'next/navigation'
import FastCard from './components/FastCard'
import { useQuickStartContext } from './components/Fetcher'

export default function FastPage() {
  const router = useRouter()
  const { quickStartResponses } = useQuickStartContext()
  // console.log(quickStartResponses)

  return (
    <HeaderWithBack title="빠른 시작" onBack={() => router.back()}>
      <Div className="flex flex-col gap-15 pb-50">
        {quickStartResponses.map(
          ({ id, meridiem, type, name, hour, minute, spareTime }) => (
            <FastCard
              key={id}
              id={id}
              meridiem={meridiem}
              type={type}
              name={name}
              hour={hour}
              minute={minute}
              spareTime={spareTime}
            />
          ),
        )}
      </Div>
      <Button
        className="sticky  bottom-20 mx-auto w-[80%] max-w-280 whitespace-nowrap"
        onClick={() => router.push('/home/fast/add')}
        rightIcon={<Plus />}
      >
        빠른 시작 추가하기
      </Button>
    </HeaderWithBack>
  )
}
