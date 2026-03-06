import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTE_PATHS } from '@/routes'
import { getFirstAccessiblePath } from '@/utils/navigationHelper'

/**
 * 根路徑重定向組件
 * 將根路徑 (/) 重定向到使用者第一個可訪問的頁面
 */
export function RootRedirect() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const firstAccessiblePath = getFirstAccessiblePath(user!.menus)

  if (firstAccessiblePath) {
    return <Navigate replace to={firstAccessiblePath} />
  }

  // 如果沒有任何可訪問的頁面，顯示錯誤訊息
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-white shadow-xl max-w-md">
        <div className="card-body text-center">
          <h2 className="card-title justify-center text-error">無可訪問頁面</h2>
          <p className="text-base-content/70">您沒有任何頁面的訪問權限，請聯繫管理員。</p>
          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate(ROUTE_PATHS.LOGIN, { replace: true, state: { from: location } })}
              type="button"
            >
              重新登入
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
