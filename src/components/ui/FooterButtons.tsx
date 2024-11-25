import { cn } from '@/util'
import { useRouter } from 'next/navigation'
import { Button } from '../common'
import { Category, House } from '../Icons'

export default function FooterButtons({ className }: { className?: string }) {
  const { push } = useRouter()
  return (
    <div
      className={cn(
        'w-full flex justify-center gap-12 bg-white pt-15 pb-40',
        className,
      )}
    >
      <Button
        leftIcon={<House />}
        className="rounded-8 w-133 h-44 bg-primary_foundation_100"
        onClick={() => {
          push('/home')
        }}
      >
        홈
      </Button>
      <Button
        leftIcon={<Category />}
        className="bg-transparent text-textColor px-0 rounded-8 w-133 h-44"
        onClick={() => {
          push('/archive')
        }}
      >
        아카이빙
      </Button>
    </div>
  )
}
