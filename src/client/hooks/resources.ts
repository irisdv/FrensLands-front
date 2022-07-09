import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../abi/M02_Resources_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      // "0x02e0b1173419944ef0bea7f7fcf5eaf34d1b5fafcbcebdda9b66785888c506bc",
      "0x075b61cd0ac0babdb0984aa82801dc8a94da6e3b56fb6756c37a5827acce36f8", // 8th
  });
}
