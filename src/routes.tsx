import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import App from '@/App.tsx'
// import { RoutesInfo } from '@/config/routes-config'

import DataTable from '@/components/DataTable.tsx'
import CreateTestAccount from '@/components/CreateTestAccount.tsx'
import {
  Search,
  Edit,
  FolderPlus,
  Upload,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'
import React from 'react'

// 定義路由配置的擴展類型，包含 displayText 和 icon
export interface AppRouteObject {
  path: string
  displayText: string
  icon?: LucideIcon
  element?: React.ReactNode
}

// 匯出所有文檔路由配置，包含 displayText 和 icon
export const RoutesInfo: AppRouteObject[] = [
  {
    path: '/query',
    displayText: '測試帳號查詢',
    icon: Search,
    element: (
      <DataTable
        title="測試帳號查詢"
      />
    ),
  },
  {
    path: '/maintain',
    displayText: '測試帳號維護',
    icon: Edit,
    element: <p>此頁面用於維護測試帳號</p>,
  },
  {
    path: '/create',
    displayText: '測試帳號建立',
    icon: FolderPlus,
    element: <CreateTestAccount />,
  },
  {
    path: '/upload',
    displayText: '檔案上傳',
    icon: Upload,
    element: <p>此頁面用於上傳檔案</p>,
  },
  {
    path: '/nonCompleteTxMaintain',
    displayText: '未完成交易查詢建立',
    icon: HelpCircle,
    element: <p>此頁面用於查詢和建立未完成交易</p>,
  },
]

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        // 使用 Navigate 組件將根路徑重定向到 /query
        element: <Navigate to="/query" replace />,
      },
      // 使用 RoutesInfo 來生成子路由
      ...RoutesInfo.map(route => ({
        path: route.path.slice(1), // 移除前導斜線
        element: route.element,
      })),
    ],
  },
]

// 創建路由器
const router = createBrowserRouter(routes)
export default router
