import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import TestAbi from "../abi/test_abi.json";

export function useTestContract() {
  return useContract({
    abi: TestAbi as Abi,
    address:
      "0x070a11b308ea853c4d60bdfdc95ca90fc7795a04f0d4a3b4677aae7fb2b0706a",
  });
}
