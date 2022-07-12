import { useStarknet } from '@starknet-react/core'
import { useCallback } from 'react'
import { AddTransactionResponse } from 'starknet'
import { useNotifTransactionManager } from '../../providers/transactions'
import { useWorldsContract } from '../contracts/worlds'

export default function useMintMap() {
  const { account } = useStarknet()
  const { contract } = useWorldsContract()

  const { addTransaction } = useNotifTransactionManager()

  return useCallback(async () => {
    if (!contract || !account) {
      throw new Error('Missing Dependencies')
    }

    return contract
      .invoke('get_map', [])
      .then((tx: AddTransactionResponse) => {
        console.log('Transaction hash: ', tx.transaction_hash)

        addTransaction({
          status: tx.code,
          transactionHash: tx.transaction_hash,
          address: account,
          metadata: {
            method: "get_map",
            message: "Mint Frens Lands map",
          }
        })

        return tx.transaction_hash
      })
      .catch((e) => {
        console.error(e)
      })
  }, [account, addTransaction, contract])
}