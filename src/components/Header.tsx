import { useLocation } from 'react-router-dom'
import { RoutesInfo } from '@/routes.tsx'
import { Menu } from 'lucide-react'

export function Header() {
  const location = useLocation()

  // 找到當前路由的顯示文字和圖標
  const currentRoute = RoutesInfo.find(route => route.path === location.pathname)
  const displayText = currentRoute?.displayText || '測試帳號查詢'
  const CurrentIcon = currentRoute?.icon

  return (
    <div className="navbar bg-white">
      <div className="navbar-start flex-1">
        <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost">
          <Menu size={22} />
        </label>
        <div className="flex items-center ml-2">
          {CurrentIcon && <CurrentIcon size={20} className="mr-2" />}
          <h1 className="text-subheading">{displayText}</h1>
        </div>
      </div>
      <div className="navbar-end">
        {/* 可以在這裡放置右側功能按鈕 */}
      </div>
    </div>
  )
}
