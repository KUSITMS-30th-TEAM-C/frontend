'use client'

import { StrictPropsWithChildren } from '@/types'
import { cn } from '@/util'
import { useIsSuggestLoading } from '@/store/SuggestLodingCheckStore'
import { IconLeft } from '../Icons'

interface StartHeaderProps extends StrictPropsWithChildren {
  onBack: () => void
  title: string
  mainClassName?: string
}

export default function HeaderWithBack({
  children,
  onBack,
  title,
  mainClassName,
}: StartHeaderProps) {
  const { isSuggestLoading } = useIsSuggestLoading()

  return (
    <div
      className={`flex flex-col h-full overflow-hidden w-full ${isSuggestLoading && 'bg-[#F7F7FC]'}`}
    >
      <header className="relative font-semibold flex justify-center items-center py-4 min-h-52">
        <IconLeft
          className="absolute left-20 cursor-pointer"
          onClick={onBack}
        />
        <span>{title}</span>
      </header>
      <main
        className={cn(
          'h-[calc(100%-82px)] relative overflow-auto',
          mainClassName,
        )}
      >
        {children}
      </main>
    </div>
  )
}
