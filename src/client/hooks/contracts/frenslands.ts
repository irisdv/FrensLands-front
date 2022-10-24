import { Abi, Contract } from "starknet";

import FrensLandsAbi from "../../abi/FrensLands_abi.json";

export function useFLContract() {
  const FL = new Contract(
    FrensLandsAbi as Abi,
    "0x0431e5dffcbb7bc303760113c0b4fdd0224d1d1f513610a5d658f9a4e8599f4d"
  );
  // "0x060363b467a2b8d409234315babe6be180020e0bb65d708c0d09be6fd3691a2f"

  return FL;
}
