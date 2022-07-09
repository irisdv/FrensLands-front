import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import ERC1155Abi from "../abi/tokens/ERC1155_Mintable_Burnable_abi.json";

export function useERC1155Contract() {
  return useContract({
    abi: ERC1155Abi as Abi,
    address:
      "0x073801bd4c8a099d0e92446b9c4b232aca8ea4119f0c8eed50dd7830fc99b71a",
  });
}
