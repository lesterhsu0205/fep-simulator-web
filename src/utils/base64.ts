// Base64 編碼/解碼工具函數
import * as base64js from 'base64-js'

/**
 * 檢查字串是否為有效的 base64 編碼
 * @param str 要檢查的字串
 * @returns 如果是有效的 base64 編碼則回傳 true，否則回傳 false
 */
export function isBase64(str: string): boolean {
  try {
    // 空字串或太短的字串不是 base64
    if (!str || str.length < 4) {
      return false
    }

    // 檢查 base64 格式的正則表達式
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    if (!base64Regex.test(str)) {
      return false
    }

    // 純數字字串不應該被視為 base64
    if (/^\d+$/.test(str)) {
      return false
    }

    // base64 編碼的長度必須是 4 的倍數
    if (str.length % 4 !== 0) {
      return false
    }

    // 嘗試解碼，如果成功且解碼後的字串看起來合理，則是有效的 base64
    const decoded = base64js.toByteArray(str)
    // 檢查解碼後的 bytes 是否為有效的 UTF-8
    try {
      const decoder = new TextDecoder('utf-8', { fatal: true })
      decoder.decode(decoded)
      return true
    }
    catch {
      // 如果不是有效的 UTF-8，可能是二進制數據，仍然是有效的 base64
      return true
    }
  }
  catch {
    return false
  }
}

/**
 * 將字串編碼為 base64（支援 Unicode）
 * @param str 要編碼的字串
 * @returns base64 編碼的字串
 */
export function encodeBase64(str: string): string {
  try {
    // 使用 TextEncoder 將字串轉為 UTF-8 bytes
    const encoder = new TextEncoder()
    const bytes = encoder.encode(str)
    // 使用 base64-js 編碼
    return base64js.fromByteArray(bytes)
  }
  catch (error) {
    console.error('Base64 encode error:', error)
    throw new Error('Base64 編碼失敗')
  }
}

/**
 * 將 base64 字串解碼（支援 Unicode）
 * @param str base64 編碼的字串
 * @returns 解碼後的字串，如果解碼失敗則回傳原始字串
 */
export function decodeBase64(str: string): string {
  try {
    // 使用 base64-js 解碼為 bytes
    const bytes = base64js.toByteArray(str)
    // 使用 TextDecoder 將 UTF-8 bytes 轉為字串
    const decoder = new TextDecoder()
    return decoder.decode(bytes)
  }
  catch {
    return str // 如果解碼失敗，返回原始字串
  }
}

/**
 * 智能處理字串的 base64 編碼
 * 如果字串不是 base64 編碼，則進行編碼；如果已經是 base64 編碼，則保持不變
 * @param str 要處理的字串
 * @returns base64 編碼的字串
 */
export function ensureBase64Encoded(str: string): string {
  return isBase64(str) ? str : encodeBase64(str)
}

/**
 * 智能處理字串的 base64 解碼
 * 如果字串是 base64 編碼，則解碼；如果不是 base64 編碼，則保持不變
 * @param str 要處理的字串
 * @returns 解碼後的字串
 */
export function ensureBase64Decoded(str: string): string {
  return isBase64(str) ? decodeBase64(str) : str
}
