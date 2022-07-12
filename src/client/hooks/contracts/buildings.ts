import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import BuildingsAbi from "../../abi/M03_Buildings_abi.json";

export function useBuildingsContract() {
  return useContract({
    abi: BuildingsAbi as Abi,
    address:
      "0x005c3c94dfa7214bfdbbcde88c131557eb445046a4405603ee28a6a6872c01dc",
  });
}
