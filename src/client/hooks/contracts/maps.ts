import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import MapsAbi from "../../abi/tokens/Maps_ERC721_enumerable_mintable_burnable_abi.json";

export function useMapsContract() {
  return useContract({
    abi: MapsAbi as Abi,
    address:
      "0x02ccba7dab7685f7691f16e36b74dc99ba48460d48c0ca5c4526a31b17c0c590",
  });
}
