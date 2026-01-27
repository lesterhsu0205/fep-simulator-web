import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { type LoginResponse, loginApi, type MenuItem, type SignupRequest, signupApi } from '@/services/AuthService'

interface User {
  account: string
  username: string
  role: string
  token: string
  menus: MenuItem[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (account: string, password: string) => Promise<void>
  signup: (signupData: SignupRequest) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 檢查本地存儲的登入狀態
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // 監聽 API 服務觸發的登出事件
  useEffect(() => {
    const handleLogout = () => {
      console.log('🚪 收到登出事件，清除用戶狀態並導向登入頁')
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }

    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, []) // 加入空的依賴陣列，只在組件 mount/unmount 時執行

  const login = async (account: string, password: string): Promise<void> => {
    setIsLoading(true)
    try {
      // 使用 mock API 進行登入
      const loginData: LoginResponse = await loginApi(account, password)

      const user: User = {
        account,
        username: loginData.username,
        role: loginData.role,
        token: loginData.token,
        menus: loginData.menus
      }

      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', loginData.token)

      console.log('🔑 已將 token 存入 localStorage')
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (signupData: SignupRequest): Promise<void> => {
    setIsLoading(true)
    try {
      await signupApi(signupData)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    window.dispatchEvent(new CustomEvent('auth:logout'))
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
