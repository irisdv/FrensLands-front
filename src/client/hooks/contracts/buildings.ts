import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import BuildingsAbi from "../../abi/M03_Buildings_abi.json";

export function useBuildingsContract() {
  return useContract({
    abi: BuildingsAbi as Abi,
    address:
      "0x047774cf16f5b8178c32ad4f9e07d0a801db3732f6509ded21beecf5fe664244"
  });
}
