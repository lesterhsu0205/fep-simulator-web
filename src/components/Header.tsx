import { useLocation } from 'react-router-dom'
import { Menu, LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { MenuItem } from '@/services/AuthService'

export function Header() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  // 從用戶選單中找到當前頁面的標題
  const findCurrentPageTitle = (menus: MenuItem[], currentPath: string): string => {
    for (const menu of menus) {
      // 檢查 path 或根據 url 生成的路徑
      if (menu.path && menu.path === currentPath) {
        return menu.name
      }
      // 如果沒有 path 但有 url，嘗試匹配基於 code 的路徑
      if (!menu.path && menu.url && currentPath === `/${menu.code.toLowerCase().replace(/_/g, '-')}`) {
        return menu.name
      }

      if (menu.children && menu.children.length > 0) {
        const found = findCurrentPageTitle(menu.children, currentPath)
        if (found !== '系統首頁') return found
      }
    }
    return '系統首頁'
  }

  const currentPageTitle = user?.menus
    ? findCurrentPageTitle(user.menus, location.pathname)
    : '系統首頁'

  // 調試輸出
  console.log('📍 Current path:', location.pathname)
  console.log('📋 User menus:', user?.menus)
  console.log('📝 Found title:', currentPageTitle)

  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-2">
      {/* 左側 - 漢堡選單 */}
      <div className="navbar-start px-6">
        <label htmlFor="sidebar-drawer" className="btn btn-ghost btn-circle drawer-button">
          <Menu size={20} />
        </label>
        <div className="text-lg font-semibold ml-2 lg:ml-0">{currentPageTitle}</div>
      </div>

      {/* 右側 - 用戶資訊 dropdown */}
      <div className="navbar-end px-6">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-circle avatar">
            <div className="avatar avatar-placeholder">
              <div className="w-8 rounded-full">
                <User size={16} />
              </div>
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-64 p-2 shadow-lg border border-base-300">
            {/* 用戶資訊標題 */}
            <li className="menu-title px-3 py-2">
              <div className="sidebar-item flex items-center gap-3">
                <div className="avatar avatar-placeholder">
                  <User size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-base-content truncate">
                    {user?.username || '訪客'}
                  </div>
                  <div className="text-xs text-base-content/70 truncate">
                    {user?.role || '未授權'}
                  </div>
                </div>
              </div>
            </li>

            {/* 分隔線 */}
            <div className="border-t border-gray-200 my-1"></div>

            {/* 操作選項 */}
            <li>
              <a className="sidebar-item flex items-center gap-2 px-3 py-2">
                <User size={14} />
                個人設定
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="sidebar-item flex items-center gap-2 px-3 py-2 text-error hover:bg-error/10"
              >
                <LogOut size={14} />
                登出
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
