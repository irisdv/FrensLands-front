import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MinterAbi from "../../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMinterContract() {
  return useContract({
    abi: MinterAbi as Abi,
    address:
      "0x04bfe9cd95ecc5fec6baae17ea75ee6ee79673c769b14ab88ff2b84c4a5484d4", // 8th
  });
}
