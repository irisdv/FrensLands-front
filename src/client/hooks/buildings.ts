import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import BuildingsAbi from "../abi/M03_Buildings_abi.json";

export function useBuildingsContract() {
  return useContract({
    abi: BuildingsAbi as Abi,
    address:
      "0x04bad6d5f54e70c1edd8127fa3a7e3633a0c6b2a8753f0c7ead7503df111d77f",
  });
}
