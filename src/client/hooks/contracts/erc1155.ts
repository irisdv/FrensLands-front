import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ERC1155Abi from "../../abi/tokens/ERC1155_Mintable_Burnable_abi.json";

export function useERC1155Contract() {
  return useContract({
    abi: ERC1155Abi as Abi,
    address:
      "0x00b38e856e62416916645525541c05b85e74972f2d95769e4c89ae2e5f1614f9",
  });
}
