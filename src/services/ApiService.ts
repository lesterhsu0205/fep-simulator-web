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

// 回應攔截器 - 處理統一錯誤
ApiClient.interceptors.response.use(
  (response) => {
    // 檢查 API 回應的錯誤代碼
    const data = response.data

    if (data?.messageCode && data.messageCode !== '00000') {
      if (data.messageCode === '9997' || data.messageCode === '9996' || data.messageCode === '0402') {
      // Token 過期或無效，清除認證資料並觸發登出事件
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.dispatchEvent(new CustomEvent('auth:logout'))
      }

      // 根據 API 規格，非 00000 都視為錯誤
      const error = new ApiError(
        data.messageDesc || '交易失敗',
        data.messageCode,
        data.messageContent,
      )
      return Promise.reject(error)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token 過期或無效，清除認證資料並觸發登出事件
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new CustomEvent('auth:logout'))
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
