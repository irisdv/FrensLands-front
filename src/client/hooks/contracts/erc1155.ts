import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ERC1155Abi from "../../abi/tokens/ERC1155_Mintable_Burnable_abi.json";

export function useERC1155Contract() {
  return useContract({
    abi: ERC1155Abi as Abi,
    address:
      "0x018ab1a2888a584ff7a7b2122c6a8e22b95918e06f338024fc160000fa4ebf3f",
  });
}
