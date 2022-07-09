import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import BuildingsAbi from "../abi/M03_Buildings_abi.json";

export function useBuildingsContract() {
  return useContract({
    abi: BuildingsAbi as Abi,
    address:
      "0x037bcd02ce5e05f7f90fb9f5d2553d257999c5cf595a164690c795fdd88f7293",
  });
}
