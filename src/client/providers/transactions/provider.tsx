import React, { useCallback, useEffect, useReducer } from 'react'
import { List } from 'immutable'
import { useStarknet } from '@starknet-react/core'
import { TransactionManagerContext } from './context'
import { NotifItem, Transaction, TransactionSubmitted } from './model'
import { transactionManagerReducer } from './reducer'
import { nanoid } from 'nanoid'

function shouldRefreshTransaction (
  transaction: Transaction,
  now: number
): boolean {
  // try to get transaction data as soon as possible
  if (transaction.status === 'TRANSACTION_RECEIVED') {
    return true
  }

  // wont' be updated anymore
  if (
    transaction.status === 'ACCEPTED_ON_L1' ||
    transaction.status === 'REJECTED'
  ) {
    return false
  }

  // every couple of minutes is enough. Blocks finalized infrequently.
  if (transaction.status === 'ACCEPTED_ON_L2') {
    return now - transaction.lastUpdatedAt > 120000
  }

  return now - transaction.lastUpdatedAt > 15000
}

interface NotifTransactionManagerProviderProps {
  children: React.ReactNode
  interval?: number
}

export function NotifTransactionManagerProvider ({
  children,
  interval
}: NotifTransactionManagerProviderProps): JSX.Element {
  const { library } = useStarknet()

  const [state, dispatch] = useReducer(transactionManagerReducer, {
    transactions: List<Transaction>(),
    notifList: List<NotifItem>()
  })

  const refresh = useCallback(
    async (transaction: Transaction) => {
      try {
        const transactionResponse = await library.getTransaction(
          transaction.transactionHash
        )
        const lastUpdatedAt = Date.now()

        if (transaction.status !== transactionResponse.status) {
          dispatch({
            type: 'update_transaction',
            transactionResponse,
            lastUpdatedAt,
            show: true,
            transactionHash: transaction.transactionHash
          })
        }

        if (
          transaction.status !== 'NOT_RECEIVED' &&
          transaction.status !== 'PENDING' &&
          transactionResponse.status !== 'ACCEPTED_ON_L1'
        ) {
          dispatch({
            type: 'add_notification',
            notifItem: {
              content: {
                status: transactionResponse.status,
                description: transaction.metadata,
                transactionHash: transaction.transactionHash
              }
            }
          })
        }
      } catch (err) {
        // TODO(fra): somehow should track the error
        console.error(err)
      }
    },
    [library, dispatch]
  )

  const refreshByTxHash = useCallback(
    async (transactionHash: string) => {
      try {
        const transactionResponse = await library.getTransaction(
          transactionHash
        )
        const lastUpdatedAt = Date.now()
        const show = true

        dispatch({
          type: 'update_transaction',
          transactionResponse,
          lastUpdatedAt,
          show,
          transactionHash
        })
      } catch (err) {
        console.error(err)
      }
    },
    [library, dispatch]
  )

  const refreshAllTransactions = useCallback(() => {
    const now = Date.now()
    for (const transaction of state.transactions.toArray()) {
      if (shouldRefreshTransaction(transaction, now)) {
        refresh(transaction)
      }
    }
  }, [state.transactions, refresh])

  const addTransaction = useCallback(
    (transaction: TransactionSubmitted) => {
      dispatch({ type: 'add_transaction', transaction })
      console.log('addTransaction', transaction.metadata)
    },
    [dispatch]
  )

  const removeTransaction = useCallback(
    async (transactionHash: string) => {
      // dispatch({ type: 'remove_transaction', transactionHash })

      try {
        const transactionResponse = await library.getTransaction(
          transactionHash
        )
        const lastUpdatedAt = Date.now()
        const show = false
        console.log('in remove', transactionHash)

        // dispatch({ type: 'update_transaction', transactionResponse, lastUpdatedAt, show, transactionHash })
        dispatch({
          type: 'remove_transaction',
          transactionResponse,
          lastUpdatedAt,
          show,
          transactionHash
        })
      } catch (err) {
        console.error(err)
      }
    },
    [dispatch]
  )

  const refreshTransaction = useCallback(
    (transactionHash: string) => {
      refreshByTxHash(transactionHash)
    },
    [refresh]
  )

  const removeNotif = useCallback((key: string, content: any) => {
    dispatch({ type: 'remove_notification', key, content })
  }, [])

  // periodically refresh all transactions.
  // do this more often than once per block since there are
  // different stages of "accepted" transactions.
  useEffect(() => {
    refreshAllTransactions()
    const intervalId = setInterval(() => {
      refreshAllTransactions()
    }, interval ?? 5000)
    return () => clearInterval(intervalId)
  }, [interval, refreshAllTransactions])

  return (
    <TransactionManagerContext.Provider
      value={{
        transactions: state.transactions.toArray(),
        notifList: state.notifList.toArray(),
        addTransaction,
        removeTransaction,
        refreshTransaction,
        removeNotif
      }}
    >
      {children}
    </TransactionManagerContext.Provider>
  )
}
