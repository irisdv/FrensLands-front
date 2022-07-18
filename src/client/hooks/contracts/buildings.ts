import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import BuildingsAbi from "../../abi/M03_Buildings_abi.json";

export function useBuildingsContract() {
  return useContract({
    abi: BuildingsAbi as Abi,
    address:
      "0x008f52dee4bed3deb8d370224673a51abad87d0b296c448b18070dd3f786f51f"
  });
}
