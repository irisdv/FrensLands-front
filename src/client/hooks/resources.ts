import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../abi/M02_Resources_abi.json";

export function useResourcesContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      "0x01eee6b37b6bded103cfc21355c5cc232bfe8303d717e86133bd88fdc1ab8f12",
  });
}
