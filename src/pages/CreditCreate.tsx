interface CreditCreateProps {
  afterSubmit?: () => void
}

export default function CreditCreate({ afterSubmit }: CreditCreateProps) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">新增信用查詢</h2>
      <p className="text-gray-500">信用查詢新增功能尚未實作</p>
      <div className="flex justify-end mt-4">
        <button 
          className="btn btn-ghost"
          onClick={afterSubmit}
        >
          關閉
        </button>
      </div>
    </div>
  )
}