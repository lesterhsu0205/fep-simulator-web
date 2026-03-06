import CreditEditForm from '@/components/CreditEditForm'
import DataTable, { type LoadDataFunction, type SearchField, type TableColumn } from '@/components/DataTable'
import type { JcicSituation, JcicSituationQuery } from '@/models/JcicSituation'
import CreditCreate from '@/pages/CreditCreate'
import { CreditService } from '@/services/CreditService'

export default function CreditMaintain() {
  // 定義查詢表單欄位配置
  const searchFields: SearchField[] = [
    {
      key: 'txid',
      label: '查詢項目',
      placeholder: '請輸入查詢項目',
      type: 'text'
    },
    {
      key: 'inqueryKey1',
      label: '查詢條件1',
      placeholder: '請輸入查詢條件1',
      type: 'text'
    },
    {
      key: 'inqueryKey2',
      label: '查詢條件2',
      placeholder: '請輸入查詢條件2',
      type: 'text'
    },
    {
      key: 'returnCode',
      label: '回應代碼',
      placeholder: '請輸入回應代碼',
      type: 'text'
    },
    {
      key: 'forceToJcic',
      label: '強制發查',
      placeholder: '請輸入強制發查',
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
      key: 'txid',
      title: '查詢項目'
    },
    {
      key: 'inqueryKey1',
      title: '查詢條件1'
    },
    {
      key: 'inqueryKey2',
      title: '查詢條件2'
    },
    {
      key: 'returnCode',
      title: '回應代碼'
    },
    {
      key: 'forceToJcic',
      title: '強制發查'
    },
    {
      key: 'jcicDataDate',
      title: '發查資料日期'
    },
    {
      key: 'jcicData',
      render: 'blob',
      title: '回傳資料'
    },
    {
      key: 'situationDesc',
      title: '情境說明'
    },
    // {
    //   key: 'memo',
    //   title: '補充說明',
    // },
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
  const loadJcicData: LoadDataFunction<JcicSituation, JcicSituationQuery> = async (queryParams, page, pageSize) => {
    const response = await CreditService.getJcicSituationList({
      page,
      pageSize,
      ...queryParams
    })

    return {
      data: response?.jcicSituations || [],
      pagination: response?.pagination || {
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0
      }
    }
  }

  // delete item
  const deleteJcicData = async (selectedIds: number[]) => {
    // FIXME: 缺批次刪除 API
    // 方案1：使用 Promise.all (平行執行)
    await Promise.all(
      selectedIds.map(async (id) => {
        await CreditService.maintainJcicSituation({
          action: 'D',
          id
        })
      })
    )
  }

  return (
    <div className="w-full">
      <DataTable<JcicSituation, JcicSituationQuery>
        AddFormComponent={CreditCreate}
        columns={columns}
        deleteDataFn={deleteJcicData}
        deleteTitleAttr={['txid', 'inqueryKey1', 'inqueryKey2', 'returnCode', 'forceToJcic']}
        EditFormComponent={CreditEditForm}
        loadDataFn={loadJcicData}
        searchFields={searchFields}
      />
    </div>
  )
}
