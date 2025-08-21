import type { ReactNode } from 'react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  modalTitle: string
  modalContent: ReactNode
  modalAction: ReactNode
  onCancel: () => void
  className?: string
}

export default function Modal({ isOpen, modalTitle, modalContent, modalAction, onCancel, className }: ModalProps) {
  // ESC 鍵監聽事件
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onCancel])

  return (
    <dialog className="modal modal-middle" open={isOpen}>
      <div className={`modal-box ${className || ''}`}>
        <h3 className="font-bold text-lg">{modalTitle}</h3>
        <div className="py-4">
          {modalContent}
        </div>
        <div className="modal-action">
          {modalAction}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>close</button>
      </form>
    </dialog>
  )
}
