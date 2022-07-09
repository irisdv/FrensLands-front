import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MapsAbi from "../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMapsContract() {
  return useContract({
    abi: MapsAbi as Abi,
    address:
      "0x05975fef9b94e841a78e9826a95415874a476b04b8836eb8149a5cafdaef4fe3", // 8th
  });
}
