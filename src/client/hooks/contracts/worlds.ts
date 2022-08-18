import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      "0x05386271b6d9a5edf0ac8532728ba4b6ff52a6485730e176613e2328b593cf4e",
  });
}
