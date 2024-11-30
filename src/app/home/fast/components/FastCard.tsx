import { Badge, Pencil, Right } from '@/components'
import { useRouter } from 'next/navigation'
import { ActiveTypeMap } from '@/types'
import { cn } from '@/util'
import { QuickStart } from '../../api/type'
import { useQuickStart } from '../../hook/useQuickStart'

export default function FastCard(quickStart: QuickStart) {
  const { push } = useRouter()
  const { goToActivity } = useQuickStart()
  const { id, name, hour, minute, spareTime, meridiem, type } = quickStart

  const handleClickEdit = () => {
    const isOnline = type === 'ONLINE' || type === 'ONLINE_AND_OFFLINE'
    const isOffline = type === 'OFFLINE' || type === 'ONLINE_AND_OFFLINE'
    // console.log(
    //   id,
    //   name,
    //   hour,
    //   minute,
    //   spareTime,
    //   meridiem,
    //   isOnline,
    //   isOffline,
    // )
    const query = new URLSearchParams({
      id: id!.toString(),
      name,
      hour: hour.toString(),
      minute: minute.toString(),
      spareTime: spareTime.toString(),
      meridiem,
      isOnline: isOnline.toString(),
      isOffline: isOffline.toString(),
    }).toString()

    push(`/home/fast/add?${query}`)
  }
  return (
    <div className="px-16 py-12 flex justify-between w-full items-center border border-primary_foundation_10 rounded-8">
      <div className="flex flex-col items-start gap-12">
        <div className="flex gap-10 items-center text-16">
          <p>{name}</p>
          <Pencil onClick={handleClickEdit} />
        </div>
        <div className="flex gap-8">
          <Badge>
            {meridiem} {hour}시
            <span className={cn(minute === 0 && 'hidden')}> {minute}분</span>
          </Badge>
          <Badge>{spareTime}분</Badge>
          <Badge>{ActiveTypeMap[type]}</Badge>
        </div>
      </div>
      <Right
        color="#333333"
        width={19}
        height={19}
        onClick={() => goToActivity(quickStart)}
      />
    </div>
  )
}
