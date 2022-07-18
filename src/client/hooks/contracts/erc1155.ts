import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ERC1155Abi from "../../abi/tokens/ERC1155_Mintable_Burnable_abi.json";

export function useERC1155Contract() {
  return useContract({
    abi: ERC1155Abi as Abi,
    address:
      "0x009610d2ea3149cdc3413f47c687a34aa9965af76020f0bb6507b25f9e517092",
  });
}
