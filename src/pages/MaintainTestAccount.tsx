import DataTable, { type SearchField, type TableColumn } from '@/components/DataTable'
import { type EditFormData } from '@/components/EditForm'
import { type CreateTestAccountData } from '@/pages/CreateTestAccount'
import { ApiService } from '@/services/apiService'
import { type FiscSituation, type FiscSituationQuery } from '@/model/FiscSituation'

export default function MaintainTestAccount() {
  // 渲染表格儲存格內容的輔助函數
  const renderCellValue = (value: string | null) => {
    if (value === null || value === '' || value === undefined) {
      return <span className="badge badge-outline border-gray-300 text-xs text-gray-500">None</span>
    }
    return value
  }

  // 定義查詢表單欄位配置
  const searchFields: SearchField[] = [
    {
      key: 'account',
      label: '帳號',
      placeholder: '請輸入帳號',
      type: 'text',
    },
    {
      key: 'creator',
      label: '建立者',
      placeholder: '請輸入建立者',
      type: 'text',
    },
  ]

  // 定義表格欄位配置
  const columns: TableColumn[] = [
    {
      key: 'account',
      title: '帳號',
    },
    {
      key: 'situationDesc',
      title: '情境說明',
    },
    {
      key: 'rmtResultCode',
      title: '匯出匯款',
      render: value => renderCellValue(value as string | null),
    },
    {
      key: 'atmResultCode',
      title: '代理轉帳',
      render: value => renderCellValue(value as string | null),
    },
    {
      key: 'atmVerifyRCode',
      title: '帳號核核',
    },
    {
      key: 'atmVerifyRDetail',
      title: '帳號核檢 91-96',
    },
    {
      key: 'fxmlResultCode',
      title: 'FXML 規則',
    },
    {
      key: 'updatedAt',
      title: '最後修改時間',
    },
    {
      key: 'updater',
      title: '最後修改者',
    },
    {
      key: 'createdAt',
      title: '建立時間',
    },
    {
      key: 'creator',
      title: '建立者',
    },
  ]

  // 載入資料函數 (傳給 DataTable 使用)
  const loadFiscData = async (queryParams: FiscSituationQuery, page: number, pageSize: number) => {
    const response = await ApiService.getFiscSituationList({
      page,
      pageSize,
      ...queryParams,
    })

    return {
      data: response.fiscSituations,
      pagination: response.pagination,
    }
  }

  // delete item
  const deleteFiscData = async (_selectedIds: number[]) => {
    void _selectedIds
    // TODO: 實作 API 批次刪除邏輯
    // await batchDeleteItemsAPI(selectedIds)
  }

  // add item
  const addFiscData = async (_formData: CreateTestAccountData) => {
    void _formData
    // TODO: 實作 API 新增邏輯
    // await createTestAccountAPI(formData)
  }

  // edit item
  const editFiscData = async (_formData: EditFormData) => {
    void _formData
    // TODO: 實作 API 更新邏輯
    // await updateItemAPI(editingItem.id, formData)
  }

  return (
    <div className="w-full">
      <DataTable<FiscSituation, FiscSituationQuery>
        loadDataFn={loadFiscData}
        deleteDataFn={deleteFiscData}
        addDataFn={addFiscData}
        editDataFn={editFiscData}
        columns={columns}
        searchFields={searchFields}
      />
    </div>
  )
}
