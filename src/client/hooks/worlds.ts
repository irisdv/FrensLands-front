import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      // "0x02e0b1173419944ef0bea7f7fcf5eaf34d1b5fafcbcebdda9b66785888c506bc",
      "0x03a700de233310283bf079bfa6eb3acb2b011d76ec34995b246bc43b5a61ae95", // 8th
  });
}
