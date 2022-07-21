import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../../abi/M02_Resources_abi.json";

export function useResourcesContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      "0x03cc2fbb513f6305a48303140ad75c6c8189fd91abd79a3e30766825ec46ccf4",
  });
}
