import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import FrensCoinsAbi from "../../abi/tokens/Gold_ERC20_Mintable_Burnable_abi.json";

export function useFrensCoinsContract() {
  return useContract({
    abi: FrensCoinsAbi as Abi,
    address:
      "0x061dbc46460e77113d49d13454b29ee798e04a4e26df0391cf3166748f00cc72",
  });
}
