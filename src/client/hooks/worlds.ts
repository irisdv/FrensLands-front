import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      "0x02e0b1173419944ef0bea7f7fcf5eaf34d1b5fafcbcebdda9b66785888c506bc",
  });
}
