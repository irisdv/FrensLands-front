import { Abi, Contract } from "starknet";

import FrensLandsAbi from "../../abi/FrensLands_abi.json";

export function useFLContract() {
  const FL = new Contract(
    FrensLandsAbi as Abi,
    "0x0274f30014f7456d36b82728eb655f23dfe9ef0b7e0c6ca827052ab2d01a5d65"
  );
  return FL;
}
