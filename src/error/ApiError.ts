// 自定義 API 錯誤類別
export class ApiError extends Error {
  messageDesc: string
  messageCode: string
  messageContent?: string

  constructor(message: string, messageCode: string, messageContent?: string) {
    super(message)
    this.name = 'ApiError'
    this.messageDesc = message
    this.messageCode = messageCode
    this.messageContent = messageContent
  }
}
