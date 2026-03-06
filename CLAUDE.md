# CLAUDE.md

此檔案為 Claude Code (claude.ai/code) 在此專案中工作時提供指導。

## 人機協作最高指導原則

請務必全程用繁體中文回應
每次都用審視的眼光，仔細看我輸入的潛在問題，你要指出我的問題，並給出明顯在我思考框架之外的建議
你要對你自己有信心，如果你覺得我說的錯得太離譜或是概念走偏，也請厲聲指證

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

主要佈局使用抽屜模式，包含 `Header`、`Content`、`Footer` 和 `Sidebar`。功能組件包括用於帳戶管理的 `FinanceMaintain` 和用於新建帳戶的 `FinanceCreate`。工具組件處理模態視窗、提示訊息和路由保護。

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

## 專案背景

1. 當進行外部機構相關之系統開發時，若需進行整合測試，僅能依外部機構測試環境既有資料(如聯徵發查)，或僅能依他行測試環境帳戶資料(如財金跨行交易、金融帳戶資訊核驗等)進行測試。可能無法滿足業務情境之測試需求。
2. 故於開行時委由廠商進行模擬器之開發，使測試人員可於模擬器依需求設定回應資料，供進行各種情境之測試。
3. 模擬器於開發時僅作為過渡期間使用，但逐漸演變回日常測試所需，其使用方便性、穩定性及效能已不敷日常使用。

## 專案目的

1. 系統整合應用部擬重新開發此模擬器，主要目的有以下
   a. 提供 Biz / IT 依測試需求建立回應資料，供 Outbound 查詢/交易測試。
   b. 提供 Biz / IT 依測試需求發動 Inbound 交易。
   c. 提供 Biz / IT 透過財金公司自主測試平台模擬他行發動跨行交易。

## 需求列表

1. Biz 可根據業務需求之測試情境，透過 Simulator 建立模擬以下外部機構回應之資料，存放於資料庫內。
   a. 聯徵中心 HTML 發查
   b. 聯徵中心 RawData 發查
   c. 財金公司 匯款匯出交易
   d. 財金公司 ATM 代理交易
   e. 財金公司 FXML 出金交易
2. Biz 於建立情境時，可選擇預先建立好的測資，減少手動輸入。
3. 當 Simulator 收到前端的請求，應根據交易性質之 Key 欄位，於資料庫內找出對應之資料並依格式回傳。
4. Biz 可根據業務需求之測試情境，透過 UI 發動模擬外部機構之請求
   a. 財金公司 匯款匯入交易
   b. 財金公司 ATM 被代理交易
   c. 財金公司 FXML 入金交易
5. Biz 可透過交易明細查詢透過此平台發動的模擬財金交易
6. Biz 可透過此系統呼叫財金 API 建立測試晶片卡資料 (卡片內容由 IT 提供)
7. Biz 可透過此系統呼叫財金 API 發動被代理交易
8. Biz 可透過交易明細查詢透過此平台發動的自主財金交易
