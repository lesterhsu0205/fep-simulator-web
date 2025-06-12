import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

// 表格資料類型
export interface TableData {
  id: number
  header: string
  type: string
  status: string | null
  target: string | null
  limit: string
  reviewer: string
  fxml: string
  lastModifiedTime: string
  lastModifiedBy: string
  createdTime: string
  createdBy: string
}

// 表單資料類型（排除不可編輯的欄位）
export interface EditFormData {
  type: string
  status: string | null
  target: string | null
  limit: string
  reviewer: string
  fxml: string
}

interface EditFormProps {
  data: TableData | null
  onSubmit: (data: EditFormData) => void
  onCancel: () => void
}

export default function EditForm({ data, onSubmit, onCancel }: EditFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditFormData>()

  // 當資料變化時，重置表單
  useEffect(() => {
    if (data) {
      reset({
        type: data.type,
        status: data.status,
        target: data.target,
        limit: data.limit,
        reviewer: data.reviewer,
        fxml: data.fxml,
      })
    }
  }, [data, reset])

  const handleFormSubmit = (formData: EditFormData) => {
    onSubmit(formData)
  }

  if (!data) return null

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="text-sm text-gray-600 font-medium">情境說明</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          {...register('type', { required: '情境說明為必填項目' })}
        />
        {errors.type && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.type.message}</span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="text-sm text-gray-600 font-medium">匯出匯款</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          {...register('status', { required: '匯出匯款為必填項目' })}
        />
        {errors.status && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.status.message}</span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="text-sm text-gray-600 font-medium">代理轉帳</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          {...register('target', { required: '代理轉帳為必填項目' })}
        />
        {errors.target && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.target.message}</span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="text-sm text-gray-600 font-medium">帳號檢核</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          {...register('limit', { required: '帳號核核為必填項目' })}
        />
        {errors.limit && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.limit.message}</span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="text-sm text-gray-600 font-medium">帳號檢核 91-96</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          {...register('reviewer', { required: '帳號核檢 91-96為必填項目' })}
        />
        {errors.reviewer && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.reviewer.message}</span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="text-sm text-gray-600 font-medium">FXML 規則</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          {...register('fxml', { required: 'FXML 規則為必填項目' })}
        />
        {errors.fxml && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.fxml.message}</span>
          </label>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
        >
          取消
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          儲存
        </button>
      </div>
    </form>
  )
}
