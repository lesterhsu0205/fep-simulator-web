import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Save, RotateCcw } from 'lucide-react'

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
    <div className="w-full">
      {/* 表單卡片 */}
      <div className="bg-white rounded-lg shadow border-0">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">

          {/* 基本資料區塊 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">編輯資料</h2>

            {/* 帳號資訊 */}
            {data && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">帳號</div>
                <div className="text-lg font-semibold">{data.header}</div>
              </div>
            )}

            {/* 第一行：情境說明、匯出匯款 */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700 font-medium w-20 flex-shrink-0">
                  情境說明
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered h-10 w-full"
                    {...register('type', { required: '情境說明為必填項目' })}
                  />
                  {errors.type && (
                    <div className="text-xs text-red-500 mt-1">{errors.type.message}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700 font-medium w-20 flex-shrink-0">
                  匯出匯款
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered h-10 w-full"
                    {...register('status', { required: '匯出匯款為必填項目' })}
                  />
                  {errors.status && (
                    <div className="text-xs text-red-500 mt-1">{errors.status.message}</div>
                  )}
                </div>
              </div>
            </div>

            {/* 第二行：代理轉帳、帳號檢核 */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700 font-medium w-20 flex-shrink-0">
                  代理轉帳
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered h-10 w-full"
                    {...register('target', { required: '代理轉帳為必填項目' })}
                  />
                  {errors.target && (
                    <div className="text-xs text-red-500 mt-1">{errors.target.message}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700 font-medium w-20 flex-shrink-0">
                  帳號檢核
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered h-10 w-full"
                    {...register('limit', { required: '帳號檢核為必填項目' })}
                  />
                  {errors.limit && (
                    <div className="text-xs text-red-500 mt-1">{errors.limit.message}</div>
                  )}
                </div>
              </div>
            </div>

            {/* 第三行：帳號檢核 91-96、FXML 規則 */}
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700 font-medium w-20 flex-shrink-0">
                  帳號檢核 91-96
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered h-10 w-full"
                    {...register('reviewer', { required: '帳號檢核 91-96為必填項目' })}
                  />
                  {errors.reviewer && (
                    <div className="text-xs text-red-500 mt-1">{errors.reviewer.message}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700 font-medium w-20 flex-shrink-0">
                  FXML 規則
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered h-10 w-full"
                    {...register('fxml', { required: 'FXML 規則為必填項目' })}
                  />
                  {errors.fxml && (
                    <div className="text-xs text-red-500 mt-1">{errors.fxml.message}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="btn btn-ghost px-6"
              onClick={onCancel}
            >
              <RotateCcw size={16} />
              取消
            </button>
            <button
              type="submit"
              className="btn btn-primary px-6"
            >
              <Save size={16} />
              儲存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
