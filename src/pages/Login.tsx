import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Footer } from '@/components/Footer'
import { getFirstAccessiblePath, isPathAccessible } from '@/utils/navigationHelper'
import { ApiError } from '@/error/ApiError'
import transactionalDataIcon from '/transactional-data.png'

// 登入表單資料類型
interface LoginFormData {
  account: string
  password: string
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useAuth()
  const { showToast } = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      account: '',
      password: '',
    },
  })

  const handleSignIn = async (data: LoginFormData) => {
    try {
      await login(data.account, data.password)
      showToast('登入成功！', 'success')

      // 延遲一點讓 AuthContext 更新完成，然後獲取最新的使用者資訊
      setTimeout(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          if (user?.menus) {
            // 檢查是否有之前嘗試訪問的頁面
            const from = (location.state as { from?: { pathname: string } })?.from?.pathname

            // 如果之前嘗試訪問的頁面有權限，就導向該頁面
            if (from && from !== '/' && isPathAccessible(from, user.menus)) {
              navigate(from, { replace: true })
              return
            }

            // 否則導向使用者有權限的第一個頁面
            const firstAccessiblePath = getFirstAccessiblePath(user.menus)
            if (firstAccessiblePath) {
              navigate(firstAccessiblePath, { replace: true })
            }
            else {
              // 如果沒有任何可訪問的頁面，顯示錯誤
              showToast('您沒有任何頁面的訪問權限，請聯繫管理員', 'error')
            }
          }
        }
      }, 100)
    }
    catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.messageDesc
        : '登入失敗，請稍後再試'
      showToast(errorMessage, 'error')
      console.error('Login error:', error)
    }
  }

  const handleSignUp = () => {
    navigate('/signup')
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
            <h1 className="text-heading">歡迎回來!</h1>
            <p className="py-6 whitespace-nowrap">
              請登入您的帳戶開始使用 FEP Simulator - 快速、安全、專業的財金模擬平台。
            </p>
          </div>
          <div className="card bg-white w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <form onSubmit={handleSubmit(handleSignIn)}>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">登入資訊</legend>

                  {/* 員工編號輸入框 */}
                  <div className="mb-4">
                    <label className="input input-bordered input-lg w-full">
                      <User size={20} className="text-gray-400" />
                      <input
                        type="text"
                        className="grow"
                        placeholder="請輸入員工編號"
                        {...register('account', {
                          required: '員工編號為必填項目',
                          pattern: {
                            value: /^[A-Za-z]{2}\d{5}$/,
                            message: '須為兩位英文字 + 5位數字 (ex.BK00999)',
                          },
                          maxLength: { value: 7, message: '員工編號不能超過7個字元' },
                        })}
                      />
                    </label>
                    {errors.account && (
                      <p className="text-form-error">{errors.account.message}</p>
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
                          minLength: { value: 8, message: '密碼至少需要8個字元' },
                          maxLength: { value: 30, message: '密碼不能超過30個字元' },
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
                      <p className="text-form-error">{errors.password.message}</p>
                    )}
                  </div>

                  {/* 忘記密碼連結 */}
                  {/* <div className="text-right mb-6">
                    <a href="#" className="link link-hover">
                      忘記密碼？
                    </a>
                  </div> */}

                  {/* 登入 按鈕 */}
                  <button
                    type="submit"
                    className={`btn btn-primary btn-lg w-full block mt-2 ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? '' : '登入'}
                  </button>
                </fieldset>
              </form>

              {/* 分隔線 */}
              <div className="divider">或</div>

              {/* 註冊 按鈕 */}
              <button
                type="button"
                className={`btn btn-outline btn-lg w-full block ${isLoading ? 'loading' : ''}`}
                onClick={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? '' : '註冊'}
              </button>

              {/* 底部提示 */}
              <div className="text-center mt-6">
                <p className="text-xs text-base-content/70">
                  點擊 註冊 即表示您同意我們的
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
