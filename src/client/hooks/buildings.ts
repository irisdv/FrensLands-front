import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";

import BuildingsAbi from "../abi/M03_Buildings_abi.json";

export function useBuildingsContract() {
  return useContract({
    abi: BuildingsAbi as Abi,
    address:
      //   "0x039277456b3eaa163fdc90935ca0489c4a03388d86f390e4f66e1db391e4a5b9",
      "0x01c025dba9b67047f5b84b09255517e878e9a21d45334638c867f150ce02ab51",
  });
}
