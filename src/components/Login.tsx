import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

// 登入表單資料類型
interface LoginFormData {
  account: string
  password: string
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showToast } = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      account: '',
      password: '',
    },
  })

  const handleSignIn = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const success = await login(data.account, data.password)
      if (success) {
        showToast('登入成功！', 'success')
        // 登入成功後導向之前嘗試訪問的頁面，或默認到首頁
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/query'
        navigate(from, { replace: true })
      }
      else {
        showToast('帳號或密碼錯誤', 'error')
      }
    }
    catch (error) {
      showToast('登入失敗，請稍後再試', 'error')
      console.error('Login error:', error)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async () => {
    setIsLoading(true)
    try {
      // 這裡可以實作註冊邏輯
      showToast('註冊功能尚未實作', 'info')
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse lg:gap-16">
        <div className="text-center lg:text-left lg:ml-8 lg:min-w-96 lg:max-w-lg">
          <h1 className="text-5xl font-bold">歡迎回來!</h1>
          <p className="py-6 whitespace-nowrap">
            請登入您的帳戶以存取 FEP Simulator - 安全、快速、便捷的模擬平台。
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">登入資訊</legend>

              {/* 帳號輸入框 */}
              <div className="form-control mb-4">
                <div className="relative">
                  <div className="input input-bordered input-lg flex items-center gap-2 w-full h-14">
                    <User size={20} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      className="w-full h-full bg-transparent border-none outline-none text-base font-sans"
                      placeholder="請輸入帳號"
                      style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        lineHeight: '1.4',
                        padding: '0',
                      }}
                      {...register('account', {
                        required: '帳號為必填項目',
                        minLength: { value: 3, message: '帳號至少需要3個字元' },
                      })}
                    />
                  </div>
                </div>
                {errors.account && (
                  <p className="label text-error text-sm">{errors.account.message}</p>
                )}
              </div>

              {/* 密碼輸入框 */}
              <div className="form-control mb-4">
                <div className="relative">
                  <div className="input input-bordered input-lg flex items-center gap-2 w-full h-14">
                    <Lock size={20} className="text-gray-400 flex-shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full h-full bg-transparent border-none outline-none text-base font-sans"
                      placeholder="請輸入密碼"
                      style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        lineHeight: '1.4',
                        padding: '0',
                      }}
                      {...register('password', {
                        required: '密碼為必填項目',
                        minLength: { value: 6, message: '密碼至少需要6個字元' },
                      })}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm flex-shrink-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="label text-error text-sm">{errors.password.message}</p>
                )}
              </div>

              {/* 忘記密碼連結 */}
              <div className="text-right mb-6">
                <a href="#" className="link link-hover">
                  忘記密碼？
                </a>
              </div>

              {/* Sign In 按鈕 */}
              <button
                type="button"
                className={`btn btn-primary btn-lg w-full mt-2 ${isLoading ? 'loading' : ''}`}
                onClick={handleSubmit(handleSignIn)}
                disabled={isLoading}
              >
                {isLoading ? '' : 'Sign In'}
              </button>

              {/* 分隔線 */}
              <div className="divider">或</div>

              {/* Sign Up 按鈕 */}
              <button
                type="button"
                className={`btn btn-outline btn-primary btn-lg w-full ${isLoading ? 'loading' : ''}`}
                onClick={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? '' : 'Sign Up'}
              </button>
            </fieldset>

            {/* 底部提示 */}
            <div className="text-center mt-6">
              <p className="text-xs text-base-content/70">
                點擊 Sign Up 即表示您同意我們的
                <a href="#" className="link link-hover text-primary"> 服務條款 </a>
                和
                <a href="#" className="link link-hover text-primary"> 隱私政策</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
