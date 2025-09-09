import { useForm, Controller } from 'react-hook-form'
import { Save, RotateCcw } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext.tsx'
import { type JcicCreateFormData } from '@/models/JcicSituation'
import { CreditService } from '@/services/CreditService'

interface CreditCreateProps {
  afterSubmit?: () => void
}

export default function CreditCreate({ afterSubmit }: CreditCreateProps) {
  const { showToast } = useToast()

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<JcicCreateFormData>({
    defaultValues: {
      txid: '',
      inqueryKey1: '',
      inqueryKey2: null,
      returnCode: '',
      forceToJcic: '',
      jcicDataDate: null,
      jcicData: null,
      situationDesc: '',
      memo: null,
      creator: '',
    },
  })

  const handleFormSubmit = async (formData: JcicCreateFormData) => {
    try {
      const progressFormData = {
        ...formData,
      }

      progressFormData.forceToJcic = formData.forceToJcic === true ? 'Y' : 'N'

      // 轉換日期格式為 YYYYMMDD
      if (formData.jcicDataDate) {
        const date = new Date(formData.jcicDataDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        progressFormData.jcicDataDate = `${year}${month}${day}`
      }

      const requestData = {
        action: 'A' as const,
        ...progressFormData,
      }

      await CreditService.maintainJcicSituation(requestData)
      showToast('測試帳號建立成功', 'success')

      // 列表頁新增時
      if (afterSubmit) {
        afterSubmit?.()
        reset()
      }
    }
    catch (error) {
      showToast('建立失敗，請稍後再試', 'error')
      console.error('Create error:', error)
    }
  }

  const handleReset = () => {
    reset()
    showToast('表單已重置', 'info')
  }

  return (
    <div className="w-full">
      {/* 表單卡片 */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">

        {/* 基本資料區塊 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">基本資料</h2>

          <div className="grid grid-cols-2 gap-8">
            {/* 左邊欄位 */}
            <div className="space-y-6">
              {/* 建立者 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  建立者
                </label>
                <input
                  type="text"
                  className="input input-bordered h-10 flex-1"
                  {...register('creator')}
                />
              </div>
            </div>

            {/* 右邊欄位 - 留白 */}
            <div>
            </div>
          </div>
        </div>

        {/* 情境說明區塊 */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <label className="text-sm font-medium w-30 flex-shrink-0">
              情境說明
            </label>
            <div className="flex-1">
              <textarea
                className="textarea textarea-bordered h-32 resize-none w-full"
                placeholder="(小於 100 字)"
                {...register('situationDesc', {
                  maxLength: { value: 20, message: '情境說明不可超過100字' },
                })}
              />
              {errors.situationDesc && (
                <div className="text-xs text-red-500 mt-1">{errors.situationDesc.message}</div>
              )}
            </div>
          </div>
        </div>

        {/* 補充說明區塊 */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <label className="text-sm font-medium w-30 flex-shrink-0">
              補充說明
            </label>
            <div className="flex-1">
              <textarea
                className="textarea textarea-bordered h-32 resize-none w-full"
                {...register('memo')}
              />
              {errors.memo && (
                <div className="text-xs text-red-500 mt-1">{errors.memo.message}</div>
              )}
            </div>
          </div>
        </div>

        {/* 交易設定區塊 - TODO: 尚未實作 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">交易設定</h2>
          <div className="grid grid-cols-2 gap-8">
            {/* 左邊欄位 */}
            <div className="space-y-6">
              {/* 查詢項目 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  查詢項目
                </label>
                <input
                  type="text"
                  className="input input-bordered h-10 flex-1"
                  {...register('txid')}
                />
              </div>

              {/* 查詢條件1 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  查詢條件1
                </label>
                <input
                  type="text"
                  className="input input-bordered h-10 flex-1"
                  {...register('inqueryKey1')}
                />
              </div>

              {/* 強制發查 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  強制發查
                </label>
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register('forceToJcic')}
                />
              </div>
            </div>

            {/* 右邊欄位 */}
            <div className="space-y-6">
              {/* 回應代碼 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  回應代碼
                </label>
                <input
                  type="text"
                  className="input input-bordered h-10 flex-1"
                  {...register('returnCode')}
                />
              </div>

              {/* 查詢條件2 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  查詢條件2
                </label>
                <input
                  type="text"
                  className="input input-bordered h-10 flex-1"
                  {...register('inqueryKey2')}
                />
              </div>

              {/* 發查資料日期 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  發查資料日期
                </label>
                <Controller
                  name="jcicDataDate"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="date"
                      className="input input-bordered h-10 flex-1"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 回傳資料區塊 */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <label className="text-sm font-medium w-30 flex-shrink-0">
              回傳資料
            </label>
            <div className="flex-1">
              <textarea
                className="textarea textarea-bordered h-64 resize-none w-full"
                {...register('jcicData')}
              />
              {errors.jcicData && (
                <div className="text-xs text-red-500 mt-1">{errors.jcicData.message}</div>
              )}
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="btn btn-ghost px-6"
            onClick={handleReset}
          >
            <RotateCcw size={16} />
            重置
          </button>
          <button
            type="submit"
            className="btn btn-primary px-6"
          >
            <Save size={16} />
            新增
          </button>
        </div>
      </form>
    </div>
  )
}
