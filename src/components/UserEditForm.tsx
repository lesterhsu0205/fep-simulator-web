import { Save } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { EditFormProps } from '@/components/DataTable'
import type { UserEditFormData } from '@/models/User'
import { UserService } from '@/services/UserService'

export default function UserEditForm({ data, afterSubmit }: EditFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserEditFormData>()

  // 當資料變化時，重置表單
  useEffect(() => {
    if (data) {
      reset({
        username: data.username as string,
        email: data.email as string
      })
    }
  }, [data, reset])

  const handleFormSubmit = async (formData: UserEditFormData) => {
    const requestData = {
      action: 'U' as const,
      id: data?.id as number,
      username: formData.username,
      email: formData.email
    }

    await UserService.maintainSystemUser(requestData)
    afterSubmit()
  }

  if (!data) return null

  return (
    <div className="w-full">
      {/* 表單卡片 */}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
        {/* 基本資料區塊 */}
        <div className="mb-8">
          {/* 用戶名稱 */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-form-label w-20 shrink-0">
              名稱
              <span className="text-form-required">*</span>
            </span>
            <div className="flex-1">
              <input
                type="text"
                className="input input-bordered h-10 w-full"
                {...register('username', { required: '名稱為必填項目' })}
              />
              {errors.username && <div className="text-form-error">{errors.username.message}</div>}
            </div>
          </div>

          {/* 電子郵件 */}
          <div className="flex items-center gap-4">
            <span className="text-form-label w-20 shrink-0">
              電子郵件
              <span className="text-form-required">*</span>
            </span>
            <div className="flex-1">
              <input
                type="email"
                className="input input-bordered h-10 w-full"
                {...register('email', {
                  required: '電子郵件為必填項目',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '請輸入有效的電子郵件格式'
                  }
                })}
              />
              {errors.email && <div className="text-form-error">{errors.email.message}</div>}
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
