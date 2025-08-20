# FEP Simulator Web

一個用於模擬前置作業處理器（Front End Processor）的網頁應用程式，主要用於銀行或金融機構的測試帳號管理和交易模擬。

## 功能特色

- **測試帳號管理**：提供完整的測試帳號維護功能
- **動態路由系統**：支援動態路由配置和側邊欄導航
- **用戶認證**：內建登入系統和受保護的路由
- **響應式設計**：支援桌面和行動裝置的響應式介面
- **資料表格**：具備搜尋、排序和編輯功能的資料表格
- **表單驗證**：使用 React Hook Form 進行表單驗證和管理
- **Toast 通知**：全域 Toast 通知系統

## 技術架構

- **前端框架**：React 19 + TypeScript
- **建構工具**：Vite 6
- **路由管理**：React Router v7
- **UI 框架**：DaisyUI + TailwindCSS v4
- **表單處理**：React Hook Form
- **HTTP 客戶端**：Axios
- **圖示庫**：Lucide React
- **字型**：思源黑體（Noto Sans TC）

## 安裝說明

### 系統需求

- Node.js >= 18
- pnpm（推薦）或 npm/yarn

### 安裝步驟

1.複製專案

```bash
git clone <repository-url>
cd feb-simulator-web
```

2.安裝相依套件

```bash
pnpm install
```

3.啟動開發伺服器

```bash
pnpm run local
```

4.開啟瀏覽器訪問 `http://localhost:5173`

## 開發指令

- `pnpm run local` - 啟動開發伺服器
- `pnpm run build` - 建構生產版本
- `pnpm run lint` - 執行 ESLint 檢查
- `pnpm run preview` - 預覽建構後的應用程式

## 專案結構

```sh
src/
├── components/            # React 元件
│   ├── Content.tsx        # 主要內容元件
│   ├── DataTable.tsx      # 資料表格元件
│   ├── DynamicRoutes.tsx  # 動態路由元件
│   ├── Sidebar.tsx        # 動態側邊欄
│   ├── Header.tsx         # 頁面標題元件
│   ├── Login.tsx          # 登入元件
│   └── ...
├── contexts/              # React Context
│   ├── AuthContext.tsx    # 認證上下文
│   └── ToastContext.tsx   # Toast 通知上下文
├── services/              # API 服務
│   ├── ApiService.ts      # axios 實例
│   ├── AuthService.ts     # 認證服務
│   ├── CreditService.ts   # 聯徵服務
│   └── FinanceService.ts  # 財金服務
├── assets/                # 靜態資源
├── App.tsx                # 主應用程式元件
├── Main.tsx               # 應用程式入口點
└── routes.tsx             # 路由配置
```

## 登入資訊

測試用登入帳號：

- 帳號：lester
- 密碼：password

## 開發說明

### 路由系統

本專案使用動態路由系統，路由配置在 `routes.tsx` 中定義。主要路由包括：

- `/login` - 登入頁面
- `/TEST_ACCT_MAINT` - 測試帳號維護（預設首頁）

### 認證系統

使用 React Context 進行狀態管理，所有受保護的路由都會經過 `ProtectedRoute` 元件驗證。

### 樣式系統

- 使用 TailwindCSS v4 作為 CSS 框架
- DaisyUI 提供預設的 UI 元件樣式
- 支援深色/淺色主題切換
- 響應式設計適配不同螢幕尺寸

### 表單處理

使用 React Hook Form 處理表單驗證和提交，提供良好的使用者體驗和效能。

## 貢獻指南

1. Fork 本專案
2. 建立新的功能分支 (`git checkout -b feature/new-feature`)
3. 提交變更 (`git commit -am 'Add new feature'`)
4. 推送到分支 (`git push origin feature/new-feature`)
5. 建立 Pull Request

## 授權條款

本專案採用私有授權，請勿未經授權使用或分發。
