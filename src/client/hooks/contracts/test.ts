import { useContract } from "@starknet-react/core";
import { Abi, Contract } from "starknet";

import TestAbi from "../../abi/test_abi.json";

export function useTestContract() {
  const Test = new Contract(
    TestAbi as Abi,
    "0x01c4a2c6c3398cac008a66e727af63248b55aac85e6259308f059b34fc0ce311"
  );

  return Test;
}
