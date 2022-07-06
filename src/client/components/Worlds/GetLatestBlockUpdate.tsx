import { useStarknet, useStarknetCall } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useWorldsContract } from "../../hooks/worlds";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";

export function GetGameStatus() {
  const [watch, setWatch] = useState(true);
  const { contract: worlds } = useWorldsContract();

  const { data: gameBlockResult } = useStarknetCall({
    contract: worlds,
    method: "get_latest_block",
    args: [uint256.bnToUint256(1)],
    options: { watch },
  });

  const gameBlockValue = useMemo(() => {
    console.log("gameBlockResult", gameBlockResult);
    if (gameBlockResult && gameBlockResult.length > 0) {
      var elem = toBN(gameBlockResult[0]);
      var block = elem.toNumber();

      console.log("game State", block);

      return { block: block };
    }
  }, [gameBlockResult]);

  return (
    <>
      <div>Latest blcok Value : {gameBlockValue && gameBlockValue.block}</div>
    </>
  );
}
