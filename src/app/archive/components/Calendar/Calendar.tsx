import { format, isSameDay, parseISO, getMonth } from 'date-fns'
import { cn } from '@/util'
import { Activity } from '../../api/types'

interface CalendarProps {
  currentDate: Date
  days: Date[]
  activities?: Activity[]
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
}

export default function Calendar({
  currentDate,
  days,
  activities = [],
  selectedDate,
  setSelectedDate,
}: CalendarProps) {
  const currentMonth = getMonth(currentDate)

  const today = new Date()

  const getActivityForDate = (date: Date): Activity[] => {
    return activities.filter((activity) =>
      isSameDay(parseISO(activity.activityCreatedAt), date),
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 w-full text-14 text-center text-gray-500">
        {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 gap-5 w-full mt-2 text-16"
        style={{
          gridAutoRows: '1fr',
        }}
      >
        {days.map((day) => {
          const dayMonth = getMonth(day)
          const activitiesForDay = getActivityForDate(day)
          const totalSavedTime = activitiesForDay.reduce(
            (sum, activity) => sum + activity.savedTime,
            0,
          )
          const hasActivity = activitiesForDay.length > 0

          return (
            <div key={day.toISOString()} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  setSelectedDate(
                    selectedDate && isSameDay(day, selectedDate)
                      ? undefined
                      : day,
                  )
                }
                disabled={!hasActivity}
                className={cn(
                  'flex w-full items-center justify-center aspect-square rounded-12 cursor-pointer bg-white',

                  dayMonth !== currentMonth && 'text-primary_foundation-20', // 현재 월 날짜
                  isSameDay(day, today) && 'border border-[#1a1a25]/50',
                  activitiesForDay.length > 0 && 'bg-red-100 text-red-600', // 활동이 있는 날짜
                  selectedDate &&
                    isSameDay(day, selectedDate) &&
                    'bg-accent_100 text-white', // 선택된 날짜
                )}
              >
                {format(day, 'd')}
              </button>
              {activitiesForDay.length > 0 && (
                <div className="text-10 text-red-500 mt-1">
                  +{totalSavedTime}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
