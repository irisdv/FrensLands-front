import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      "0x03b0db7f43f38849dd97e90a8df41c9577413f6463953bb32216cf3f4162c34b",
  });
}
