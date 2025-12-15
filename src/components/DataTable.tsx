import { useForm, Controller } from 'react-hook-form'
import { Search, RotateCcw, Edit, Trash2, Plus, Check, X } from 'lucide-react'
import { useState, useEffect, useCallback, type ComponentType } from 'react'
import Modal from '@/components/Modal'
import { useToast } from '@/contexts/ToastContext'
import { type PaginationInfo } from '@/models/PaginationInfo'
import { ensureBase64Decoded } from '@/utils/base64'
import DateRangePicker from '@/components/DateRangePicker'
import { ApiError } from '@/error/ApiError'

// 定義查詢表單欄位類型
export interface SearchField {
  key: string
  label: string
  placeholder?: string
  type?: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'dateRange'
  required?: boolean
  className?: string
  options?: Array<{ value: string | number | null, label: string }>
}

// 表格欄位配置介面
export interface TableColumn {
  key: string
  title: string
  width?: string
  className?: string
  render?: string
}

// 通用表格資料介面
interface TableItem {
  id: number
  [key: string]: unknown
}

// 資料載入函數類型
export type LoadDataFunction<TRawData = unknown, TQuery = Record<string, unknown>> = (
  queryParams: TQuery,
  page: number,
  pageSize: number
) => Promise<{
  data: TRawData[]
  pagination: PaginationInfo
}>

// 新增表單組件的 props 介面
interface AddFormProps {
  afterSubmit: () => void
}

// 編輯表單組件的 props 介面
export interface EditFormProps {
  data: { [key: string]: unknown } | null
  afterSubmit: () => void
}

interface DataTableProps<TRawData = unknown, TQuery = Record<string, unknown>> {
  // 資料處理函數
  loadDataFn: LoadDataFunction<TRawData, TQuery>
  deleteDataFn?: (selectedIds: number[]) => void

  // 新增表單組件
  AddFormComponent?: ComponentType<AddFormProps>

  // 編輯表單組件
  EditFormComponent?: ComponentType<EditFormProps>

  // 表格欄位配置
  columns: TableColumn[]

  // 分頁控制 (初始值，內部管理)
  initialCurrentPage?: number
  initialItemsPerPage?: number
  itemsPerPageOptions?: number[]

  // 查詢欄位
  searchFields?: SearchField[]

  // 自訂配置
  deleteTitleAttr?: string | string[]
  emptyMessage?: string
  loadingMessage?: string
}

// 工具函數：根據 deleteTitleAttr 取得顯示標題
const getDisplayTitle = (item: Record<string, unknown> | null | undefined, titleAttr: string | string[]): string => {
  if (Array.isArray(titleAttr)) {
    // 如果是陣列，串接所有屬性值
    return titleAttr
      .map(attr => String(item?.[attr] || ''))
      .filter(value => value !== '')
      .join('') || String(item?.id) || ''
  }
  // 如果是字串，使用原本邏輯
  return (item?.[titleAttr] as string) || String(item?.id) || ''
}

export default function DataTable<TRawData = unknown, TQuery = Record<string, unknown>>({
  loadDataFn,
  deleteDataFn,
  AddFormComponent,
  EditFormComponent,
  columns,
  initialCurrentPage = 1,
  initialItemsPerPage = 10,
  itemsPerPageOptions = [10, 20, 50, 100],
  searchFields = [],
  emptyMessage = '暫無資料',
  deleteTitleAttr = 'account',
  // loadingMessage = '載入中...',
}: DataTableProps<TRawData, TQuery>) {
  const { showToast } = useToast()

  // 內部狀態管理
  const [data, setData] = useState<TableItem[]>([])
  // const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: initialCurrentPage,
    itemsPerPage: initialItemsPerPage,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [currentPage, setCurrentPage] = useState(initialCurrentPage)
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [currentQuery, setCurrentQuery] = useState<TQuery>({} as TQuery)

  // Modal 狀態管理
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TableItem | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<TableItem | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailContent, setDetailContent] = useState<string>('')
  const [detailTitle, setDetailTitle] = useState<string>('')

  // 載入資料
  const loadData = useCallback(async (queryParams: TQuery = {} as TQuery, page = currentPage, pageSize = itemsPerPage) => {
    // setLoading(true)
    try {
      const response = await loadDataFn(queryParams, page, pageSize)

      setData(response.data as TableItem[])
      setPagination(response.pagination)
      setCurrentPage(response.pagination.currentPage)
      setItemsPerPage(response.pagination.itemsPerPage)
      setCurrentQuery(queryParams)
    }
    catch (error) {
      console.error('載入資料失敗:', error)
      if (error instanceof Error) {
        showToast(`載入資料失敗，${error.message}`, 'error')
      }
      else {
        showToast(`載入資料失敗，${String(error)}`, 'error')
      }
    }
    finally {
      // setLoading(false)
    }
  }, [loadDataFn, currentPage, itemsPerPage, showToast])

  // 初始化資料
  useEffect(() => {
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 只在組件掛載時執行一次

  // 當資料變化時重置選擇項目
  useEffect(() => {
    setSelectedItems([])
  }, [data])

  // React Hook Form 設定
  const defaultValues = searchFields.reduce<Record<string, string | number | undefined | { startDatetime?: string, endDatetime?: string }>>((acc, field) => {
    if (field.type === 'dateRange') {
      acc[field.key] = { startDatetime: '', endDatetime: '' }
    }
    else {
      acc[field.key] = ''
    }
    return acc
  }, {})
  const { register, handleSubmit, reset, control } = useForm<Record<string, string | number | undefined | { startDatetime?: string, endDatetime?: string }>>({
    defaultValues,
  })

  // 選擇項目
  const handleSelectItem = (id: number) => {
    const newSelection = selectedItems.includes(id)
      ? selectedItems.filter(itemId => itemId !== id)
      : [...selectedItems, id]
    setSelectedItems(newSelection)
  }

  // 選擇全部項目
  const handleSelectAll = () => {
    const newSelection = selectedItems.length === data.length ? [] : data.map(item => item.id)
    setSelectedItems(newSelection)
  }

  // 查詢表單處理
  const onSubmit = (formData: Record<string, string | number | undefined | { startDatetime?: string, endDatetime?: string }>) => {
    // 處理表單數據：空字串轉換為 null，日期範圍欄位展開
    const processedData: Record<string, string | number | null> = {}

    Object.entries(formData).forEach(([key, value]) => {
      // 處理日期範圍欄位
      if (value && typeof value === 'object' && 'startDatetime' in value && 'endDatetime' in value) {
        processedData.startDatetime = value.startDatetime || null
        processedData.endDatetime = value.endDatetime || null
      }
      // 處理一般欄位
      else if (value === '' || value === undefined) {
        processedData[key] = null
      }
      else {
        processedData[key] = value as string | number | null
      }
    })

    const queryParams = processedData as unknown as TQuery
    loadData(queryParams, 1, itemsPerPage)
  }

  const handleReset = () => {
    reset(defaultValues)
    setCurrentPage(1)
    setItemsPerPage(initialItemsPerPage)
    loadData({} as TQuery, 1, initialItemsPerPage)
  }

  // 分頁控制
  const handlePageChange = (page: number) => {
    loadData(currentQuery, page, itemsPerPage)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    loadData(currentQuery, 1, newItemsPerPage)
  }

  // Modal 處理函數
  const handleEditClick = (item: TableItem) => {
    setEditingItem(item)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (item: TableItem) => {
    setDeletingItem(item)
    setIsDeleteModalOpen(true)
  }

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  const handleBatchDeleteClick = (selectedIds: number[]) => {
    if (selectedIds.length > 0) {
      setIsBatchDeleteModalOpen(true)
    }
  }

  // Modal 確認處理

  // 處理刪除確認
  const handleConfirmDelete = async () => {
    if (deletingItem && deleteDataFn) {
      try {
        await deleteDataFn([deletingItem.id])

        // 暫時從本地資料中移除
        setData(prev => prev.filter(d => d.id !== deletingItem.id))
        showToast('刪除成功', 'success')
      }
      catch (error) {
        const errorMessage = error instanceof ApiError
          ? error.messageDesc
          : '刪除失敗，請稍後再試'
        showToast(errorMessage, 'error')
        console.error('Delete error:', error)
      }
      finally {
        setDeletingItem(null)
        setIsDeleteModalOpen(false)
      }
    }
  }

  // 處理批次刪除確認
  const handleConfirmBatchDelete = async () => {
    if (deleteDataFn) {
      try {
        await deleteDataFn(selectedItems)

        // 暫時從本地資料中移除選中的項目
        setData(prev => prev.filter(item => !selectedItems.includes(item.id)))
        showToast(`成功刪除 ${selectedItems.length} 筆資料`, 'success')
      }
      catch (error) {
        const errorMessage = error instanceof ApiError
          ? error.messageDesc
          : '批次刪除失敗，請稍後再試'
        showToast(errorMessage, 'error')
        console.error('Batch delete error:', error)
      }
      finally {
        setSelectedItems([])
        setIsBatchDeleteModalOpen(false)
      }
    }
  }

  // Modal 取消處理
  const handleCancelDelete = () => {
    setDeletingItem(null)
    setIsDeleteModalOpen(false)
  }

  const handleCancelBatchDelete = () => {
    setIsBatchDeleteModalOpen(false)
  }

  const handleCloseEditModal = () => {
    setEditingItem(null)
    setIsEditModalOpen(false)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  // 表單提交處理
  // 處理編輯提交
  const handleEditSubmit = async () => {
    // 重新載入資料以獲取最新的列表
    await loadData(currentQuery, currentPage, itemsPerPage)
    showToast('編輯成功', 'success')
    setEditingItem(null)
    setIsEditModalOpen(false)
  }

  // 處理新增提交
  const handleAddSubmit = async () => {
    // 重新載入資料以獲取最新的列表
    await loadData(currentQuery, currentPage, itemsPerPage)
    setIsAddModalOpen(false)
  }

  // 處理詳細資料彈窗 (blob/json)
  const handleDetailClick = (content: string, title: string) => {
    // 智能解碼 base64 內容
    const decodedContent = ensureBase64Decoded(content)
    setDetailContent(decodedContent)
    setDetailTitle(title)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setDetailContent('')
    setDetailTitle('')
    setIsDetailModalOpen(false)
  }

  // 渲染表格儲存格內容的輔助函數
  const renderCellValue = (value: string | boolean | null, column: TableColumn) => {
    if (value === null || value === '' || value === undefined) {
      return <span className="badge badge-outline border-gray-300 text-xs text-gray-500">None</span>
    }
    else if (typeof value === 'boolean') {
      return (
        <div>
          {value
            ? (
                <Check size={18} className="text-green-600 stroke-[5]" />
              )
            : (
                <X size={18} className="text-red-600 stroke-[5]" />
              )}
        </div>
      )
    }
    else if (column.render === 'blob') {
      return (
        <button
          className="btn btn-xs"
          onClick={(e) => {
            e.stopPropagation()
            handleDetailClick(String(value), column.title)
          }}
          title="點擊查看詳細內容"
        >
          ******
        </button>
      )
    }
    else if (column.render === 'json') {
      try {
        const parsed = JSON.parse(String(value))
        const prettyJson = JSON.stringify(parsed, null, 2)
        return (
          <button
            className="btn btn-xs"
            onClick={(e) => {
              e.stopPropagation()
              handleDetailClick(prettyJson, column.title)
            }}
            title="點擊查看 JSON 詳細內容"
          >
            ******
          </button>
        )
      }
      catch {
        // 如果無法解析為 JSON，回傳原始值
        return value
      }
    }
    return value
  }

  // 計算總欄位數（用於 colSpan）2: checkbox column + action column
  const totalColumns = 2 + columns.length

  return (
    <div className="w-full">
      {/* 查詢表單 */}
      {searchFields.length > 0 && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
          <div className="flex items-center gap-6 flex-wrap">
            {searchFields.map(field => (
              <div key={field.key} className="flex items-center gap-3">
                <label className="text-form-label whitespace-nowrap">
                  {field.label}
                  {field.required && <span className="text-form-required">*</span>}
                </label>
                {field.type === 'select'
                  ? (
                      <select
                        className={`select select-bordered w-40 ${field.className || ''}`}
                        required={field.required}
                        {...register(field.key)}
                      >
                        {field.placeholder && <option value="">{field.placeholder}</option>}
                        {field.options?.map(option => (
                          <option key={option.value} value={option.value ?? ''}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )
                  : field.type === 'dateRange'
                    ? (
                        <Controller
                          name={field.key}
                          control={control}
                          render={({ field: controllerField }) => (
                            <DateRangePicker
                              value={controllerField.value as { startDatetime?: string, endDatetime?: string }}
                              onChange={controllerField.onChange}
                              placeholder={field.placeholder}
                              className={field.className}
                            />
                          )}
                        />
                      )
                    : (
                        <input
                          type={field.type || 'text'}
                          className={`input input-bordered w-40 ${field.className || ''}`}
                          placeholder={field.placeholder || ''}
                          required={field.required}
                          {...register(field.key)}
                        />
                      )}
              </div>
            ))}

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
                {AddFormComponent && (
                  <button
                    type="button"
                    className="btn btn-success text-white"
                    onClick={handleAddClick}
                  >
                    <Plus size={16} />
                    新增
                  </button>
                )}
                {deleteDataFn && (
                  <button
                    type="button"
                    className="btn btn-error text-white"
                    onClick={() => handleBatchDeleteClick(selectedItems)}
                    disabled={selectedItems.length === 0}
                  >
                    <Trash2 size={16} />
                    刪除
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 表格 */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">

              {deleteDataFn && (
                <th className="text-table-header w-10 py-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    checked={selectedItems.length > 0 && selectedItems.length === data.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}

              {columns.map(column => (
                <th
                  key={column.key}
                  className={`text-table-header py-3 ${column.width || ''} ${column.className || ''}`}
                >
                  {column.title}
                </th>
              ))}

              {(EditFormComponent || deleteDataFn) && <th className="text-table-header w-12 py-3 text-center">功能</th> }

            </tr>
          </thead>
          <tbody>
            {data.length === 0
              ? (
                  <tr>
                    <td colSpan={totalColumns} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="text-gray-500">{emptyMessage}</span>
                      </div>
                    </td>
                  </tr>
                )
              : (
                  data.map((item, index) => (
                    <tr
                      key={`table-row-${index}`}
                      onClick={() => handleSelectItem(item.id)}
                      className={`
                      cursor-pointer
                      transition-[background-color,transform,box-shadow] duration-150
                      ${selectedItems.includes(item.id)
                      ? '!bg-blue-50 shadow-sm hover:!bg-blue-100 hover:shadow-md'
                      : 'hover:bg-gray-50'
                    }
                    `}
                    >

                      {deleteDataFn
                        && (
                          <td className="text-table-cell" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="checkbox checkbox-xs"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleSelectItem(item.id)}
                            />
                          </td>
                        )}

                      {columns.map(column => (
                        <td key={column.key} className={`text-table-cell ${column.className || ''}`}>
                          {renderCellValue(item[column.key] as string | boolean | null, column)}
                        </td>
                      ))}
                      {(EditFormComponent || deleteDataFn)
                        && (
                          <td className="text-table-cell" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-2">
                              {EditFormComponent && (
                                <button
                                  className="btn btn-ghost btn-xs text-blue-600 hover:text-blue-800"
                                  onClick={() => handleEditClick(item)}
                                  title="編輯"
                                >
                                  <Edit className="stroke-[2]" size={18} />
                                </button>
                              )}
                              {deleteDataFn && (
                                <button
                                  className="btn btn-ghost btn-xs text-red-600 hover:text-red-800"
                                  onClick={() => handleDeleteClick(item)}
                                  title="刪除"
                                >
                                  <Trash2 className="stroke-[2]" size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                    </tr>
                  ))
                )}
          </tbody>
        </table>
      </div>

      {/* 分頁與每頁顯示數量 */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-3">
          <select
            className="select select-bordered select-md border-gray-200"
            value={itemsPerPage}
            onChange={e => handleItemsPerPageChange(Number(e.target.value))}
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {`${option} 筆/頁`}
              </option>
            ))}
          </select>
          <span className="text-gray-600 text-sm whitespace-nowrap">
            {`顯示 ${pagination.totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} 到 ${Math.min(currentPage * itemsPerPage, pagination.totalItems)} 筆資料，共 ${pagination.totalItems} 筆`}
          </span>
          {selectedItems.length > 0 && (
            <span className="text-gray-400 text-sm font-bold whitespace-nowrap">
              {`已選取 ${selectedItems.length} 筆`}
            </span>
          )}
        </div>

        {/* DaisyUI 分頁控制 */}
        <div className="join">
          <button
            className="join-item btn btn-md"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || pagination.totalPages === 0}
            title="第一頁"
          >
            «
          </button>
          <button
            className="join-item btn btn-md"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || pagination.totalPages === 0}
            title="上一頁"
          >
            ‹
          </button>

          {(() => {
            if (pagination.totalPages === 0) return null

            const pages = []
            const maxVisiblePages = 3

            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
            const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1)

            if (endPage - startPage + 1 < maxVisiblePages) {
              startPage = Math.max(1, endPage - maxVisiblePages + 1)
            }

            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
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
            onClick={() => handlePageChange(Math.min(currentPage + 1, pagination.totalPages))}
            disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
            title="下一頁"
          >
            ›
          </button>
          <button
            className="join-item btn btn-md"
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
            title="最後一頁"
          >
            »
          </button>
        </div>
      </div>

      {/* Modal 渲染 */}

      {/* 編輯 Modal */}
      {EditFormComponent && (
        <Modal
          isOpen={isEditModalOpen}
          modalTitle="編輯項目"
          className="!max-w-none w-[90vw] h-[90vh]"
          modalContent={(
            <EditFormComponent
              data={editingItem}
              afterSubmit={handleEditSubmit}
            />
          )}
          modalAction={(
            <button
              className="btn btn-ghost"
              onClick={handleCloseEditModal}
            >
              關閉
            </button>
          )}
          onCancel={handleCloseEditModal}
        />
      )}

      {/* 刪除確認 Modal */}
      {deleteDataFn && (
        <Modal
          isOpen={isDeleteModalOpen}
          modalTitle="確認刪除"
          modalContent={(
            <>
              確定要刪除項目「
              <span className="font-bold text-red-600">{getDisplayTitle(deletingItem, deleteTitleAttr)}</span>
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
      )}

      {/* 新增 Modal */}
      {AddFormComponent && (
        <Modal
          isOpen={isAddModalOpen}
          modalTitle="新增項目"
          className="!max-w-none w-[90vw] h-[100vh]"
          modalContent={(
            <AddFormComponent afterSubmit={handleAddSubmit} />
          )}
          modalAction={(
            <button
              className="btn btn-ghost"
              onClick={handleCloseAddModal}
            >
              關閉
            </button>
          )}
          onCancel={handleCloseAddModal}
        />
      )}

      {/* 批次刪除確認 Modal */}
      {deleteDataFn && (
        <Modal
          isOpen={isBatchDeleteModalOpen}
          modalTitle="確認批次刪除"
          modalContent={(
            <>
              確定要刪除以下
              {' '}
              {selectedItems.length}
              {' '}
              個項目嗎？
              <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
                {selectedItems.map((id) => {
                  const item = data.find(d => d.id === id)
                  return item
                    ? (
                        <div key={id} className="text-sm text-red-600 font-bold">
                          •
                          {' '}
                          {getDisplayTitle(item, deleteTitleAttr)}
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
      )}

      {/* 詳細資料 Modal (Blob/JSON) */}
      <Modal
        isOpen={isDetailModalOpen}
        modalTitle={`詳細內容 - ${detailTitle}`}
        className="!max-w-none w-[90vw] h-[90vh]"
        modalContent={(
          <pre className="text-pre whitespace-pre-wrap break-words p-4 rounded">
            {detailContent}
          </pre>
        )}
        modalAction={(
          <button
            className="btn btn-ghost"
            onClick={handleCloseDetailModal}
          >
            關閉
          </button>
        )}
        onCancel={handleCloseDetailModal}
      />

    </div>
  )
}
