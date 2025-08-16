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

export interface MenuItem {
  id: number
  code: string
  name: string
  url: string | null
  path?: string
  children: MenuItem[]
}

// 模擬 API 呼叫
export const loginApi = async (account: string, password: string): Promise<LoginResponse> => {
  console.log('🔐 開始登入流程...', { account, password: '***' })

  try {
    let apiFileName = ''

    // 根據不同的帳號密碼選擇對應的 API 回應文件
    if (account === 'angus' && password === '3345678') {
      apiFileName = '/api_login.json'
      console.log('✅ angus 帳號認證成功，使用 api_login.json')
    }
    else if (account === 'lester' && password === '3345678') {
      apiFileName = '/api_login_2.json'
      console.log('✅ lester 帳號認證成功，使用 api_login_2.json')
    }
    else {
      console.log('❌ 認證失敗：帳號或密碼錯誤')
      throw new Error('Invalid credentials')
    }

    console.log('📡 開始獲取 mock 資料...', apiFileName)

    // 從 public 資料夾讀取對應的 mock 資料
    const response = await fetch(apiFileName)
    console.log('📡 API 呼叫回應狀態:', response.status)

    if (!response.ok) {
      throw new Error(`Failed to fetch login data: ${response.status}`)
    }

    const apiResponse: ApiLoginResponse = await response.json()
    console.log('📊 API 完整回應:', apiResponse)

    // 檢查訊息代碼
    if (apiResponse.messageCode !== '00000') {
      throw new Error(`Login failed: ${apiResponse.messageDesc}`)
    }

    const loginData: LoginResponse = apiResponse.messageContent
    console.log('📊 獲取到的選單資料:', loginData)

    // 將固定 token 存入 sessionStorage
    const fixedToken = "eyJhbGciOiJIUzUxMiJ9.eyJhY2NvdW50VHlwZSI6ImFkbWluIiwicm9sZUNvZGUiOiJCUzAxMSIsInVzZXJOYW1lIjoiQkswMDM2MSIsInVzZXJJZCI6MSwic3ViIjoiMSIsImlhdCI6MTc1Mzk0MTEwMCwiZXhwIjoxNzg1NDc3MTAwfQ.UIK67oFE1STeIVMyQwFloCGfLViqhjdBUSJlf-5CgHnkjr0WC3HOFP1MTD8MFZjc33Sd8UCXB7-kHfGyHremPQ"
    sessionStorage.setItem('authToken', fixedToken)
    console.log('🔑 已將固定 token 存入 sessionStorage')

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
