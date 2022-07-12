import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../../abi/M02_Resources_abi.json";

export function useResourcesContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      "0x0594b6b3d702733c3cbb9b43f5a40a27d8ceb4218e724e995b166b6e57c56df6",
  });
}
