import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../abi/M02_Resources_abi.json";

export function useResourcesContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      "0x0747833bccf3a112fe3b6ace0fe636fe92361734565539778ecdaefad7c48b4b",
  });
}
