import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ToastProvider } from '@/contexts/ToastContext.tsx'
import { AuthProvider } from '@/contexts/AuthContext.tsx'
import GlobalToast from '@/components/GlobalToast.tsx'
import router from '@/routes.tsx'
import '@/app.css'

function Window() {
  // macOS 風格滾動條控制：只在滾動時顯示
  /* useEffect(() => {
    let timer: number | undefined
    const handleScroll = () => {
      document.body.classList.add('scrolling')
      document.documentElement.classList.add('scrolling')
      clearTimeout(timer)
      // 滾動停止後 800ms 隱藏滾動條
      timer = window.setTimeout(() => {
        document.body.classList.remove('scrolling')
        document.documentElement.classList.remove('scrolling')
      }, 800)
    }

    // 同時監聽 window 和 document 的滾動事件
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, []) */

  return (
    <>
      <RouterProvider router={router} />
      <GlobalToast />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <Window />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)
