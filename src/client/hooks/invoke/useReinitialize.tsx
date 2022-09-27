import { useStarknet } from '@starknet-react/core'
import { useCallback } from 'react'
import { AddTransactionResponse, uint256 } from 'starknet'
import { useNotifTransactionManager } from '../../providers/transactions'
import { useWorldsContract } from '../contracts/worlds'

export default function useReinitialize () {
  const { account } = useStarknet()
  const { contract } = useWorldsContract()

  const { addTransaction } = useNotifTransactionManager()

  return useCallback(
    async (tokenId: number, nonce: string) => {
      if (contract == null || !account) {
        throw new Error('Missing Dependencies')
      }

      if (!tokenId || tokenId == 0) {
        throw new Error('Missing Arguments')
      }

      return await contract
        .invoke('reinitialize_game', [uint256.bnToUint256(tokenId)], { nonce })
        .then((tx: AddTransactionResponse) => {
          console.log('Transaction hash: ', tx.transaction_hash)

          addTransaction({
            status: tx.code,
            transactionHash: tx.transaction_hash,
            address: account,
            metadata: {
              method: 'reinitialize',
              message: 'Reinitialize land'
            }
          })

          return tx.transaction_hash
        })
        .catch((e) => {
          console.error(e)
          return 0
        })
    },
    [account, addTransaction, contract]
  )
}
