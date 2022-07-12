import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MapsAbi from "../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMapsContract() {
  return useContract({
    abi: MapsAbi as Abi,
    address:
      "0x07274d3a8431cd2f1a6183aa24b1274b9e7a13951d76e5ab90a91e8370f74300", // 8th
  });
}
