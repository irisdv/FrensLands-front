import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ResourcesAbi from "../../abi/M02_Resources_abi.json";

export function useResourcesContract() {
  return useContract({
    abi: ResourcesAbi as Abi,
    address:
      "0x04fd797d38ca45579a518e81460824c70e7bf627053ba8da5ffbcd3b89d143d6",
  });
}
