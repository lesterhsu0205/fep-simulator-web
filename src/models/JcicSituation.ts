import { type PaginationInfo } from '@/models/PaginationInfo'

// 財金情境相關接口
export interface JcicSituation {
  id: number
  txid: string
  inqueryKey1: string
  inqueryKey2: string | null
  returnCode: string
  forceToJcic: string
  jcicDataDate: string | null
  jcicData: string | null
  situationDesc: string
  memo: string | null
  creator: string
  createdAt: string
  updater: string
  updatedAt: string
}

// 編輯表單需要的欄位
export interface JcicCreateFormData {
  txid: string
  inqueryKey1: string
  inqueryKey2: string | null
  returnCode: string
  forceToJcic: string | boolean
  jcicDataDate: string | null
  jcicData: string | null
  situationDesc: string
  memo: string | null
  creator: string
}

export interface JcicSituationListResponse {
  query: JcicSituationQuery
  pagination: PaginationInfo
  jcicSituations: JcicSituation[]
}

// 查詢參數（分頁參數由 DataTable 統一管理）
export interface JcicSituationQuery {
  txid?: string
  inqueryKey1?: string
  inqueryKey2?: string
  creator?: string
}
