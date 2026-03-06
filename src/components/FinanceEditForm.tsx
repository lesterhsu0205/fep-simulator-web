import type { EditFormProps } from '@/components/DataTable'
import FinanceForm from '@/components/FinanceForm'

export default function FinanceEditForm({ data, afterSubmit }: EditFormProps) {
  return <FinanceForm afterSubmit={afterSubmit} initialData={data || undefined} mode="edit" />
}
