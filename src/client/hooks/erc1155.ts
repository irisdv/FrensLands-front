import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ERC1155Abi from "../abi/tokens/ERC1155_Mintable_Burnable_abi.json";

export function useERC1155Contract() {
  return useContract({
    abi: ERC1155Abi as Abi,
    address:
      "0x07a4f265c03e318013e530ccd612a7ee582a147ae75f2edb9a62e740a28dcd76",
  });
}
