import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      "0x02b8f3e7a283dcf5703ab165d0b3785e4e903742102743735da4c64e8ac0dfc6",
  });
}
