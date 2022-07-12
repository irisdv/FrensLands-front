import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MinterAbi from "../../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMinterContract() {
  return useContract({
    abi: MinterAbi as Abi,
    address:
      "0x00369dabca1bef3c504d35f67e9115e19a60ee2d14609c2148a3067916d8e90c", // 8th
  });
}
