import { type AxiosResponse } from 'axios'
import ApiClient, { type ApiResponse } from '@/services/ApiService'
import { type JcicSituation, type JcicSituationListResponse, type JcicSituationQuery } from '@/models/JcicSituation'

// Credit API 服務類
export class CreditService {
  // 查詢財金情境列表
  static async getJcicSituationList(params: JcicSituationQuery & { page?: number, pageSize?: number } = {}): Promise<JcicSituationListResponse | null> {
    try {
      const response: AxiosResponse<ApiResponse<JcicSituationListResponse>> = await ApiClient.get('/credit/list', {
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
  static async getJcicSituationById(id: number): Promise<JcicSituation | null> {
    try {
      const response: AxiosResponse<ApiResponse<{ jcicSituation: JcicSituation }>> = await ApiClient.get(`/credit/${id}`)

      return response.data.messageContent?.jcicSituation || null
    }
    catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // 財金情境維護（新增/修改/刪除）
  static async maintainJcicSituation(data: unknown): Promise<JcicSituation | null> {
    try {
      const response: AxiosResponse<ApiResponse<{ jcicSituation?: JcicSituation }>> = await ApiClient.post('/credit/maint', data)

      return response.data.messageContent?.jcicSituation || null
    }
    catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}
