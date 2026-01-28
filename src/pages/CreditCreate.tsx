import { RotateCcw, Save } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useToast } from '@/contexts/ToastContext.tsx'
import { ApiError } from '@/error/ApiError'
import type { JcicCreateFormData } from '@/models/JcicSituation'
import { CreditService } from '@/services/CreditService'

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
    } catch {
      // 忽略解析錯誤
    }
    return ''
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<JcicCreateFormData>({
    defaultValues: {
      creator: getCurrentUsername(),
      forceToJcic: '',
      inqueryKey1: '',
      inqueryKey2: null,
      jcicData: null,
      jcicDataDate: null,
      memo: null,
      returnCode: '',
      situationDesc: '',
      txid: ''
    }
  })

  // 監聽強制發查欄位變化
  const forceToJcic = watch('forceToJcic')

  useEffect(() => {
    if (forceToJcic) {
      // 當勾選強制發查時，設定為當天日期
      const today = new Date().toISOString().split('T')[0]
      setValue('jcicDataDate', today)
    } else {
      // 未勾選時清空日期
      setValue('jcicDataDate', null)
    }
  }, [forceToJcic, setValue])

  const handleFormSubmit = async (formData: JcicCreateFormData) => {
    try {
      const progressFormData = {
        ...formData
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
        ...progressFormData
      }

      await CreditService.maintainJcicSituation(requestData)
      showToast('測試帳號建立成功', 'success')

      // 列表頁新增時
      if (afterSubmit) {
        afterSubmit?.()
        reset()
      }
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.messageDesc : '建立失敗，請稍後再試'
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
      <form className="p-6" onSubmit={handleSubmit(handleFormSubmit)}>
        {/* 情境說明區塊 */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <span className="text-form-label w-30 shrink-0">情境說明</span>
            <div className="flex-1">
              <textarea
                className="textarea textarea-bordered h-32 resize-none w-full"
                placeholder="(小於 100 字)"
                {...register('situationDesc', {
                  maxLength: { message: '情境說明不可超過100字', value: 20 }
                })}
              />
              {errors.situationDesc && <div className="text-form-error">{errors.situationDesc.message}</div>}
            </div>
          </div>
        </div>

        {/* 補充說明區塊 */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <span className="text-form-label w-30 shrink-0">補充說明</span>
            <div className="flex-1">
              <textarea className="textarea textarea-bordered h-32 resize-none w-full" {...register('memo')} />
              {errors.memo && <div className="text-form-error">{errors.memo.message}</div>}
            </div>
          </div>
        </div>

        {/* 交易設定區塊 - TODO: 尚未實作 */}
        <div className="mb-8">
          <h2 className="text-card-title mb-6">交易設定</h2>
          <div className="grid grid-cols-2 gap-8">
            {/* 左邊欄位 */}
            <div className="space-y-6">
              {/* 查詢項目 */}
              <div className="flex items-center gap-4">
                <span className="text-form-label w-30 shrink-0">
                  查詢項目
                  <span className="text-form-required">*</span>
                </span>
                <div className="flex-1">
                  <input
                    className="input input-bordered h-10 w-full"
                    type="text"
                    {...register('txid', {
                      required: '查詢項目為必填項目'
                    })}
                  />
                  {errors.txid && <div className="text-form-error">{errors.txid.message}</div>}
                </div>
              </div>

              {/* 查詢條件1 */}
              <div className="flex items-center gap-4">
                <span className="text-form-label w-30 shrink-0">查詢條件1</span>
                <input className="input input-bordered h-10 flex-1" type="text" {...register('inqueryKey1')} />
              </div>

              {/* 強制發查 */}
              <div className="flex items-center gap-4">
                <span className="text-form-label w-30 shrink-0">強制發查</span>
                <input className="checkbox" type="checkbox" {...register('forceToJcic')} />
              </div>
            </div>

            {/* 右邊欄位 */}
            <div className="space-y-6">
              {/* 回應代碼 */}
              <div className="flex items-center gap-4">
                <span className="text-form-label w-30 shrink-0">回應代碼</span>
                <input className="input input-bordered h-10 flex-1" type="text" {...register('returnCode')} />
              </div>

              {/* 查詢條件2 */}
              <div className="flex items-center gap-4">
                <span className="text-form-label w-30 shrink-0">查詢條件2</span>
                <input className="input input-bordered h-10 flex-1" type="text" {...register('inqueryKey2')} />
              </div>

              {/* 發查資料日期 */}
              <div className="flex items-center gap-4">
                <span className="text-form-label w-30 shrink-0">
                  發查資料日期
                  <span className="text-form-required">*</span>
                </span>
                <Controller
                  control={control}
                  name="jcicDataDate"
                  render={({ field }) => (
                    <div className="flex-1">
                      <input
                        className={`input input-bordered h-10 w-full ${forceToJcic ? 'bg-gray-100' : ''}`}
                        onChange={field.onChange}
                        readOnly={!!forceToJcic}
                        type="date"
                        value={field.value || ''}
                      />
                      {errors.jcicDataDate && <div className="text-form-error">{errors.jcicDataDate.message}</div>}
                    </div>
                  )}
                  rules={{
                    required: '發查資料日期為必填欄位'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 回傳資料區塊 */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <span className="text-form-label w-30 shrink-0">回傳資料</span>
            <div className="flex-1">
              <textarea className="textarea textarea-bordered h-64 resize-none w-full" {...register('jcicData')} />
              {errors.jcicData && <div className="text-form-error">{errors.jcicData.message}</div>}
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end gap-3 pt-4">
          <button className="btn btn-ghost px-6" onClick={handleReset} type="button">
            <RotateCcw size={16} />
            重置
          </button>
          <button className="btn btn-primary px-6" type="submit">
            <Save size={16} />
            新增
          </button>
        </div>
      </form>
    </div>
  )
}
