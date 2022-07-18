import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import TestAbi from "../abi/test_abi.json";

export function useTestContract() {
  return useContract({
    abi: TestAbi as Abi,
    address:
      "0x042ac514ced520e889d4ed696ad3717d818837f0e1d0b7c33ccc794b7b697704",
  });
}
