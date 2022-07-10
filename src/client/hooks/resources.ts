import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../abi/M02_Resources_abi.json";

export function useResourcesContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      "0x06b1c1299bc6c4ecf71246f6580c0e36bee5ac53f3fa016706ef5c093183dde3",
  });
}
