import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ERC1155Abi from "../abi/tokens/ERC1155_Mintable_Burnable_abi.json";

export function useERC1155Contract() {
  return useContract({
    abi: ERC1155Abi as Abi,
    address:
      "0x07618aa010230df0ef65ba02f66c869e7fcf9309c471043e159436f1eb22c25a",
  });
}
