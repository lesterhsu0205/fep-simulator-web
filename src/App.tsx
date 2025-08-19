import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Content } from '@/components/Content'
import { Footer } from '@/components/Footer'
import { Sidebar } from '@/components/Sidebar'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      }
      else {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const drawerCheckbox = document.getElementById('sidebar-drawer') as HTMLInputElement
    if (drawerCheckbox) {
      drawerCheckbox.checked = sidebarOpen
    }
  }, [sidebarOpen])

  const handleDrawerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSidebarOpen(e.target.checked)
  }

  return (

    <div className={`drawer ${sidebarOpen ? 'lg:drawer-open' : ''} bg-base-200 transition-none`}>
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle transition-none"
        checked={sidebarOpen}
        onChange={handleDrawerChange}
      />
      <div className="drawer-content flex flex-col min-h-screen bg-base-200 p-0 lg:pt-4 lg:px-4 lg:pb-0 transition-none">
        <div className="bg-white rounded-3xl overflow-hidden flex flex-col flex-grow shadow-2xs border border-gray-200">
          <Header />
          <Content />
        </div>
        <Footer />
      </div>
      <Sidebar />
    </div>
  )
}
