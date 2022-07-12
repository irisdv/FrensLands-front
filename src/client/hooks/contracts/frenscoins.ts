import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import FrensCoinsAbi from "../../abi/tokens/Gold_ERC20_Mintable_Burnable_abi.json";

export function useFrensCoinsContract() {
  return useContract({
    abi: FrensCoinsAbi as Abi,
    address:
      "0x077a6c801a90b5b13d2e8ccf66e6ba94609887d94fb69774c0b15bc4135fc3cc",
  });
}
