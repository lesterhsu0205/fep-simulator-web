import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { FinanceService } from '@/services/FinanceService'
import FileUploadForm, { type FileUploadFormData } from '@/components/FileUploadForm'
import { type ApiResponse } from '@/services/ApiService'
import { type UploadResult } from '@/models/UploadResult'
import { ApiError } from '@/error/ApiError'

export default function FinanceFileUpload() {
  const { showToast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<ApiResponse<UploadResult> | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileSubmit = async (formData: FileUploadFormData) => {
    try {
      setIsUploading(true)
      setUploadResult(null)
      setUploadError(null)

      const file = formData.file[0]
      if (!file) {
        showToast('請選擇要上傳的檔案', 'error')
        return
      }

      const result = await FinanceService.uploadFiscSituationFile(file, formData.action)

      if (result) {
        setUploadResult(result)
        if (result.messageCode === '00000') {
          showToast('檔案上傳成功', 'success')
        }
        else {
          showToast(`上傳回應：${result.messageDesc}`, 'warning')
        }
      }
    }
    catch (error) {
      console.error('Upload error:', error)

      const errorMessage = error instanceof ApiError
        ? error.messageDesc
        : '檔案上傳失敗，請稍後再試'
      showToast(errorMessage, 'error')
      setUploadError(`上傳失敗：${errorMessage}`)

      if (error instanceof ApiError) {
        const uploadResult: ApiResponse<UploadResult> = {
          messageDesc: error.messageDesc,
          messageCode: error.messageCode,
          messageContent: error.messageContent as UploadResult | null,
        }

        setUploadResult(uploadResult)
      }
    }
    finally {
      setIsUploading(false)
    }
  }

  return (
    <FileUploadForm
      title="財金情境管理 - 測試情境檔案上傳"
      templateFileName="SimDataUpload_FISC.xlsx"
      onSubmit={handleFileSubmit}
      isUploading={isUploading}
      uploadResult={uploadResult}
      uploadError={uploadError}
    />
  )
}
