import { type AxiosResponse } from 'axios'
import ApiClient, { type ApiResponse } from '@/services/ApiService'
import { type JcicSituation, type JcicSituationListResponse, type JcicSituationQuery } from '@/models/JcicSituation'
import { type UploadResult } from '@/models/UploadResult'
import { ensureBase64Encoded } from '@/utils/base64'

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
      // 處理 jcicData 的 base64 編碼
      let processedData = data
      if (data && typeof data === 'object' && 'jcicData' in data) {
        const typedData = data as { jcicData?: string | null }
        if (typedData.jcicData && typeof typedData.jcicData === 'string') {
          // 智能處理 base64 編碼：如果不是 base64 則編碼，已編碼則保持不變
          processedData = {
            ...data,
            jcicData: ensureBase64Encoded(typedData.jcicData),
          }
        }
      }

      const response: AxiosResponse<ApiResponse<{ jcicSituation?: JcicSituation }>> = await ApiClient.post('/credit/maint', processedData)

      return response.data.messageContent?.jcicSituation || null
    }
    catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // 上傳聯徵情境檔案
  static async uploadJcicSituationFile(file: File, action: string): Promise<ApiResponse<UploadResult> | null> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('action', action)

      const response: AxiosResponse<ApiResponse<UploadResult>> = await ApiClient.post('/credit/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    }
    catch (error) {
      console.error('Upload Error:', error)
      throw error
    }
  }
}
