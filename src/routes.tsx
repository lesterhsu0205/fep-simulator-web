import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import App from '@/App.tsx'
import { DynamicRoutes } from '@/components/DynamicRoutes.tsx'
import ProtectedRoute from '@/components/ProtectedRoute.tsx'
import { RootRedirect } from '@/components/RootRedirect.tsx'
import Login from '@/pages/Login.tsx'
import SignUp from '@/pages/SignUp.tsx'

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  // 根路徑重定向
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootRedirect />
      </ProtectedRoute>
    )
  },
  // 所有其他路徑
  {
    path: '/*',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '*',
        element: <DynamicRoutes />
      }
    ]
  }
]

// 創建路由器
const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL.replace(/\/$/, '')
})

// 導出常用路徑常數
export const ROUTE_PATHS = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  ROOT: '/'
} as const

// 工具函數：取得完整路徑（包含 basename）
export const getFullPath = (path: string): string => {
  const basename = import.meta.env.BASE_URL?.replace(/\/$/, '') || ''
  return `${basename}${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
}

export default router
