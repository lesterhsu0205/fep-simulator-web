import { type AxiosResponse } from 'axios'
import ApiClient, { type ApiResponse } from '@/services/ApiService'
import { type User, type UserListResponse, type UserQuery, type UserMaintenanceRequest } from '@/models/User'
import userListData from '@/assets/UserList.json'

// API 服務類
export class UserService {
  // 查詢使用者列表
  static async getUserList(params: UserQuery & { page?: number, pageSize?: number } = {}): Promise<UserListResponse | null> {
    try {
      // 暫時使用本地 JSON 檔案，之後需要改回 API 呼叫
      // const response: AxiosResponse<ApiResponse<UserListResponse>> = await ApiClient.get('/system/user/list', {
      //   params,
      // })
      // return response.data.messageContent

      const mockData = userListData

      // 簡單的篩選邏輯
      let filteredUsers = [...mockData]

      if (params.username) {
        filteredUsers = filteredUsers.filter(user =>
          user.username.toLowerCase().includes(params.username!.toLowerCase()),
        )
      }

      if (params.accountType) {
        filteredUsers = filteredUsers.filter(user =>
          user.accountType === params.accountType,
        )
      }

      // 分頁處理
      const currentPage = params.page || 1
      const pageSize = params.pageSize || 10
      const totalItems = filteredUsers.length
      const totalPages = Math.ceil(totalItems / pageSize)

      // 計算分頁範圍
      const startIndex = (currentPage - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

      return {
        query: params,
        pagination: {
          currentPage,
          itemsPerPage: pageSize,
          totalItems,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
        users: paginatedUsers,
      }
    }
    catch (error) {
      console.error('Mock Data Error:', error)
      throw error
    }
  }

  // 依ID查詢單筆財金情境
  static async getUserById(id: number): Promise<User | null> {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User }>> = await ApiClient.get(`/system/users/${id}`)

      return response.data.messageContent?.user || null
    }
    catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // 財金情境維護（新增/修改/刪除）
  static async maintainUser(data: UserMaintenanceRequest): Promise<User | null> {
    try {
      const response: AxiosResponse<ApiResponse<{ user?: User }>> = await ApiClient.post('/system/user/maint', data)

      return response.data.messageContent?.user || null
    }
    catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}
