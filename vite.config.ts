import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數
  const env = loadEnv(mode, process.cwd(), '')
  const isUAT = mode === 'uat'
  const basePath = env.VITE_APP_BASE_PATH || '/'

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
      // 1. Gzip
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      // 2. Brotli
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      // 🔥 優化 1: 加入分析工具 (Build 完會產生 stats.html 讓你知道誰最胖)
      visualizer({
        open: false, // 是否自動開啟網頁，CI/CD 環境建議 false
        gzipSize: true,
        brotliSize: true,
        filename: 'stats.html',
      }),
    ],

    build: {
      // CSS 代碼分割 (預設是 true，確認一下)
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isUAT, // 只有在 Production 才移除 console
          drop_debugger: isUAT,
          passes: 2, // 🔥 新增：多壓一遍，擠出更多水分
        },
      },

      // 🔥 正式環境關閉 SourceMap
      sourcemap: !isUAT,

      rollupOptions: {
        output: {
          // 🔥 優化 3: 進階分包策略 (切碎一點，提升並行加載)
          manualChunks(id) {
            // 1. 把 React 核心獨立一包 (因為它們幾乎不會變，快取效益最大)
            if (id.includes('node_modules')) {
              // 1. 嚴格過濾 React 核心 (只抓這幾個特定的包)
              // 使用完全匹配或特定路徑匹配，避免誤殺 lucide-react
              if (
                id.includes('/node_modules/react/')
                || id.includes('/node_modules/react-dom/')
                || id.includes('/node_modules/react-router/')
                || id.includes('/node_modules/scheduler/')
              ) {
                return 'react-vendor'
              }

              // 2. 把巨大的 Icon 庫單獨切出來 (選配，如果不切就會去 vendor)
              // 這樣做的好處是，如果你只是改了業務邏輯，用戶不用重新下載這些巨大的 Icon
              if (id.includes('lucide-react')) {
                return 'icons-vendor'
              }

              // 3. 把日期和圖表庫切出來 (選配)
              if (id.includes('date-fns') || id.includes('react-day-picker')) {
                return 'utils-vendor'
              }

              // 4. 剩下的全部歸為 vendor
              return 'vendor'
            }
          },
          // 讓輸出的檔案名稱包含 hash，確保緩存更新正確
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },

      // 預警門檻，超過 1000kb 警告 (預設 500)
      chunkSizeWarningLimit: 1000,
    },

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
