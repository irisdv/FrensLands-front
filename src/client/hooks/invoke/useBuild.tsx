import { useStarknet } from '@starknet-react/core'
import { useCallback } from 'react'
import { AddTransactionResponse, uint256 } from 'starknet'
import { useNotifTransactionManager } from '../../providers/transactions'
import { useBuildingsContract } from '../contracts/buildings'

export default function useBuild() {
  const { account } = useStarknet()
  const { contract } = useBuildingsContract()

  const { addTransaction } = useNotifTransactionManager()

  return useCallback(async (tokenId : number, building_type_id: number, level: number, pos_start: number, posX: number, posY: number, uniqueId: number) => {
    if (!contract || !account) {
      throw new Error('Missing Dependencies')
    }

    console.log('tokenId', tokenId)
    console.log('building_type_id', building_type_id)
    console.log('level', level)
    console.log('pos_start', pos_start)

    if (!tokenId || tokenId == 0 || !pos_start || !building_type_id || !level) {
        throw new Error('Missing Arguments')
    }

    return contract
      .invoke('build', [uint256.bnToUint256(tokenId as number), building_type_id, pos_start])
      .then((tx: AddTransactionResponse) => {
        console.log('Transaction hash: ', tx.transaction_hash)

        addTransaction({
          status: tx.code,
          transactionHash: tx.transaction_hash,
          address: account,
          metadata: {
            method: "build",
            message: "Build",
            posX: posX,
            posY: posY,
            uniqueId: uniqueId,
            type_id: building_type_id
          }
        })

        return tx.transaction_hash
      })
      .catch((e) => {
        console.error(e)
      })
  }, [account, addTransaction, contract])
}