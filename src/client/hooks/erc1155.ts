import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ERC1155Abi from "../abi/tokens/ERC1155_Mintable_Burnable_abi.json";

export function useERC1155Contract() {
  return useContract({
    abi: ERC1155Abi as Abi,
    address:
      "0x05d54aa7c05c8130647246de2c6b02c98813e0e19ddca7dd12a9266d5d4721ae",
  });
}
