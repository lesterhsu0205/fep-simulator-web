import { useAuth } from '@/contexts/AuthContext'
import type { MenuItem } from '@/services/authService'
import { Link, useLocation } from 'react-router-dom'
import { Landmark } from 'lucide-react'

export function DynamicSidebar() {
  const { user } = useAuth()
  const location = useLocation()

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0
    const isActive = item.path ? location.pathname === item.path : false

    if (hasChildren) {
      return (
        <li key={item.id}>
          <details>
            <summary className="sidebar-item font-medium">{item.name}</summary>
            <ul>
              {item.children.map(child => renderMenuItem(child))}
            </ul>
          </details>
        </li>
      )
    }

    // 葉子節點 - 可點擊的選單項目
    if (item.path && (item.path === '/TEST_ACCT_MAINT' || item.path === '/TEST_ACCT_CREATE')) {
      return (
        <li key={item.id}>
          <Link
            to={item.path}
            className={isActive ? 'sidebar-item-active' : 'sidebar-item'}
          >
            {item.name}
          </Link>
        </li>
      )
    }
    else {
      // 沒有路徑的項目顯示為標題
      return (
        <li key={item.id} className="menu-title">
          <span className="sidebar-item text-xs! font-medium">{item.name}</span>
        </li>
      )
    }
  }

  if (!user || !user.menus) {
    return (
      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
        <aside className="bg-base-200 min-h-full w-64 shadow-lg">
          <div className="border-b border-base-300">
            <a href="/" className="btn btn-ghost text-xl justify-start p-4 h-auto min-h-16 rounded-none w-full">
              <Landmark size={20} className="text-primary" />
              <span className="font-bold text-primary">FEP Simulator</span>
            </a>
          </div>
          <div className="p-6 text-center">
            <div className="loading loading-spinner loading-md text-primary mb-2"></div>
            <p className="text-base-content/70 text-sm">載入選單中...</p>
          </div>
        </aside>
      </div>
    )
  }

  return (
    <div className="drawer-side">
      <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
      <aside className="bg-base-200 min-h-full w-64 shadow-lg">
        {/* 品牌標題 */}
        <div className="border-b border-base-300">
          <a href="/" className="btn btn-ghost text-xl justify-start p-4 h-auto min-h-16 rounded-none w-full">
            <Landmark size={20} className="text-primary" />
            <span className="font-bold text-primary">FEP Simulator</span>
          </a>
        </div>

        {/* 動態選單 - 使用 Context7 建議的緊湊樣式 */}
        <ul className="menu menu-sm p-2 w-full">
          {user.menus.map(menu => renderMenuItem(menu))}
        </ul>
      </aside>
    </div>
  )
}
