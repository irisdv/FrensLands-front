import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MinterAbi from "../../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMinterContract() {
  return useContract({
    abi: MinterAbi as Abi,
    address:
      "0x0752d94f97acf4723b74e8abe14c718fbb10cf7a27b6e92a81e66313fe680ceb", // 8th
  });
}
