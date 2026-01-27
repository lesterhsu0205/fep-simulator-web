import type { AxiosResponse } from 'axios'
import type { User, UserListResponse, UserMaintenanceRequest, UserQuery } from '@/models/User'
import ApiClient, { type ApiResponse } from '@/services/ApiService'

// API 服務類
export class UserService {
  // 查詢使用者列表
  static async getSystemUserList(
    params: UserQuery & { page?: number; pageSize?: number } = {}
  ): Promise<UserListResponse | null> {
    try {
      const response: AxiosResponse<ApiResponse<UserListResponse>> = await ApiClient.get('/users/list', {
        params
      })
      return response.data.messageContent
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // 依ID查詢單筆財金情境
  static async getSystemUserById(id: number): Promise<User | null> {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User }>> = await ApiClient.get(`/system/users/${id}`)

      return response.data.messageContent?.user || null
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // 財金情境維護（新增/修改/刪除）
  static async maintainSystemUser(data: UserMaintenanceRequest): Promise<User | null> {
    try {
      const response: AxiosResponse<ApiResponse<{ user?: User }>> = await ApiClient.post('/users/maint', data)

      return response.data.messageContent?.user || null
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}
