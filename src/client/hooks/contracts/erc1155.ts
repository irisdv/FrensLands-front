import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ERC1155Abi from "../../abi/tokens/ERC1155_Mintable_Burnable_abi.json";

export function useERC1155Contract() {
  return useContract({
    abi: ERC1155Abi as Abi,
    address:
      "0x07d37b426e9ee224048ff111ca87ff080802cd72fe9a292da8d2b631b253944c",
  });
}
