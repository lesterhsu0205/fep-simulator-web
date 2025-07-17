import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ToastProvider } from '@/contexts/ToastContext.tsx'
import { AuthProvider } from '@/contexts/AuthContext.tsx'
import GlobalToast from '@/components/GlobalToast.tsx'
import router from '@/routes.tsx'
import '@/app.css'

function AppWithToast() {
  // 動態添加 body.scrolling 類名，控制滾動條顯示
  useEffect(() => {
    let timer: number | undefined
    const handleScroll = () => {
      document.body.classList.add('scrolling')
      clearTimeout(timer)
      // 1 秒無滾動則移除
      timer = window.setTimeout(() => {
        document.body.classList.remove('scrolling')
      }, 1000)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
        <AppWithToast />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)
