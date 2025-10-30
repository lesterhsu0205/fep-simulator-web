import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { signupApi, type SignupRequest } from '@/services/AuthService'
import { Footer } from '@/components/Footer'
import transactionalDataIcon from '/transactional-data.png'

// 註冊表單資料類型
interface SignupFormData {
  username: string
  password: string
  confirmPassword: string
  email: string
  accountType: string
  roleCode: string
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      accountType: 'user',
      roleCode: 'GENERAL',
    },
  })

  const password = watch('password')

  const handleSignUp = async (data: SignupFormData) => {
    setIsLoading(true)
    try {
      const signupData: SignupRequest = {
        username: data.username,
        password: data.password,
        email: data.email,
        accountType: 'user',
        roleCode: data.roleCode,
      }

      await signupApi(signupData)
      showToast('註冊成功！即將返回登入頁面', 'success')
      // 延遲 1.5 秒後跳轉到登入頁面
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : '註冊失敗，請稍後再試'
      showToast(errorMessage, 'error')
      console.error('Signup error:', error)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <div className="hero bg-base-200 flex-1">
        <div className="hero-content flex-col lg:flex-row-reverse lg:gap-16">
          <div className="text-center lg:text-left lg:ml-8 lg:min-w-96 lg:max-w-lg">
            <div className="flex justify-center lg:justify-start mb-6">
              <img
                src={transactionalDataIcon}
                alt="Transaction icons created by nangicon - Flaticon"
                className="w-24 h-24"
              />
            </div>
            <h1 className="text-5xl font-medium">立即註冊!</h1>
            <p className="py-6 whitespace-nowrap">
              建立您的新帳戶，開始享受 FEP Simulator 的強大功能 - 快速、安全、專業的財金模擬平台。
            </p>
          </div>
          <div className="card bg-white w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <form onSubmit={handleSubmit(handleSignUp)}>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">註冊資訊</legend>

                  {/* 員工編號輸入框 */}
                  <div className="mb-4">
                    <label className="input input-bordered input-lg w-full">
                      <User size={20} className="text-gray-400" />
                      <input
                        type="text"
                        className="grow"
                        placeholder="請輸入員編(ex.BK00999)"
                        {...register('username', {
                          required: '員工編為必填項目',
                          pattern: {
                            value: /^BK\d{5}$/,
                            message: '員編格式須為大寫 BK + 5位數字 (ex.BK00999)',
                          },
                        })}
                      />
                    </label>
                    {errors.username && (
                      <p className="label text-error text-sm mt-1">{errors.username.message}</p>
                    )}
                  </div>

                  {/* 電子郵件輸入框 */}
                  <div className="mb-4">
                    <label className="input input-bordered input-lg w-full">
                      <Mail size={20} className="text-gray-400" />
                      <input
                        type="email"
                        className="grow"
                        placeholder="請輸入電子郵件"
                        {...register('email', {
                          required: '電子郵件為必填項目',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: '請輸入有效的電子郵件地址',
                          },
                        })}
                      />
                    </label>
                    {errors.email && (
                      <p className="label text-error text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* 密碼輸入框 */}
                  <div className="mb-4">
                    <label className="input input-bordered input-lg w-full">
                      <Lock size={20} className="text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="grow"
                        placeholder="請輸入密碼"
                        {...register('password', {
                          required: '密碼為必填項目',
                          minLength: { value: 6, message: '密碼至少需要6個字元' },
                          maxLength: { value: 100, message: '密碼不能超過100個字元' },
                        })}
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </label>
                    {errors.password && (
                      <p className="label text-error text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  {/* 確認密碼輸入框 */}
                  <div className="mb-4">
                    <label className="input input-bordered input-lg w-full">
                      <Lock size={20} className="text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="grow"
                        placeholder="請再次輸入密碼"
                        {...register('confirmPassword', {
                          required: '請確認密碼',
                          validate: value => value === password || '密碼不一致',
                        })}
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </label>
                    {errors.confirmPassword && (
                      <p className="label text-error text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* 部門代號輸入框（選填） */}
                  {/* <div className="mb-6">
                    <label className="input input-bordered input-lg w-full">
                      <UserCheck size={20} className="text-gray-400" />
                      <input
                        type="text"
                        className="grow"
                        placeholder="請輸入部門代號"
                        {...register('roleCode', {
                          required: '部門代號為必填項目',
                          maxLength: { value: 20, message: '部門代號不能超過20個字元' },
                        })}
                      />
                    </label>
                    {errors.roleCode && (
                      <p className="label text-error text-sm mt-1">{errors.roleCode.message}</p>
                    )}
                  </div> */}

                  {/* Sign Up 按鈕 */}
                  <button
                    type="submit"
                    className={`btn btn-primary btn-lg w-full block mt-2 ${isLoading ? 'loading' : ''}`}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    disabled={isLoading}
                  >
                    {isLoading ? '' : 'Sign Up'}
                  </button>
                </fieldset>
              </form>

              {/* 分隔線 */}
              <div className="divider">或</div>

              {/* 返回登入按鈕 */}
              <button
                type="button"
                className={`btn btn-outline btn-lg w-full block ${isLoading ? 'loading' : ''}`}
                style={{ width: '100%', boxSizing: 'border-box' }}
                onClick={handleBackToLogin}
                disabled={isLoading}
              >
                {isLoading ? '' : '返回登入'}
              </button>

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
      <Footer />
    </div>
  )
}
