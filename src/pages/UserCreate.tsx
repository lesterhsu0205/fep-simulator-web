import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext.tsx'
import { type UserCreateFormData } from '@/models/User'
import { UserService } from '@/services/UserService'
import { ApiError } from '@/error/ApiError'

interface UserCreateProps {
  afterSubmit?: () => void
}

export default function UserCreate({ afterSubmit }: UserCreateProps) {
  const { showToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<UserCreateFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      accountType: 'user',
      roleCode: 'GENERAL',
      isActive: true,
    },
  })

  const password = watch('password')

  const handleFormSubmit = async (formData: UserCreateFormData) => {
    try {
      // 移除確認密碼欄位，因為它不需要傳送到 API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...apiData } = formData
      const requestData = {
        action: 'A' as const,
        ...apiData,
      }

      await UserService.maintainSystemUser(requestData)
      showToast('使用者帳戶建立成功', 'success')

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

        {/* 基本資料區塊 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">基本資料</h2>

          <div className="grid grid-cols-2 gap-8">
            {/* 左邊欄位 */}
            <div className="space-y-6">
              {/* 員工編號 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  員工編號
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="input input-bordered h-10 w-full"
                    placeholder="ex.BK00999"
                    {...register('username', {
                      required: '員工編號為必填項目',
                      pattern: {
                        value: /^[A-Za-z]{2}\d{5}$/,
                        message: '須為兩位英文字 + 5位數字 (ex.BK00999)',
                      },
                      maxLength: { value: 7, message: '員工編號不能超過7個字元' },
                    })}
                  />
                  {errors.username && (
                    <div className="text-xs text-red-500 mt-1">{errors.username.message}</div>
                  )}
                </div>
              </div>

              {/* 電子郵件 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  電子郵件
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="email"
                    className="input input-bordered h-10 w-full"
                    placeholder="請輸入電子郵件"
                    {...register('email', {
                      required: '電子郵件為必填項目',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: '請輸入有效的電子郵件地址',
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="text-xs text-red-500 mt-1">{errors.email.message}</div>
                  )}
                </div>
              </div>

              {/* 帳戶類型 */}
              {/* <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  帳戶類型
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex-1">
                  <select
                    className="select select-bordered h-10 w-full"
                    {...register('accountType', {
                      required: '帳戶類型為必填項目',
                    })}
                  >
                    <option value="user">一般使用者</option>
                    <option value="admin">系統管理員</option>
                  </select>
                  {errors.accountType && (
                    <div className="text-xs text-red-500 mt-1">{errors.accountType.message}</div>
                  )}
                </div>
              </div> */}

              {/* 啟用狀態 */}
              {/* <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  啟用狀態
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    {...register('isActive')}
                  />
                  <span className="text-sm">啟用帳戶</span>
                </label>
              </div> */}
            </div>

            {/* 右邊欄位 */}
            <div className="space-y-6">
              {/* 密碼 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  密碼
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input input-bordered h-10 w-full pr-10"
                    placeholder="請輸入密碼"
                    {...register('password', {
                      required: '密碼為必填項目',
                      minLength: { value: 8, message: '密碼至少需要8個字元' },
                      maxLength: { value: 30, message: '密碼不能超過30個字元' },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {errors.password && (
                    <div className="text-xs text-red-500 mt-1">{errors.password.message}</div>
                  )}
                </div>
              </div>

              {/* 確認密碼 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  確認密碼
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex-1 relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="input input-bordered h-10 w-full pr-10"
                    placeholder="請再次輸入密碼"
                    {...register('confirmPassword', {
                      required: '請確認密碼',
                      validate: value => value === password || '密碼不一致',
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {errors.confirmPassword && (
                    <div className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</div>
                  )}
                </div>
              </div>

              {/* 角色代碼 */}
              {/* <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-30 flex-shrink-0">
                  角色代碼
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex-1">
                  <select
                    className="select select-bordered h-10 w-full"
                    {...register('roleCode', {
                      required: '角色代碼為必填項目',
                    })}
                  >
                    <option value="GENERAL">一般使用者</option>
                    <option value="ADMIN">系統管理員</option>
                    <option value="MANAGER">主管</option>
                  </select>
                  {errors.roleCode && (
                    <div className="text-xs text-red-500 mt-1">{errors.roleCode.message}</div>
                  )}
                </div>
              </div> */}
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
