import DataTable, { type SearchField, type TableColumn, type LoadDataFunction } from '@/components/DataTable'
import { type TxLog, type TxLogQuery } from '@/models/TxLog'
import { TxLogService } from '@/services/TxLogService'

export default function RecordQuery() {
  // 定義查詢表單欄位配置
  const searchFields: SearchField[] = [
    {
      key: 'dateRange',
      label: '查詢起迄日',
      type: 'dateRange',
      placeholder: '選擇查詢日期範圍',
    },
    {
      key: 'systemType',
      label: '系統類型',
      placeholder: '請選擇系統類型',
      type: 'select',
      options: [{ label: '全部', value: null }, { label: 'ATM', value: 'FA' }, { label: '通匯', value: 'FI' }, { label: 'FXML', value: 'FX' }, { label: '聯徵', value: 'JC' }],
    },
    {
      key: 'txnId',
      label: '交易代號',
      placeholder: '請輸入交易代號',
      type: 'text',
    },
    {
      key: 'guid',
      label: 'guid',
      placeholder: '請輸入guid',
      type: 'text',
    },
    {
      key: 'italGuidOmsgID',
      label: 'italGuid',
      placeholder: '請輸入italGuidOmsgID',
      type: 'text',
    },
    {
      key: 'uuid',
      label: 'uuid',
      placeholder: '請輸入uuid',
      type: 'text',
    },
  ]

  // 定義表格欄位配置
  const columns: TableColumn[] = [
    {
      key: 'logDatetime',
      title: '日期時間',
    },
    {
      key: 'systemType',
      title: '系統類型',
    },
    {
      key: 'txnType',
      title: '交易型態',
    },
    {
      key: 'txnId',
      title: '交易代號',
    },
    {
      key: 'guid',
      title: 'guid',
    },
    {
      key: 'italGuidOmsgID',
      title: 'italGuidOmsgID',
    },
    {
      key: 'uuid',
      title: 'uuid',
    },
    {
      key: 'txnData',
      title: 'txnData',
      render: 'json',
    },
  ]

  // 載入資料函數 (傳給 DataTable 使用)
  const loadTxLogData: LoadDataFunction<TxLog, TxLogQuery> = async (queryParams, page, pageSize) => {
    const response = await TxLogService.getTxLogList({
      page,
      pageSize,
      ...queryParams,
    })

    return {
      data: response?.txlogs || [],
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

  return (
    <div className="w-full">
      <DataTable<TxLog, TxLogQuery>
        loadDataFn={loadTxLogData}
        columns={columns}
        searchFields={searchFields}
      />
    </div>
  )
}
