import { useForm, useWatch } from 'react-hook-form'
import { useEffect } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import { type FinanceCreateFormData } from '@/models/FiscSituation'
import { FinanceService } from '@/services/FinanceService'
import { useToast } from '@/contexts/ToastContext.tsx'
import { useAuth } from '@/contexts/AuthContext.tsx'
import { ApiError } from '@/error/ApiError'

export interface FinanceFormProps {
  mode: 'create' | 'edit'
  initialData?: Record<string, unknown>
  afterSubmit?: () => void
}

export default function FinanceForm({ mode, initialData, afterSubmit }: FinanceFormProps) {
  const { showToast } = useToast()
  const { user } = useAuth()
  const isEditMode = mode === 'edit'

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<FinanceCreateFormData>({
    defaultValues: isEditMode
      ? {}
      : {
          creator: user?.username || '',
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
          rmtResultCodeSelection: '00000',
          atmResultCodeSelection: '00000',
          atmVerifyRCodeSelection: '00000',
          fxmlResultCodeSelection: '00000',
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

  // 編輯模式：當資料變化時，重置表單
  useEffect(() => {
    if (isEditMode && initialData) {
      const editData = {
        id: initialData.id as number,
        account: initialData.account as string,
        situationDesc: initialData.situationDesc as string,
        memo: initialData.memo as string | null,

        // 根據現有資料設定交易類型啟用狀態
        isRmt: initialData.rmtResultCode ? true : null,
        rmtResultCode: initialData.rmtResultCode as string | null,
        rmtResultCodeSelection: initialData.rmtResultCode ? initialData.rmtResultCode === '00000' || initialData.rmtResultCode === '0202' ? initialData.rmtResultCode : 'custom' : '00000',

        isAtm: initialData.atmResultCode ? true : null,
        atmResultCode: initialData.atmResultCode as string | null,
        atmResultCodeSelection: initialData.atmResultCode ? initialData.atmResultCode === '00000' || initialData.atmResultCode === '4507' ? initialData.atmResultCode : 'custom' : '00000',

        atmVerify: initialData.atmVerifyRCode ? true : null,
        atmVerifyRCode: initialData.atmVerifyRCode as string | null,
        atmVerifyRCodeSelection: initialData.atmVerifyRCode ? initialData.atmVerifyRCode === '00000' || initialData.atmVerifyRCode === '2999' ? initialData.atmVerifyRCode : 'custom' : '00000',
        atmVerifyRDetail: initialData.atmVerifyRDetail as string | null,

        // 解析 atmVerifyRDetail 為三個獨立欄位 (如果是6位數字)
        atmVerifyRDetail1: initialData.atmVerifyRDetail && typeof initialData.atmVerifyRDetail === 'string' && initialData.atmVerifyRDetail.length === 6 ? initialData.atmVerifyRDetail.substring(0, 2) : null,
        atmVerifyRDetail2: initialData.atmVerifyRDetail && typeof initialData.atmVerifyRDetail === 'string' && initialData.atmVerifyRDetail.length === 6 ? initialData.atmVerifyRDetail.substring(2, 4) : null,
        atmVerifyRDetail3: initialData.atmVerifyRDetail && typeof initialData.atmVerifyRDetail === 'string' && initialData.atmVerifyRDetail.length === 6 ? initialData.atmVerifyRDetail.substring(4, 6) : null,

        isFxml: initialData.fxmlResultCode ? true : null,
        fxmlResultCode: initialData.fxmlResultCode as string | null,
        fxmlResultCodeSelection: initialData.fxmlResultCode ? initialData.fxmlResultCode === '00000' || initialData.fxmlResultCode === '2310' ? initialData.fxmlResultCode : 'custom' : '00000',
      }

      reset(editData)
    }
  }, [isEditMode, initialData, reset])

  const getDefaultValues = () => ({
    creator: user?.username || '',
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
  })

  const handleFormSubmit = async (formData: FinanceCreateFormData) => {
    try {
      // 如果匯出匯款未勾選，清空相關欄位
      if (!isRmtChecked) {
        formData.rmtResultCodeSelection = null
        formData.rmtResultCode = null
      }

      if (!isAtmChecked) {
        formData.atmResultCodeSelection = null
        formData.atmResultCode = null
      }

      if (!atmVerifyChecked) {
        formData.atmVerifyRCodeSelection = null
        formData.atmVerifyRCode = null
        formData.atmVerifyRDetail = null
        formData.atmVerifyRDetail1 = null
        formData.atmVerifyRDetail2 = null
        formData.atmVerifyRDetail3 = null
      }
      else if (atmVerifyChecked && (formData.atmVerifyRCodeSelection != '00000')) {
        formData.atmVerifyRDetail = null
        formData.atmVerifyRDetail1 = null
        formData.atmVerifyRDetail2 = null
        formData.atmVerifyRDetail3 = null
      }

      if (!isFxmlChecked) {
        formData.fxmlResultCodeSelection = null
        formData.fxmlResultCode = null
      }

      // 處理各種回應代碼的邏輯
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
        action: isEditMode ? 'U' as const : 'A' as const,
        ...processedFormData,
      }

      await FinanceService.maintainFiscSituation(requestData)

      if (isEditMode) {
        showToast('測試帳號更新成功', 'success')
      }
      else {
        showToast('測試帳號建立成功', 'success')
      }

      if (afterSubmit) {
        // 編輯模式：Modal 會關閉，組件會被銷毀，不需要重置
        afterSubmit()

        // 新增模式：重置表單以便繼續新增
        if (!isEditMode) {
          reset(getDefaultValues())
        }
      }
    }
    catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.messageDesc
        : isEditMode ? '更新失敗，請稍後再試' : '建立失敗，請稍後再試'
      showToast(errorMessage, 'error')
      console.error(`${isEditMode ? 'Update' : 'Create'} error:`, error)
    }
  }

  const handleReset = () => {
    reset(getDefaultValues())
    showToast('表單已重置', 'info')
  }

  if (isEditMode && !initialData) return null

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
              {/* 帳號 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  帳號
                  {!isEditMode && <span className="text-red-500">*</span>}
                </label>
                <div className="flex-1">
                  {isEditMode
                    ? (
                        <input
                          type="text"
                          className="input input-bordered h-10 w-full bg-gray-50"
                          value={initialData?.account as string || ''}
                          readOnly
                        />
                      )
                    : (
                        <>
                          <input
                            type="text"
                            className="input input-bordered h-10 w-full"
                            placeholder="(小於 16 長度)"
                            {...register('account', {
                              required: '帳號為必填項目',
                              maxLength: { value: 16, message: '帳號長度不可超過16碼' },
                            })}
                          />
                          {errors.account && (
                            <div className="text-xs text-red-500 mt-1">{errors.account.message}</div>
                          )}
                        </>
                      )}
                </div>
              </div>

              {/* 情境說明 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  情境說明
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered h-10 w-full"
                    placeholder="(小於 20 字)"
                    {...register('situationDesc', {
                      required: '情境說明為必填項目',
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
                    {...register('isRmt')}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">匯出匯款</span>
                </label>

                <div className="flex items-center flex-1 justify-end">
                  {isRmtChecked && (
                    <table className="border-0">
                      <tr>
                        <td className="px-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              className="radio radio-sm"
                              value="00000"
                              {...register('rmtResultCodeSelection', {
                                onChange: (e) => {
                                  if (e.target.value !== 'custom') {
                                    setValue('rmtResultCode', null)
                                  }
                                },
                              })}
                            />
                            <span className="text-sm whitespace-nowrap">交易成功</span>
                          </label>
                        </td>
                        <td className="px-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              className="radio radio-sm"
                              value="0202"
                              {...register('rmtResultCodeSelection', {
                                onChange: (e) => {
                                  if (e.target.value !== 'custom') {
                                    setValue('rmtResultCode', null)
                                  }
                                },
                              })}
                            />
                            <span className="text-sm whitespace-nowrap">交易失敗</span>
                          </label>
                        </td>
                        <td className="px-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              className="radio radio-sm"
                              value="custom"
                              {...register('rmtResultCodeSelection', {
                                onChange: (e) => {
                                  if (e.target.value !== 'custom') {
                                    setValue('rmtResultCode', null)
                                  }
                                },
                              })}
                            />
                            <span className="text-sm whitespace-nowrap">指定錯誤代碼</span>
                          </label>
                        </td>
                        <td className="px-3">
                          <div className={`${rmtResultCodeSelection === 'custom' ? 'visible' : 'invisible'}`}>
                            <input
                              type="text"
                              className="input input-bordered input-sm w-50"
                              placeholder="輸入錯誤代碼"
                              {...register('rmtResultCode', {
                                pattern: { value: /^\d+$/, message: '錯誤代碼必須為數字' },
                                maxLength: { value: 5, message: '錯誤代碼最長5位數' },
                              })}
                            />
                          </div>
                        </td>
                        <td className="px-3 w-40">
                          <div className={`text-xs text-red-500 whitespace-nowrap ${errors.rmtResultCode ? 'visible' : 'invisible'}`}>
                            {errors.rmtResultCode?.message || ''}
                          </div>
                        </td>
                      </tr>
                    </table>
                  )}
                </div>
              </div>

              {/* 代理轉帳 */}
              <div className="flex gap-4 min-h-[40px]">
                <label className="flex items-center gap-3 cursor-pointer w-32 flex-shrink-0">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    {...register('isAtm')}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">代理轉帳</span>
                </label>

                <div className="flex items-center flex-1 justify-end">
                  {isAtmChecked && (
                    <table className="border-0">
                      <tr>
                        <td className="px-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              className="radio radio-sm"
                              value="00000"
                              {...register('atmResultCodeSelection', {
                                onChange: (e) => {
                                  if (e.target.value !== 'custom') {
                                    setValue('atmResultCode', null)
                                  }
                                },
                              })}
                            />
                            <span className="text-sm whitespace-nowrap">交易成功</span>
                          </label>
                        </td>
                        <td className="px-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              className="radio radio-sm"
                              value="4507"
                              {...register('atmResultCodeSelection', {
                                onChange: (e) => {
                                  if (e.target.value !== 'custom') {
                                    setValue('atmResultCode', null)
                                  }
                                },
                              })}
                            />
                            <span className="text-sm whitespace-nowrap">交易失敗</span>
                          </label>
                        </td>
                        <td className="px-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              className="radio radio-sm"
                              value="custom"
                              {...register('atmResultCodeSelection', {
                                onChange: (e) => {
                                  if (e.target.value !== 'custom') {
                                    setValue('atmResultCode', null)
                                  }
                                },
                              })}
                            />
                            <span className="text-sm whitespace-nowrap">指定錯誤代碼</span>
                          </label>
                        </td>
                        <td className="px-3">
                          <div className={`${atmResultCodeSelection === 'custom' ? 'visible' : 'invisible'}`}>
                            <input
                              type="text"
                              className="input input-bordered input-sm w-50"
                              placeholder="輸入錯誤代碼"
                              {...register('atmResultCode', {
                                pattern: { value: /^\d+$/, message: '錯誤代碼必須為數字' },
                                maxLength: { value: 5, message: '錯誤代碼最長5位數' },
                              })}
                            />
                          </div>
                        </td>
                        <td className="px-3 w-40">
                          <div className={`text-xs text-red-500 whitespace-nowrap ${errors.atmResultCode ? 'visible' : 'invisible'}`}>
                            {errors.atmResultCode?.message || ''}
                          </div>
                        </td>
                      </tr>
                    </table>
                  )}
                </div>
              </div>

              {/* 帳號核驗 */}
              <div className="flex gap-4 min-h-[40px]">
                <label className="flex items-start gap-3 cursor-pointer w-32 flex-shrink-0 pt-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    {...register('atmVerify')}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">帳號核驗</span>
                </label>

                <div className="flex items-center flex-1 justify-end">
                  <div className="space-y-4">
                    {atmVerifyChecked && (
                      <table className="border-0">
                        <tr>
                          <td className="px-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                className="radio radio-sm"
                                value="00000"
                                {...register('atmVerifyRCodeSelection', {
                                  onChange: (e) => {
                                    if (e.target.value !== 'custom') {
                                      setValue('atmVerifyRCode', null)
                                    }
                                    // if (e.target.value === '2999' || e.target.value === 'custom') {
                                    //   setValue('atmVerifyRDetail', null)
                                    //   setValue('atmVerifyRDetail1', null)
                                    //   setValue('atmVerifyRDetail2', null)
                                    //   setValue('atmVerifyRDetail3', null)
                                    // }
                                  },
                                })}
                              />
                              <span className="text-sm whitespace-nowrap">交易成功</span>
                            </label>
                          </td>
                          <td className="px-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                className="radio radio-sm"
                                value="2999"
                                {...register('atmVerifyRCodeSelection', {
                                  onChange: (e) => {
                                    if (e.target.value !== 'custom') {
                                      setValue('atmVerifyRCode', null)
                                    }
                                  },
                                })}
                              />
                              <span className="text-sm whitespace-nowrap">交易失敗</span>
                            </label>
                          </td>
                          <td className="px-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                className="radio radio-sm"
                                value="custom"
                                {...register('atmVerifyRCodeSelection', {
                                  onChange: (e) => {
                                    if (e.target.value !== 'custom') {
                                      setValue('atmVerifyRCode', null)
                                    }
                                  },
                                })}
                              />
                              <span className="text-sm whitespace-nowrap">指定錯誤代碼</span>
                            </label>
                          </td>
                          <td className="px-3">
                            <div className={`${atmVerifyRCodeSelection === 'custom' ? 'visible' : 'invisible'}`}>
                              <input
                                type="text"
                                className="input input-bordered input-sm w-50"
                                placeholder="輸入錯誤代碼"
                                {...register('atmVerifyRCode', {
                                  pattern: { value: /^\d+$/, message: '錯誤代碼必須為數字' },
                                  maxLength: { value: 5, message: '錯誤代碼最長5位數' },
                                })}
                              />
                            </div>
                          </td>
                          <td className="px-3 w-40">
                            <div className={`text-xs text-red-500 whitespace-nowrap ${errors.atmVerifyRCode ? 'visible' : 'invisible'}`}>
                              {errors.atmVerifyRCode?.message || ''}
                            </div>
                          </td>
                        </tr>
                        {atmVerifyRCodeSelection === '00000' && (
                          <tr>
                            <td colSpan="5" className="px-3 pt-4">
                              <div className="text-sm text-gray-500 mb-3">核驗交易成功回應欄位</div>
                              <div className="flex items-center gap-8">
                                <label className="flex items-center gap-2">
                                  <span className="text-sm whitespace-nowrap">91-92:</span>
                                  <div className="relative group">
                                    <input
                                      type="text"
                                      className="input input-bordered input-sm w-30"
                                      {...register('atmVerifyRDetail1')}
                                    />
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-pre-line z-[1000] w-max">
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
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-pre-line z-[1000] w-max">
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
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-pre-line z-[1000] w-max">
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
                            </td>
                          </tr>
                        )}
                      </table>
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
                    {...register('isFxml')}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">FXML 出金</span>
                </label>

                <div className="flex items-center flex-1 justify-end">
                  {isFxmlChecked && (
                    <table className="border-0">
                      <tr>
                        <td className="px-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              className="radio radio-sm"
                              value="00000"
                              {...register('fxmlResultCodeSelection', {
                                onChange: (e) => {
                                  if (e.target.value !== 'custom') {
                                    setValue('fxmlResultCode', null)
                                  }
                                },
                              })}
                            />
                            <span className="text-sm whitespace-nowrap">交易成功</span>
                          </label>
                        </td>
                        <td className="px-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              className="radio radio-sm"
                              value="2310"
                              {...register('fxmlResultCodeSelection', {
                                onChange: (e) => {
                                  if (e.target.value !== 'custom') {
                                    setValue('fxmlResultCode', null)
                                  }
                                },
                              })}
                            />
                            <span className="text-sm whitespace-nowrap">交易失敗</span>
                          </label>
                        </td>
                        <td className="px-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              className="radio radio-sm"
                              value="custom"
                              {...register('fxmlResultCodeSelection', {
                                onChange: (e) => {
                                  if (e.target.value !== 'custom') {
                                    setValue('fxmlResultCode', null)
                                  }
                                },
                              })}
                            />
                            <span className="text-sm whitespace-nowrap">指定錯誤代碼</span>
                          </label>
                        </td>
                        <td className="px-3">
                          <div className={`${fxmlResultCodeSelection === 'custom' ? 'visible' : 'invisible'}`}>
                            <input
                              type="text"
                              className="input input-bordered input-sm w-50"
                              placeholder="輸入錯誤代碼"
                              {...register('fxmlResultCode', {
                                pattern: { value: /^\d+$/, message: '錯誤代碼必須為數字' },
                                maxLength: { value: 5, message: '錯誤代碼最長5位數' },
                              })}
                            />
                          </div>
                        </td>
                        <td className="px-3 w-40">
                          <div className={`text-xs text-red-500 whitespace-nowrap ${errors.fxmlResultCode ? 'visible' : 'invisible'}`}>
                            {errors.fxmlResultCode?.message || ''}
                          </div>
                        </td>
                      </tr>
                    </table>
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
          {!isEditMode && (
            <button
              type="button"
              className="btn btn-ghost px-6"
              onClick={handleReset}
            >
              <RotateCcw size={16} />
              重置
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary px-6"
          >
            <Save size={16} />
            {isEditMode ? '儲存' : '新增'}
          </button>
        </div>
      </form>
    </div>
  )
}
