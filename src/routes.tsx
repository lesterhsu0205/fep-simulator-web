import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import App from '@/App.tsx'
import ProtectedRoute from '@/components/ProtectedRoute.tsx'
import Login from '@/components/Login.tsx'
import { DynamicRoutes } from '@/components/DynamicRoutes'

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '*',
        element: <DynamicRoutes />,
      },
    ],
  },
]

// 創建路由器
const router = createBrowserRouter(routes)

export default router
