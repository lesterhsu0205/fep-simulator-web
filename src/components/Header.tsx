import { LogOut, Menu, User } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { MenuItem } from '@/services/AuthService'

export function Header() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  // 使用 useMemo 快取頁面標題計算，避免重新渲染
  const currentPageTitle = useMemo(() => {
    if (!user?.menus) return '系統首頁'

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

    return findCurrentPageTitle(user.menus, location.pathname)
  }, [user?.menus, location.pathname])

  return (
    <header className="navbar border-b border-base-300">
      {/* 左側 - 漢堡選單 */}
      <div className="navbar-start px-6">
        <label htmlFor="sidebar-drawer" className="btn btn-ghost btn-circle drawer-button">
          <Menu size={20} />
        </label>
        <div className="text-card-title ml-2 lg:ml-0">{currentPageTitle}</div>
      </div>

      {/* 右側 - 用戶資訊 dropdown */}
      <div className="navbar-end px-6">
        <div className="dropdown dropdown-end">
          <button type="button" className="btn btn-circle avatar">
            <div className="avatar avatar-placeholder">
              <div className="w-8 rounded-full">
                <User size={16} />
              </div>
            </div>
          </button>
          <ul className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-64 p-2 shadow-lg border border-base-300">
            {/* 用戶資訊標題 */}
            <li className="menu-title px-3 py-2">
              <div className="sidebar-item flex items-center gap-3">
                <div className="avatar avatar-placeholder">
                  <User size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base-content truncate">{user?.username || '訪客'}</div>
                  <div className="text-xs text-base-content/70 truncate">{user?.role || '未授權'}</div>
                </div>
              </div>
            </li>

            {/* 分隔線 */}
            <div className="border-t border-gray-200 my-1"></div>

            {/* 操作選項 */}
            <li>
              <button type="button" className="sidebar-item flex items-center gap-2 px-3 py-2">
                <User size={14} />
                個人設定
              </button>
            </li>
            <li>
              <button
                type="button"
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
