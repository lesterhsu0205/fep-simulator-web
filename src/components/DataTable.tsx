import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Search, RotateCcw, X, Edit, Trash2, FileEdit, Plus } from 'lucide-react'
import tableData from '@/assets/data.json'
import EditForm, { type TableData, type EditFormData } from '@/components/EditForm.tsx'
import CreateTestAccount, { type CreateTestAccountData } from '@/components/CreateTestAccount.tsx'
import Modal from '@/components/Modal.tsx'
import { useToast } from '@/contexts/ToastContext'

// 定義查詢表單資料類型
interface QueryFormData {
  account: string
  creator: string
}

// 可自訂功能按鈕類型
interface ActionButton {
  label: string
  onClick: (item: TableData) => void
}

interface DataTableProps {
  title?: string
  showSearch?: boolean
  searchPlaceholder?: string
  actionButtons?: ActionButton[]
  itemsPerPageOptions?: number[]
  defaultItemsPerPage?: number
  onQuerySubmit?: (data: QueryFormData) => void
}

// 渲染表格儲存格內容的輔助函數
const renderCellValue = (value: string | null) => {
  if (value === null || value === '' || value === undefined) {
    return <span className="badge badge-outline border-gray-300 text-xs text-gray-500">None</span>
  }
  return value
}

export default function DataTable({
  itemsPerPageOptions = [10, 20, 50, 100],
  defaultItemsPerPage = 10,
  onQuerySubmit,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [data, setData] = useState<TableData[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TableData | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<TableData | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false)
  const { showToast } = useToast()

  // React Hook Form 設定
  const { register, handleSubmit, reset } = useForm<QueryFormData>({
    defaultValues: {
      account: '',
      creator: '',
    },
  })

  // 初始化資料
  useEffect(() => {
    setData(tableData as TableData[])
  }, [])

  // 由於未來會使用後端分頁，這裡直接使用原始資料
  const filteredData = useMemo(() => {
    return data
  }, [data])

  // 分頁資料
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, itemsPerPage])

  // 總頁數
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage)
  }, [filteredData, itemsPerPage])

  // 選擇項目
  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id)
      }
      else {
        return [...prev, id]
      }
    })
  }

  // 選擇全部項目
  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([])
    }
    else {
      setSelectedItems(paginatedData.map(item => item.id))
    }
  }

  // 查詢表單處理
  const onSubmit = (data: QueryFormData) => {
    setCurrentPage(1) // 查詢時重置頁碼
    onQuerySubmit?.(data) // 呼叫外部傳入的查詢函數
  }

  const handleReset = () => {
    reset() // 使用 React Hook Form 的 reset 方法
    setCurrentPage(1)
    onQuerySubmit?.({ account: '', creator: '' }) // 重置時也通知外部
  }

  // 編輯功能
  const handleEdit = (item: TableData) => {
    setEditingItem(item)
    setIsDrawerOpen(true)
  }

  // 開啟刪除 modal
  const handleDelete = (item: TableData) => {
    setDeletingItem(item)
    setIsDeleteModalOpen(true)
  }

  // 確認刪除
  const handleConfirmDelete = async () => {
    if (deletingItem) {
      try {
        // TODO: 實作 API 刪除邏輯
        // await deleteItemAPI(deletingItem.id)

        // 暫時從本地資料中移除
        setData(prev => prev.filter(d => d.id !== deletingItem.id))
        setIsDeleteModalOpen(false)
        setDeletingItem(null)
        showToast('刪除成功', 'success')
      }
      catch (error) {
        showToast('刪除失敗，請稍後再試', 'error')
        console.error('Delete error:', error)
      }
    }
  }

  // 取消刪除
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setDeletingItem(null)
  }

  // 處理編輯表單提交
  const handleEditSubmit = (formData: EditFormData) => {
    if (editingItem) {
      try {
        // TODO: 實作 API 更新邏輯
        // await updateItemAPI(editingItem.id, formData)

        // 暫時更新本地資料
        setData(prev => prev.map(item =>
          item.id === editingItem.id
            ? {
                ...item,
                ...formData,
                lastModifiedTime: new Date().toLocaleString(),
                lastModifiedBy: '目前使用者', // TODO: 從使用者資訊取得
              }
            : item,
        ))

        setIsDrawerOpen(false)
        setEditingItem(null)
        showToast('修改成功', 'success')
      }
      catch (error) {
        showToast('修改失敗，請稍後再試', 'error')
        console.error('Update error:', error)
      }
    }
  }

  // 關閉 Drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setEditingItem(null)
  }

  // 開啟新增 modal
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true)
  }

  // 關閉新增 modal
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  // 處理新增帳號提交
  const handleAddSubmit = (formData: CreateTestAccountData) => {
    try {
      // TODO: 實作 API 新增邏輯
      // await createTestAccountAPI(formData)

      // 暫時新增到本地資料
      const newItem: TableData = {
        id: Math.max(...data.map(d => d.id)) + 1,
        header: formData.accountNumber,
        type: formData.scenario,
        status: formData.remittance.enabled ? (formData.remittance.result === 'custom' ? formData.remittance.customCode || null : formData.remittance.result) : null,
        target: formData.proxyTransfer.enabled ? (formData.proxyTransfer.result === 'custom' ? formData.proxyTransfer.customCode || null : formData.proxyTransfer.result) : null,
        limit: formData.accountVerification.enabled ? (formData.accountVerification.result === 'custom' ? formData.accountVerification.customCode || '00000' : '00000') : '00000',
        reviewer: formData.accountVerification.enabled ? Object.values(formData.accountVerification.positions).join('') || '000000' : '000000',
        fxml: formData.fxml.enabled ? (formData.fxml.result === 'custom' ? formData.fxml.customCode || '00000' : '00000') : '00000',
        lastModifiedTime: new Date().toLocaleDateString(),
        lastModifiedBy: formData.creator || '目前使用者',
        createdTime: new Date().toLocaleDateString(),
        createdBy: formData.creator || '目前使用者',
      }

      setData(prev => [newItem, ...prev])
      setIsAddModalOpen(false)
      showToast('測試帳號建立成功', 'success')
    }
    catch (error) {
      showToast('建立失敗，請稍後再試', 'error')
      console.error('Create error:', error)
    }
  }

  // 批次刪除
  const handleBatchDelete = () => {
    setIsBatchDeleteModalOpen(true)
  }

  // 確認批次刪除
  const handleConfirmBatchDelete = async () => {
    try {
      // TODO: 實作 API 批次刪除邏輯
      // await batchDeleteItemsAPI(selectedItems)

      // 暫時從本地資料中移除選中的項目
      setData(prev => prev.filter(item => !selectedItems.includes(item.id)))
      setSelectedItems([])
      setIsBatchDeleteModalOpen(false)
      showToast(`成功刪除 ${selectedItems.length} 筆資料`, 'success')
    }
    catch (error) {
      showToast('批次刪除失敗，請稍後再試', 'error')
      console.error('Batch delete error:', error)
    }
  }

  // 取消批次刪除
  const handleCancelBatchDelete = () => {
    setIsBatchDeleteModalOpen(false)
  }

  return (
    <div className="w-full">
      {/* 查詢表單 */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">帳號</label>
            <input
              type="text"
              className="input input-bordered w-60"
              placeholder="請輸入帳號"
              {...register('account')}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">建立者</label>
            <input
              type="text"
              className="input input-bordered w-60"
              placeholder="請輸入建立者"
              {...register('creator')}
            />
          </div>

          <div className="flex items-center gap-3 flex-1 justify-between">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="btn btn-primary px-6"
              >
                <Search size={16} />
                查詢
              </button>
              <button
                type="button"
                className="btn btn-ghost px-6"
                onClick={handleReset}
              >
                <RotateCcw size={16} />
                重置
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-success text-white"
                onClick={handleOpenAddModal}
              >
                <Plus size={16} />
                新增
              </button>
              <button
                type="button"
                className="btn btn-error text-white"
                onClick={handleBatchDelete}
                disabled={selectedItems.length === 0}
              >
                <Trash2 size={16} />
                刪除
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* 表格 */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200 text-sm">
              <th className="w-10 py-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  checked={selectedItems.length > 0 && selectedItems.length === paginatedData.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="py-3">帳號</th>
              <th className="py-3">情境說明</th>
              <th className="py-3">匯出匯款</th>
              <th className="py-3">代理轉帳</th>
              <th className="py-3">帳號核核</th>
              <th className="py-3">帳號核檢 91-96</th>
              <th className="py-3">FXML 規則</th>
              <th className="py-3">最後修改時間</th>
              <th className="py-3">最後修改者</th>
              <th className="py-3">建立時間</th>
              <th className="py-3">建立者</th>
              <th className="w-12 py-3 text-center">功能</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(item => (
              <tr
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={`
                  text-sm cursor-pointer
                  transition-[background-color,transform,box-shadow] duration-150
                  ${selectedItems.includes(item.id)
                ? '!bg-blue-50 shadow-sm hover:!bg-blue-100 hover:shadow-md hover:scale-[1.005]'
                : 'hover:bg-gray-100 hover:scale-[1.005]'
              }
                `}
              >
                <td onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                  />
                </td>
                <td>{item.header}</td>
                <td>{item.type}</td>
                <td>{renderCellValue(item.status)}</td>
                <td>{renderCellValue(item.target)}</td>
                <td>{item.limit}</td>
                <td>{item.reviewer}</td>
                <td>{item.fxml}</td>
                <td>{item.lastModifiedTime}</td>
                <td>{item.lastModifiedBy}</td>
                <td>{item.createdTime}</td>
                <td>{item.createdBy}</td>
                <td onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="btn btn-ghost btn-xs text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(item)}
                      title="編輯"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-xs text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(item)}
                      title="刪除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分頁與每頁顯示數量 */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-3">
          <select
            className="select select-bordered select-md border-gray-200"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1) // 切換每頁數量時重置頁碼
            }}
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {`${option} 筆/頁`}
              </option>
            ))}
          </select>
          <span className="text-gray-600 text-sm whitespace-nowrap">
            {`顯示 ${filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} 到 ${Math.min(currentPage * itemsPerPage, filteredData.length)} 筆資料，共 ${filteredData.length} 筆`}
          </span>
          {selectedItems.length > 0 && (
            <span className="text-gray-400 text-sm font-medium whitespace-nowrap">
              {`已選取 ${selectedItems.length} 筆`}
            </span>

          )}
        </div>

        {/* DaisyUI 分頁控制 */}
        <div className="join">
          <button
            className="join-item btn btn-md"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || totalPages === 0}
            title="第一頁"
          >
            «
          </button>
          <button
            className="join-item btn btn-md"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || totalPages === 0}
            title="上一頁"
          >
            ‹
          </button>

          {(() => {
            if (totalPages === 0) return null

            const pages = []
            const maxVisiblePages = 3

            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

            if (endPage - startPage + 1 < maxVisiblePages) {
              startPage = Math.max(1, endPage - maxVisiblePages + 1)
            }

            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`join-item btn btn-md ${currentPage === i ? 'btn-active' : ''}`}
                >
                  {i}
                </button>,
              )
            }

            return pages
          })()}

          <button
            className="join-item btn btn-md"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            title="下一頁"
          >
            ›
          </button>
          <button
            className="join-item btn btn-md"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            title="最後一頁"
          >
            »
          </button>
        </div>
      </div>

      {/* 編輯 Drawer */}
      <div className={`fixed inset-0 z-50 ${isDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* 背景遮罩 */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isDrawerOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={handleCloseDrawer}
        />

        {/* Drawer 內容 */}
        <div className={`absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 h-full overflow-y-auto bg-gradient-to-b from-white to-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileEdit size={20} />
                <h2 className="text-subheading">編輯資料</h2>
              </div>
              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={handleCloseDrawer}
              >
                <X size={18} />
              </button>
            </div>

            {/* 帳號資訊 */}
            {editingItem && (
              <div className="stats shadow mb-4 w-full bg-gray-100">
                <div className="stat ">
                  <div className="stat-title">帳號</div>
                  <div className="stat-value text-lg">{editingItem.header}</div>
                </div>
              </div>
            )}

            <EditForm
              data={editingItem}
              onSubmit={handleEditSubmit}
              onCancel={handleCloseDrawer}
            />
          </div>
        </div>
      </div>

      {/* 刪除確認 Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        modalTitle="確認刪除"
        modalContent={(
          <>
            確定要刪除帳號「
            <span className="font-semibold text-red-600">{deletingItem?.header || ''}</span>
            」嗎？
            <br />
            <span className="text-sm text-gray-500">此操作無法復原。</span>
          </>
        )}
        modalAction={(
          <>
            <button
              className="btn btn-ghost"
              onClick={handleCancelDelete}
            >
              取消
            </button>
            <button
              className="btn btn-error text-white"
              onClick={handleConfirmDelete}
            >
              確認刪除
            </button>
          </>
        )}
        onCancel={handleCancelDelete}
      />

      {/* 新增 Modal */}
      <dialog className={`modal ${isAddModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-6xl h-5/6 p-0">
          <CreateTestAccount
            onSubmit={handleAddSubmit}
            onCancel={handleCloseAddModal}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleCloseAddModal}>close</button>
        </form>
      </dialog>

      {/* 批次刪除確認 Modal */}
      <Modal
        isOpen={isBatchDeleteModalOpen}
        modalTitle="確認批次刪除"
        modalContent={(
          <>
            確定要刪除以下
            {' '}
            {selectedItems.length}
            {' '}
            個帳號嗎？
            <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
              {selectedItems.map((id) => {
                const item = data.find(d => d.id === id)
                return item
                  ? (
                      <div key={id} className="text-sm text-red-600 font-semibold">
                        •
                        {' '}
                        {item.header}
                      </div>
                    )
                  : null
              })}
            </div>
            <span className="text-sm text-gray-500 mt-2 block">此操作無法復原。</span>
          </>
        )}
        modalAction={(
          <>
            <button
              className="btn btn-ghost"
              onClick={handleCancelBatchDelete}
            >
              取消
            </button>
            <button
              className="btn btn-error text-white"
              onClick={handleConfirmBatchDelete}
            >
              確認刪除
            </button>
          </>
        )}
        onCancel={handleCancelBatchDelete}
      />
    </div>
  )
}
