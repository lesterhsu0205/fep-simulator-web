import { useAuth } from '@/contexts/AuthContext'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { MenuItem } from '@/services/authService'

// 導入現有的組件
import DataTable from '@/components/DataTable'
import CreateTestAccount from '@/components/CreateTestAccount'

// 創建一個簡單的佔位符組件
function PlaceholderPage({ title, code }: { title: string, code: string }) {
  return (
    <div className="p-6">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="text-base-content/70">
            功能代碼:
            {code}
          </p>
          <p>此功能頁面尚未實作，這是一個佔位符頁面。</p>
        </div>
      </div>
    </div>
  )
}

export function DynamicRoutes() {
  const { user } = useAuth()

  // 收集所有有 path 的選單項目
  const collectRoutes = (menus: MenuItem[]): Array<{ path: string, name: string, code: string }> => {
    const routes: Array<{ path: string, name: string, code: string }> = []

    const traverse = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.path) {
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

  // 根據路徑返回對應的組件
  const getComponentForPath = (path: string, name: string, code: string) => {
    switch (path) {
      case '/maintain':
        return <DataTable />
      case '/create':
        return <CreateTestAccount />
      default:
        return <PlaceholderPage title={name} code={code} />
    }
  }

  if (!user || !user.menus) {
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  const routes = collectRoutes(user.menus)

  return (
    <Routes>
      {/* 預設重定向到第一個可用路由 */}
      <Route
        index
        element={
          routes.length > 0
            ? <Navigate to={routes[0].path} replace />
            : <div className="p-6 text-center">沒有可用的功能</div>
        }
      />

      {/* 動態生成的路由 */}
      {routes.map(route => (
        <Route
          key={route.path}
          path={route.path}
          element={getComponentForPath(route.path, route.name, route.code)}
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
