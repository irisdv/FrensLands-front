import {
  Status,
  TransactionStatus,
  Transaction as NotifTransaction
} from 'starknet'

export interface TransactionSubmitted {
  status: TransactionStatus
  transactionHash: string
  address?: string
  show?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any
}

export interface TransactionReceived {
  status: Status
  transaction: NotifTransaction
  transactionHash: string
  lastUpdatedAt: number
  show?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any
}

export type Transaction = TransactionSubmitted | TransactionReceived

export interface NotifContent {
  transactionHash: string
  status: Status
  description: string
  building_type_id?: number
  pos_start?: number
}

export interface NotifItem {
  key: string
  show: boolean
  content: NotifContent
}

export interface NotifTransactionManager {
  transactions: Transaction[]
  notifList: NotifItem[]
  addTransaction: (transaction: TransactionSubmitted) => void
  removeTransaction: (transactionHash: string) => void
  refreshTransaction: (transactionHash: string) => void
  removeNotif: (_transactionHash: string, _txContent: any) => void
}

export const TRANSACTION_MANAGER_INITIAL_STATE: NotifTransactionManager = {
  transactions: [],
  notifList: [],
  addTransaction: (_transaction) => undefined,
  removeTransaction: (_transactionHash) => undefined,
  refreshTransaction: (_transactionHash) => undefined,
  removeNotif: (_transactionKey, _txContent) => undefined
}
