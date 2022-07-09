import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import FrensCoinsAbi from "../abi/tokens/Gold_ERC20_Mintable_Burnable_abi.json";

export function useFrensCoinsContract() {
  return useContract({
    abi: FrensCoinsAbi as Abi,
    address:
      "0x00ad6ce9bad182f1154847ad1c0a7d0e4b903747ecec5fd19b1c15e5f08e2825",
  });
}
