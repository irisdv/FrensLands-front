import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MapsAbi from "../../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMapsContract() {
  return useContract({
    abi: MapsAbi as Abi,
    address:
      "0x052c936c5624517d671a6378ab0ede31e4c6d4584357ebb432bb1313af93599c",
  });
}
