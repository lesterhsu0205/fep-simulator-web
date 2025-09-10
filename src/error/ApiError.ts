// 自定義 API 錯誤類別
export class ApiError<T = unknown | null> extends Error {
  messageDesc: string
  messageCode: string
  messageContent?: T | null

  constructor(message: string, messageCode: string, messageContent?: T) {
    super(message)
    this.name = 'ApiError'
    this.messageDesc = message
    this.messageCode = messageCode
    this.messageContent = messageContent
  }
}
