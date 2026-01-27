import { useState } from 'react'
import FileUploadForm, { type FileUploadFormData } from '@/components/FileUploadForm'
import { useToast } from '@/contexts/ToastContext'
import { ApiError } from '@/error/ApiError'
import type { UploadResult } from '@/models/UploadResult'
import type { ApiResponse } from '@/services/ApiService'
import { CreditService } from '@/services/CreditService'

export default function CreditFileUpload() {
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

      const result = await CreditService.uploadJcicSituationFile(file, formData.action)

      if (result) {
        setUploadResult(result)
        if (result.messageCode === '00000') {
          showToast('檔案上傳成功', 'success')
        } else {
          showToast(`上傳回應：${result.messageDesc}`, 'warning')
        }
      }
    } catch (error) {
      console.error('Upload error:', error)

      const errorMessage = error instanceof ApiError ? error.messageDesc : '檔案上傳失敗，請稍後再試'
      showToast(errorMessage, 'error')
      setUploadError(`上傳失敗：${errorMessage}`)

      if (error instanceof ApiError) {
        const uploadResult: ApiResponse<UploadResult> = {
          messageDesc: error.messageDesc,
          messageCode: error.messageCode,
          messageContent: error.messageContent as UploadResult | null
        }

        setUploadResult(uploadResult)
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <FileUploadForm
      templateFileName="SimDataUpload_JCIC.xlsx"
      onSubmit={handleFileSubmit}
      isUploading={isUploading}
      uploadResult={uploadResult}
      uploadError={uploadError}
    />
  )
}
