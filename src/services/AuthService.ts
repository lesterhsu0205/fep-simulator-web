import { type AxiosResponse } from 'axios'
import ApiClient, { type ApiResponse } from '@/services/ApiService'

// API 登入回應的型別定義
export interface LoginResponse {
  username: string
  token: string
  role: string
  menus: MenuItem[]
}

export interface MenuItem {
  id: number
  code: string
  name: string
  url: string
  path: string
  children: MenuItem[]
}

// 使用者註冊請求的型別定義
export interface SignupRequest {
  username: string
  password: string
  email?: string
  accountType: string
  roleCode?: string
}

// 使用者登入 API
export const loginApi = async (account: string, password: string): Promise<LoginResponse> => {
  console.log('🔐 開始登入流程...', { username: account, password: '***' })

  const response: AxiosResponse<ApiResponse<LoginResponse>> = await ApiClient.post('/auth/login', {
    username: account,
    password: password,
  })

  console.log('📊 登入 API 完整回應:', response.data)

  // 檢查回傳內容是否存在
  if (!response.data.messageContent) {
    throw new Error('登入回應資料為空')
  }

  const loginData: LoginResponse = response.data.messageContent
  console.log('📊 獲取到的使用者資料:', loginData)

  return loginData
}

// 將選單項目轉換為路由資訊
export const convertMenusToRoutes = (menus: MenuItem[]): Array<{
  path: string
  name: string
  code: string
  url: string | null
}> => {
  const routes: Array<{
    path: string
    name: string
    code: string
    url: string | null
  }> = []

  const extractRoutes = (items: MenuItem[]) => {
    items.forEach((item) => {
      // 如果有 path，使用 path；否則如果有 url，嘗試轉換
      if (item.path) {
        routes.push({
          path: item.path,
          name: item.name,
          code: item.code,
          url: item.url,
        })
      }
      else if (item.url && !item.children.length) {
        // 如果沒有 path 但有 url 且沒有子項目，可以根據 url 生成路徑
        // 這裡可以根據您的需求調整路徑轉換邏輯
        const generatedPath = item.url.replace('/api', '').replace(/\//g, '-') || `/${item.code.toLowerCase()}`
        routes.push({
          path: generatedPath,
          name: item.name,
          code: item.code,
          url: item.url,
        })
      }

      // 遞歸處理子項目
      if (item.children.length > 0) {
        extractRoutes(item.children)
      }
    })
  }

  extractRoutes(menus)
  return routes
}

// 使用者註冊 API
export const signupApi = async (signupData: SignupRequest): Promise<void> => {
  console.log('📝 開始註冊流程...', { ...signupData, password: '***' })

  try {
    const response: AxiosResponse<ApiResponse<void>> = await ApiClient.post('/users/create', signupData)

    console.log('📊 註冊 API 完整回應:', response.data)
    console.log('✅ 註冊成功')
  }
  catch (error) {
    console.error('🚨 Signup API error:', error)
    throw error
  }
}
