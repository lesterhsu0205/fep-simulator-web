import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  console.log('🛡️ ProtectedRoute 檢查:', {
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    currentPath: location.pathname,
  })

  if (isLoading) {
    console.log('⏳ 正在載入認證狀態...')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log('❌ 用戶未認證，重定向到登入頁')
    // 保存用戶嘗試訪問的路徑，登入成功後可以重定向回來
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  console.log('✅ 用戶已認證，渲染子組件')
  return <>{children}</>
}
