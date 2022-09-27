import { useStarknet } from '@starknet-react/core'
import { useCallback, useMemo } from 'react'
import { AddTransactionResponse, uint256 } from 'starknet'
import { useNotifTransactionManager } from '../../providers/transactions'
import { useResourcesContract } from '../contracts/resources'

export default function useHarvestResource () {
  const { account } = useStarknet()
  const { contract } = useResourcesContract()

  const { addTransaction } = useNotifTransactionManager()

  return useCallback(
    async (
      tokenId: number,
      pos_start: number,
      unique_id: number,
      type_id: number,
      level: number,
      posX: number,
      posY: number,
      nonce: string
    ) => {
      if (contract == null || !account) {
        throw new Error('Missing Dependencies')
      }

      if (!tokenId || tokenId == 0 || !pos_start) {
        throw new Error('Missing Arguments')
      }

      return await contract
        .invoke('harvest', [uint256.bnToUint256(tokenId), pos_start], { nonce })
        .then((tx: AddTransactionResponse) => {
          console.log('Transaction hash: ', tx.transaction_hash)

          addTransaction({
            status: tx.code,
            transactionHash: tx.transaction_hash,
            address: account,
            metadata: {
              method: 'harvest_resources',
              message: 'Harvest resource',
              pos_start,
              posX,
              posY,
              unique_id,
              type_id,
              level_start: level
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
