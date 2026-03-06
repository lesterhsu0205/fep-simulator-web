import type { PaginationInfo } from '@/models/PaginationInfo'

// 財金情境相關接口
export interface TxLog {
  logDatetime: string
  systemType: string
  txnType: string
  txnId: string
  guid: string
  italGuidOmsgID: string
  uuid: string | null
  txnData: string
}

// 編輯表單需要的欄位
export interface TxLogCreateFormData {
  logDatetime: string
  systemType: string
  txnType: string
  txnId: string
  guid: string
  italGuidOmsgID: string
  uuid: string | null
  txnData: string
}

// 表單資料類型（使用 API 的 key 值）
export interface TxLogEditFormData {
  logDatetime: string
  systemType: string
  txnType: string
  txnId: string
  guid: string
  italGuidOmsgID: string
  uuid: string | null
  txnData: string
}

export interface TxLogListResponse {
  query: TxLogQuery
  pagination: PaginationInfo
  txlogs: TxLog[]
}

// 查詢參數（分頁參數由 DataTable 統一管理）
export interface TxLogQuery {
  startDatetime?: string
  endDatetime?: string
  systemType?: string
  txnId?: string
  guid?: string
  italGuidOmsgID?: string
  uuid?: string
}

// API 維護請求
export interface TxLogMaintenanceRequest {
  action: 'A' | 'U' | 'D'
  logDatetime?: string
  systemType?: string
  txnType?: string
  txnId?: string
  guid?: string
  italGuidOmsgID?: string
  uuid?: string | null
  txnData?: string
}
