import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Save, RotateCcw } from 'lucide-react'

// 使用 API 原始格式的表格資料類型
export interface TableData {
  id: number
  account: string
  situationDesc: string
  rmtResultCode: string | null
  atmResultCode: string | null
  atmVerifyRCode: string
  atmVerifyRDetail: string
  fxmlResultCode: string
  updatedAt: string
  updater: string
  createdAt: string
  creator: string
}

// 表單資料類型（使用 API 的 key 值）
export interface EditFormData {
  situationDesc: string
  rmtResultCode: string | null
  atmResultCode: string | null
  atmVerifyRCode: string
  atmVerifyRDetail: string
  fxmlResultCode: string
}

interface EditFormProps {
  data: TableData | { [key: string]: unknown } | null
  onSubmit: (data: EditFormData) => void
  onCancel: () => void
}

export default function EditForm({ data, onSubmit, onCancel }: EditFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditFormData>()

  // 當資料變化時，重置表單
  useEffect(() => {
    if (data) {
      reset({
        situationDesc: data.situationDesc as string,
        rmtResultCode: data.rmtResultCode as string | null,
        atmResultCode: data.atmResultCode as string | null,
        atmVerifyRCode: data.atmVerifyRCode as string,
        atmVerifyRDetail: data.atmVerifyRDetail as string,
        fxmlResultCode: data.fxmlResultCode as string,
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
                <div className="text-lg font-semibold">{data.account as string}</div>
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
                    {...register('situationDesc', { required: '情境說明為必填項目' })}
                  />
                  {errors.situationDesc && (
                    <div className="text-xs text-red-500 mt-1">{errors.situationDesc.message}</div>
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
                    {...register('rmtResultCode', { required: '匯出匯款為必填項目' })}
                  />
                  {errors.rmtResultCode && (
                    <div className="text-xs text-red-500 mt-1">{errors.rmtResultCode.message}</div>
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
                    {...register('atmResultCode', { required: '代理轉帳為必填項目' })}
                  />
                  {errors.atmResultCode && (
                    <div className="text-xs text-red-500 mt-1">{errors.atmResultCode.message}</div>
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
                    {...register('atmVerifyRCode', { required: '帳號檢核為必填項目' })}
                  />
                  {errors.atmVerifyRCode && (
                    <div className="text-xs text-red-500 mt-1">{errors.atmVerifyRCode.message}</div>
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
                    {...register('atmVerifyRDetail', { required: '帳號檢核 91-96為必填項目' })}
                  />
                  {errors.atmVerifyRDetail && (
                    <div className="text-xs text-red-500 mt-1">{errors.atmVerifyRDetail.message}</div>
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
                    {...register('fxmlResultCode', { required: 'FXML 規則為必填項目' })}
                  />
                  {errors.fxmlResultCode && (
                    <div className="text-xs text-red-500 mt-1">{errors.fxmlResultCode.message}</div>
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
