import axios, { type AxiosResponse } from 'axios'

// 創建 axios 實例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截器 - 自動添加 Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 回應攔截器 - 處理統一錯誤
apiClient.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 過期或無效，清除並重定向到登入頁
      sessionStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// API 回應格式
export interface ApiResponse<T = any> {
  messageCode: string
  messageDesc: string
  messageContent: T | null
}

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

export interface PaginationInfo {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface FiscSituationListResponse {
  query: {
    account?: string
    creator?: string
  }
  pagination: PaginationInfo
  fiscSituations: FiscSituation[]
}

// 查詢參數
export interface FiscSituationQuery {
  page?: number
  pageSize?: number
  account?: string
  creator?: string
}

// API 服務類
export class ApiService {
  // 查詢財金情境列表
  static async getFiscSituationList(params: FiscSituationQuery = {}): Promise<FiscSituationListResponse> {
    try {
      const response: AxiosResponse<ApiResponse<FiscSituationListResponse>> = await apiClient.get('/finance/scenario/list', {
        params,
      })

      if (response.data.messageCode === '00000' && response.data.messageContent) {
        return response.data.messageContent
      }
      else {
        throw new Error(response.data.messageDesc || '查詢失敗')
      }
    }
    catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // 依ID查詢單筆財金情境
  static async getFiscSituationById(id: number): Promise<FiscSituation> {
    try {
      const response: AxiosResponse<ApiResponse<{ fiscSituation: FiscSituation }>> = await apiClient.get(`/finance/scenario/${id}`)

      if (response.data.messageCode === '00000' && response.data.messageContent) {
        return response.data.messageContent.fiscSituation
      }
      else {
        throw new Error(response.data.messageDesc || '查詢失敗')
      }
    }
    catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // 財金情境維護（新增/修改/刪除）
  static async maintainFiscSituation(data: any): Promise<FiscSituation | null> {
    try {
      const response: AxiosResponse<ApiResponse<{ fiscSituation?: FiscSituation }>> = await apiClient.post('/finance/scenario/maint', data)

      if (response.data.messageCode === '00000') {
        return response.data.messageContent?.fiscSituation || null
      }
      else {
        throw new Error(response.data.messageDesc || '操作失敗')
      }
    }
    catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}

export default apiClient
