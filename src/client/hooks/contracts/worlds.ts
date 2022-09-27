import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import WorldsAbi from '../../abi/M01_Worlds_abi.json'

export function useWorldsContract () {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      '0x00a7a315c7463b4bc491239e1d995fe736fe4830d3345d109a25182fb918ddd2'
  })
}
