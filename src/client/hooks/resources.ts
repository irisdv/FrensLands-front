import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../abi/M02_Resources_abi.json";

export function useResourcesContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      "0x0475087719e09fd8c0b18d36b4dee92088b0eb8fd90d001386ef616fe80158ec",
  });
}
