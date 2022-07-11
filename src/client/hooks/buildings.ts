import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import BuildingsAbi from "../abi/M03_Buildings_abi.json";

export function useBuildingsContract() {
  return useContract({
    abi: BuildingsAbi as Abi,
    address:
      "0x0526abb8b9f4d90e97a29266a3d9c5ed52f44a8a70847ef7ce9fe90f65ca51ea",
  });
}
