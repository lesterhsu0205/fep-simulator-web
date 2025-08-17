import { type PaginationInfo } from '@/model/PaginationInfo'

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

export interface FiscSituationListResponse {
  query: {
    account?: string
    creator?: string
  }
  pagination: PaginationInfo
  fiscSituations: FiscSituation[]
}

// 查詢參數（分頁參數由 DataTable 統一管理）
export interface FiscSituationQuery {
  account?: string
  creator?: string
}
