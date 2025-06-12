import { useEffect, useState } from 'react'
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

export default function GlobalToast() {
  const { toastState, hideToast } = useToast()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (toastState.isVisible) {
      setShouldRender(true)
      const timer = setTimeout(() => {
        hideToast()
      }, 3000)

      return () => clearTimeout(timer)
    }
    else {
      // 延遲移除組件以完成淡出動畫
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [toastState.isVisible, hideToast])

  if (!shouldRender) return null

  const getToastStyles = () => {
    switch (toastState.type) {
      case 'success':
        return 'alert-success text-white'
      case 'error':
        return 'alert-error text-white'
      case 'info':
        return 'alert-info text-white'
      default:
        return 'alert-success text-white'
    }
  }

  const getIcon = () => {
    switch (toastState.type) {
      case 'success':
        return <CheckCircle size={20} />
      case 'error':
        return <AlertCircle size={20} />
      case 'info':
        return <Info size={20} />
      default:
        return <CheckCircle size={20} />
    }
  }

  return (
    <div className="toast toast-top toast-end z-50 fixed">
      <div
        className={`alert ${getToastStyles()} transition-all duration-300 ease-in-out ${
          toastState.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        }`}
      >
        {getIcon()}
        <span>{toastState.message}</span>
        <button
          className="btn btn-ghost btn-xs ml-2"
          onClick={hideToast}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
