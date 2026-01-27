import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import GlobalToast from '@/components/GlobalToast.tsx'
import { AuthProvider } from '@/contexts/AuthContext.tsx'
import { ToastProvider } from '@/contexts/ToastContext.tsx'
import router from '@/routes.tsx'
import '@/app.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
        <GlobalToast />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
)
