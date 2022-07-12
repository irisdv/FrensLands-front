import { useStarknet } from '@starknet-react/core'
import { useCallback } from 'react'
import { AddTransactionResponse, uint256 } from 'starknet'
import { useNotifTransactionManager } from '../../providers/transactions'
import { useGameContext } from '../useGameContext'
import { useWorldsContract } from '../worlds'

export default function useStartGame() {
  const { account } = useStarknet()
  const { contract } = useWorldsContract()
  const { tokenId, updateTokenId } = useGameContext();

  const { addTransaction } = useNotifTransactionManager()

  console.log('tokenId', tokenId)

  return useCallback(async () => {
    if (!contract || !account) {
      throw new Error('Missing Dependencies')
    }

    if (tokenId == null || tokenId == 0) {
        // throw new Error('Wrong tokenId')
        updateTokenId(account)
      }

    return contract
      .invoke('start_game', [uint256.bnToUint256(tokenId as number)])
      .then((tx: AddTransactionResponse) => {
        console.log('Transaction hash: ', tx.transaction_hash)

        addTransaction({
          status: tx.code,
          transactionHash: tx.transaction_hash,
          address: account,
          metadata: {
            method: "start_game",
            message: "Initialiazing a game",
          }
        })

        return tx.transaction_hash
      })
      .catch((e) => {
        console.error(e)
      })
  }, [account, addTransaction, contract])
}