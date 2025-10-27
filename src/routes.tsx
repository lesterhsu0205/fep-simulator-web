import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import App from '@/App.tsx'
import ProtectedRoute from '@/components/ProtectedRoute.tsx'
import Login from '@/pages/Login.tsx'
import SignUp from '@/pages/SignUp.tsx'
import { DynamicRoutes } from '@/components/DynamicRoutes.tsx'

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
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
const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL.replace(/\/$/, ''),
})

export default router
