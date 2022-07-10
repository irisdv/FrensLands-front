import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../abi/M02_Resources_abi.json";

export function useResourcesContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      "0x07132dd9247a4c02b108dc096e8888775e28bbf28ed3208638f7e0bfbbc2f281",
  });
}
