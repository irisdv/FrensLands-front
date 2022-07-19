import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MinterAbi from "../../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMinterContract() {
  return useContract({
    abi: MinterAbi as Abi,
    address:
      "0x0029bba25a4e0fdac4b0d6d48438516b4f1df95e2e2267c68e33b278b413726d", // 8th
  });
}
