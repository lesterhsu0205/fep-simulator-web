import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Save } from 'lucide-react'
import { type EditFormProps } from '@/components/DataTable'
import { type FinanceEditFormData } from '@/model/FiscSituation'
import { FinanceService } from '@/services/FinanceService'

export default function FinanceEditForm({ data, afterSubmit }: EditFormProps) {
  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm<FinanceEditFormData>()

  // 當資料變化時，重置表單
  useEffect(() => {
    if (data) {
      reset({
        id: data.id as number,
        account: data.account as string,
        situationDesc: data.situationDesc as string,
        rmtResultCode: data.rmtResultCode as string | null,
        atmResultCode: data.atmResultCode as string | null,
        atmVerifyRCode: data.atmVerifyRCode as string | null,
        atmVerifyRDetail: data.atmVerifyRDetail as string | null,
        fxmlResultCode: data.fxmlResultCode as string | null,
      })
    }
  }, [data, reset])

  const handleFormSubmit = async (formData: FinanceEditFormData) => {
    const requestData = {
      action: 'U' as const,
      ...formData,
      isRmt: formData.rmtResultCode ? formData.rmtResultCode !== null && formData.rmtResultCode !== '' : false,
      isAtm: formData.atmResultCode ? formData.atmResultCode !== null && formData.atmResultCode !== '' : false,
      atmVerify: formData.atmVerifyRCode ? formData.atmVerifyRCode !== null && formData.atmVerifyRCode !== '' : false,
      isFxml: formData.fxmlResultCode ? formData.fxmlResultCode !== null && formData.fxmlResultCode !== '' : false,
    }

    await FinanceService.maintainFiscSituation(requestData)
    afterSubmit()
  }

  if (!data) return null

  return (
    <div className="w-full">
      {/* 表單卡片 */}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">

        {/* 基本資料區塊 */}
        <div className="mb-8">

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
                  {...register('rmtResultCode')}
                />
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
                  {...register('atmResultCode')}
                />
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
                  {...register('atmVerifyRCode')}
                />
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
                  {...register('atmVerifyRDetail', {
                    validate: (value) => {
                      const formValues = getValues()

                      if ((formValues.atmVerifyRCode === null || formValues.atmVerifyRCode === '') && value) {
                        return '帳號檢核空值時此欄位也必須為空'
                      }

                      if (formValues.atmVerifyRCode === '00000' && !value) {
                        return '帳號檢核為 "00000" 時此欄位為必填'
                      }
                      return true
                    },
                  })}
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
                  {...register('fxmlResultCode')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end gap-3 pt-4">
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
  )
}
