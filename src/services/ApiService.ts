import axios from 'axios'
import { ApiError } from '@/error/ApiError'

// 創建 axios 實例
const ApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_FES,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    return searchParams.toString()
  },
})

// 請求攔截器 - 自動添加 Authorization header
ApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 統一處理認證相關錯誤
const handleAuthError = (messageCode: string) => {
  if (messageCode === '9997' || messageCode === '9996' || messageCode === '0402') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new CustomEvent('auth:logout'))
  }
}

// 統一創建 API 錯誤
const createApiError = (data: { messageCode: string, messageDesc?: string, messageContent?: unknown }) => {
  handleAuthError(data.messageCode)
  return new ApiError(
    data.messageDesc || '交易失敗',
    data.messageCode,
    data.messageContent,
  )
}

// 回應攔截器 - 處理統一錯誤
ApiClient.interceptors.response.use(
  (response) => {
    // 檢查 API 回應的錯誤代碼
    const data = response.data

    if (data?.messageCode && data.messageCode !== '00000') {
      // 根據 API 規格，非 00000 都視為錯誤
      const error = createApiError(data)
      return Promise.reject(error)
    }
    return response
  },
  (error) => {
    // 處理 HTTP 401 錯誤（沒有業務錯誤訊息的情況）
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }

    // 處理後端客制的錯誤回應（如 400），檢查是否包含業務錯誤訊息
    if (error.response?.data?.messageCode && error.response?.data?.messageDesc) {
      const apiError = createApiError(error.response.data)
      return Promise.reject(apiError)
    }

    return Promise.reject(error)
  },
)

// API 回應格式
export interface ApiResponse<T = unknown | null> {
  messageCode: string
  messageDesc: string
  messageContent: T | null
}

export default ApiClient
