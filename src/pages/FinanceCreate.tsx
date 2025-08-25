import { useForm, useWatch } from 'react-hook-form'
import { Save, RotateCcw } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext.tsx'
import { type FinanceCreateFormData } from '@/model/FiscSituation'
import { FinanceService } from '@/services/FinanceService'

interface FinanceCreateProps {
  afterSubmit?: () => void
}

export default function FinanceCreate({ afterSubmit }: FinanceCreateProps) {
  const { showToast } = useToast()

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<FinanceCreateFormData>({
    defaultValues: {
      creator: '',
      // creatorUnit: '',
      account: '',
      situationDesc: '',
      memo: null,
      isRmt: null,
      rmtResultCode: null,
      isAtm: null,
      atmResultCode: null,
      atmVerify: null,
      atmVerifyRCode: null,
      atmVerifyRDetail: null,
      atmVerifyRDetail1: null,
      atmVerifyRDetail2: null,
      atmVerifyRDetail3: null,
      isFxml: null,
      fxmlResultCode: null,

      rmtResultCodeSelection: null,
      atmResultCodeSelection: null,
      atmVerifyRCodeSelection: null,
      fxmlResultCodeSelection: null,
    },
  })

  // 監聽各個交易設定的啟用狀態
  const isRmtChecked = useWatch({ control, name: 'isRmt' })
  const isAtmChecked = useWatch({ control, name: 'isAtm' })
  const atmVerifyChecked = useWatch({ control, name: 'atmVerify' })
  const isFxmlChecked = useWatch({ control, name: 'isFxml' })

  const rmtResultCodeSelection = useWatch({ control, name: 'rmtResultCodeSelection' })
  const atmResultCodeSelection = useWatch({ control, name: 'atmResultCodeSelection' })
  const atmVerifyRCodeSelection = useWatch({ control, name: 'atmVerifyRCodeSelection' })
  const fxmlResultCodeSelection = useWatch({ control, name: 'fxmlResultCodeSelection' })

  const handleFormSubmit = async (formData: FinanceCreateFormData) => {
    try {
      // FIXME: 尚須檢查有打勾但沒 result code 情形

      // 處理帳號驗證回應代碼的邏輯，如果是 custom，已經由文字輸入框設定
      const processedFormData = { ...formData }
      if (formData.rmtResultCodeSelection === '00000' || formData.rmtResultCodeSelection === '0202') {
        processedFormData.rmtResultCode = formData.rmtResultCodeSelection
      }

      if (formData.atmResultCodeSelection === '00000' || formData.atmResultCodeSelection === '4507') {
        processedFormData.atmResultCode = formData.atmResultCodeSelection
      }

      if (formData.atmVerifyRCodeSelection === '00000' || formData.atmVerifyRCodeSelection === '2999') {
        processedFormData.atmVerifyRCode = formData.atmVerifyRCodeSelection
      }

      if (formData.atmVerifyRCodeSelection === '00000') {
        processedFormData.atmVerifyRDetail = `${formData.atmVerifyRDetail1 || ''}${formData.atmVerifyRDetail2 || ''}${formData.atmVerifyRDetail3 || ''}`
      }

      if (formData.fxmlResultCodeSelection === '00000' || formData.fxmlResultCodeSelection === '2310') {
        processedFormData.fxmlResultCode = formData.fxmlResultCodeSelection
      }

      const requestData = {
        action: 'A' as const,
        ...processedFormData,
      }

      await FinanceService.maintainFiscSituation(requestData)
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

              {/* 帳號 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
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

              {/* 情境說明 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
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

            {/* 右邊欄位 - 補充說明 */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0 pt-2.5">
                  補充說明
                </label>
                <div className="flex-1">
                  <textarea
                    className="textarea textarea-bordered h-32 resize-none w-full"
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
          </div>
        </div>

        {/* 交易設定區塊 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">交易設定</h2>

          <div className="grid grid-cols-2 gap-8">
            {/* 左欄 - 交易設定項目 */}
            <div className="space-y-6">
              {/* 匯出匯款 */}
              <div className="flex gap-4 min-h-[40px]">
                <label className="flex items-center gap-3 cursor-pointer w-32 flex-shrink-0">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    {...register('isRmt', {
                      onChange: (e) => {
                        if (!e.target.checked) {
                          setValue('rmtResultCodeSelection', null)
                          setValue('rmtResultCode', null)
                        }
                      },
                    })}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">匯出匯款</span>
                </label>

                <div className="flex items-center flex-1 justify-end">
                  {isRmtChecked && (
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="00000"
                          {...register('rmtResultCodeSelection')}
                        />
                        <span className="text-sm whitespace-nowrap">交易成功</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="0202"
                          {...register('rmtResultCodeSelection')}
                        />
                        <span className="text-sm whitespace-nowrap">交易失敗</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="custom"
                          {...register('rmtResultCodeSelection')}
                        />
                        <span className="text-sm whitespace-nowrap">指定錯誤代碼</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm w-50"
                        placeholder="輸入錯誤代碼"
                        disabled={rmtResultCodeSelection !== 'custom'}
                        {...register('rmtResultCode')}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 代理轉帳 */}
              <div className="flex gap-4 min-h-[40px]">
                <label className="flex items-center gap-3 cursor-pointer w-32 flex-shrink-0">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    {...register('isAtm', {
                      onChange: (e) => {
                        if (!e.target.checked) {
                          setValue('atmResultCodeSelection', null)
                          setValue('atmResultCode', null)
                        }
                      },
                    })}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">代理轉帳</span>
                </label>

                <div className="flex items-center flex-1 justify-end">
                  {isAtmChecked && (
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="00000"
                          {...register('atmResultCodeSelection')}
                        />
                        <span className="text-sm whitespace-nowrap">交易成功</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="4507"
                          {...register('atmResultCodeSelection')}
                        />
                        <span className="text-sm whitespace-nowrap">交易失敗</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="custom"
                          {...register('atmResultCodeSelection')}
                        />
                        <span className="text-sm whitespace-nowrap">指定錯誤代碼</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm w-50"
                        placeholder="輸入錯誤代碼"
                        disabled={atmResultCodeSelection !== 'custom'}
                        {...register('atmResultCode')}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 帳號驗證 */}
              <div className="flex gap-4 min-h-[40px]">
                <label className="flex items-start gap-3 cursor-pointer w-32 flex-shrink-0 pt-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    {...register('atmVerify', {
                      onChange: (e) => {
                        if (!e.target.checked) {
                          setValue('atmVerifyRCodeSelection', null)
                          setValue('atmVerifyRCode', null)
                          setValue('atmVerifyRDetail', null)
                          setValue('atmVerifyRDetail1', null)
                          setValue('atmVerifyRDetail2', null)
                          setValue('atmVerifyRDetail3', null)
                        }
                      },
                    })}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">帳號驗證</span>
                </label>

                <div className="flex items-center flex-1 justify-end">

                  <div className="space-y-4">
                    {atmVerifyChecked && (
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            className="radio radio-sm"
                            value="00000"
                            {...register('atmVerifyRCodeSelection', {
                              onChange: (e) => {
                                if (e.target.value === '2999' || e.target.value === 'custom') {
                                  setValue('atmVerifyRDetail', null)
                                  setValue('atmVerifyRDetail1', null)
                                  setValue('atmVerifyRDetail2', null)
                                  setValue('atmVerifyRDetail3', null)
                                }
                              },
                            })}
                          />
                          <span className="text-sm whitespace-nowrap">交易成功</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            className="radio radio-sm"
                            value="2999"
                            {...register('atmVerifyRCodeSelection', {
                              onChange: (e) => {
                                if (e.target.value === '2999' || e.target.value === 'custom') {
                                  setValue('atmVerifyRDetail', null)
                                  setValue('atmVerifyRDetail1', null)
                                  setValue('atmVerifyRDetail2', null)
                                  setValue('atmVerifyRDetail3', null)
                                }
                              },
                            })}
                          />
                          <span className="text-sm whitespace-nowrap">交易失敗</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            className="radio radio-sm"
                            value="custom"
                            {...register('atmVerifyRCodeSelection', {
                              onChange: (e) => {
                                if (e.target.value === '2999' || e.target.value === 'custom') {
                                  setValue('atmVerifyRDetail', null)
                                  setValue('atmVerifyRDetail1', null)
                                  setValue('atmVerifyRDetail2', null)
                                  setValue('atmVerifyRDetail3', null)
                                }
                              },
                            })}
                          />
                          <span className="text-sm whitespace-nowrap">指定錯誤代碼</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered input-sm w-50"
                          placeholder="輸入錯誤代碼"
                          disabled={atmVerifyRCodeSelection !== 'custom'}
                          {...register('atmVerifyRCode')}
                        />
                      </div>
                    )}

                    {atmVerifyChecked && atmVerifyRCodeSelection === '00000' && (
                      <div>
                        <div className="text-sm text-gray-500 mb-3 flex">檢驗交易成功回應欄位</div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2">
                            <span className="text-sm whitespace-nowrap">91-92:</span>
                            <div className="relative group">
                              <input
                                type="text"
                                className="input input-bordered input-sm w-30"
                                {...register('atmVerifyRDetail1')}
                              />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-pre-line z-10 w-max">
                                {`核驗結果
                                  -----------
                                  00 核驗成功
                                  01 身分證或外來人口統一證號或營利事業統一編號有誤
                                  02 持卡人之行動電話號碼有誤
                                  03 持卡人之出生年月日有誤
                                  04 持卡人之住家電話號碼有誤
                                  99 無指定之核驗項目或未核驗指定項目之內容`}
                              </div>
                            </div>
                          </label>
                          <label className="flex items-center gap-2">
                            <span className="text-sm whitespace-nowrap">93-94:</span>
                            <div className="relative group">
                              <input
                                type="text"
                                className="input input-bordered input-sm w-30"
                                {...register('atmVerifyRDetail2')}
                              />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-pre-line z-10 w-max">
                                {`帳號核驗結果
                                  -----------------
                                  00 帳號核驗成功
                                  01 該卡片之帳號為問題帳戶
                                  99 狀態不明或未核驗帳號`}
                              </div>
                            </div>
                          </label>
                          <label className="flex items-center gap-2">
                            <span className="text-sm whitespace-nowrap">95-96:</span>
                            <div className="relative group">
                              <input
                                type="text"
                                className="input input-bordered input-sm w-30"
                                {...register('atmVerifyRDetail3')}
                              />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-pre-line z-10 w-max">
                                {`開戶狀態
                                  -----------
                                  01 臨櫃開立之存款帳戶
                                  02 數位存款帳戶
                                  03 電子支付帳戶
                                  05 臨櫃VTM(多功能視訊櫃檯)開立之存款帳戶
                                  10 第一類數位存款帳戶得支援高風險交易
                                  11 第一類數位存款帳戶僅支援低風險交易
                                  12 第二類數位存款帳戶
                                  13 第三類數位存款帳戶
                                  99 無法確認開戶狀態`}
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              </div>

              {/* FXML 出金 */}
              <div className="flex gap-4 min-h-[40px]">
                <label className="flex items-center gap-3 cursor-pointer w-32 flex-shrink-0">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    {...register('isFxml', {
                      onChange: (e) => {
                        if (!e.target.checked) {
                          setValue('fxmlResultCodeSelection', null)
                          setValue('fxmlResultCode', null)
                        }
                      },
                    })}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">FXML 出金</span>
                </label>

                <div className="flex items-center flex-1 justify-end">
                  {isFxmlChecked && (
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="00000"
                          {...register('fxmlResultCodeSelection')}
                        />
                        <span className="text-sm whitespace-nowrap">交易成功</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="2310"
                          {...register('fxmlResultCodeSelection')}
                        />
                        <span className="text-sm whitespace-nowrap">交易失敗</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="radio radio-sm"
                          value="custom"
                          {...register('fxmlResultCodeSelection')}
                        />
                        <span className="text-sm whitespace-nowrap">指定錯誤代碼</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm w-50"
                        placeholder="輸入錯誤代碼"
                        disabled={fxmlResultCodeSelection !== 'custom'}
                        {...register('fxmlResultCode')}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 右欄 - 預留空間 */}
              <div>
                {/* 未來功能預留區域 */}
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
  )
}
