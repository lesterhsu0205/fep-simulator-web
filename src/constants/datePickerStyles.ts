/**
 * DatePicker 組件樣式常數
 * 用於統一管理 react-day-picker 的樣式配置
 */

import type { CSSProperties } from 'react'

/**
 * DayPicker 組件的樣式配置
 * 包含字體大小、元素尺寸等設定
 */
export const DATE_PICKER_STYLES: Record<string, CSSProperties> = {
  /** 下一個月按鈕樣式 */
  button_next: { height: '24px', width: '24px' },
  /** 上一個月按鈕樣式 */
  button_previous: { height: '24px', width: '24px' },
  /** 日期單元格樣式 */
  day: { fontSize: '13px', height: '32px', width: '32px' },
  /** 下拉選單樣式 */
  dropdown: { fontSize: '13px' },
  /** 月份標題樣式 */
  month_caption: { fontSize: '14px' },
  /** 根元素樣式 */
  root: { fontSize: '14px' },
  /** 星期標題樣式 */
  weekday: { fontSize: '12px' }
} as const
