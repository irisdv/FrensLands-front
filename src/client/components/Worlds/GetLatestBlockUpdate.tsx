import { useStarknet, useStarknetCall } from '@starknet-react/core'
import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useWorldsContract } from '../../hooks/contracts/worlds'
import { number, uint256 } from 'starknet'
import { toBN } from 'starknet/dist/utils/number'

export function GetGameStatus () {
  const [watch, setWatch] = useState(true)
  const { contract: worlds } = useWorldsContract()

  const { data: gameBlockResult } = useStarknetCall({
    contract: worlds,
    method: 'get_latest_block',
    args: [uint256.bnToUint256(1)],
    options: { watch }
  })

  const gameBlockValue = useMemo(() => {
    console.log('gameBlockResult', gameBlockResult)
    if (gameBlockResult != null && gameBlockResult.length > 0) {
      const elem = toBN(gameBlockResult[0])
      const block = elem.toNumber()

      console.log('game State', block)

      return { block }
    }
  }, [gameBlockResult])

  return (
    <>
      <div>
        Latest blcok Value : {gameBlockValue != null && gameBlockValue.block}
      </div>
    </>
  )
}
