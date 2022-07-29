import { useMemo } from 'react'
import { useNotifTransactionManager } from '../providers/transactions'

export default function useActiveNotifications() {
  const { transactions } = useNotifTransactionManager()

  return useMemo(() => {
    return transactions.filter((transaction) => transaction.show)
  }, [transactions])
}