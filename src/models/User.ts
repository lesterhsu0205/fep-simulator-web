import { type PaginationInfo } from '@/models/PaginationInfo'

// 財金情境相關接口
export interface User {
  id: number
  username: string
  email: string
  accountType: string
  isActive: boolean
  roleCode: string
}

// 編輯表單需要的欄位
export interface UserCreateFormData {
  email: string
  accountType: string
  isActive: boolean
  roleCode: string
}

// 表單資料類型（使用 API 的 key 值）
export interface UserEditFormData {
  email: string
  username: string
}

export interface UserListResponse {
  query: UserQuery
  pagination: PaginationInfo
  users: User[]
}

// 查詢參數（分頁參數由 DataTable 統一管理）
export interface UserQuery {
  username?: string
  accountType?: string
}

// API 維護請求
export interface UserMaintenanceRequest {
  action: 'A' | 'U' | 'D'
  id?: number
  username?: string
  email?: string
  accountType?: string
  isActive?: boolean
  roleCode?: string
}
