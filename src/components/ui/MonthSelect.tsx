import useUserInfo from '@/store/useUserInfo'
import { addMonths, differenceInMonths, format } from 'date-fns'
import { Check } from '../Icons'

interface MonthSelectProps {
  currentDate: Date
  setCurrentDate: (date: Date) => void
}

export default function MonthSelect({
  currentDate,
  setCurrentDate,
}: MonthSelectProps) {
  const today = new Date()
  const { registrationDate } = useUserInfo().userInfo

  const months = Array.from(
    { length: differenceInMonths(today, registrationDate) + 2 },
    (_, i) => addMonths(today, -i + 1),
  )

  const handleMonthSelect = (date: Date) => {
    setCurrentDate(date)
  }

  return (
    <div className="flex flex-col px-24">
      {months.map((month) => (
        <button
          type="button"
          key={month.toISOString()}
          onClick={() => handleMonthSelect(month)}
          className="flex justify-between items-center h-48 pb-12 rounded-lg"
        >
          {format(month, 'yyyy년 MM월')}
          {format(month, 'yyyy-MM') === format(currentDate, 'yyyy-MM') && (
            <Check color="#FF4F38" />
          )}
        </button>
      ))}
    </div>
  )
}
