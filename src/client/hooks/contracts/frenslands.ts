import { Abi, Contract } from "starknet";

import FrensLandsAbi from "../../abi/FrensLands_abi.json";

export function useFLContract() {
  const FL = new Contract(
    FrensLandsAbi as Abi,
    "0x060363b467a2b8d409234315babe6be180020e0bb65d708c0d09be6fd3691a2f"
  );

  return FL;
}
