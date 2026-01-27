import { Save } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { EditFormProps } from '@/components/DataTable'
import type { JcicEditFormData } from '@/models/JcicSituation'
import { CreditService } from '@/services/CreditService'
import { ensureBase64Decoded } from '@/utils/base64'

export default function CreditEditForm({ data, afterSubmit }: EditFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<JcicEditFormData>()

  // 當資料變化時，重置表單
  useEffect(() => {
    if (data) {
      // 處理日期格式：yyyyMMdd -> yyyy-MM-dd
      const formatDateForInput = (dateStr: string | null) => {
        if (!dateStr) return null

        // 如果是 yyyyMMdd 格式 (8位數字)
        if (/^\d{8}$/.test(dateStr)) {
          const year = dateStr.substring(0, 4)
          const month = dateStr.substring(4, 6)
          const day = dateStr.substring(6, 8)
          return `${year}-${month}-${day}`
        }

        // 如果是 ISO 格式，取日期部分
        if (dateStr.includes('T')) {
          return dateStr.split('T')[0]
        }

        // 其他情況返回原值
        return dateStr
      }

      reset({
        id: data.id as number,
        txid: data.txid as string,
        inqueryKey1: data.inqueryKey1 as string,
        inqueryKey2: data.inqueryKey2 as string | null,
        returnCode: data.returnCode as string,
        forceToJcic: data.forceToJcic as string,
        jcicDataDate: formatDateForInput(data.jcicDataDate as string | null),
        jcicData: data.jcicData ? ensureBase64Decoded(data.jcicData as string) : null,
        situationDesc: data.situationDesc as string,
        memo: data.memo as string | null
      })
    }
  }, [data, reset])

  const handleFormSubmit = async (formData: JcicEditFormData) => {
    // 處理日期格式：yyyy-MM-dd -> yyyyMMdd
    const formatDateForSubmit = (dateStr: string | null) => {
      if (!dateStr) return null

      // 如果是 yyyy-MM-dd 格式，轉為 yyyyMMdd
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr.replace(/-/g, '')
      }

      // 其他情況返回原值
      return dateStr
    }

    const requestData = {
      action: 'U' as const,
      ...formData,
      jcicDataDate: formatDateForSubmit(formData.jcicDataDate)
    }

    await CreditService.maintainJcicSituation(requestData)
    afterSubmit()
  }

  if (!data) return null

  return (
    <div className="w-full">
      {/* 表單卡片 */}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
        {/* 基本資料區塊 */}
        <div className="mb-8">
          {/* 查詢項目資訊 */}
          {data && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">查詢項目</div>
              <div className="text-card-title">{data.txid as string}</div>
            </div>
          )}

          {/* 第一行：查詢條件1、查詢條件2 */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-form-label w-20 shrink-0">查詢條件1</span>
              <div className="flex-1">
                <input
                  type="text"
                  className="input input-bordered h-10 w-full bg-gray-100"
                  readOnly
                  {...register('inqueryKey1')}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-form-label w-20 shrink-0">查詢條件2</span>
              <div className="flex-1">
                <input
                  type="text"
                  className="input input-bordered h-10 w-full bg-gray-100"
                  readOnly
                  {...register('inqueryKey2')}
                />
              </div>
            </div>
          </div>

          {/* 第二行：回應代碼、強制發查 */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-form-label w-20 shrink-0">回應代碼</span>
              <div className="flex-1">
                <input
                  type="text"
                  className="input input-bordered h-10 w-full bg-gray-100"
                  readOnly
                  {...register('returnCode')}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-form-label w-20 shrink-0">強制發查</span>
              <div className="flex-1">
                <input
                  type="text"
                  className="input input-bordered h-10 w-full bg-gray-100"
                  readOnly
                  {...register('forceToJcic')}
                />
              </div>
            </div>
          </div>

          {/* 第三行：情境說明、發查資料日期 */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-form-label w-20 shrink-0">
                情境說明
                <span className="text-form-required">*</span>
              </span>
              <div className="flex-1">
                <input
                  type="text"
                  className="input input-bordered h-10 w-full"
                  {...register('situationDesc', { required: '情境說明為必填項目' })}
                />
                {errors.situationDesc && <div className="text-form-error">{errors.situationDesc.message}</div>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-form-label w-20 shrink-0">發查資料日期</span>
              <div className="flex-1">
                <input type="date" className="input input-bordered h-10 w-full" {...register('jcicDataDate')} />
              </div>
            </div>
          </div>

          {/* 第四行：備註、回傳資料 */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <span className="text-form-label w-20 shrink-0">備註</span>
              <div className="flex-1">
                <input type="text" className="input input-bordered h-10 w-full" {...register('memo')} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-form-label w-20 shrink-0">回傳資料</span>
              <div className="flex-1">
                <textarea className="textarea textarea-bordered w-full" rows={2} {...register('jcicData')} />
              </div>
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="submit" className="btn btn-primary px-6">
            <Save size={16} />
            儲存
          </button>
        </div>
      </form>
    </div>
  )
}
