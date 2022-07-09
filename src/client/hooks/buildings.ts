import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import BuildingsAbi from "../abi/M03_Buildings_abi.json";

export function useBuildingsContract() {
  return useContract({
    abi: BuildingsAbi as Abi,
    address:
      "0x00799bbcbc6eb80913457f2d6bdcd15f3a95d9a9fb300d01a08c4732fd511047",
  });
}
