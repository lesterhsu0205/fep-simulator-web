import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'
import { useToast } from '@/contexts/ToastContext'

export default function GlobalToast() {
  const { toastState, hideToast } = useToast()

  useEffect(() => {
    if (toastState.isVisible) {
      const timer = setTimeout(() => {
        hideToast()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastState.isVisible, hideToast])

  if (!toastState.isVisible) return null

  const getAlertColor = () => {
    switch (toastState.type) {
      case 'success':
        return 'alert-success'
      case 'error':
        return 'alert-error'
      case 'info':
        return 'alert-info'
      default:
        return 'alert-success'
    }
  }

  const getIcon = () => {
    switch (toastState.type) {
      case 'success':
        return <CheckCircle className="text-white" size={20} />
      case 'error':
        return <AlertCircle className="text-white" size={20} />
      case 'info':
        return <Info className="text-white" size={20} />
      default:
        return <CheckCircle className="text-white" size={20} />
    }
  }

  return (
    <div className="toast toast-top toast-end z-1001">
      <div className={`alert ${getAlertColor()} text-white`} role="alert">
        {getIcon()}
        <span className="text-white">{toastState.message}</span>
        <button
          aria-label="關閉通知"
          className="btn btn-ghost btn-xs text-white hover:text-gray-200"
          onClick={hideToast}
          type="button"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
