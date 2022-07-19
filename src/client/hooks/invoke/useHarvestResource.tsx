import { useStarknet } from '@starknet-react/core'
import { useCallback } from 'react'
import { AddTransactionResponse, uint256 } from 'starknet'
import { useNotifTransactionManager } from '../../providers/transactions'
import { useResourcesContract } from '../contracts/resources'

export default function useHarvestResource() {
  const { account } = useStarknet()
  const { contract } = useResourcesContract()

  const { addTransaction } = useNotifTransactionManager()

  return useCallback(async (tokenId : number, pos_start: number, unique_id : number, type_id: number, level : number, posX: number, posY: number) => {
    if (!contract || !account) {
      throw new Error('Missing Dependencies')
    }

    if (!tokenId || tokenId == 0 || !pos_start) {
        throw new Error('Missing Arguments')
    }

    return contract
      .invoke('harvest', [uint256.bnToUint256(tokenId as number), pos_start])
      .then((tx: AddTransactionResponse) => {
        console.log('Transaction hash: ', tx.transaction_hash)

        addTransaction({
          status: tx.code,
          transactionHash: tx.transaction_hash,
          address: account,
          metadata: {
            method: "harvest_resources",
            message: "Harvest resource",
            pos_start: pos_start,
            posX: posX,
            posY: posY,
            unique_id: unique_id,
            type_id: type_id,
            level_start: level
          }
        })

        return tx.transaction_hash
      })
      .catch((e) => {
        console.error(e)
      })
  }, [account, addTransaction, contract])
}