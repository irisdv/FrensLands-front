import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      "0x0707eb47250096ed6914323fee1cc1994645967048ebb2657cf71a3d0fa269b4",
  });
}
