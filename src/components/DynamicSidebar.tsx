import { useAuth } from '@/contexts/AuthContext'
import type { MenuItem } from '@/services/authService'
import { Link, useLocation } from 'react-router-dom'
import { Landmark } from 'lucide-react'
import { useEffect } from 'react'

export function DynamicSidebar() {
  const { user } = useAuth()
  const location = useLocation()

  // 檢查路徑是否有對應的實現
  const isPathImplemented = (path: string): boolean => {
    const implementedPaths = ['/TEST_ACCT_MAINT', '/TEST_ACCT_CREATE']
    return implementedPaths.includes(path)
  }

  // 檢查當前路徑是否在某個選單項目的子項目中
  const isPathInMenu = (menu: MenuItem, currentPath: string): boolean => {
    // 如果當前選單項目有對應的路徑且匹配
    if (menu.path === currentPath) {
      return true
    }

    // 遞歸檢查子項目
    if (menu.children && menu.children.length > 0) {
      return menu.children.some(child => isPathInMenu(child, currentPath))
    }

    return false
  }

  // 使用 useEffect 來處理 details 元素的展開狀態
  useEffect(() => {
    if (!user?.menus) return

    // 找到所有的 details 元素並根據當前路徑設置展開狀態
    const detailsElements = document.querySelectorAll('.sidebar-details')

    detailsElements.forEach((details) => {
      const menuId = details.getAttribute('data-menu-id')
      if (menuId) {
        const menu = findMenuById(user.menus, parseInt(menuId))
        if (menu && isPathInMenu(menu, location.pathname)) {
          ;(details as HTMLDetailsElement).open = true
        }
        else {
          ;(details as HTMLDetailsElement).open = false
        }
      }
    })
  }, [location.pathname, user?.menus])

  // 根據 ID 找到選單項目
  const findMenuById = (menus: MenuItem[], id: number): MenuItem | null => {
    for (const menu of menus) {
      if (menu.id === id) {
        return menu
      }
      if (menu.children && menu.children.length > 0) {
        const found = findMenuById(menu.children, id)
        if (found) return found
      }
    }
    return null
  }

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0
    const isActive = item.path ? location.pathname === item.path : false
    const isImplemented = item.path ? isPathImplemented(item.path) : true

    if (hasChildren) {
      return (
        <li key={item.id}>
          <details
            className="sidebar-details"
            data-menu-id={item.id.toString()}
          >
            <summary className="sidebar-item font-medium">{item.name}</summary>
            <ul>
              {item.children.map(child => renderMenuItem(child))}
            </ul>
          </details>
        </li>
      )
    }

    // 葉子節點 - 可點擊的選單項目
    if (item.path) {
      const linkClass = isActive
        ? 'sidebar-item-active'
        : isImplemented
          ? 'sidebar-item'
          : 'sidebar-item text-xs! text-base-content/50 cursor-not-allowed'

      if (isImplemented) {
        return (
          <li key={item.id}>
            <Link
              to={item.path}
              className={linkClass}
            >
              {item.name}
            </Link>
          </li>
        )
      }
      else {
        return (
          <li key={item.id}>
            <span className={linkClass}>
              {item.name}
            </span>
          </li>
        )
      }
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
