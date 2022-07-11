import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      "0x045ecb5f7d99d67214def0c6c77b20070b3fac664ddc16ca9850cd417c393a38",
  });
}
