// API 登入回應的型別定義
export interface LoginResponse {
  username: string
  token: string
  role: string
  menus: MenuItem[]
}

// API 完整回應結構
export interface ApiLoginResponse {
  messageCode: string
  messageDesc: string
  messageContent: LoginResponse
}

// 使用者註冊請求的型別定義
export interface SignupRequest {
  username: string
  password: string
  email?: string
  accountType: string
  roleCode?: string
}

// API 註冊回應結構
export interface ApiSignupResponse {
  messageCode: string
  messageDesc: string
  messageContent: null
}

export interface MenuItem {
  id: number
  code: string
  name: string
  url: string
  path: string
  children: MenuItem[]
}

// 使用者登入 API
export const loginApi = async (account: string, password: string): Promise<LoginResponse> => {
  console.log('🔐 開始登入流程...', { username: account, password: '***' })

  try {
    // 呼叫實際的登入 API
    const response = await fetch('/fes/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: account,
        password: password,
      }),
    })

    console.log('📡 登入 API 呼叫回應狀態:', response.status)

    if (!response.ok) {
      throw new Error(`登入請求失敗: ${response.status}`)
    }

    const apiResponse: ApiLoginResponse = await response.json()
    console.log('📊 登入 API 完整回應:', apiResponse)

    // 檢查訊息代碼
    if (apiResponse.messageCode !== '00000') {
      throw new Error(apiResponse.messageDesc || '登入失敗')
    }

    const loginData: LoginResponse = apiResponse.messageContent
    console.log('📊 獲取到的使用者資料:', loginData)

    return loginData
  }
  catch (error) {
    console.error('🚨 Login API error:', error)
    throw error
  }
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
    // 模擬 API 呼叫 - 在實際環境中這會是真實的後端 API 呼叫
    const response = await fetch('/fes/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    })

    console.log('📡 註冊 API 呼叫回應狀態:', response.status)

    if (!response.ok) {
      throw new Error(`註冊請求失敗: ${response.status}`)
    }

    const apiResponse: ApiSignupResponse = await response.json()
    console.log('📊 註冊 API 完整回應:', apiResponse)

    // 檢查訊息代碼
    if (apiResponse.messageCode !== '00000') {
      throw new Error(apiResponse.messageDesc || '註冊失敗')
    }

    console.log('✅ 註冊成功')
  }
  catch (error) {
    console.error('🚨 Signup API error:', error)
    throw error
  }
}
