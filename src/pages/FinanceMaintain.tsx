import DataTable, { type LoadDataFunction, type SearchField, type TableColumn } from '@/components/DataTable'
import FinanceEditForm from '@/components/FinanceEditForm'
import type { FiscSituation, FiscSituationQuery } from '@/models/FiscSituation'
import FinanceCreate from '@/pages/FinanceCreate'
import { FinanceService } from '@/services/FinanceService'

export default function FinanceMaintain() {
  // 定義查詢表單欄位配置
  const searchFields: SearchField[] = [
    {
      key: 'account',
      label: '帳號',
      placeholder: '請輸入帳號',
      type: 'text'
    },
    {
      key: 'creator',
      label: '建立者',
      placeholder: '請輸入建立者',
      type: 'text'
    }
  ]

  // 定義表格欄位配置
  const columns: TableColumn[] = [
    {
      key: 'account',
      title: '帳號'
    },
    {
      key: 'situationDesc',
      title: '情境說明'
    },
    // {
    //   key: 'memo',
    //   title: '補充說明',
    // },
    // {
    //   key: 'isRmt',
    //   title: '通匯是否啟用',
    // },
    {
      key: 'rmtResultCode',
      title: '匯出匯款'
    },
    // {
    //   key: 'isAtm',
    //   title: '轉帳是否啟用',
    // },
    {
      key: 'atmResultCode',
      title: '代理轉帳'
    },
    // {
    //   key: 'atmVerify',
    //   title: '核驗是否啟用',
    // },
    {
      key: 'atmVerifyRCode',
      title: '帳號核驗'
    },
    {
      key: 'atmVerifyRDetail',
      title: '帳號核驗91-96'
    },
    // {
    //   key: 'isFxml',
    //   title: 'FXML是否啟用',
    // },
    {
      key: 'fxmlResultCode',
      title: 'FXML 出金'
    },
    {
      key: 'updatedAt',
      title: '最後修改時間'
    },
    {
      key: 'updater',
      title: '最後修改者'
    },
    {
      key: 'createdAt',
      title: '建立時間'
    },
    {
      key: 'creator',
      title: '建立者'
    }
  ]

  // 載入資料函數 (傳給 DataTable 使用)
  const loadFiscData: LoadDataFunction<FiscSituation, FiscSituationQuery> = async (queryParams, page, pageSize) => {
    const response = await FinanceService.getFiscSituationList({
      page,
      pageSize,
      ...queryParams
    })

    return {
      data: response?.fiscSituations || [],
      pagination: response?.pagination || {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    }
  }

  // delete item
  const deleteFiscData = async (selectedIds: number[]) => {
    // FIXME: 缺批次刪除 API
    // 方案1：使用 Promise.all (平行執行)
    await Promise.all(
      selectedIds.map(async id => {
        await FinanceService.maintainFiscSituation({
          action: 'D',
          id
        })
      })
    )
  }

  return (
    <div className="w-full">
      <DataTable<FiscSituation, FiscSituationQuery>
        loadDataFn={loadFiscData}
        deleteDataFn={deleteFiscData}
        AddFormComponent={FinanceCreate}
        EditFormComponent={FinanceEditForm}
        deleteTitleAttr="account"
        columns={columns}
        searchFields={searchFields}
      />
    </div>
  )
}
