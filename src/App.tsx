import { useEffect, useState } from 'react'
import { Content } from '@/components/Content'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDrawerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSidebarOpen(e.target.checked)
  }

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <div className={`drawer ${sidebarOpen ? 'lg:drawer-open' : ''} grow`}>
        <input
          checked={sidebarOpen}
          className="drawer-toggle"
          id="sidebar-drawer"
          onChange={handleDrawerChange}
          type="checkbox"
        />
        <div className="drawer-content flex flex-col lg:pt-4 lg:px-4">
          <div className="bg-white rounded-3xl overflow-hidden flex flex-col grow shadow-2xs border border-gray-200">
            <Header />
            <Content />
          </div>
        </div>
        <Sidebar />
      </div>
      <Footer />
    </div>
  )
}
