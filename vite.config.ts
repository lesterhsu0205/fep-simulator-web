import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_APP_BASE_PATH,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        [env.VITE_API_BASE_URL_FES]: {
          target: env.VITE_API_BASE_DOMAIN,
          changeOrigin: true,
          secure: false,
        },
      },
      warmup: {
        clientFiles: [
          // 核心檔案
          './src/main.tsx',
          './src/App.tsx',
          './src/routes.tsx',

          // 路由系統（關鍵）
          './src/components/DynamicRoutes.tsx',
          './src/components/ProtectedRoute.tsx',

          // Context 與狀態管理
          './src/contexts/AuthContext.tsx',

          // 主要布局組件
          './src/components/Header.tsx',
          './src/components/Sidebar.tsx',
          './src/components/Content.tsx',
          './src/components/Footer.tsx',

          // 通用 UI 組件
          './src/components/Modal.tsx',
          './src/components/GlobalToast.tsx',
          './src/components/DataTable.tsx',
          './src/components/FinanceEditForm.tsx',

          // 主要頁面組件
          './src/pages/Login.tsx',
          './src/pages/FinanceMaintain.tsx',
          './src/pages/FinanceCreate.tsx',

          // 樣式檔案
          './src/app.css',
        ],
      },
    },
  }
})
