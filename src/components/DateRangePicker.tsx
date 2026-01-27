import { Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type DateRange, DayPicker } from 'react-day-picker'
import { DATE_PICKER_STYLES } from '@/constants/datePickerStyles'
import 'react-day-picker/style.css'

interface DateRangePickerProps {
  value?: {
    startDatetime?: string
    endDatetime?: string
  }
  onChange?: (value: { startDatetime: string | null; endDatetime: string | null }) => void
  placeholder?: string
  className?: string
}

interface TimeInput {
  hours: string
  minutes: string
  seconds: string
}

// 格式化日期為 yyyyMMddHHmmss
const formatDateTime = (date: Date, time: TimeInput): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = time.hours.padStart(2, '0')
  const minutes = time.minutes.padStart(2, '0')
  const seconds = time.seconds.padStart(2, '0')

  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

// 解析 yyyyMMddHHmmss 格式為 Date 和 Time
const parseDateTime = (dateTimeStr: string): { date: Date; time: TimeInput } => {
  if (!dateTimeStr || dateTimeStr.length !== 14) {
    return {
      date: new Date(),
      time: { hours: '00', minutes: '00', seconds: '00' }
    }
  }

  const year = parseInt(dateTimeStr.slice(0, 4), 10)
  const month = parseInt(dateTimeStr.slice(4, 6), 10) - 1
  const day = parseInt(dateTimeStr.slice(6, 8), 10)
  const hours = dateTimeStr.slice(8, 10)
  const minutes = dateTimeStr.slice(10, 12)
  const seconds = dateTimeStr.slice(12, 14)

  return {
    date: new Date(year, month, day),
    time: { hours, minutes, seconds }
  }
}

export default function DateRangePicker({
  value,
  onChange,
  placeholder = '選擇日期範圍',
  className = ''
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const [startTime, setStartTime] = useState<TimeInput>({ hours: '00', minutes: '00', seconds: '00' })
  const [endTime, setEndTime] = useState<TimeInput>({ hours: '23', minutes: '59', seconds: '59' })

  // 初始化數值
  useEffect(() => {
    if (value?.startDatetime && value?.endDatetime) {
      const startDateTime = parseDateTime(value.startDatetime)
      const endDateTime = parseDateTime(value.endDatetime)

      setSelectedRange({
        from: startDateTime.date,
        to: endDateTime.date
      })
      setStartTime(startDateTime.time)
      setEndTime(endDateTime.time)
    } else {
      // 當 value 為空時，清空內部狀態
      setSelectedRange(undefined)
      setStartTime({ hours: '00', minutes: '00', seconds: '00' })
      setEndTime({ hours: '23', minutes: '59', seconds: '59' })
    }
  }, [value])

  // 處理日期範圍變化（不同步）
  const handleRangeChange = (range: DateRange | undefined) => {
    setSelectedRange(range)
  }

  // 處理時間變化（不同步）
  const handleTimeChange = (isStart: boolean, field: keyof TimeInput, value: string) => {
    if (isStart) {
      setStartTime({ ...startTime, [field]: value })
    } else {
      setEndTime({ ...endTime, [field]: value })
    }
  }

  // 處理時間輸入框失焦時的驗證（不同步）
  const handleTimeBlur = (isStart: boolean, field: keyof TimeInput, value: string) => {
    const numValue = parseInt(value, 10) || 0
    let validValue: string

    if (field === 'hours') {
      validValue = Math.max(0, Math.min(23, numValue)).toString().padStart(2, '0')
    } else {
      validValue = Math.max(0, Math.min(59, numValue)).toString().padStart(2, '0')
    }

    if (isStart) {
      setStartTime({ ...startTime, [field]: validValue })
    } else {
      setEndTime({ ...endTime, [field]: validValue })
    }
  }

  // 確定按鈕處理（同步數據）
  const handleConfirm = () => {
    if (selectedRange?.from && selectedRange?.to && onChange) {
      const startDateTime = formatDateTime(selectedRange.from, startTime)
      const endDateTime = formatDateTime(selectedRange.to, endTime)
      onChange({
        startDatetime: startDateTime,
        endDatetime: endDateTime
      })
    }
    setIsOpen(false)
  }

  // 清除按鈕處理
  const handleClear = () => {
    setSelectedRange(undefined)
    setStartTime({ hours: '00', minutes: '00', seconds: '00' })
    setEndTime({ hours: '23', minutes: '59', seconds: '59' })
    onChange?.({ startDatetime: null, endDatetime: null })
  }

  // 格式化顯示文字
  const getDisplayText = (): string => {
    if (!selectedRange?.from || !selectedRange?.to) {
      return placeholder
    }

    const formatDisplayDate = (date: Date, time: TimeInput) => {
      return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${time.hours}:${time.minutes}:${time.seconds}`
    }

    return `${formatDisplayDate(selectedRange.from, startTime)} ~ ${formatDisplayDate(selectedRange.to, endTime)}`
  }

  return (
    <div className={`relative ${className}`}>
      {/* 輸入框觸發器 */}
      <button
        type="button"
        className="input input-bordered w-100 flex items-center cursor-pointer hover:border-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={16} className="mr-2 text-gray-400" />
        <span
          className={`font-normal ${selectedRange?.from && selectedRange?.to ? 'text-base-content' : 'text-base-content/50'}`}
        >
          {getDisplayText()}
        </span>
      </button>

      {/* 下拉選擇器 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-100 min-w-fit max-w-2xl">
          {/* 日期選擇器 */}
          <div className="p-6 pb-4">
            <DayPicker
              animate
              captionLayout="dropdown-years"
              mode="range"
              navLayout="around"
              required
              showOutsideDays
              timeZone="Asia/Taipei"
              weekStartsOn={0}
              selected={selectedRange}
              onSelect={handleRangeChange}
              className="rdp text-sm"
              styles={DATE_PICKER_STYLES}
            />
          </div>

          {/* 時間選擇器 */}
          {selectedRange?.from && selectedRange?.to && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="space-y-4">
                {/* 開始時間 */}
                <div className="flex items-center justify-between">
                  <span className="text-form-label">開始時間</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={startTime.hours}
                        onChange={e => handleTimeChange(true, 'hours', e.target.value)}
                        onBlur={e => handleTimeBlur(true, 'hours', e.target.value)}
                        className="input input-bordered input-sm w-12 h-8 text-center font-mono text-sm"
                        placeholder="00"
                      />
                      <span className="text-form-hint">時</span>
                    </div>
                    <span className="text-sm font-bold text-gray-400 pb-4">:</span>
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={startTime.minutes}
                        onChange={e => handleTimeChange(true, 'minutes', e.target.value)}
                        onBlur={e => handleTimeBlur(true, 'minutes', e.target.value)}
                        className="input input-bordered input-sm w-12 h-8 text-center font-mono text-sm"
                        placeholder="00"
                      />
                      <span className="text-form-hint">分</span>
                    </div>
                    <span className="text-sm font-bold text-gray-400 pb-4">:</span>
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={startTime.seconds}
                        onChange={e => handleTimeChange(true, 'seconds', e.target.value)}
                        onBlur={e => handleTimeBlur(true, 'seconds', e.target.value)}
                        className="input input-bordered input-sm w-12 h-8 text-center font-mono text-sm"
                        placeholder="00"
                      />
                      <span className="text-form-hint">秒</span>
                    </div>
                  </div>
                </div>

                {/* 結束時間 */}
                <div className="flex items-center justify-between">
                  <span className="text-form-label">結束時間</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={endTime.hours}
                        onChange={e => handleTimeChange(false, 'hours', e.target.value)}
                        onBlur={e => handleTimeBlur(false, 'hours', e.target.value)}
                        className="input input-bordered input-sm w-12 h-8 text-center font-mono text-sm"
                        placeholder="23"
                      />
                      <span className="text-form-hint">時</span>
                    </div>
                    <span className="text-sm font-bold text-gray-400 pb-4">:</span>
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={endTime.minutes}
                        onChange={e => handleTimeChange(false, 'minutes', e.target.value)}
                        onBlur={e => handleTimeBlur(false, 'minutes', e.target.value)}
                        className="input input-bordered input-sm w-12 h-8 text-center font-mono text-sm"
                        placeholder="59"
                      />
                      <span className="text-form-hint">分</span>
                    </div>
                    <span className="text-sm font-bold text-gray-400 pb-4">:</span>
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={endTime.seconds}
                        onChange={e => handleTimeChange(false, 'seconds', e.target.value)}
                        onBlur={e => handleTimeBlur(false, 'seconds', e.target.value)}
                        className="input input-bordered input-sm w-12 h-8 text-center font-mono text-sm"
                        placeholder="59"
                      />
                      <span className="text-form-hint">秒</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="flex justify-end px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
            <div className="flex space-x-3">
              <button type="button" className="btn btn-ghost btn-sm px-4" onClick={handleClear}>
                清除
              </button>
              <button type="button" className="btn btn-primary btn-sm px-6" onClick={handleConfirm}>
                確定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 背景遮罩 - 點擊關閉 */}
      {isOpen && (
        // biome-ignore lint/a11y/noStaticElementInteractions: 背景遮罩僅供點擊關閉
        // biome-ignore lint/a11y/useKeyWithClickEvents: 背景遮罩僅供點擊關閉
        <div className="fixed inset-0 z-90" onClick={() => setIsOpen(false)} />
      )}
    </div>
  )
}
