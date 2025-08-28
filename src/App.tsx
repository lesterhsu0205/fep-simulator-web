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

  const handleDrawerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSidebarOpen(e.target.checked)
  }

  return (

    <div className={`drawer ${sidebarOpen ? 'lg:drawer-open' : ''} bg-base-200`}>
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={handleDrawerChange}
      />
      <div className="drawer-content flex flex-col min-h-screen lg:pt-4 lg:px-4">
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
