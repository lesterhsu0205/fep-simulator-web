import DataTable, { type SearchField, type TableColumn, type LoadDataFunction } from '@/components/DataTable'
import { type EditFormData } from '@/components/EditForm'
import { type JcicSituation, type JcicSituationQuery } from '@/model/JcicSituation'
import { CreditService } from '@/services/CreditService'
import CreditCreate from '@/pages/CreditCreate'

export default function MaintainTestAccount() {
  // 定義查詢表單欄位配置
  const searchFields: SearchField[] = [
    {
      key: 'txId',
      label: '查詢項目',
      placeholder: '請輸入查詢項目',
      type: 'text',
    },
    {
      key: 'inqueryKey1',
      label: '查詢條件1',
      placeholder: '請輸入查詢條件1',
      type: 'text',
    },
    {
      key: 'inqueryKey2',
      label: '查詢條件2',
      placeholder: '請輸入查詢條件2',
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
      key: 'txId',
      title: '查詢項目',
    },
    {
      key: 'inqueryKey1',
      title: '查詢條件1',
    }, {
      key: 'inqueryKey2',
      title: '查詢條件2',
    },
    {
      key: 'returnCode',
      title: '錯誤代碼',
    },
    {
      key: 'forceToJcic',
      title: '強制發查flag',
    },
    {
      key: 'jcicDataDate',
      title: '發查資料日期',
    },
    {
      key: 'jcicData',
      title: '回傳資料',
      render: 'blob',
    },
    {
      key: 'situationDesc',
      title: '情境說明',
    },
    {
      key: 'memo',
      title: '補充說明',
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
  const loadJcicData: LoadDataFunction<JcicSituation, JcicSituationQuery> = async (queryParams, page, pageSize) => {
    const response = await CreditService.getJcicSituationList({
      page,
      pageSize,
      ...queryParams,
    })

    return {
      data: response?.jcicSituations || [],
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
  const deleteJcicData = async (_selectedIds: number[]) => {
    void _selectedIds
    // TODO: 實作 API 批次刪除邏輯
    // await batchDeleteItemsAPI(selectedIds)
  }

  // edit item
  const editJcicData = async (_formData: EditFormData) => {
    void _formData
    // TODO: 實作 API 更新邏輯
    // await updateItemAPI(editingItem.id, formData)
  }

  return (
    <div className="w-full">
      <DataTable<JcicSituation, JcicSituationQuery, EditFormData>
        loadDataFn={loadJcicData}
        deleteDataFn={deleteJcicData}
        editDataFn={editJcicData}
        AddFormComponent={CreditCreate}
        columns={columns}
        searchFields={searchFields}
      />
    </div>
  )
}
