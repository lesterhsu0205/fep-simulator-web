import DataTable, { type SearchField, type TableColumn, type LoadDataFunction } from '@/components/DataTable'
import { type TestAccount, type TestAccountQuery } from '@/model/TestAccount'
import TestAccountCreate from '@/pages/TestAccountCreate'
import testAccountData from '@/assets/TestAccountList.json'

export default function TestAccountMaintain() {
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
      key: 'status',
      title: '狀態',
    },
    {
      key: 'type',
      title: '帳號類型',
    },
    {
      key: 'icNo',
      title: '晶片卡序號',
    },
    {
      key: 'icMemo',
      title: '晶片卡備註',
    },
    {
      key: 'icC6Key',
      title: '晶片卡C6資料',
    },
    {
      key: 'icCkey',
      title: '晶片卡資料',
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
  const loadTestAccountData: LoadDataFunction<TestAccount, TestAccountQuery> = async (queryParams, page, pageSize) => {
    // 模擬 API 呼叫延遲
    await new Promise(resolve => setTimeout(resolve, 300))

    // 從 JSON 檔案載入資料
    const allData = testAccountData as TestAccount[]

    // 篩選資料
    let filteredData = allData

    if (queryParams.account) {
      filteredData = filteredData.filter(item =>
        item.account.toLowerCase().includes(queryParams.account!.toLowerCase()),
      )
    }

    if (queryParams.creator) {
      filteredData = filteredData.filter(item =>
        item.creator.toLowerCase().includes(queryParams.creator!.toLowerCase()),
      )
    }

    // 計算分頁
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = filteredData.slice(startIndex, endIndex)

    const totalItems = filteredData.length
    const totalPages = Math.ceil(totalItems / pageSize)

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        itemsPerPage: pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }
  }

  // delete item
  const deleteTestAccountData = async (_selectedIds: number[]) => {
    void _selectedIds
    // TODO: 實作 API 批次刪除邏輯
    // await batchDeleteItemsAPI(selectedIds)
  }

  return (
    <div className="w-full">
      <DataTable<TestAccount, TestAccountQuery>
        loadDataFn={loadTestAccountData}
        deleteDataFn={deleteTestAccountData}
        AddFormComponent={TestAccountCreate}
        deleteTitleAttr=""
        columns={columns}
        searchFields={searchFields}
      />
    </div>
  )
}
