import { useForm } from 'react-hook-form'
import { Save, RotateCcw } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext.tsx'
import { type TestAccountCreateFormData } from '@/models/TestAccount'
import { ApiError } from '@/error/ApiError'

interface TestAccountCreateProps {
  afterSubmit?: () => void
}

export default function TestAccountCreate({ afterSubmit }: TestAccountCreateProps) {
  const { showToast } = useToast()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TestAccountCreateFormData>({
    defaultValues: {
      account: '',
      status: '',
      type: '',
      icNo: '',
      icMemo: '',
      icC6Key: '',
      icCkey: '',
      creator: '',
    },
  })

  // 監聽各個交易設定的啟用狀態
  // const remittanceEnabled = useWatch({ control, name: 'isRmt' })
  // const proxyTransferEnabled = useWatch({ control, name: 'isAtm' })
  // const accountVerificationEnabled = useWatch({ control, name: 'atmVerify' })
  // const fxmlEnabled = useWatch({ control, name: 'isFxml' })

  const handleFormSubmit = async (formData: TestAccountCreateFormData) => {
    try {
      // TODO: 實作測試帳號建立 API 呼叫
      console.log('Form data:', formData)

      showToast('測試帳號建立成功', 'success')
      afterSubmit?.()
      reset()
    }
    catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.messageDesc
        : '建立失敗，請稍後再試'
      showToast(errorMessage, 'error')
      console.error('Create error:', error)
    }
  }

  const handleResetForm = () => {
    reset()
    showToast('表單已重置', 'info')
  }

  return (
    <div className="w-full p-6">
      <h2 className="text-lg font-semibold mb-6">新增測試帳號</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">帳號</label>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register('account')}
            />
            {errors.account && <span className="text-error text-xs">{errors.account.message}</span>}
          </div>

          <div>
            <label className="label">狀態</label>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register('status')}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleResetForm}
          >
            <RotateCcw size={16} />
            重置
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            <Save size={16} />
            新增
          </button>
        </div>
      </form>
    </div>
  )
}
