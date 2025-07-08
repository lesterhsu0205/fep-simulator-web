import { useAuth } from '@/contexts/AuthContext'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { MenuItem } from '@/services/authService'

// 導入現有的組件
import DataTable from '@/components/DataTable'
import CreateTestAccount from '@/components/CreateTestAccount'

export function DynamicRoutes() {
  const { user } = useAuth()

  console.log('🔍 DynamicRoutes 組件已渲染')
  console.log('👤 用戶資訊:', user)

  // 收集所有有 path 的選單項目
  const collectRoutes = (menus: MenuItem[]): string[] => {
    const routes: string[] = []

    const traverse = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.path) {
          routes.push(item.path)
        }
        if (item.children.length > 0) {
          traverse(item.children)
        }
      })
    }

    traverse(menus)
    return routes
  }

  // 根據路徑返回對應的組件
  const getComponentForPath = (path: string) => {
    switch (path) {
      case '/TEST_ACCT_MAINT':
        return <DataTable />
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

  const routes = collectRoutes(user.menus)
  console.log('📋 收集到的路由:', routes)

  return (
    <Routes>
      {/* 動態生成的路由 */}
      {routes.map((path) => {
        const component = getComponentForPath(path)
        return component
          ? (
              <Route
                key={path}
                path={path}
                element={component}
              />
            )
          : null
      })}

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
