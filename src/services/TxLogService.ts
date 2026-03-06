import type { AxiosResponse } from 'axios'
import type { TxLogListResponse, TxLogQuery } from '@/models/TxLog'
import ApiClient, { type ApiResponse } from '@/services/ApiService'

// API 服務類
export class TxLogService {
  // 查詢交易紀錄列表
  static async getTxLogList(
    params: TxLogQuery & { page?: number; pageSize?: number } = {}
  ): Promise<TxLogListResponse | null> {
    try {
      // 使用真實 API 呼叫
      const response: AxiosResponse<ApiResponse<TxLogListResponse>> = await ApiClient.get('/logs', {
        params
      })
      return response.data.messageContent
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}
