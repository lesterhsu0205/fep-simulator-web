import type { EditFormProps } from '@/components/DataTable'
import FinanceForm from '@/components/FinanceForm'

export default function FinanceEditForm({ data, afterSubmit }: EditFormProps) {
  return <FinanceForm mode="edit" initialData={data || undefined} afterSubmit={afterSubmit} />
}
