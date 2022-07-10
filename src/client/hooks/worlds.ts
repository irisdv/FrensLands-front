import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      "0x0430d5c9c6d7e58919697aa3e8b1ba30a98d37ddf65fadf5810ea918a2c11ae5",
  });
}
