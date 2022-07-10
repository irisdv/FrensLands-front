import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import BuildingsAbi from "../abi/M03_Buildings_abi.json";

export function useBuildingsContract() {
  return useContract({
    abi: BuildingsAbi as Abi,
    address:
      "0x0574fe8bbe799ce7583ef1aefe4c6cf1135dc21c092471982e56b038355f8249",
  });
}
