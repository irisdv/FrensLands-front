import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../../abi/M02_Resources_abi.json";

export function useResourcesContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      "0x028bd50e18760f9dff61f24a9f95e95ede85d1a40c010f08a5147e038689eb44",
  });
}
