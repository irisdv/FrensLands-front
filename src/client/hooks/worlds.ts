import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      "0x05e10dc2d99756ff7e339912a8723ecb9c596e8ecd4f3c3a9d03eb06096b153f",
  });
}
