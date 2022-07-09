import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ERC1155Abi from "../abi/tokens/ERC1155_Mintable_Burnable_abi.json";

export function useERC1155Contract() {
  return useContract({
    abi: ERC1155Abi as Abi,
    address:
      "0x03398abc4e4cd2f8d711bf02c4f6704f89e73bf2c952457328e638d55a229057",
  });
}
