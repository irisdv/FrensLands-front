import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import FrensCoinsAbi from "../../abi/tokens/Gold_ERC20_Mintable_Burnable_abi.json";

export function useFrensCoinsContract() {
  return useContract({
    abi: FrensCoinsAbi as Abi,
    address:
      "0x06a794ac893eea11eb039e736600a1bbb56e070cb37f4d54a2590cd5307ded80",
  });
}
