import { categoryLabels } from '@/app/archive/api/types'
import { Badge, Div } from '@/components'
import Image from 'next/image'

interface TimeCardProps {
  time: number
  category: string
  title: string
  imgSrc: string
}

export default function TimeCard({
  time,
  category,
  title,
  imgSrc,
}: TimeCardProps) {
  // console.log(category, 'category')
  return (
    <Div className="relative bg-white px-12">
      <div className="">
        <Image
          alt="icon"
          src={imgSrc}
          width="88"
          height="88"
          className="absolute left-0 top-0"
        />
        <div className="bg-black text-white flex items-center justify-center rounded-bl-12 rounded-tr-12 absolute top-0 right-0 w-59 h-38 whitespace-nowrap text-14">
          +{time}분
        </div>
      </div>
      <div className="flex flex-col mt-80 gap-5">
        <Badge className="!text-11">{categoryLabels[category]}의 조각</Badge>
        <p>{title}</p>
      </div>
    </Div>
  )
}
