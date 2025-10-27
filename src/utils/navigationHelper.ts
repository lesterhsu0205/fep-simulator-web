import type { MenuItem } from '@/services/AuthService'

/**
 * 獲取使用者有權限訪問的第一個頁面路徑
 * 這是登入後智能導航的核心邏輯
 */
export function getFirstAccessiblePath(menus: MenuItem[]): string | null {
  const implementedPaths = import.meta.env.VITE_IMPLEMENTED_PATHS?.split(',') || []

  // 遞歸搜尋第一個有 path 且已實現的選單項目
  const findFirstAccessiblePath = (items: MenuItem[]): string | null => {
    for (const item of items) {
      // 檢查當前項目是否有路徑且已實現
      if (item.path && implementedPaths.includes(item.path)) {
        return item.path
      }

      // 遞歸檢查子選單
      if (item.children && item.children.length > 0) {
        const childPath = findFirstAccessiblePath(item.children)
        if (childPath) {
          return childPath
        }
      }
    }
    return null
  }

  return findFirstAccessiblePath(menus)
}

/**
 * 獲取所有使用者有權限的路徑列表
 * 用於檢查路徑是否有權限訪問
 */
export function getAllAccessiblePaths(menus: MenuItem[]): string[] {
  const implementedPaths = import.meta.env.VITE_IMPLEMENTED_PATHS?.split(',') || []
  const accessiblePaths: string[] = []

  const collectPaths = (items: MenuItem[]) => {
    items.forEach((item) => {
      if (item.path && implementedPaths.includes(item.path)) {
        accessiblePaths.push(item.path)
      }
      if (item.children && item.children.length > 0) {
        collectPaths(item.children)
      }
    })
  }

  collectPaths(menus)
  return accessiblePaths
}

/**
 * 檢查特定路徑是否可訪問
 */
export function isPathAccessible(path: string, menus: MenuItem[]): boolean {
  const accessiblePaths = getAllAccessiblePaths(menus)
  return accessiblePaths.includes(path)
}
