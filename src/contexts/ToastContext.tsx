import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastState {
  message: string
  isVisible: boolean
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
  hideToast: () => void
  toastState: ToastState
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toastState, setToastState] = useState<ToastState>({
    message: '',
    isVisible: false,
    type: 'success',
  })

  const showToast = (message: string, type: ToastType = 'success') => {
    setToastState({
      message,
      isVisible: true,
      type,
    })
  }

  const hideToast = () => {
    setToastState(prev => ({
      ...prev,
      isVisible: false,
    }))
  }

  const value = {
    showToast,
    hideToast,
    toastState,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
