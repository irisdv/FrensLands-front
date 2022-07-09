import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      "0x0174e32bc7249dba36ba93cf008912e8e0891c5889299d46da7d29f8802d4b5a",
  });
}
