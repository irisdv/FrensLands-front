import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ERC1155Abi from "../../abi/tokens/ERC1155_Mintable_Burnable_abi.json";

export function useERC1155Contract() {
  return useContract({
    abi: ERC1155Abi as Abi,
    address:
      "0x0793db0827a27dd9d4147be13ffaf9d7fa01abce0c2019e2a560af41de6d975c",
  });
}
