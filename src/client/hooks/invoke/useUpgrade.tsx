import { useStarknet } from '@starknet-react/core'
import { useCallback } from 'react'
import { AddTransactionResponse, uint256 } from 'starknet'
import { useNotifTransactionManager } from '../../providers/transactions'
import { useBuildingsContract } from '../contracts/buildings'

export default function useBuild () {
  const { account } = useStarknet()
  const { contract } = useBuildingsContract()

  const { addTransaction } = useNotifTransactionManager()

  return useCallback(
    async (
      tokenId: number,
      pos_start: number,
      uniqueId: number,
      building_type_id: number,
      level: number,
      posX: number,
      posY: number,
      nonce: string
    ) => {
      if (contract == null || !account) {
        throw new Error('Missing Dependencies')
      }

      if (
        !tokenId ||
        tokenId == 0 ||
        !pos_start ||
        !building_type_id ||
        !level
      ) {
        throw new Error('Missing Arguments')
      }

      return await contract
        .invoke('upgrade', [uint256.bnToUint256(tokenId), pos_start], { nonce })
        .then((tx: AddTransactionResponse) => {
          console.log('Transaction hash: ', tx.transaction_hash)

          addTransaction({
            status: tx.code,
            transactionHash: tx.transaction_hash,
            address: account,
            metadata: {
              method: 'upgrade',
              message: 'Build',
              posX,
              posY,
              uniqueId,
              type_id: building_type_id,
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
