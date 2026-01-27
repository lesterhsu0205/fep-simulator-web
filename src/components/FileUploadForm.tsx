import { AlertCircle, CheckCircle, FileText, Info, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useToast } from '@/contexts/ToastContext'
import { ApiError } from '@/error/ApiError'
import type { UploadResult } from '@/models/UploadResult'
import type { ApiResponse } from '@/services/ApiService'
import { downloadTemplate } from '@/utils/fileDownload'

export interface FileUploadFormData {
  action: 'CREATE' | 'UPDATE'
  file: FileList
}

interface FileUploadFormProps<UploadResult> {
  templateFileName: string
  onSubmit: (data: FileUploadFormData) => Promise<void>
  isUploading: boolean
  uploadResult: ApiResponse<UploadResult> | null
  uploadError?: string | null
  helpText?: {
    createDesc: string
    updateDesc: string
    additionalNotes?: string[]
  }
}

export default function FileUploadForm({
  templateFileName,
  onSubmit,
  isUploading,
  uploadResult,
  uploadError,
  helpText = {
    createDesc: '建立新的測試情境資料',
    updateDesc: '更新現有的測試情境資料'
  }
}: FileUploadFormProps<UploadResult>) {
  const { showToast } = useToast()

  const renderContent = (content: unknown, depth = 0, excludeErrors = false): React.ReactNode => {
    if (content === null || content === undefined) {
      return <span className="text-gray-500 italic">null</span>
    }

    if (typeof content === 'string') {
      return <span className="text-green-600">"{content}"</span>
    }

    if (typeof content === 'number' || typeof content === 'boolean') {
      return <span className="text-blue-600">{String(content)}</span>
    }

    if (Array.isArray(content)) {
      if (content.length === 0) {
        return <span className="text-gray-500">[]</span>
      }
      return (
        <ul className={`menu bg-base-200 w-full rounded-box ${depth > 0 ? 'ml-4' : ''}`}>
          {content.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: 純展示資料，不會重排
            <li key={index}>
              <div className="flex items-start">
                <span className="font-bold text-gray-600 mr-2">
                  [{index}
                  ]:
                </span>
                <div className="flex-1">{renderContent(item, depth + 1, excludeErrors)}</div>
              </div>
            </li>
          ))}
        </ul>
      )
    }

    if (typeof content === 'object') {
      const entries = Object.entries(content).filter(([key]) => !excludeErrors || key !== 'errors')
      if (entries.length === 0) {
        return <span className="text-gray-500">{'{}'}</span>
      }
      return (
        <ul className={`menu bg-base-200 w-full rounded-box ${depth > 0 ? 'ml-4' : ''}`}>
          {entries.map(([key, value]) => (
            <li key={key}>
              <div className="flex items-start">
                <span className="font-bold text-gray-800 mr-2">{key}:</span>
                <div className="flex-1">{renderContent(value, depth + 1, excludeErrors)}</div>
              </div>
            </li>
          ))}
        </ul>
      )
    }

    return <span className="text-gray-600">{String(content)}</span>
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FileUploadFormData>({
    defaultValues: {
      action: 'CREATE'
    }
  })

  const handleFormSubmit = async (formData: FileUploadFormData) => {
    try {
      await onSubmit(formData)
      reset()
    } catch {
      // 錯誤處理由父組件負責
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
        <div className="space-y-6">
          {/* 操作類型選擇 */}
          <div className="flex items-center gap-4">
            <span className="text-form-label w-30 shrink-0">
              操作類型
              <span className="text-form-required">*</span>
            </span>
            <div className="flex gap-6 flex-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="radio radio-primary radio-sm"
                  value="CREATE"
                  {...register('action', { required: '請選擇操作類型' })}
                />
                <span>新增</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="radio radio-primary radio-sm"
                  value="UPDATE"
                  {...register('action', { required: '請選擇操作類型' })}
                />
                <span>修改</span>
              </label>
            </div>
            {errors.action && <div className="text-form-error">{errors.action.message}</div>}
          </div>

          {/* 檔案選擇 */}
          <div className="flex items-center gap-4">
            <span className="text-form-label w-30 shrink-0">
              選擇檔案
              <span className="text-form-required">*</span>
            </span>
            <div className="flex-1">
              <input
                type="file"
                className="file-input file-input-bordered w-full h-10"
                accept=".xlsx"
                {...register('file', {
                  required: '請選擇要上傳的檔案',
                  validate: {
                    fileType: files => {
                      if (!files || files.length === 0) return true
                      const file = files[0]
                      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
                      return validTypes.includes(file.type) || '僅支援 Excel (.xlsx)'
                    }
                  }
                })}
              />
              {errors.file && <div className="text-form-error">{errors.file.message}</div>}
              <div className="text-form-hint">支援格式：.xlsx</div>
            </div>
          </div>

          {/* 上傳按鈕 */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              className={`btn btn-primary px-6 ${isUploading ? 'loading' : ''}`}
              disabled={isUploading}
            >
              <Upload size={16} />
              {isUploading ? '上傳中...' : '上傳'}
            </button>
          </div>
        </div>

        {/* 結果顯示區域 */}
        {(uploadResult || uploadError) && (
          <div className="mt-6">
            <div className="divider">上傳結果</div>

            <div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {uploadError ? (
                    <AlertCircle className="h-6 w-6 shrink-0 text-red-500" />
                  ) : uploadResult?.messageCode === '00000' ? (
                    <CheckCircle className="h-6 w-6 shrink-0 text-green-500" />
                  ) : (
                    <Info className="h-6 w-6 shrink-0 text-orange-500" />
                  )}
                  <h3
                    className={`text-subheading ${
                      uploadError
                        ? 'text-red-600'
                        : uploadResult?.messageCode === '00000'
                          ? 'text-green-600'
                          : 'text-orange-600'
                    }`}
                  >
                    {uploadError ? '上傳失敗' : uploadResult?.messageCode === '00000' ? '上傳成功' : '上傳失敗'}
                  </h3>

                  <div className="badge badge-neutral badge-sm font-mono">{uploadResult?.messageCode}</div>
                </div>

                {!uploadResult && uploadError && (
                  <div className="text-sm font-bold mb-3">
                    <strong>錯誤：</strong>
                    {uploadError}
                  </div>
                )}

                {uploadResult?.messageDesc && (
                  <div className="text-sm font-bold mb-3">
                    <strong>描述：</strong>
                    {uploadResult.messageDesc}
                  </div>
                )}

                {uploadResult?.messageContent !== null && uploadResult?.messageContent !== undefined && (
                  <>
                    <div className="text-sm font-bold mb-3">回應內容：</div>
                    <div className="bg-base-200 rounded-lg p-3 flex gap-4">
                      {/* 左欄：內容顯示（排除 errors） */}
                      <div className="w-3/12 shrink-0">
                        <div className="text-sm">{renderContent(uploadResult.messageContent, 0, true)}</div>
                      </div>

                      {/* 右欄：錯誤表格 */}
                      {uploadResult?.messageContent?.errors &&
                        Array.isArray(uploadResult.messageContent.errors) &&
                        uploadResult.messageContent.errors.length > 0 && (
                          <div className="flex-1">
                            <h4 className="text-card-title mb-3 text-red-600">錯誤詳情</h4>
                            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border-gray-200 border max-h-80 overflow-y-auto">
                              <table className="table table-zebra table-compact w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                  <tr>
                                    <th className="text-table-header px-3 py-2">#</th>
                                    {uploadResult.messageContent.errors.length > 0 &&
                                      typeof uploadResult.messageContent.errors[0] === 'object' &&
                                      uploadResult.messageContent.errors[0] !== null &&
                                      Object.keys(uploadResult.messageContent.errors[0]).map(key => (
                                        <th key={key} className="text-table-header px-3 py-2">
                                          {key}
                                        </th>
                                      ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {uploadResult.messageContent.errors.map((error, index: number) => (
                                    // biome-ignore lint/suspicious/noArrayIndexKey: 純展示資料，不會重排
                                    <tr key={index} className="hover:bg-gray-50">
                                      <td className="text-table-cell font-bold px-3 py-2">{index + 1}</td>
                                      {typeof error === 'object' && error !== null ? (
                                        Object.values(error).map((value, valueIndex) => (
                                          <td
                                            // biome-ignore lint/suspicious/noArrayIndexKey: 純展示資料，不會重排
                                            key={valueIndex}
                                            className="text-table-cell px-3 py-2 max-w-xs truncate"
                                            title={String(value)}
                                          >
                                            {String(value)}
                                          </td>
                                        ))
                                      ) : (
                                        <td
                                          className="text-table-cell px-3 py-2"
                                          colSpan={Object.keys(uploadResult.messageContent?.errors[0] || {}).length}
                                        >
                                          {String(error)}
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 說明區域 */}
        <div className="mt-8">
          <div className="divider">使用說明</div>
          <div className="text-body space-y-2">
            <p>
              • 新增：
              {helpText.createDesc}
            </p>
            <p>
              • 修改：
              {helpText.updateDesc}
            </p>
            <p>• 支援檔案格式：Excel (.xlsx)</p>
            {helpText.additionalNotes?.map((note, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: 純展示資料，不會重排
              <p key={index}>• {note}</p>
            ))}
            <p>
              • 範例檔案請參考：
              <button
                type="button"
                onClick={async () => {
                  try {
                    await downloadTemplate(templateFileName)
                  } catch (error) {
                    const errorMessage = error instanceof ApiError ? error.messageDesc : '範例檔案下載失敗'
                    showToast(errorMessage, 'error')
                  }
                }}
                className="text-blue-600 hover:text-blue-800 underline cursor-pointer bg-transparent border-none p-0 m-0 inline-flex items-center gap-1"
              >
                <FileText size={14} />
                {templateFileName}
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
