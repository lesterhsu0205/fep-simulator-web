import type { PaginationInfo } from '@/models/PaginationInfo'

// 財金情境相關接口
export interface TestAccount {
  id: number
  account: string
  status: string
  type: string
  icNo: string
  icMemo: string
  icC6Key: string
  icCkey: string
  creator: string
  createdAt: string
  updater: string
  updatedAt: string
}

// 編輯表單欄位
export interface TestAccountCreateFormData {
  account: string
  status: string
  type: string
  icNo: string
  icMemo: string
  icC6Key: string
  icCkey: string
  creator: string
}

export interface TestAccountListResponse {
  query: TestAccountQuery
  pagination: PaginationInfo
  testAccounts: TestAccount[]
}

// 查詢參數（分頁參數由 DataTable 統一管理）
export interface TestAccountQuery {
  account?: string
  creator?: string
}
