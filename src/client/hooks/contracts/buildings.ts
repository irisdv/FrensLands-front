import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import BuildingsAbi from "../../abi/M03_Buildings_abi.json";

export function useBuildingsContract() {
  return useContract({
    abi: BuildingsAbi as Abi,
    address:
      "0x06a6a0fba0c452c1bbe3e608138eed465e75f7e0e16a47095f1031762e4a1f3a"
  });
}
