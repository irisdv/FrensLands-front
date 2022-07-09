import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import FrensCoinsAbi from "../abi/tokens/Gold_ERC20_Mintable_Burnable_abi.json";

export function useFrensCoinsContract() {
  return useContract({
    abi: FrensCoinsAbi as Abi,
    address:
      "0x008dc9007070e128f4036edc623d5b6d0f264b7e736089618ea255919320a094",
  });
}
