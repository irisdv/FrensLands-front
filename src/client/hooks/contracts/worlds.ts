import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      "0x06f2608eadabeb98651ccae9f110174ce1ff29daede36966f7e75fd1ae1035ce",
  });
}
