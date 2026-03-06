import { Eye, EyeOff, RotateCcw, Save } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '@/contexts/ToastContext.tsx'
import { ApiError } from '@/error/ApiError'
import type { UserCreateFormData } from '@/models/User'
import { UserService } from '@/services/UserService'

interface UserCreateProps {
  afterSubmit?: () => void
}

export default function UserCreate({ afterSubmit }: UserCreateProps) {
  const { showToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<UserCreateFormData>({
    defaultValues: {
      accountType: 'user',
      confirmPassword: '',
      email: '',
      isActive: true,
      password: '',
      roleCode: 'GENERAL',
      username: ''
    }
  })

  const password = watch('password')

  const handleFormSubmit = async (formData: UserCreateFormData) => {
    try {
      // 移除確認密碼欄位，因為它不需要傳送到 API
      const { confirmPassword, ...apiData } = formData
      const requestData = {
        action: 'A' as const,
        ...apiData
      }

      await UserService.maintainSystemUser(requestData)
      showToast('使用者帳戶建立成功', 'success')

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
        {/* 基本資料區塊 */}
        <div className="mb-8">
          <h2 className="text-card-title mb-6">基本資料</h2>

          <div className="grid grid-cols-2 gap-8">
            {/* 左邊欄位 */}
            <div className="space-y-6">
              {/* 員工編號 */}
              <div className="flex items-center gap-4">
                <span className="text-form-label w-30 shrink-0">
                  員工編號
                  <span className="text-form-required">*</span>
                </span>
                <div className="flex-1">
                  <input
                    className="input input-bordered h-10 w-full"
                    placeholder="ex.BK00999"
                    type="text"
                    {...register('username', {
                      maxLength: { message: '員工編號不能超過7個字元', value: 7 },
                      pattern: {
                        message: '須為兩位英文字 + 5位數字 (ex.BK00999)',
                        value: /^[A-Za-z]{2}\d{5}$/
                      },
                      required: '員工編號為必填項目'
                    })}
                  />
                  {errors.username && <div className="text-form-error">{errors.username.message}</div>}
                </div>
              </div>

              {/* 電子郵件 */}
              <div className="flex items-center gap-4">
                <span className="text-form-label w-30 shrink-0">
                  電子郵件
                  <span className="text-form-required">*</span>
                </span>
                <div className="flex-1">
                  <input
                    className="input input-bordered h-10 w-full"
                    placeholder="請輸入電子郵件"
                    type="email"
                    {...register('email', {
                      pattern: {
                        message: '請輸入有效的電子郵件地址',
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                      },
                      required: '電子郵件為必填項目'
                    })}
                  />
                  {errors.email && <div className="text-form-error">{errors.email.message}</div>}
                </div>
              </div>

              {/* 帳戶類型 */}
              {/* <div className="flex items-center gap-4">
                <label className="text-form-label w-30 flex-shrink-0">
                  帳戶類型
                  <span className="text-form-required">*</span>
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
                    <div className="text-form-error">{errors.accountType.message}</div>
                  )}
                </div>
              </div> */}

              {/* 啟用狀態 */}
              {/* <div className="flex items-center gap-4">
                <label className="text-form-label w-30 flex-shrink-0">
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
                <span className="text-form-label w-30 shrink-0">
                  密碼
                  <span className="text-form-required">*</span>
                </span>
                <div className="flex-1 relative">
                  <input
                    className="input input-bordered h-10 w-full pr-10"
                    placeholder="請輸入密碼"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      maxLength: { message: '密碼不能超過30個字元', value: 30 },
                      minLength: { message: '密碼至少需要8個字元', value: 8 },
                      required: '密碼為必填項目'
                    })}
                  />
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {errors.password && <div className="text-form-error">{errors.password.message}</div>}
                </div>
              </div>

              {/* 確認密碼 */}
              <div className="flex items-center gap-4">
                <span className="text-form-label w-30 shrink-0">
                  確認密碼
                  <span className="text-form-required">*</span>
                </span>
                <div className="flex-1 relative">
                  <input
                    className="input input-bordered h-10 w-full pr-10"
                    placeholder="請再次輸入密碼"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: '請確認密碼',
                      validate: (value) => value === password || '密碼不一致'
                    })}
                  />
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {errors.confirmPassword && <div className="text-form-error">{errors.confirmPassword.message}</div>}
                </div>
              </div>

              {/* 角色代碼 */}
              {/* <div className="flex items-center gap-4">
                <label className="text-form-label w-30 flex-shrink-0">
                  角色代碼
                  <span className="text-form-required">*</span>
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
                    <div className="text-form-error">{errors.roleCode.message}</div>
                  )}
                </div>
              </div> */}
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
