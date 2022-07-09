import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import WorldsAbi from "../abi/M01_Worlds_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: WorldsAbi as Abi,
    address:
      "0x016555934428cdf31176b17b6e53791f0ae70768e6c2e6be73ebc0fcad4f33d3",
  });
}
