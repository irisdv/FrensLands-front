import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import TestAbi from "../abi/test_abi.json";

export function useTestContract() {
  return useContract({
    abi: TestAbi as Abi,
    address:
      // "0x069500dce73ca5fd3f832a13c152335051556d22b5e0cf099a88f78e7d0631b6",
      "0x02e0b1173419944ef0bea7f7fcf5eaf34d1b5fafcbcebdda9b66785888c506bc",
  });
}
