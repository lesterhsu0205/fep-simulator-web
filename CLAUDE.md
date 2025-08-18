# CLAUDE.md

此檔案為 Claude Code (claude.ai/code) 在此專案中工作時提供指導。

## 開發指令

- `pnpm run local` - 啟動開發伺服器 (運行於 <http://localhost:5173>)
- `pnpm run build` - 正式環境建置 (TypeScript 編譯 + Vite 建置)
- `pnpm run lint` - 執行 ESLint 檢查
- `pnpm run preview` - 預覽正式環境建置結果

此專案未設定測試指令。

## 架構概述

這是一個基於 React 的銀行測試帳戶管理 FEP (Front End Processor) 模擬器。應用程式使用動態路由系統，可用路由與導航由驗證時收到的使用者權限決定。

### 動態路由系統

核心架構模式是基於權限的動態路由系統：

- **路由生成**：`DynamicRoutes.tsx` 僅為 `implementedPaths` 陣列中列出的路徑生成路由 (目前為 `/TEST_ACCT_MAINT`、`/TEST_ACCT_CREATE`)
- **選單渲染**：`Sidebar.tsx` 根據使用者的選單資料渲染導航，但將未實作的路由標記為停用
- **組件映射**：路由透過 `DynamicRoutes.tsx` 中的 `getComponentForPath()` 函數映射到組件

新增路由步驟：將路徑新增至 `implementedPaths` 陣列，在 `getComponentForPath()` 中新增組件映射，確保使用者選單資料包含該路徑。

### 身份驗證與狀態管理

- **模擬身份驗證**：根據登入憑證使用靜態 JSON 檔案 (`/public/api_login.json`、`/public/api_login_2.json`)
- **Context 模式**：身份驗證狀態透過 `AuthContext.tsx` 管理，具備 localStorage 持久化功能
- **測試憑證**：
  - angus/3345678 → api_login.json
  - lester/3345678 → api_login_2.json
- **保護路由**：除 `/login` 外的所有路由都需要透過 `ProtectedRoute` 包裝器進行身份驗證

### 關鍵技術細節

- **匯入別名**：`@/` 解析至 `/src` 目錄
- **UI 框架**：DaisyUI + TailwindCSS v4，具有基於抽屜的響應式導航
- **表單處理**：使用 React Hook Form 進行驗證與提交
- **開發伺服器**：設定為在 0.0.0.0 運行，具備 Vite 預熱功能以加快開發速度

### 組件架構

主要佈局使用抽屜模式，包含 `Header`、`Content`、`Footer` 和 `Sidebar`。功能組件包括用於帳戶管理的 `MaintainTestAccount` 和用於新建帳戶的 `CreateTestAccount`。工具組件處理模態視窗、提示訊息和路由保護。

## TypeScript 編碼規範

### 類型導出原則

- **Interface 導出**：直接使用 `export interface` 語法

  ```typescript
  export interface UserData {
    id: number
    name: string
  }
  ```

- **Type 導出**：直接使用 `export type` 語法  

  ```typescript
  export type LoadFunction = (id: number) => Promise<Data>
  ```

- **避免批量導出**：不要使用 `export type { Interface1, Interface2 }` 語法，直接在定義時導出更清晰
