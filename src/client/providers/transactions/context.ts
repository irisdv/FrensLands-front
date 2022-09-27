import { createContext, useContext } from 'react'

import {
  NotifTransactionManager,
  TRANSACTION_MANAGER_INITIAL_STATE
} from './model'

export const TransactionManagerContext = createContext<NotifTransactionManager>(
  TRANSACTION_MANAGER_INITIAL_STATE
)

export function useNotifTransactionManager (): NotifTransactionManager {
  return useContext(TransactionManagerContext)
}
