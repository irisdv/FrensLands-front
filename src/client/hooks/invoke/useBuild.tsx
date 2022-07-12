import { useStarknet } from '@starknet-react/core'
import { useCallback } from 'react'
import { AddTransactionResponse, uint256 } from 'starknet'
import { useNotifTransactionManager } from '../../providers/transactions'
import { useBuildingsContract } from '../contracts/buildings'

export default function useBuild() {
  const { account } = useStarknet()
  const { contract } = useBuildingsContract()

  const { addTransaction } = useNotifTransactionManager()

  return useCallback(async (tokenId : number, building_type_id: number, level: number, pos_start: number, allocated_pop: number) => {
    if (!contract || !account) {
      throw new Error('Missing Dependencies')
    }

    if (!tokenId || tokenId == 0 || !pos_start || !building_type_id || !level || !allocated_pop) {
        throw new Error('Missing Arguments')
    }

    return contract
      .invoke('upgrade', [uint256.bnToUint256(tokenId as number), building_type_id, level, pos_start, allocated_pop])
      .then((tx: AddTransactionResponse) => {
        console.log('Transaction hash: ', tx.transaction_hash)

        addTransaction({
          status: tx.code,
          transactionHash: tx.transaction_hash,
          address: account,
          metadata: {
            method: "build",
            message: "Build",
          }
        })

        return tx.transaction_hash
      })
      .catch((e) => {
        console.error(e)
      })
  }, [account, addTransaction, contract])
}