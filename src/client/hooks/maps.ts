import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MapsAbi from "../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMapsContract() {
  return useContract({
    abi: MapsAbi as Abi,
    address:
      "0x07512235050405a278c61bb814355b506710f8bfcf7cb6b71753a5f525758ae6", // 8th
  });
}
