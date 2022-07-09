import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import BuildingsAbi from "../abi/M03_Buildings_abi.json";

export function useBuildingsContract() {
  return useContract({
    abi: BuildingsAbi as Abi,
    address:
      "0x064562830982399a2ad3b827e00feebcb0b224a7c6df4f2b280edbf8d023294a",
  });
}
