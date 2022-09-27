import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import BuildingsAbi from '../../abi/M03_Buildings_abi.json'

export function useBuildingsContract () {
  return useContract({
    abi: BuildingsAbi as Abi,
    address:
      '0x044b7f706c198629198a4382aa21b71fa7aef5541452e894a1130bab6d3eef42'
  })
}
