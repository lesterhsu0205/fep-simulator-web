import { type AxiosResponse } from 'axios'
import ApiClient, { type ApiResponse } from '@/services/ApiService'
import { type TxLogListResponse, type TxLogQuery } from '@/models/TxLog'
import txLogData from '@/assets/TxLogList.json'

// API 服務類
export class TxLogService {
  // 查詢交易紀錄列表
  static async getTxLogList(params: TxLogQuery & { page?: number, pageSize?: number } = {}): Promise<TxLogListResponse | null> {
    try {
      // 暫時使用本地 JSON 檔案，之後需要改回 API 呼叫
      // const response: AxiosResponse<ApiResponse<TxLogListResponse>> = await ApiClient.get('/logs', {
      //   params,
      // })
      // return response.data.messageContent

      const mockData = txLogData

      // 簡單的篩選邏輯
      let filteredLogs = [...mockData]

      if (params.systemType) {
        filteredLogs = filteredLogs.filter(log =>
          log.systemType === params.systemType,
        )
      }

      if (params.txnId) {
        filteredLogs = filteredLogs.filter(log =>
          log.txnId === params.txnId,
        )
      }

      if (params.guid) {
        filteredLogs = filteredLogs.filter(log =>
          log.guid.includes(params.guid!),
        )
      }

      if (params.startDatetime && params.endDatetime) {
        const startDate = new Date(params.startDatetime)
        const endDate = new Date(params.endDatetime)
        filteredLogs = filteredLogs.filter((log) => {
          const logDate = new Date(log.logDatetime)
          return logDate >= startDate && logDate <= endDate
        })
      }

      // 分頁處理
      const currentPage = params.page || 1
      const pageSize = params.pageSize || 10
      const totalItems = filteredLogs.length
      const totalPages = Math.ceil(totalItems / pageSize)

      // 計算分頁範圍
      const startIndex = (currentPage - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedLogs = filteredLogs.slice(startIndex, endIndex)

      return {
        query: params,
        pagination: {
          currentPage,
          itemsPerPage: pageSize,
          totalItems,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
        txlogs: paginatedLogs,
      }
    }
    catch (error) {
      console.error('Mock Data Error:', error)
      throw error
    }
  }
}
