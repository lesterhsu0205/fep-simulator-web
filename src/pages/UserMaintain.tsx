import DataTable, { type SearchField, type TableColumn, type LoadDataFunction } from '@/components/DataTable'
import { type User, type UserQuery } from '@/models/User'
import { UserService } from '@/services/UserService'
import UserCreate from '@/pages/UserCreate'
// import FinanceEditForm from '@/components/FinanceEditForm'

export default function UserMaintain() {
  // 定義查詢表單欄位配置
  const searchFields: SearchField[] = [
    {
      key: 'username',
      label: '名稱',
      placeholder: '請輸入名稱',
      type: 'text',
    },
    {
      key: 'accountType',
      label: '角色',
      placeholder: '請輸入角色',
      type: 'text',
    },
  ]

  // 定義表格欄位配置
  const columns: TableColumn[] = [
    {
      key: 'username',
      title: '名稱',
    },
    {
      key: 'email',
      title: '電子郵件',
    },
    {
      key: 'accountType',
      title: '類別',
    },
    {
      key: 'isActive',
      title: '狀態',
    },
    {
      key: 'roleCode',
      title: '角色',
    },
  ]

  // 載入資料函數 (傳給 DataTable 使用)
  const loadFiscData: LoadDataFunction<User, UserQuery> = async (queryParams, page, pageSize) => {
    const response = await UserService.getUserList({
      page,
      pageSize,
      ...queryParams,
    })

    return {
      data: response?.users || [],
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
  const deleteUserData = async (selectedIds: number[]) => {
    // FIXME: 缺批次刪除 API
    // 方案1：使用 Promise.all (平行執行)
    await Promise.all(selectedIds.map(async (id) => {
      await UserService.maintainUser({
        action: 'D',
        id,
      })
    }))
  }

  return (
    <div className="w-full">
      <DataTable<User, UserQuery>
        loadDataFn={loadFiscData}
        deleteDataFn={deleteUserData}
        AddFormComponent={UserCreate}
        // EditFormComponent={FinanceEditForm}
        deleteTitleAttr="username"
        columns={columns}
        searchFields={searchFields}
      />
    </div>
  )
}
