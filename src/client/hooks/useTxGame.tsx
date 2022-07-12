import { useMemo } from 'react'
import { useNotifTransactionManager } from '../providers/transactions'

export default function useTxGame() {
  const { transactions } = useNotifTransactionManager()

  return useMemo(() => {
    return transactions.filter((transaction) => transaction.status)
  }, [transactions])
}