import { useEffect } from 'react'
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'
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
        return <CheckCircle size={20} className="text-white" />
      case 'error':
        return <AlertCircle size={20} className="text-white" />
      case 'info':
        return <Info size={20} className="text-white" />
      default:
        return <CheckCircle size={20} className="text-white" />
    }
  }

  return (
    <div className="toast toast-top toast-end z-[1001]">
      <div role="alert" className={`alert ${getAlertColor()} text-white`}>
        {getIcon()}
        <span className="text-white">{toastState.message}</span>
        <button
          className="btn btn-ghost btn-xs text-white hover:text-gray-200"
          onClick={hideToast}
          aria-label="關閉通知"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
