import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MapsAbi from "../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMapsContract() {
  return useContract({
    abi: MapsAbi as Abi,
    address:
      "0x05a3753f79d6c6c3700c3652a3eaa00bb431ea21b0c155ba8883d130634ab001", // 8th
  });
}
