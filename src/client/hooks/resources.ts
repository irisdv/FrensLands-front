import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../abi/M02_Resources_abi.json";

export function useResourcesContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      "0x05db18beb279b478d36714d5c4470b4b422da05d987a1b207f0e19f405ec05d5",
  });
}
