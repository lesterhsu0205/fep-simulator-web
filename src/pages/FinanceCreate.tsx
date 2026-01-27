import FinanceForm from '@/components/FinanceForm'

interface FinanceCreateProps {
  afterSubmit?: () => void
}

export default function FinanceCreate({ afterSubmit }: FinanceCreateProps) {
  return <FinanceForm mode="create" afterSubmit={afterSubmit} />
}
