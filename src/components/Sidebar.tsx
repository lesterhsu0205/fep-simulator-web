import { Link, useLocation } from 'react-router-dom'
import { RoutesInfo } from '@/routes.tsx'
import { Landmark } from 'lucide-react'

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="drawer-side">
      <label htmlFor="sidebar-drawer" aria-label="close sidebar" className="drawer-overlay opacity-0 pointer-events-none"></label>
      <aside className="bg-base-200 w-56 min-h-screen transition-all duration-300 ease-in-out">
        <div className="p-4 font-extrabold text-primary text-2xl flex items-center">
          <Landmark size={24} className="mr-2 text-primary" />
          FEP Simulator
        </div>
        <ul className="menu p-2">
          {RoutesInfo.map(route => (
            <li key={route.path} className="my-1">
              <Link
                to={route.path}
                className={`py-2 ${location.pathname === route.path ? 'sidebar-item-active' : 'sidebar-item'}`}
              >
                {route.icon && <route.icon size={18} />}
                {route.displayText}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
