import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MinterAbi from "../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMinterContract() {
  return useContract({
    abi: MinterAbi as Abi,
    address:
      "0x01cab2703e4813d008149a72a7fc238bb790c76546ee79199d5767bd7ffa9b9c", // 8th
  });
}
