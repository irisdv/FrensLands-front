import { useStarknet } from '@starknet-react/core'
import { useCallback } from 'react'
import { AddTransactionResponse, uint256 } from 'starknet'
import { useNotifTransactionManager } from '../../providers/transactions'
import { useBuildingsContract } from '../contracts/buildings'

export default function useRecharge() {
  const { account } = useStarknet()
  const { contract } = useBuildingsContract()

  const { addTransaction } = useNotifTransactionManager()

  return useCallback(async (tokenId : number, pos_start: number, nb_days: number, building_type_id: number, posX: number, posY: number, uniqueId: number) => {
    if (!contract || !account) {
      throw new Error('Missing Dependencies')
    }

    if (!tokenId || tokenId == 0 || !pos_start || !nb_days ) {
        throw new Error('Missing Arguments')
    }

    return contract
      .invoke('recharge_building', [uint256.bnToUint256(tokenId as number), pos_start, nb_days])
      .then((tx: AddTransactionResponse) => {
        console.log('Transaction hash: ', tx.transaction_hash)

        addTransaction({
          status: tx.code,
          transactionHash: tx.transaction_hash,
          address: account,
          metadata: {
            method: "recharge_building",
            message: "Fueling building",
            posX: posX,
            posY: posY,
            uniqueId: uniqueId,
            type_id: building_type_id,
            nb_days: nb_days
          }
        })

        return tx.transaction_hash
      })
      .catch((e) => {
        console.error(e)
      })
  }, [account, addTransaction, contract])
}