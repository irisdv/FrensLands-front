import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../abi/M02_Resources_abi.json";

export function useWorldsContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      "0x058ecb92d757b11cd3a42e68043071211b583196504e5773c483858767d08ea2",
  });
}
