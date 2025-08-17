import { useForm, useWatch } from 'react-hook-form'
import { Save, RotateCcw } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext.tsx'

// 使用 API 原始格式的建立測試帳號資料類型
export interface CreateTestAccountData {
  account: string
  situationDesc: string
  memo: string | null
  isRmt: boolean | null
  rmtResultCode: string | null
  isAtm: boolean | null
  atmResultCode: string | null
  atmVerify: boolean | null
  atmVerifyRCode: string | null
  atmVerifyRDetail: string | null
  isFxml: boolean | null
  fxmlResultCode: string | null
  creator: string | null
  creatorUnit: string
}

interface CreateTestAccountProps {
  onSubmit?: (data: CreateTestAccountData) => void
  onCancel?: () => void
}

export default function CreateTestAccount({ onSubmit }: CreateTestAccountProps) {
  const { showToast } = useToast()

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateTestAccountData>({
    defaultValues: {
      creator: '',
      creatorUnit: '',
      account: '',
      situationDesc: '',
      memo: '',
      isRmt: null,
      rmtResultCode: null,
      isAtm: null,
      atmResultCode: null,
      atmVerify: null,
      atmVerifyRCode: null,
      atmVerifyRDetail: null,
      isFxml: null,
      fxmlResultCode: null,
    },
  })

  // 監聽各個交易設定的啟用狀態
  const remittanceEnabled = useWatch({ control, name: 'isRmt' })
  const proxyTransferEnabled = useWatch({ control, name: 'isAtm' })
  const accountVerificationEnabled = useWatch({ control, name: 'atmVerify' })
  const fxmlEnabled = useWatch({ control, name: 'isFxml' })

  const handleFormSubmit = async (formData: CreateTestAccountData) => {
    try {
      showToast('測試帳號建立成功', 'success')
      onSubmit?.(formData)
      reset()
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
      <div className="bg-white rounded-lg shadow border-0">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">

          {/* 基本資料區塊 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">基本資料</h2>

            {/* 第一行：建立者、建立者單位 */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700 font-medium w-16 flex-shrink-0">
                  建立者
                </label>
                <input
                  type="text"
                  className="input input-bordered h-10 flex-1"
                  {...register('creator')}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700 font-medium w-20 flex-shrink-0">
                  建立者單位
                </label>
                <input
                  type="text"
                  className="input input-bordered h-10 flex-1"
                  {...register('creatorUnit')}
                />
              </div>
            </div>

            {/* 第二行：帳號、補充說明 */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700 font-medium w-16 flex-shrink-0">
                  帳號
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered h-10 w-full"
                    placeholder="(小於 16 長度)"
                    {...register('account', {
                      maxLength: { value: 16, message: '帳號長度不可超過16碼' },
                    })}
                  />
                  {errors.account && (
                    <div className="text-xs text-red-500 mt-1">{errors.account.message}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <label className="text-sm text-gray-700 font-medium w-20 flex-shrink-0 mt-2">
                  補充說明
                </label>
                <div className="flex-1">
                  <textarea
                    className="textarea textarea-bordered h-20 resize-none w-full"
                    placeholder="(小於 100 字)"
                    {...register('memo', {
                      maxLength: { value: 100, message: '補充說明不可超過100字' },
                    })}
                  />
                  {errors.memo && (
                    <div className="text-xs text-red-500 mt-1">{errors.memo.message}</div>
                  )}
                </div>
              </div>
            </div>

            {/* 第三行：情境說明 */}
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700 font-medium w-16 flex-shrink-0">
                  情境說明
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered h-10 w-full"
                    placeholder="(小於 20 字)"
                    {...register('situationDesc', {
                      maxLength: { value: 20, message: '情境說明不可超過20字' },
                    })}
                  />
                  {errors.situationDesc && (
                    <div className="text-xs text-red-500 mt-1">{errors.situationDesc.message}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 交易設定區塊 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">交易設定</h2>

            <div className="space-y-6">
              {/* 匯出匯款 */}
              <div className="grid grid-cols-[180px_1fr] gap-8 min-h-[40px]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    {...register('isRmt')}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">匯出匯款</span>
                </label>

                <div className="flex items-center">
                  {remittanceEnabled && (
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="00000"
                          {...register('rmtResultCode')}
                        />
                        <span className="text-sm whitespace-nowrap">交易成功</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="99999"
                          {...register('rmtResultCode')}
                        />
                        <span className="text-sm whitespace-nowrap">交易失敗</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="custom"
                          {...register('rmtResultCode')}
                        />
                        <span className="text-sm whitespace-nowrap">指定錯誤代碼</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm w-20"
                        {...register('rmtResultCode')}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 代理轉帳 */}
              <div className="grid grid-cols-[180px_1fr] gap-8 min-h-[40px]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    {...register('isAtm')}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">代理轉帳</span>
                </label>

                <div className="flex items-center">
                  {proxyTransferEnabled && (
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="00000"
                          {...register('atmResultCode')}
                        />
                        <span className="text-sm whitespace-nowrap">交易成功</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="99999"
                          {...register('atmResultCode')}
                        />
                        <span className="text-sm whitespace-nowrap">交易失敗</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="custom"
                          {...register('atmResultCode')}
                        />
                        <span className="text-sm whitespace-nowrap">指定錯誤代碼</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm w-20"
                        {...register('atmResultCode')}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 帳號驗證 */}
              <div className="grid grid-cols-[180px_1fr] gap-8 min-h-[40px]">
                <label className="flex items-start gap-3 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    {...register('atmVerify')}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">帳號驗證</span>
                </label>

                <div className="flex flex-col justify-start py-1">
                  {accountVerificationEnabled && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            className="radio radio-sm"
                            value="00000"
                            {...register('atmVerifyRCode')}
                          />
                          <span className="text-sm whitespace-nowrap">交易成功</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            className="radio radio-sm"
                            value="99999"
                            {...register('atmVerifyRCode')}
                          />
                          <span className="text-sm whitespace-nowrap">交易失敗</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            className="radio radio-sm"
                            value="custom"
                            {...register('atmVerifyRCode')}
                          />
                          <span className="text-sm whitespace-nowrap">指定錯誤代碼</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered input-sm w-20"
                          {...register('atmVerifyRCode')}
                        />
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 mb-3">檢驗交易成功回應欄位</div>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2">
                            <span className="text-sm whitespace-nowrap">91-92:</span>
                            <input
                              type="text"
                              className="input input-bordered input-sm w-16"
                              {...register('atmVerifyRDetail')}
                            />
                          </label>
                          <label className="flex items-center gap-2">
                            <span className="text-sm whitespace-nowrap">93-94:</span>
                            <input
                              type="text"
                              className="input input-bordered input-sm w-16"
                              disabled
                              placeholder="固定欄位"
                            />
                          </label>
                          <label className="flex items-center gap-2">
                            <span className="text-sm whitespace-nowrap">95-96:</span>
                            <input
                              type="text"
                              className="input input-bordered input-sm w-16"
                              disabled
                              placeholder="固定欄位"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FXML 出金 */}
              <div className="grid grid-cols-[180px_1fr] gap-8 min-h-[40px]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    {...register('isFxml')}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">FXML 出金</span>
                </label>

                <div className="flex items-center">
                  {fxmlEnabled && (
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="00000"
                          {...register('fxmlResultCode')}
                        />
                        <span className="text-sm whitespace-nowrap">交易成功</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="99999"
                          {...register('fxmlResultCode')}
                        />
                        <span className="text-sm whitespace-nowrap">交易失敗</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="custom"
                          {...register('fxmlResultCode')}
                        />
                        <span className="text-sm whitespace-nowrap">指定錯誤代碼</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm w-20"
                        {...register('fxmlResultCode')}
                      />
                    </div>
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

    </div>
  )
}
