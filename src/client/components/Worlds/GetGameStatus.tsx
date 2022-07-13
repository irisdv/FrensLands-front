import { useStarknet, useStarknetCall } from "@starknet-react/core";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useWorldsContract } from "../../hooks/contracts/worlds";
import { number, uint256 } from "starknet";
import { toBN } from "starknet/dist/utils/number";

export function GetGameStatus() {
  const [watch, setWatch] = useState(true);
  const { contract: worlds } = useWorldsContract();

  const { data: gameStatusResult } = useStarknetCall({
    contract: worlds,
    method: "get_game_status",
    args: [uint256.bnToUint256(1)],
    options: { watch },
  });

  const gameStatusValue = useMemo(() => {
    console.log("gameStatusResult", gameStatusResult);
    if (gameStatusResult && gameStatusResult.length > 0) {
      var elem = toBN(gameStatusResult[0]);
      var state = elem.toNumber();

      console.log("game State", state);

      return { state: state };
    }
  }, [gameStatusResult]);

  return (
    <>
      <div>
        Number of buildings built : {gameStatusValue && gameStatusValue.state}
      </div>
    </>
  );
}
