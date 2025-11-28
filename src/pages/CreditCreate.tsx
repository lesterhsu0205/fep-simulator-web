import { useForm, Controller } from 'react-hook-form'
import { useEffect } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext.tsx'
import { type JcicCreateFormData } from '@/models/JcicSituation'
import { CreditService } from '@/services/CreditService'
import { ApiError } from '@/error/ApiError'

interface CreditCreateProps {
  afterSubmit?: () => void
}

export default function CreditCreate({ afterSubmit }: CreditCreateProps) {
  const { showToast } = useToast()

  // 取得當前用戶資訊
  const getCurrentUsername = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        return user.username || ''
      }
    }
    catch {
      // 忽略解析錯誤
    }
    return ''
  }

  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm<JcicCreateFormData>({
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
      creator: getCurrentUsername(),
    },
  })

  // 監聽強制發查欄位變化
  const forceToJcic = watch('forceToJcic')

  useEffect(() => {
    if (forceToJcic) {
      // 當勾選強制發查時，設定為當天日期
      const today = new Date().toISOString().split('T')[0]
      setValue('jcicDataDate', today)
    }
    else {
      // 未勾選時清空日期
      setValue('jcicDataDate', null)
    }
  }, [forceToJcic, setValue])

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
      const errorMessage = error instanceof ApiError
        ? error.messageDesc
        : '建立失敗，請稍後再試'
      showToast(errorMessage, 'error')
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
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered h-10 w-full"
                    {...register('txid', {
                      required: '查詢項目為必填項目' })}
                  />
                  {errors.txid && (
                    <div className="text-xs text-red-500 mt-1">{errors.txid.message}</div>
                  )}
                </div>
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
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="jcicDataDate"
                  control={control}
                  rules={{
                    required: '發查資料日期為必填欄位',
                  }}
                  render={({ field }) => (
                    <div className="flex-1">
                      <input
                        type="date"
                        className={`input input-bordered h-10 w-full ${forceToJcic ? 'bg-gray-100' : ''}`}
                        value={field.value || ''}
                        onChange={field.onChange}
                        readOnly={!!forceToJcic}
                      />
                      {errors.jcicDataDate && (
                        <div className="text-xs text-red-500 mt-1">{errors.jcicDataDate.message}</div>
                      )}
                    </div>
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
