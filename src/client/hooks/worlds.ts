import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      "0x0085ff9369c67639a295c8cdac77f654bdaadb2a13c0bd20cbf45bbc7e50769c",
  });
}
