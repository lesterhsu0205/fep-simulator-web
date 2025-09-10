import { type AxiosResponse } from 'axios'
import ApiClient, { type ApiResponse } from '@/services/ApiService'
import { type FiscSituation, type FiscSituationListResponse, type FiscSituationQuery, type FiscSituationMaintenanceRequest } from '@/models/FiscSituation'
import { type UploadResult } from '@/models/UploadResult'

// API 服務類
export class FinanceService {
  // 查詢財金情境列表
  static async getFiscSituationList(params: FiscSituationQuery & { page?: number, pageSize?: number } = {}): Promise<FiscSituationListResponse | null> {
    try {
      const response: AxiosResponse<ApiResponse<FiscSituationListResponse>> = await ApiClient.get('/finance/scenario/list', {
        params,
      })

      return response.data.messageContent
    }
    catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // 依ID查詢單筆財金情境
  static async getFiscSituationById(id: number): Promise<FiscSituation | null> {
    try {
      const response: AxiosResponse<ApiResponse<{ fiscSituation: FiscSituation }>> = await ApiClient.get(`/finance/scenario/${id}`)

      return response.data.messageContent?.fiscSituation || null
    }
    catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // 財金情境維護（新增/修改/刪除）
  static async maintainFiscSituation(data: FiscSituationMaintenanceRequest): Promise<FiscSituation | null> {
    try {
      const response: AxiosResponse<ApiResponse<{ fiscSituation?: FiscSituation }>> = await ApiClient.post('/finance/scenario/maint', data)

      return response.data.messageContent?.fiscSituation || null
    }
    catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // 上傳財金情境檔案
  static async uploadFiscSituationFile(file: File, action: 'CREATE' | 'UPDATE'): Promise<ApiResponse<UploadResult> | null> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('action', action)

      const response: AxiosResponse<ApiResponse<UploadResult>> = await ApiClient.post('/finance/scenario/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    }
    catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}
