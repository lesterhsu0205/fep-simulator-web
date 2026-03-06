export const downloadTemplate = async (filename: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_BASE_PATH}/${filename}`)
    if (!response.ok) throw new Error('檔案下載失敗')

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download error:', error)
    throw error // 讓呼叫方處理錯誤顯示
  }
}
