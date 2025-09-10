export interface UploadResult {
  uploadId: string
  fileName: string
  action: string
  totalRecords: number
  successRecords: number
  failedRecords: number
  successRate: number
  processingTime: string
  processedAt: string
  creator: string
  errors: Error[]
}

interface Error {
  row: number
  column: string
  value: string
  errorCode: string
  errorMessage: string
}
