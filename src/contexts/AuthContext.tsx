import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { loginApi, type LoginResponse, type MenuItem } from '@/services/AuthService'

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
  login: (account: string, password: string) => Promise<boolean>
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
      console.log('🚪 收到登出事件，清除用戶狀態')
      setUser(null)
    }

    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  const login = async (account: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // 使用 mock API 進行登入
      const loginData: LoginResponse = await loginApi(account, password)

      const user: User = {
        account,
        username: loginData.username,
        role: loginData.role,
        token: loginData.token,
        menus: loginData.menus,
      }

      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', loginData.token)

      console.log('🔑 已將 token 存入 localStorage')
      return true
    }
    catch (error) {
      console.error('Login failed:', error)
      return false
    }
    finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
