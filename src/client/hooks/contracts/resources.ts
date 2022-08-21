import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../../abi/M02_Resources_abi.json";

export function useResourcesContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      "0x0442d2bfd1e20db5b59286805727241e3f26e37c223c2eed852f1a9450476c00",
  });
}
