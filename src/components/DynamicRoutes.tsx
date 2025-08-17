import { useAuth } from '@/contexts/AuthContext'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { MenuItem } from '@/services/authService'

// 導入現有的組件
import MaintainTestAccount from '@/pages/MaintainTestAccount'
import CreateTestAccount from '@/pages/CreateTestAccount'

export function DynamicRoutes() {
  const { user } = useAuth()

  console.log('🔍 DynamicRoutes 組件已渲染')
  console.log('👤 用戶資訊:', user)

  // 收集所有有 path 的選單項目，但只生成已實現的路由
  const collectImplementedRoutes = (menus: MenuItem[]): Array<{ path: string, name: string, code: string }> => {
    const routes: Array<{ path: string, name: string, code: string }> = []
    const implementedPaths = ['/TEST_ACCT_MAINT', '/TEST_ACCT_CREATE']

    const traverse = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.path && implementedPaths.includes(item.path)) {
          routes.push({
            path: item.path,
            name: item.name,
            code: item.code,
          })
        }
        if (item.children.length > 0) {
          traverse(item.children)
        }
      })
    }

    traverse(menus)
    return routes
  }

  // 根據路徑返回對應的組件（只包含已實現的）
  const getComponentForPath = (path: string) => {
    switch (path) {
      case '/TEST_ACCT_MAINT':
        return <MaintainTestAccount />
      case '/TEST_ACCT_CREATE':
        return <CreateTestAccount />
      default:
        return null
    }
  }

  if (!user || !user.menus) {
    console.log('❌ 用戶未登入或沒有選單資訊，重定向到登入頁')
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  const routes = collectImplementedRoutes(user.menus)
  console.log('📋 收集到的已實現路由:', routes)

  return (
    <Routes>
      {/* 只為已實現的路由生成路由 */}
      {routes.map(route => (
        <Route
          key={route.path}
          path={route.path}
          element={getComponentForPath(route.path)}
        />
      ))}

      {/* 404 頁面 */}
      <Route
        path="*"
        element={(
          <div className="p-6 text-center">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title">頁面不存在</h2>
                <p>您訪問的頁面不存在或您沒有權限訪問。</p>
              </div>
            </div>
          </div>
        )}
      />
    </Routes>
  )
}
