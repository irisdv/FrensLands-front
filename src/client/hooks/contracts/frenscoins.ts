import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import FrensCoinsAbi from '../../abi/tokens/Gold_ERC20_Mintable_Burnable_abi.json'

export function useFrensCoinsContract () {
  return useContract({
    abi: FrensCoinsAbi as Abi,
    address:
      '0x0030f88af77f6085a992a73d4dd45bb9a66da59b8bdbf38be22aeed383305030'
  })
}
