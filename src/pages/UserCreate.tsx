import { useForm } from 'react-hook-form'
import { Save, RotateCcw } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext.tsx'
import { type UserCreateFormData } from '@/models/User'
import { UserService } from '@/services/UserService'

interface UserCreateProps {
  afterSubmit?: () => void
}

export default function UserCreate({ afterSubmit }: UserCreateProps) {
  const { showToast } = useToast()

  const { handleSubmit, reset } = useForm<UserCreateFormData>({
    defaultValues: {
      email: '',
      accountType: '',
      isActive: false,
      roleCode: '',
    },
  })

  const handleFormSubmit = async (formData: UserCreateFormData) => {
    try {
      const requestData = {
        action: 'A' as const,
        ...formData,
      }

      await UserService.maintainSystemUser(requestData)
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
