import type { PaginationInfo } from '@/models/PaginationInfo'

// 財金情境相關接口
export interface FiscSituation {
  id: number
  account: string
  situationDesc: string
  memo: string | null
  isRmt: boolean | null
  rmtResultCode: string | null
  isAtm: boolean | null
  atmResultCode: string | null
  atmVerify: boolean | null
  atmVerifyRCode: string | null
  atmVerifyRDetail: string | null
  isFxml: boolean | null
  fxmlResultCode: string | null
  creator: string
  createdAt: string
  updater: string
  updatedAt: string
}

// 編輯表單需要的欄位
export interface FinanceCreateFormData {
  account: string
  situationDesc: string
  memo: string | null
  isRmt: boolean | null
  rmtResultCode: string | null
  isAtm: boolean | null
  atmResultCode: string | null
  atmVerify: boolean | null
  atmVerifyRCode: string | null
  atmVerifyRDetail: string | null
  atmVerifyRDetail1: string | null
  atmVerifyRDetail2: string | null
  atmVerifyRDetail3: string | null
  isFxml: boolean | null
  fxmlResultCode: string | null
  creator: string
  // creatorUnit: string

  rmtResultCodeSelection: string | null
  atmResultCodeSelection: string | null
  atmVerifyRCodeSelection: string | null
  fxmlResultCodeSelection: string | null
}

// 表單資料類型（使用 API 的 key 值）
export interface FinanceEditFormData {
  id: number
  account: string
  situationDesc: string
  memo: string | null
  isRmt: boolean | null
  rmtResultCode: string | null
  isAtm: boolean | null
  atmResultCode: string | null
  atmVerify: boolean | null
  atmVerifyRCode: string | null
  atmVerifyRDetail: string | null
  isFxml: boolean | null
  fxmlResultCode: string | null
}

export interface FiscSituationListResponse {
  query: FiscSituationQuery
  pagination: PaginationInfo
  fiscSituations: FiscSituation[]
}

// 查詢參數（分頁參數由 DataTable 統一管理）
export interface FiscSituationQuery {
  account?: string
  creator?: string
}

// API 維護請求
export interface FiscSituationMaintenanceRequest {
  action: 'A' | 'U' | 'D'
  id?: number
  account?: string
  situationDesc?: string
  memo?: string | null
  isRmt?: boolean | null
  rmtResultCode?: string | null
  isAtm?: boolean | null
  atmResultCode?: string | null
  atmVerify?: boolean | null
  atmVerifyRCode?: string | null
  atmVerifyRDetail?: string | null
  isFxml?: boolean | null
  fxmlResultCode?: string | null
  creator?: string
}
