import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MinterAbi from "../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMinterContract() {
  return useContract({
    abi: MinterAbi as Abi,
    address:
      "0x07d848450b0ccf910cb847805d2f9cf1f2f88b3699519d004cd31a38b59aef82", // 8th
  });
}
