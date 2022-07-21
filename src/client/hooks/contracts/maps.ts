import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MapsAbi from "../../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMapsContract() {
  return useContract({
    abi: MapsAbi as Abi,
    address:
      "0x042bcdd65829cf639c814e2b33b39c9a16c1f2aa1c25519ad29440be5c62cb44",
  });
}
