import DataTable, { type SearchField, type TableColumn, type LoadDataFunction } from '@/components/DataTable'
import { type EditFormData } from '@/components/EditForm'
import { type FiscSituation, type FiscSituationQuery } from '@/model/FiscSituation'
import { FinanceService } from '@/services/FinanceService'
import FinanceCreate from '@/pages/FinanceCreate'

export default function MaintainTestAccount() {
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
    }, {
      key: 'memo',
      title: '補充說明',
    },
    {
      key: 'isRmt',
      title: '通匯是否啟用',
    },
    {
      key: 'rmtResultCode',
      title: '通匯交易結果',
    },
    {
      key: 'isAtm',
      title: '轉帳是否啟用',
    },
    {
      key: 'atmResultCode',
      title: '轉帳交易結果',
    },
    {
      key: 'atmVerify',
      title: '核驗是否啟用',
    },
    {
      key: 'atmVerifyRCode',
      title: '核驗交易結果',
    },
    {
      key: 'atmVerifyRDetail',
      title: '91-96',
    },
    {
      key: 'isFxml',
      title: 'FXML是否啟用',
    },
    {
      key: 'fxmlResultCode',
      title: 'FXML交易結果',
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
  const loadFiscData: LoadDataFunction<FiscSituation, FiscSituationQuery> = async (queryParams, page, pageSize) => {
    const response = await FinanceService.getFiscSituationList({
      page,
      pageSize,
      ...queryParams,
    })

    return {
      data: response?.fiscSituations || [],
      pagination: response?.pagination || {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  // delete item
  const deleteFiscData = async (selectedIds: number[]) => {
    // FIXME: 缺批次刪除 API
    // 方案1：使用 Promise.all (平行執行)
    await Promise.all(selectedIds.map(async (id) => {
      await FinanceService.maintainFiscSituation({
        action: 'D',
        id,
      })
    }))
  }

  // edit item
  const editFiscData = async (_formData: EditFormData) => {
    void _formData
    // TODO: 實作 API 更新邏輯
    // await updateItemAPI(editingItem.id, formData)
  }

  return (
    <div className="w-full">
      <DataTable<FiscSituation, FiscSituationQuery, EditFormData>
        loadDataFn={loadFiscData}
        deleteDataFn={deleteFiscData}
        editDataFn={editFiscData}
        AddFormComponent={FinanceCreate}
        columns={columns}
        searchFields={searchFields}
      />
    </div>
  )
}
