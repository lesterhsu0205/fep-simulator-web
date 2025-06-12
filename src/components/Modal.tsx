import type { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  modalTitle: string
  modalContent: ReactNode
  modalAction: ReactNode
  onCancel: () => void
}

export default function Modal({ isOpen, modalTitle, modalContent, modalAction, onCancel }: ModalProps) {
  return (
    <dialog className="modal" open={isOpen}>
      <div className="modal-box">
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
