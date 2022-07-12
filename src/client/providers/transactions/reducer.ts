import { GetTransactionResponse } from 'starknet'
import { List } from 'immutable'
import { NotifContent, NotifItem, Transaction, TransactionSubmitted } from './model'
import { nanoid } from 'nanoid'

export interface TransactionManagerState {
  transactions: List<Transaction>,
  notifList: List<NotifItem>
}

interface AddTransaction {
  type: 'add_transaction'
  transaction: TransactionSubmitted
}

interface RemoveTransaction {
  type: 'remove_transaction'
  transactionHash: string
}

interface UpdateTransaction {
  type: 'update_transaction'
  transactionResponse: GetTransactionResponse
  lastUpdatedAt: number
  transactionHash: string
}

interface AddNotification {
  type: 'add_notification'
  notifItem: { key?: string; content: NotifContent }
}

interface RemoveNotification {
  type: 'remove_notification'
  key: string
}

export type Action = AddTransaction | RemoveTransaction | UpdateTransaction | AddNotification | RemoveNotification

export function transactionManagerReducer(
  state: TransactionManagerState,
  action: Action
): TransactionManagerState {
  if (action.type === 'add_transaction') {
    return {
      ...state,
      transactions: state.transactions.push(action.transaction),
    }
  } else if (action.type === 'remove_transaction') {
    return {
      ...state,
      transactions: state.transactions.filter(
        (tx) => tx.transactionHash !== action.transactionHash
      ),
    }
  } else if (action.type === 'update_transaction') {
    if (action.transactionResponse.status === 'NOT_RECEIVED') {
      return state
    }

    const entry = state.transactions.findEntry(
      (tx) => tx.transactionHash === action.transactionHash
      // (tx) => tx.transactionHash === action.transactionResponse.transaction['transaction_hash']
    )

    if (!entry) {
      return state
    }

    const [transactionIndex, transaction] = entry
    const description = transaction.metadata

    const newTransaction: Transaction = {
      status: action.transactionResponse.status,
      transaction: action.transactionResponse.transaction,
      transactionHash: action.transactionHash,
      lastUpdatedAt: action.lastUpdatedAt,
      metadata: description,
    }

    return {
      ...state,
      transactions: state.transactions.set(transactionIndex, newTransaction),
    }
  } else if (action.type === 'add_notification') {

    const { key, content } = action.notifItem

    const notifList = state.notifList.filter(
      (tx) => tx.content.transactionHash !== content.transactionHash
    )
    
    const updatedNotifList = notifList.concat([
      {
        key: key || nanoid(),
        show: true,
        content: content
      },
    ])

    return {
      ...state,
      notifList: updatedNotifList
    }
  } else if (action.type === 'remove_notification') {
    return {
      ...state,
      notifList: state.notifList.filter((notif) => notif.key !== action.key),
    }
  }

  return state
}