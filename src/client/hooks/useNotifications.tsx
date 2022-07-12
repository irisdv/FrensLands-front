import { useMemo } from 'react'
import { useNotifTransactionManager } from '../providers/transactions'

export default function useActiveNotifications() {
  const { notifList } = useNotifTransactionManager()

  return useMemo(() => {
    return notifList.filter((notification) => notification.show)
  }, [notifList])
}